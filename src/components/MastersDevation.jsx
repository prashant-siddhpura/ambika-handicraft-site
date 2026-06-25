import { useEffect, useRef } from 'react'

const steps = [
  { icon: '🪵', title: 'Wood Carving', desc: 'Precision crafting of premium timber into divine forms.' },
  { icon: '🎨', title: 'Artisanal Painting', desc: 'Rich, traditional color palettes applied by hand.' },
  { icon: '💎', title: 'Diamond Detailing', desc: 'Careful placement of stones for regal embellishment.' },
  { icon: '💡', title: 'LED Wiring & Boxing', desc: 'Illuminating the spirit within a protective, premium frame.' },
]

export default function MastersDevation() {
  const imgRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)

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
    if (imgRef.current) observer.observe(imgRef.current)
    if (titleRef.current) observer.observe(titleRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="process" className="masters-devotion" aria-label="The Master's Devotion – Our Process">
      <div className="container">
        <div className="devotion-grid">

          {/* Title */}
          <div className="devotion-title-wrap reveal-title" ref={titleRef}>
            <h2 className="section-title reveal-title-inner">The Master's Devotion</h2>
          </div>

          {/* Artisan Photo */}
          <div className="devotion-img-wrap reveal" ref={imgRef}>
            <img
              src="/assests/artisan_workshop.webp"
              alt="Artisan hands crafting a wooden frame surrounded by gemstones and tools in a Gujarati workshop"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="devotion-content reveal" ref={contentRef}>
            <p>
              Every piece from Ambika Handicraft is born from a legacy of devotion and
              meticulous skill. Our founder's journey is one of preserving the sacred
              essence of Gujarati artistry while infusing it with modern elegance.
            </p>

            <p className="process-label">The Sacred Process</p>

            <ol className="process-steps" aria-label="Four-step crafting process">
              {steps.map((s) => (
                <li key={s.title} className="step">
                  <div className="step-icon" aria-hidden="true">{s.icon}</div>
                  <div className="step-text">
                    <p className="step-title">{s.title}</p>
                    <p className="step-desc">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  )
}
