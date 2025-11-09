import { Link } from 'react-router-dom'
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
          <Link className="btn primary" to="/form">
            Register your business
          </Link>
          <span className="cta-footnote">Complete the FeedLA intake form</span>
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
    </div>      
  )
}

export default BusinessesPage

