import React, { useState, useEffect } from 'react';
import '../styles/form.css'; // your CSS copied from <style> above

function FoodAccessForm({ onSubmit }) {
    const [form, setForm] = useState({
        name: '',
        resource_type: '',
        address: '',
        phone: '',
        website: '',
        hours: '',
    });

    const [errors, setErrors] = useState({});
    const [addressWarning, setAddressWarning] = useState('');

    // Example choices, replace with your dynamic choices if needed
    const resourceTypeChoices = [
        { value: 'food_pantry', label: 'Food Pantry' },
        { value: 'soup_kitchen', label: 'Soup Kitchen' },
    ];

    const hoursChoices = [
        { value: 'mon_fri', label: 'Mon-Fri 9am-5pm' },
        { value: 'weekend', label: 'Weekend 10am-4pm' },
    ];

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Address validation
    useEffect(() => {
        const pattern = /^\d+\s+[^\n,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?$/;
        if (form.address && !pattern.test(form.address.trim())) {
            setAddressWarning(
                'Address must include street number, street name, city, state abbreviation, and ZIP code.'
            );
        } else {
            setAddressWarning('');
        }
    }, [form.address]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple required field validation
        const newErrors = {};
        if (!form.name) newErrors.name = 'Business Name is required';
        if (!form.resource_type) newErrors.resource_type = 'Resource Type is required';
        if (!form.address) newErrors.address = 'Address is required';
        if (!form.hours) newErrors.hours = 'Operating Hours are required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // call parent submit handler
            onSubmit && onSubmit(form);
            // optionally clear form
            setForm({
                name: '',
                resource_type: '',
                address: '',
                phone: '',
                website: '',
                hours: '',
            });
        }
    };

    return (
        <div className='form-page'>
            <div className="shell">
                <header className="hero" aria-labelledby="form-title">
                    <h1 id="form-title">Food Access Partner Intake</h1>
                    <p>
                        Help us keep the Los Angeles food support map up to date by sharing information about a new organization or business providing food security services.
                    </p>
                </header>

                <main className="card" role="main">
                    {/* Example flash messages */}
                    {Object.keys(errors).length > 0 && (
                        <div className="flash error">Please fix the errors below</div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Organization Details */}
                        <section className="form-section" aria-labelledby="org-section-title">
                            <h3 id="org-section-title">Organization Details</h3>
                            <div className="grid">
                                <div className="field">
                                    <label htmlFor="name">Business Name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={form.name}
                                        placeholder="e.g., Community Food Pantry"
                                        onChange={handleChange}
                                        autoComplete="organization"
                                    />
                                    {errors.name && <div className="field-error">{errors.name}</div>}
                                </div>

                                <div className="field">
                                    <label htmlFor="resource_type">Resource Type *</label>
                                    <select
                                        id="resource_type"
                                        name="resource_type"
                                        required
                                        value={form.resource_type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Resource Type</option>
                                        {resourceTypeChoices.map((choice) => (
                                            <option key={choice.value} value={choice.value}>
                                                {choice.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.resource_type && <div className="field-error">{errors.resource_type}</div>}
                                </div>
                            </div>
                        </section>

                        {/* Location Details */}
                        <section className="form-section" aria-labelledby="address-section-title">
                            <h3 id="address-section-title">Location Details</h3>
                            <div className="grid">
                                <div className="field" style={{ gridColumn: '1 / -1' }}>
                                    <label htmlFor="address">Street Address *</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        rows="2"
                                        required
                                        placeholder="123 Main St, Los Angeles, CA 90000"
                                        value={form.address}
                                        onChange={handleChange}
                                        autoComplete="street-address"
                                    />
                                    {addressWarning && <div id="addressWarning" className="field-warning">{addressWarning}</div>}
                                    {errors.address && <div className="field-error">{errors.address}</div>}
                                </div>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="form-section" aria-labelledby="contact-section-title">
                            <h3 id="contact-section-title">Contact Information</h3>
                            <div className="grid">
                                <div className="field">
                                    <label htmlFor="phone">Phone <span>(optional)</span></label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        value={form.phone}
                                        placeholder="(123) 456-7890"
                                        autoComplete="tel"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="website">Website <span>(optional)</span></label>
                                    <input
                                        id="website"
                                        name="website"
                                        type="url"
                                        value={form.website}
                                        placeholder="https://example.org"
                                        autoComplete="url"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Service Hours */}
                        <section className="form-section" aria-labelledby="hours-section-title">
                            <h3 id="hours-section-title">Service Hours</h3>
                            <div className="grid">
                                <div className="field">
                                    <label htmlFor="hours">Operating Hours *</label>
                                    <select
                                        id="hours"
                                        name="hours"
                                        required
                                        value={form.hours}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Hours</option>
                                        {hoursChoices.map((choice) => (
                                            <option key={choice.value} value={choice.value}>
                                                {choice.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.hours && <div className="field-error">{errors.hours}</div>}
                                </div>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="actions">
                            <small>* Required fields. Location, Google Maps link, and zone will be generated automatically.</small>
                            <div className="button-group">
                                <button type="reset" onClick={() => setForm({ name: '', resource_type: '', address: '', phone: '', website: '', hours: '' })}>
                                    Clear
                                </button>
                                <button type="submit">Submit Resource</button>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default FoodAccessForm;
