import { useState, useEffect, useRef } from 'react'

export default function Hero({ active = false }) {
  const [hidden, setHidden] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const headingRef = useRef(null)
  const rafRef = useRef(null)

  // Hide headings permanently after 6s — only start timer once active
  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => setHidden(true), 6000)
    return () => clearTimeout(t)
  }, [active])

  // Play/pause video based on splash state
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (active) {
      vid.currentTime = 0   // always start from the very beginning
      vid.play().catch(() => { })  // catch needed for strict browser autoplay policies
    } else {
      vid.pause()
    }
  }, [active])

  // Scroll-driven overlay darkening
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const sectionH = section.offsetHeight
        const progress = Math.max(0, Math.min(1, scrollY / sectionH))

        // Overlay darkens as user scrolls away
        if (overlayRef.current) {
          const e = progress * 0.28
          overlayRef.current.style.background = `
            radial-gradient(ellipse at center, rgba(0,0,0,${0.06 + e * 0.3}) 0%, rgba(0,0,0,${0.50 + e}) 100%),
            linear-gradient(to bottom, rgba(0,0,0,${0.32 + e}) 0%, transparent 28%, transparent 68%, rgba(0,0,0,${0.42 + e}) 100%)
          `
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section"
      aria-label="Hero section"
    >
      {/* ── Video background ── */}
      <div className="hero-video-wrap">
        <video
          ref={videoRef}
          className={`hero-video${videoReady ? ' hero-video--ready' : ''}`}
          src="/hero.mp4?v=3"
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload"
        />
      </div>

      {/* ── Dark vignette overlay ── */}
      <div className="hero-canvas-overlay" ref={overlayRef} />

      {/* ── Headings — visible for 3.5s then fades out forever ── */}
      <div
        className={`hero-headings${hidden ? ' hero-headings--hidden' : ''}${active ? ' hero-headings--ready' : ''}`}
        ref={headingRef}
      >
        <h1 className="hero-title-en">Ambika Handicraft</h1>
        <p className="hero-title-gu">અંબિકા હૅન્ડિક્રાફ્ટ</p>
      </div>
    </section>
  )
}
