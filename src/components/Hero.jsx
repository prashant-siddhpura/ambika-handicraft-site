import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

// forwardRef so App can hold a ref to Hero and call startAudio() directly
// from inside the LoadingScreen's click handler (required for Safari autoplay)
const Hero = forwardRef(function Hero({ active = false }, ref) {
  const [hidden, setHidden] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  const sectionRef  = useRef(null)
  const videoRef    = useRef(null)
  const overlayRef  = useRef(null)
  const headingRef  = useRef(null)
  const rafRef      = useRef(null)

  // Expose startAudio() so App can call it synchronously from the Enter click
  // handler — this keeps the call inside the browser's user-gesture context,
  // which is required by Safari (and is best practice for all browsers).
  useImperativeHandle(ref, () => ({
    startAudio() {
      const vid = videoRef.current
      if (!vid) return
      vid.currentTime = 0
      vid.muted = false
      vid.play().catch(() => {
        // Strict browser (e.g. some iOS modes) blocked unmuted — fall back
        vid.muted = true
        vid.play().catch(() => { })
      })

      // After the first complete play, mute and loop silently forever
      const onFirstEnd = () => {
        vid.muted = true
        vid.loop = true           // switch on native loop for silent replays
        vid.currentTime = 0
        vid.play().catch(() => { })
        vid.removeEventListener('ended', onFirstEnd)
      }
      vid.addEventListener('ended', onFirstEnd)
    }
  }))

  // Hide headings permanently after 6s — only start timer once active
  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => setHidden(true), 6000)
    return () => clearTimeout(t)
  }, [active])

  // When active flips true (after loading screen fade-out) the video is already
  // playing with audio (started by startAudio above). Nothing extra needed here
  // except pausing if somehow active goes false.
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (!active) vid.pause()
  }, [active])

  // Scroll-driven overlay darkening
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const scrollY  = window.scrollY
        const sectionH = section.offsetHeight
        const progress = Math.max(0, Math.min(1, scrollY / sectionH))

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
      {/* ── Video background — no `loop` attr initially so `ended` fires ── */}
      <div className="hero-video-wrap">
        <video
          ref={videoRef}
          className={`hero-video${videoReady ? ' hero-video--ready' : ''}`}
          src="/hero-with-audio.mp4"
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload"
        />
      </div>

      {/* ── Dark vignette overlay ── */}
      <div className="hero-canvas-overlay" ref={overlayRef} />

      {/* ── Headings — visible for 6s then fades out forever ── */}
      <div
        className={`hero-headings${hidden ? ' hero-headings--hidden' : ''}${active ? ' hero-headings--ready' : ''}`}
        ref={headingRef}
      >
        <h1 className="hero-title-en">Ambika Handicraft</h1>
        <p className="hero-title-gu">અંબિકા હૅન્ડિક્રાફ્ટ</p>
      </div>
    </section>
  )
})

export default Hero
