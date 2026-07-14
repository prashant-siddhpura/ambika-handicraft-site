import { useEffect, useRef } from 'react'

export default function GoogleReviews() {
  const headerRef = useRef(null)
  const widgetRef = useRef(null)

  // Scroll-reveal for the section header
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (headerRef.current) observer.observe(headerRef.current)
    if (widgetRef.current) observer.observe(widgetRef.current)
    return () => observer.disconnect()
  }, [])

  // Inject Elfsight platform script once
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return
    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <section id="reviews" className="google-reviews" aria-label="Customer Reviews">
      <div className="container">

        {/* ── Section heading ── */}
        <header className="section-header reveal" ref={headerRef}>
          <h2 className="section-title">Our Happy Clients</h2>
          <div className="section-divider">
            <span className="diamond" aria-hidden="true">✦</span>
          </div>
        </header>

        {/* ── Elfsight widget ── */}
        <div className="gr-elfsight-wrap reveal" ref={widgetRef}>
          <div
            className="elfsight-app-03154692-5738-4ade-b1bf-3a8612817a30"
            data-elfsight-app-lazy
          />
        </div>

      </div>
    </section>
  )
}
