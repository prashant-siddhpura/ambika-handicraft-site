import { useEffect, useRef, useState, useCallback } from 'react'
import { reviews, OVERALL_RATING, TOTAL_REVIEWS, GOOGLE_REVIEW_URL } from '../data/reviewsData'

// ── Avatar colours ────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#1a73e8', '#e53935', '#43a047', '#8e24aa',
  '#f4511e', '#0097a7', '#7cb342', '#c62828',
]

// ── Tiny Google "G" badge (overlaid on avatar) ────────────────────────────
function GoogleBadge() {
  return (
    <span className="cr-g-badge" aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
    </span>
  )
}

// ── Blue verified tick ────────────────────────────────────────────────────
function VerifiedTick() {
  return (
    <svg className="cr-verified" width="14" height="14" viewBox="0 0 24 24" aria-label="Verified" role="img">
      <circle cx="12" cy="12" r="12" fill="#4285F4" />
      <path d="M9 12.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// ── Stars ─────────────────────────────────────────────────────────────────
function Stars({ rating, size = 15 }) {
  return (
    <span className="cr-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
          className={s <= rating ? 'cr-star--on' : 'cr-star--off'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

// ── Single card ───────────────────────────────────────────────────────────
function ReviewCard({ review, colorIndex }) {
  const [expanded, setExpanded] = useState(false)
  const LIMIT = 160
  const isLong = review.text.length > LIMIT
  const text = isLong && !expanded ? review.text.slice(0, LIMIT) + '…' : review.text
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]
  const initials = review.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <article className="cr-card" aria-label={`Review by ${review.name}`}>
      {/* Reviewer row */}
      <header className="cr-card-header">
        <div className="cr-avatar-wrap">
          <div className="cr-avatar" style={{ background: color }}>
            <span>{initials}</span>
          </div>
          <GoogleBadge />
        </div>
        <div className="cr-reviewer-info">
          <div className="cr-name-row">
            <p className="cr-reviewer-name">{review.name}</p>
            <VerifiedTick />
          </div>
        </div>
      </header>

      {/* Stars */}
      <Stars rating={review.rating} size={16} />

      {/* Text */}
      <p className="cr-text">{text}</p>
      {isLong && (
        <button className="cr-expand" onClick={() => setExpanded(e => !e)} aria-expanded={expanded}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </article>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function CustomerReviews() {
  const headerRef = useRef(null)
  const ratingRef = useRef(null)
  const carouselRef = useRef(null)
  const trackRef = useRef(null)

  const [current, setCurrent] = useState(0)
  const [perView, setPerView] = useState(4)

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      setPerView(w <= 640 ? 1 : w <= 900 ? 2 : w <= 1100 ? 3 : 4)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const maxIdx = Math.max(0, reviews.length - perView)

  const getCardWidth = () => {
    if (!trackRef.current) return 0
    return trackRef.current.children[0]?.offsetWidth || 0
  }

  const transitionTo = useCallback((newIndex) => {
    if (!trackRef.current) return
    trackRef.current.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
    const cardWidth = getCardWidth()
    trackRef.current.style.transform = `translateX(${-newIndex * cardWidth}px)`
    setCurrent(newIndex)
  }, [])

  const goTo = useCallback((idx) => {
    const targetIdx = Math.max(0, Math.min(idx, maxIdx))
    transitionTo(targetIdx)
  }, [maxIdx, transitionTo])

  // Dragging state references
  const dragStartX = useRef(null)
  const currentTranslateX = useRef(0)
  const isDragging = useRef(false)

  // Scroll-reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
      ;[headerRef, ratingRef, carouselRef].forEach(r => r.current && obs.observe(r.current))
    return () => obs.disconnect()
  }, [])

  // Dragging handlers for Touch & Mouse
  const handleDragStart = (clientX) => {
    if (!trackRef.current) return
    isDragging.current = true
    dragStartX.current = clientX
    const cardWidth = getCardWidth()
    currentTranslateX.current = -current * cardWidth
    trackRef.current.style.transition = 'none'
  }

  const handleDragMove = (clientX) => {
    if (!isDragging.current || dragStartX.current === null || !trackRef.current) return
    const deltaX = clientX - dragStartX.current
    const newTx = currentTranslateX.current + deltaX
    trackRef.current.style.transform = `translateX(${newTx}px)`
  }

  const handleDragEnd = (clientX) => {
    if (!isDragging.current || dragStartX.current === null || !trackRef.current) return
    isDragging.current = false
    const deltaX = clientX - dragStartX.current
    const cardWidth = getCardWidth()

    // Find fractional number of cards dragged
    const cardsDragged = deltaX / cardWidth

    // Round to the nearest whole index
    let newIndex = Math.round(current - cardsDragged)

    // For quick flicks (swiped >30px but rounded back to current index)
    if (newIndex === current && Math.abs(deltaX) > 30) {
      if (deltaX < 0) {
        newIndex = Math.min(current + 1, maxIdx)
      } else {
        newIndex = Math.max(current - 1, 0)
      }
    }

    newIndex = Math.max(0, Math.min(newIndex, maxIdx))

    transitionTo(newIndex)
    dragStartX.current = null
  }

  // Touch Events
  const onTouchStart = e => handleDragStart(e.touches[0].clientX)
  const onTouchMove = e => handleDragMove(e.touches[0].clientX)
  const onTouchEnd = e => handleDragEnd(e.changedTouches[0].clientX)

  // Mouse Events
  const onMouseDown = e => {
    if (e.button !== 0) return
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
      e.preventDefault()
    }
    handleDragStart(e.clientX)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = e => {
    handleDragMove(e.clientX)
  }

  const onMouseUp = e => {
    handleDragEnd(e.clientX)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const cardPct = 100 / perView
  const translatePct = current * cardPct

  return (
    <section id="reviews" className="cr-section" aria-label="Customer Reviews">
      <div className="container">

        {/* ── Heading ── */}
        <header className="section-header reveal" ref={headerRef}>
          <h2 className="section-title">Our Happy Clients</h2>
          {/* <div className="section-divider">
            <span className="diamond" aria-hidden="true">✦</span>
          </div> */}
        </header>

        {/* ── Rating summary (centered, clean) ── */}
        <div className="cr-rating-hero reveal" ref={ratingRef}>
          <span className="cr-rating-num">{OVERALL_RATING}</span>
          <Stars rating={5} size={26} />
        </div>

        {/* ── Carousel ── */}
        <div
          className="cr-carousel reveal"
          ref={carouselRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
          {/* Prev */}
          <button
            id="cr-prev"
            className={`cr-arrow cr-arrow--prev${current === 0 ? ' cr-arrow--hidden' : ''}`}
            onClick={() => goTo(current - 1)}
            aria-label="Previous reviews"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          <div className="cr-viewport">
            <div
              className="cr-track"
              ref={trackRef}
              style={{
                transform: `translateX(-${translatePct}%)`,
                transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {reviews.map((review, i) => (
                <div key={review.id} className="cr-slide" style={{ width: `${cardPct}%`, flexShrink: 0 }}>
                  <ReviewCard review={review} colorIndex={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            id="cr-next"
            className={`cr-arrow cr-arrow--next${current >= maxIdx ? ' cr-arrow--hidden' : ''}`}
            onClick={() => goTo(current + 1)}
            aria-label="Next reviews"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* ── Dots ── */}
        <div className="cr-dots" role="tablist" aria-label="Review pages">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Page ${i + 1}`}
              className={`cr-dot${i === current ? ' cr-dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* ── See all on Google ── */}
        <div className="cr-cta">
          <a href={GOOGLE_REVIEW_URL} className="cr-see-all" target="_blank" rel="noopener noreferrer" id="cr-see-all">
            <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {/* See all {TOTAL_REVIEWS} reviews on Google */}
            See all reviews on Google
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </a>
        </div>

      </div>
    </section>
  )
}
