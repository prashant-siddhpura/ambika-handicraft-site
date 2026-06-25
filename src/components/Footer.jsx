export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="brand-en">Ambika Handicraft & Photoframe</p>
            <p className="brand-gu">અંબિકા હૅન્ડિક્રાફ્ટ & ફોટોફ્રેમ</p>
            <a
              href="https://www.instagram.com/bhaskarsiddhpura/"
              className="footer-insta-icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </a>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#home" id="footer-nav-home">Home</a>
            <a href="#gallery" id="footer-nav-gallery">Gallery</a>
            <a href="#process" id="footer-nav-process">Our Process</a>

          </nav>

          <div className="footer-info-col">
            <p className="info-line">Operating Hours: 10 AM – 8 PM</p>
            <p className="info-line">Ranip, Ahmedabad, Gujarat</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copy">© 2026 Ambika Handicraft. Ahmedabad.</p>
          <p className="made">Privacy Policy &nbsp;·&nbsp; Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
