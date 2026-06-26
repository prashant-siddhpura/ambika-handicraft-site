import { useEffect, useRef, useState } from 'react'

const WA_NUMBER = '919979963800'

// Build WhatsApp URL from form data
function buildWaUrl({ name, phone, deity }) {
  const msg = `Hello, I would like to inquire about a custom creation.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Deity / Design:* ${encodeURIComponent(deity)}`
  return `https://wa.me/${WA_NUMBER}?text=${msg}`
}

export default function Sanctuary() {
  const headerRef = useRef(null)
  const infoRef = useRef(null)
  const formRef = useRef(null)

  const [form, setForm] = useState({ name: '', phone: '', deity: '' })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
      ;[headerRef, infoRef, formRef].forEach((r) => r.current && observer.observe(r.current))
    return () => observer.disconnect()
  }, [])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = buildWaUrl({ name: form.name, phone: form.phone, deity: form.deity })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="about" className="sanctuary" aria-label="Visit Our Sanctuary and Contact">
      <div className="container">
        <header className="section-header reveal" ref={headerRef}>
          <h2 className="section-title">Visit Our Shop</h2>
          <div className="section-divider">
            <span className="diamond" aria-hidden="true">✦</span>
          </div>
        </header>

        <div className="sanctuary-grid">

          {/* Map Card */}
          <div className="map-card reveal" ref={infoRef}>
            <div className="map-embed-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3488.872074645976!2d72.55179947509357!3d23.079349979134037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8383356d9a7d%3A0x58bf09c4706f25de!2sAmbika%20handcraft%20%26%20photo%20frame!5e1!3m2!1sen!2sin!4v1779866692859!5m2!1sen!2sin"
                title="Ambika Handicraft location on Google Maps"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="map-meta">
              <div className="info-item">
                <div className="info-icon" aria-hidden="true">🕙</div>
                <div>
                  <p className="label">Operating Hours</p>
                  <p className="value">Monday – Saturday &nbsp;·&nbsp; 10:00 AM – 8:00 PM</p>
                </div>
              </div>

              {/* Social follow links — vertical stack */}
              <div className="sanc-social-stack">
                <a
                  href="https://www.instagram.com/bhaskarsiddhpura/"
                  className="sanc-social-link sanc-social-link--insta"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Instagram"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  Instagram
                </a>

                <a
                  href="https://www.facebook.com/share/1DeR4RmkZY/"
                  className="sanc-social-link sanc-social-link--fb"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Facebook"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </a>

                <a
                  href="https://www.youtube.com/@ambicahandicraft.photofram376"
                  className="sanc-social-link sanc-social-link--yt"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch on YouTube"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                  </svg>
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form → WhatsApp */}
          <div className="form-card reveal" ref={formRef}>
            <h3>Request Custom Creation</h3>
            <form
              id="inquiry-form"
              className="form-fields"
              noValidate
              onSubmit={handleSubmit}
              aria-label="Custom creation inquiry form"
            >
              <div className="form-field">
                <label htmlFor="full-name">Full Name</label>
                <input
                  type="text"
                  id="full-name"
                  name="name"
                  // placeholder="Your full name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  // placeholder="+91 98765 43210"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="deity-request">Design Request</label>
                <textarea
                  id="deity-request"
                  name="deity"
                  rows={1}
                  // placeholder="e.g., Radha Krishna, 12×16 inch, Diamond border…"
                  value={form.deity}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" id="submit-inquiry" className="btn-submit">
                Submit Inquiry
              </button>

              {/* Subtle WhatsApp hint */}
              <p className="wa-hint">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Submitting will open WhatsApp to send your inquiry directly
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
