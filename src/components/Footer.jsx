export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="brand-en">Ambika Handicraft & Photoframe</p>
            <p className="brand-gu">અંબિકા હૅન્ડિક્રાફ્ટ & ફોટોફ્રેમ</p>
            <div className="footer-social-row">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/bhaskarsiddhpura/"
                className="footer-social-link footer-social-link--insta"
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

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1DeR4RmkZY/"
                className="footer-social-link footer-social-link--fb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@ambicahandicraft.photofram376"
                className="footer-social-link footer-social-link--yt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch us on YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                </svg>
                YouTube
              </a>
            </div>
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
