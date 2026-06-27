import { useEffect, useRef } from 'react'

const steps = [
  { icon: '🪵', title: 'Hand Carved Wood', desc: 'We carve the designs directly on real wood by hand.' },
  { icon: '🎨', title: 'Painted by Hand', desc: 'Our artists paint every detail using beautiful, bright colors.' },
  { icon: '💎', title: 'Shiny Gemstones', desc: 'We stick colorful premium glass stones and polished gems.' },
  { icon: '📦', title: 'Wooden Box Frame', desc: 'We fit the completed artwork inside a strong wooden box.' },
  { icon: '💡', title: 'Warm LED Lights', desc: 'We add glowing lights inside to make the frame shine.' },
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
    <section id="process" className="masters-devotion" aria-label="How We Create – Our Process">
      <div className="container">
        <div className="devotion-grid">

          {/* Title */}
          <div className="devotion-title-wrap reveal-title" ref={titleRef}>
            <h2 className="section-title reveal-title-inner">How We Create</h2>
          </div>

          {/* Artisan Photo */}
          <div className="devotion-img-wrap reveal" ref={imgRef}>
            <img
              src="/assests/artisan_workshop.webp"
              alt="Artisan hands crafting a wooden frame surrounded by gemstones and tools in a Gujarati workshop"
              loading="lazy"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            <div className="no-save-overlay" />
          </div>

          {/* Content */}
          <div className="devotion-content reveal" ref={contentRef}>
            <p>
              At Ambika Handicraft, every single frame is 100% handmade.
              We make each piece with care, keeping our art alive.
            </p>

            <p className="process-label">Our Handmade Process</p>

            <ol className="process-steps" aria-label="Five-step crafting process">
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
