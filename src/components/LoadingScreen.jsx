import { useEffect, useRef, useState } from 'react'

/**
 * LoadingScreen
 * ─────────────
 * Shown on every visit. Exits only when BOTH:
 *   1. window 'load' event has fired (all assets fetched), AND
 *   2. MIN_MS milliseconds have elapsed (guarantees the full animation plays)
 *
 * Props:
 *   onDone — called after the fade-out transition ends
 */
const MIN_MS = 2800   // minimum splash duration (ms)

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in')  // 'in' | 'hold' | 'out'
  const [progress, setProgress] = useState(0)      // 0–100
  const loadedRef = useRef(false)
  const timerDoneRef = useRef(false)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  // Animate progress from 0 → 92 over MIN_MS, then jump to 100 on load
  useEffect(() => {
    startRef.current = performance.now()

    const tick = (now) => {
      const elapsed = now - startRef.current
      const natural = Math.min(92, Math.round((elapsed / MIN_MS) * 92))
      setProgress((prev) => Math.max(prev, natural))
      if (natural < 92) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Attempt to exit: both gates must be open
  const tryExit = () => {
    if (loadedRef.current && timerDoneRef.current) {
      setProgress(100)
      // small delay so "100%" is visible before fade
      setTimeout(() => setPhase('out'), 180)
    }
  }

  useEffect(() => {
    // Gate 1 — minimum timer
    const minTimer = setTimeout(() => {
      timerDoneRef.current = true
      tryExit()
    }, MIN_MS)

    // Gate 2 — window load event (all assets including hero.mp4)
    const onLoad = () => {
      loadedRef.current = true
      setProgress((prev) => Math.max(prev, 95))
      tryExit()
    }

    if (document.readyState === 'complete') {
      loadedRef.current = true
      tryExit()
    } else {
      window.addEventListener('load', onLoad)
    }

    return () => {
      clearTimeout(minTimer)
      window.removeEventListener('load', onLoad)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Once CSS fade-out transition ends, call onDone to unmount
  const handleTransitionEnd = (e) => {
    if (phase === 'out' && e.propertyName === 'opacity') {
      onDone()
    }
  }

  return (
    <div
      className={`splash-overlay${phase === 'out' ? ' splash-overlay--out' : ''}`}
      aria-live="polite"
      aria-label="Loading Ambika Handicraft"
      onTransitionEnd={handleTransitionEnd}
    >
      {/* ── Logo — SVG used as CSS mask; gradient animates inside the letter shapes ── */}
      <div className="splash-logo-wrap">
        <div
          className="splash-logo"
          role="img"
          aria-label="Ambika Handicraft logo"
        />
      </div>

      {/* ── Brand name ── */}
      <div className="splash-brand">
        <span className="splash-brand-en">Ambika Handicraft</span>
        <span className="splash-brand-gu">અંબિકા હૅન્ડિક્રાફ્ટ</span>
      </div>

      {/* ── Gold progress bar ── */}
      {/* <div className="splash-bar-track" aria-hidden="true">
        <div className="splash-bar-fill" />
      </div> */}

      {/* ── Circular progress ring + percentage counter ── */}
      <div className="splash-ring-wrap" aria-hidden="true">
        <svg className="splash-ring-svg" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#a07820" />
              <stop offset="40%"  stopColor="#D4AF37" />
              <stop offset="60%"  stopColor="#fff3b0" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          {/* Track (background circle) */}
          <circle
            className="splash-ring-track"
            cx="40" cy="40" r="34"
          />
          {/* Animated fill arc */}
          <circle
            className="splash-ring-fill"
            cx="40" cy="40" r="34"
            style={{
              strokeDashoffset: `${213.63 - (213.63 * progress) / 100}`,
            }}
          />
        </svg>
        <span className="splash-percent">{progress}%</span>
      </div>
    </div>
  )
}
