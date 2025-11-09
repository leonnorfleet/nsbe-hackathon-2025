import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const impactStats = [
  { label: 'Meals redirected', value: '85K+' },
  { label: 'Community partners', value: '120' },
  { label: 'Neighborhood zones', value: '28' },
]

const HERO_IMAGE_URL =
  import.meta.env.VITE_HOME_HERO_IMAGE || '/images/LA_Food_Skyline.jpg'

function HomePage() {
  return (
    <div className="page home-page themed-surface">
      {/* Logo Header */}
      <div className="logo-header">
        <div className="logo-container">
          <div className="logo-icon">
            <MapPin size={22} strokeWidth={2.2} />
          </div>
          <span className="logo-text">FeedLA</span>
        </div>
      </div>

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Los Angeles Food Security Network</p>
          <h1>
            Connecting Free Food Resources to Neighbors in Need
          </h1>
          <p className="hero-copy">
            FeedLA brings together community organizations, businesses, and individuals to
            eliminate food insecurity in Los Angeles.
          </p>
          <div className="hero-actions">
            <Link to="/individuals" className="btn primary">
              Explore resources
            </Link>
            <Link to="/businesses" className="btn ghost">
              Become a partner
            </Link>
          </div>
        </div>
        <div className="hero-media">
          <img
            src={HERO_IMAGE_URL}
            alt="Boxes of fresh produce set out in front of the Los Angeles skyline at sunset"
            loading="lazy"
          />
        </div>
        <div className="hero-card">
          <h2>Impact snapshot</h2>
          <ul>
            {impactStats.map((stat) => (
              <li key={stat.label}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
          <p className="footnote">
            Data aggregated from verified partners and public distribution events.
          </p>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-heading">
          <h2>How FeedLA works</h2>
          <p>We combine trusted data, localized outreach, and rapid logistics to keep extra food moving to the right place.</p>
        </div>
        <div className="steps-grid">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Identify resources & surplus</h3>
            <p>We aggregate public food bank listings and live updates submitted by businesses and volunteers.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Match to local need</h3>
            <p>Smart routing ensures food reaches neighborhoods with the highest demand within critical pickup windows.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Coordinate pickup & delivery</h3>
            <p>Volunteers, nonprofits, and city partners receive alerts to mobilize drivers and drop-off sites.</p>
          </div>
        </div>
      </section>

      <style>{`
        .logo-header {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0;
          margin-bottom: 1.5rem;
          align-self: flex-start;
        }

        .logo-container {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1.2rem;
          background: linear-gradient(135deg, #f97316, #fb923c);
          border-radius: 16px;
          box-shadow: 0 12px 25px rgba(249, 115, 22, 0.25);
        }

        .logo-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0.18);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .logo-text {
          font-size: 1.875rem;
          font-weight: 700;
          background: linear-gradient(to right, #fff5eb, #ffffff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .page.home-page {
          background: linear-gradient(to bottom, #fff7ed, #ffffff, #f0fdf4);
        }

        .eyebrow {
          background: #fed7aa;
          color: #9a3412;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-block;
        }

        .btn.primary {
          background: linear-gradient(to right, #f97316, #ea580c);
          color: white;
          border: none;
          box-shadow: 0 10px 15px rgba(249, 115, 22, 0.3);
          transition: all 0.3s ease;
        }

        .btn.primary:hover {
          box-shadow: 0 15px 25px rgba(249, 115, 22, 0.4);
          transform: translateY(-2px);
        }

        .btn.ghost {
          background: white;
          color: #f97316;
          border: 2px solid #fed7aa;
          transition: all 0.3s ease;
        }

        .btn.ghost:hover {
          border-color: #f97316;
          background: #fff7ed;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }

        .hero-with-bg {
          position: relative;
          border-radius: 1.75rem;
          overflow: hidden;
          padding: clamp(2.5rem, 5vw, 3.5rem);
          box-shadow: 0 30px 60px rgba(17, 24, 39, 0.22);
        }

        .hero-with-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.18), rgba(34, 197, 94, 0.18));
        }

        .hero-with-bg > * {
          position: relative;
          z-index: 1;
        }

        .hero-with-bg .hero-content h1 {
          color: #ffffff;
        }

        .hero-with-bg .hero-content .hero-copy {
          color: rgba(255, 255, 255, 0.92);
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.92);
          border: 2px solid #fed7aa;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.15);
        }

        .hero-card h2 {
          color: #9a3412;
        }

        .stat-value {
          background: linear-gradient(to right, #f97316, #16a34a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }

        .stat-label {
          color: #6b7280;
        }

        .highlight-card {
          background: linear-gradient(to bottom right, white, #fff7ed);
          border: 2px solid #fed7aa;
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        .highlight-card:hover {
          border-color: #f97316;
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.2);
          transform: translateY(-4px);
        }

        .text-link {
          color: #f97316;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .text-link:hover {
          color: #ea580c;
        }

        .how-it-works {
          background: linear-gradient(to bottom, #fff7ed, white);
        }

        .step-number {
          background: linear-gradient(to bottom right, #f97316, #ea580c);
          color: white;
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .step {
          background: white;
          border: 1px solid #fed7aa;
          border-radius: 1rem;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .step:hover {
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.15);
          border-color: #f97316;
        }

        .section-heading h2 {
          color: #1f2937;
        }

        .section-heading p {
          color: #6b7280;
        }
      `}</style>
    </div>
  )
}

export default HomePage