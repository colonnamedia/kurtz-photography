import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { CREATOR } from '../lib/seed.js'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/weddings', label: 'Weddings' },
  { to: '/about', label: 'About Amanda' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="nav creator-nav">
      <div className="wrap nav__inner">
        <Link to="/" className="nav__brand creator-brand" onClick={() => setOpen(false)}>
          <span className="creator-brand__mark">KP</span>
          <span className="kurtz-wordmark">Kurtz <em>Photography</em></span>
        </Link>

        <button className="nav__toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>

        <div className={`nav__links ${open ? 'is-open' : ''}`}>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`} onClick={() => setOpen(false)}>
              {n.label}
            </NavLink>
          ))}
          <span className="nav__cta-wrap">
            <Link to="/contact" className="btn btn--sm creator-nav__cta" onClick={() => setOpen(false)}>Check your date</Link>
          </span>
        </div>
      </div>
    </nav>
  )
}
