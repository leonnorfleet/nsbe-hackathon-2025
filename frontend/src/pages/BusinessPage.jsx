const benefits = [
  {
    title: 'Streamlined pickup scheduling',
    body: 'Log your surplus in minutes and we will alert nearby nonprofits and volunteer drivers who can arrive during your pickup window.',
  },
  {
    title: 'Tax-deductible donations',
    body: 'Receive a verified donation receipt for every successful pickup through our nonprofit partners and 501(c)(3) network.',
  },
  {
    title: 'Sustainability reporting',
    body: 'Track pounds diverted from landfill and highlight your impact in ESG and CSR reporting.',
  },
]

const steps = [
  'Share pickup details, quantity, and safe handling notes.',
  'FoodLink LA notifies pre-vetted partners within your approved radius.',
  'A partner confirms pickup, and you receive live updates until handoff.',
]

const partners = [
  {
    name: 'Angel City Grocers',
    role: 'Neighborhood grocer',
    logo: 'https://dummyimage.com/120x60/2563eb/ffffff&text=Angel+City',
  },
  {
    name: 'Sunset Kitchens',
    role: 'Restaurant collective',
    logo: 'https://dummyimage.com/120x60/0ea5e9/ffffff&text=Sunset+Kitchens',
  },
  {
    name: 'Metro Meals',
    role: 'Meal prep partner',
    logo: 'https://dummyimage.com/120x60/1d4ed8/ffffff&text=Metro+Meals',
  },
  {
    name: 'Harborview Events',
    role: 'Venue partner',
    logo: 'https://dummyimage.com/120x60/6366f1/ffffff&text=Harborview',
  },
  {
    name: 'Golden Farms',
    role: 'Fresh produce co-op',
    logo: 'https://dummyimage.com/120x60/22c55e/ffffff&text=Golden+Farms',
  },
  {
    name: 'CityServe LA',
    role: 'Nonprofit distributor',
    logo: 'https://dummyimage.com/120x60/f97316/ffffff&text=CityServe+LA',
  },
]

const partnerSlides = [...partners, ...partners]

function BusinessesPage() {
  return (
    <div className="page businesses-page themed-surface">
      <header className="page-hero">
        <div>
          <p className="eyebrow">Partners: restaurants, caterers, grocers & venues</p>
          <h1>Turn Surplus Food Into Community Impact</h1>
          <p>
            Post surplus items,schedule pickups, and access data that proves your impact.
          </p>
        </div>
        <div className="cta-card">
          <h2>Ready in 5 minutes</h2>
          <p>Complete our partnership form and our team will help you launch your first donation.</p>
          <a
            className="btn primary"
            href="http://127.0.0.1:8000/"
            target="_blank"
            rel="noreferrer"
          >
            Register your business
          </a>
          <span className="cta-footnote">Opens secure FoodLink intake form</span>
        </div>
      </header>

      <section className="partners-section" aria-labelledby="partners-carousel-title">
        <div className="section-heading">
          <h2 id="partners-carousel-title">Our Partners</h2>
          <p>
            Community grocers, restaurants, event venues, and logistics nonprofits collaborate daily to keep food moving.
          </p>
        </div>
        <section
          className="partner-carousel"
          aria-label="Participating businesses and partner organizations"
          aria-live="polite"
        >
          <div className="partner-track animate">
            {partnerSlides.map((partner, index) => (
              <article className="partner-card" key={`${partner.name}-${index}`}>
                <div className="partner-logo" aria-hidden="true">
                  <img src={partner.logo} alt="" loading="lazy" />
                </div>
                <div className="partner-meta">
                  <h3>{partner.name}</h3>
                  <p>{partner.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="benefits-section">
        <div className="section-heading">
          <h2>Why businesses trust FoodLink LA</h2>
          <p>We handle logistics so your staff can focus on service and sustainability goals.</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-card">
          <h2>Questions before you sign up?</h2>
          <p>Email <a href="mailto:partners@foodlinkla.org">partners@foodlinkla.org</a> to schedule a 15-minute onboarding call.</p>
          <div className="contact-actions">
            <a className="btn ghost" href="mailto:partners@foodlinkla.org">
              Schedule a call
            </a>
            <a className="btn secondary" href="https://drive.google.com" target="_blank" rel="noreferrer">
              Download safety guidelines
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BusinessesPage

