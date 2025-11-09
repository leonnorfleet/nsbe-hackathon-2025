from __future__ import annotations

import html
import json
import math
import os
import re
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

from flask import Flask, Response, current_app, flash, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS
from flask_wtf import CSRFProtect, FlaskForm
from geopy.exc import GeocoderServiceError, GeocoderTimedOut
from geopy.geocoders import Nominatim
from wtforms import SelectField, StringField, TextAreaField
from wtforms.validators import DataRequired, Length, Optional, URL, ValidationError

DEFAULT_RESOURCE_TYPES = [
    ("", "Select a resource type"),
    ("food_bank", "Food Bank"),
    ("community_fridge", "Community Fridge"),
    ("soup_kitchen", "Soup Kitchen"),
    ("meal_delivery", "Meal Delivery"),
    ("grocery", "Discount Grocery"),
    ("other", "Other"),
]

DEFAULT_OPERATING_HOURS = [
    ("", "Select operating hours"),
    ("weekday_mornings", "Weekday Mornings (8 AM – 12 PM)"),
    ("weekday_afternoons", "Weekday Afternoons (12 PM – 5 PM)"),
    ("weekday_evenings", "Weekday Evenings (5 PM – 9 PM)"),
    ("weekends", "Weekends"),
    ("24_7", "24/7"),
    ("by_appointment", "By Appointment"),
]


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "la_food_resources.json"
TEMPLATE_ADD_BUSINESS = "new_business_form.html"
ADDRESS_PATTERN = re.compile(
    r"^\d+\s+[^\n,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?$"
)


def _strip_filter(value: str | None) -> str | None:
    if value is None:
        return None
    return value.strip()


def _choice_label(choices: Iterable[Tuple[str, str]], value: str) -> str:
    return next((label for choice_value, label in choices if choice_value == value), value)


class NewBusinessForm(FlaskForm):
    name = StringField(
        "Business Name",
        validators=[DataRequired(message="Business name is required."), Length(max=200)],
        filters=[_strip_filter],
    )
    address = TextAreaField(
        "Street Address",
        validators=[
            DataRequired(message="Address is required."),
            Length(max=500),
        ],
        filters=[_strip_filter],
    )
    phone = StringField(
        "Phone",
        validators=[Optional(), Length(max=50)],
        filters=[_strip_filter],
    )
    website = StringField(
        "Website",
        validators=[
            Optional(),
            URL(require_tld=True, message="Website must be a valid URL."),
            Length(max=255),
        ],
        filters=[_strip_filter],
    )
    resource_type = SelectField(
        "Resource Type",
        choices=DEFAULT_RESOURCE_TYPES,
        validators=[DataRequired(message="Resource type is required.")],
        filters=[_strip_filter],
    )
    hours = SelectField(
        "Operating Hours",
        choices=DEFAULT_OPERATING_HOURS,
        validators=[DataRequired(message="Operating hours are required.")],
        filters=[_strip_filter],
    )
    def validate_address(self, field: TextAreaField) -> None:
        if not ADDRESS_PATTERN.match(field.data):
            raise ValidationError(
                "Address must include street number, street name, city, state abbreviation, and ZIP code."
            )


app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-me")
app.config.update(
    WTF_CSRF_ENABLED=True,
    WTF_CSRF_TIME_LIMIT=3600,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)

csrf = CSRFProtect(app)
CORS(
    app,
    resources={r"/api/*": {"origins": os.environ.get("ALLOWED_ORIGINS", "*")}},
    supports_credentials=False,
)

_GEOCODER = Nominatim(user_agent="foodlink_resource_form")


@app.after_request
def apply_security_headers(response):
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'",
    )
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return response


def load_resources() -> List[Dict[str, Any]]:
    if not DATA_PATH.exists():
        return []
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_resources(resources: List[Dict[str, Any]]) -> None:
    with DATA_PATH.open("w", encoding="utf-8") as file:
        json.dump(resources, file, ensure_ascii=False, indent=2)
        file.write("\n")


