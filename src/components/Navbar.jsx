import { useState } from 'react'

const WA_URL = `https://wa.me/919979963800?text=*Inquire*`

export default function Navbar({ onGalleryClick, onHomeClick, theme = 'dark' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  return (
    <nav
      className={`navbar${theme === 'light' ? ' navbar--light' : ''}${menuOpen ? ' navbar--menu-open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container navbar-inner">

        {/* ── Brand / Logo ── */}
        <a
          href="#home"
          className="nav-brand"
          onClick={() => { onHomeClick?.(); close() }}
          aria-label="Ambika Handicraft Home"
        >
          <img src="/logo.svg" alt="Ambika Handicraft Logo" className="nav-logo" />
          <span className="brand-en">Ambika Handicraft</span>
          <span className="brand-gu brand-gu-nav">| અંબિકા હૅન્ડિક્રાફ્ટ</span>
        </a>

        {/* ── Desktop right: links + CTA ── */}
        <div className="nav-right">
          <ul className="nav-links" role="list">
            <li><a href="#home" id="nav-home" onClick={onHomeClick}>Home</a></li>
            <li>
              <button
                id="nav-gallery"
                className="nav-link-btn"
                onClick={onGalleryClick}
                aria-label="Open full gallery"
              >
                Gallery
              </button>
            </li>
            <li><a href="#process" id="nav-process">Our Process</a></li>
            <li><a href="#about" id="nav-about">About Us</a></li>
          </ul>

          <a
            href={WA_URL}
            id="nav-cta"
            className="btn-primary nav-cta-desktop"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Inquire via WhatsApp"
          >
            <img
              src="/icons/whatsapp.svg"
              alt=""
              aria-hidden="true"
              style={{ width: '14px', height: '14px', flexShrink: 0 }}
            />
            Inquire Now
          </a>
        </div>

        {/* ── Hamburger — mobile only ── */}
        <button
          className={`nav-hamburger${menuOpen ? ' nav-hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {menuOpen && (
        <div className="nav-mobile-menu" role="dialog" aria-label="Mobile navigation">
          <ul className="nav-mobile-links">
            <li>
              <a href="#home" onClick={() => { onHomeClick?.(); close() }}>Home</a>
            </li>
            <li>
              <button onClick={() => { onGalleryClick?.(); close() }}>Gallery</button>
            </li>
            <li><a href="#process" onClick={close}>Our Process</a></li>
            <li><a href="#about" onClick={close}>About Us</a></li>
          </ul>
          <a
            href={WA_URL}
            className="btn-primary nav-mobile-cta"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            Inquire Now
          </a>
        </div>
      )}
    </nav>
  )
}
