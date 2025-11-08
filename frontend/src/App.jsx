import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import IndividualsPage from './pages/IndividualsPage.jsx'
import BusinessesPage from './pages/BusinessPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header" role="banner">
          <div className="header-inner">
            <Link to="/" className="brand">
              FeedLA
            </Link>
            <nav className="site-nav" aria-label="Primary navigation">
              <NavLink to="/" end className="nav-link">
                Home
              </NavLink>
              <NavLink to="/individuals" className="nav-link">
                Individuals
              </NavLink>
              <NavLink to="/businesses" className="nav-link">
                Businesses
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="site-main" role="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/individuals" element={<IndividualsPage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
          </Routes>
        </main>

        <footer className="site-footer" role="contentinfo">
          <div className="footer-inner">
            <span>© {new Date().getFullYear()} FeedLA | Connecting surplus food to communities in need.</span>
            <div className="footer-links">
              <a href="https://github.com/leonnorfleet/nsbe-hackathon-2025" target="_blank" rel="noreferrer">
                View on GitHub
              </a>
              <a href="mailto:hello@foodlinkla.org">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