def flash_validation_errors(form: NewBusinessForm) -> None:
    for field_name, field_errors in form.errors.items():
        label = form[field_name].label.text
        for error in field_errors:
            flash(f"{label}: {error}", "error")


def find_duplicate_resource(
    resources: Iterable[Dict[str, Any]], name: str, address: str
) -> Dict[str, Any] | None:
    target_name = name.strip().lower()
    target_address = address.strip().lower()
    return next(
        (
            resource
            for resource in resources
            if resource.get("name", "").strip().lower() == target_name
            and resource.get("address", "").strip().lower() == target_address
        ),
        None,
    )


def geocode_address(address: str) -> Tuple[float, float] | None:
    try:
        result = _GEOCODER.geocode(address, timeout=10)
    except (GeocoderTimedOut, GeocoderServiceError) as exc:
        current_app.logger.warning("Geocoding failed for address '%s': %s", address, exc)
        return None

    if result is None:
        return None

    return float(result.latitude), float(result.longitude)


def haversine_distance_miles(
    lat1: float, lng1: float, lat2: float, lng2: float
) -> float:
    radius = 3959  # Miles
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lng / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))
    return radius * c


def derive_zone_from_resources(
    lat: float, lng: float, resources: Iterable[Dict[str, Any]]
) -> str:
    closest_zone = "Unknown"
    min_distance = float("inf")

    for resource in resources:
        zone = resource.get("zone")
        res_lat = resource.get("lat")
        res_lng = resource.get("lng")

        if (
            zone
            and isinstance(res_lat, (float, int))
            and isinstance(res_lng, (float, int))
        ):
            distance = haversine_distance_miles(lat, lng, float(res_lat), float(res_lng))
            if distance < min_distance:
                min_distance = distance
                closest_zone = str(zone)

    return closest_zone


def build_google_maps_url(lat: float, lng: float) -> str:
    return f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"


@app.route("/", methods=["GET", "POST"])
def add_business() -> Response | str:
    form = NewBusinessForm()

    if form.validate_on_submit():
        resources = load_resources()

        if find_duplicate_resource(resources, form.name.data, form.address.data):
            flash("A resource with the same name and address already exists.", "error")
            return render_template(TEMPLATE_ADD_BUSINESS, form=form)

        geocode_result = geocode_address(form.address.data)
        if geocode_result is None:
            flash(
                "Unable to geocode the provided address. Please verify it is correct.",
                "error",
            )
            return render_template(TEMPLATE_ADD_BUSINESS, form=form)

        lat, lng = geocode_result
        zone = derive_zone_from_resources(lat, lng, resources)
        resource_type_label = _choice_label(DEFAULT_RESOURCE_TYPES, form.resource_type.data)
        hours_label = _choice_label(DEFAULT_OPERATING_HOURS, form.hours.data)

        new_resource = {
            "name": html.escape(form.name.data),
            "address": html.escape(form.address.data),
            "lat": lat,
            "lng": lng,
            "phone": html.escape(form.phone.data) if form.phone.data else "N/A",
            "website": form.website.data or "N/A",
            "type": html.escape(resource_type_label),
            "hours": hours_label,
            "google_maps_url": build_google_maps_url(lat, lng),
            "zone": html.escape(zone) if zone != "Unknown" else "Unknown",
        }

        resources.append(new_resource)
        save_resources(resources)
        flash("New business resource added successfully!", "success")
        return redirect(url_for("add_business"))

    if request.method == "POST":
        flash_validation_errors(form)

    return render_template(TEMPLATE_ADD_BUSINESS, form=form)


@app.route("/api/resources", methods=["GET"])
def get_resources() -> Response:
    """Return resource data for the frontend."""
    resources = load_resources()
    return jsonify(
        {
            "static": resources,
            "dynamic": [],
            "total": len(resources),
        }
    )


if __name__ == "__main__":
    app.run(debug=False, port=8000)

