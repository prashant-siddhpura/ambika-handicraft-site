import { useEffect, useRef, useCallback, useState } from 'react'
import { sortedGalleryItems, isVideo, VIDEO_AUTOPLAY } from '../data/galleryData'
import Lightbox from './Lightbox'

const WA_NUMBER = '919979963800'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20creation.`

// Row unit must match grid-auto-rows in CSS
const ROW_UNIT = 10  // px — matches grid-auto-rows: 10px
const ROW_GAP = 14  // px — matches gap: 14px

const READY_THRESHOLD = 0.6  // show gallery once 60% of initial batch is loaded
const INITIAL_COUNT = 8      // items shown on first load
const LOAD_MORE_COUNT = 8    // items added per "Load More" click

/**
 * Sets grid-row-end: span N on each card so the grid acts as a masonry layout.
 * Formula: span = ceil((cardHeight + gap) / (rowUnit + gap))
 */
function applyMasonrySpans(grid) {
  const cards = grid.querySelectorAll('.gi-card')
  cards.forEach((card) => {
    card.style.gridRowEnd = ''              // reset to measure natural height
    const h = card.getBoundingClientRect().height
    if (h === 0) return                    // not yet rendered — skip
    const span = Math.ceil((h + ROW_GAP) / (ROW_UNIT + ROW_GAP))
    card.style.gridRowEnd = `span ${span}`
  })
}

export default function Gallery({ onGalleryClick, onHomeClick, visible = false }) {
  const gridRef = useRef(null)

  // ── Load More pagination ──────────────────────────────────────────────────
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visibleItems = sortedGalleryItems.slice(0, visibleCount)
  const hasMore = visibleCount < sortedGalleryItems.length

  const loadMore = () => {
    setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, sortedGalleryItems.length))
  }

  // ── Gallery loading overlay ───────────────────────────────────────────────
  const [overlayVisible, setOverlayVisible] = useState(true)   // controls render
  const [overlayFading, setOverlayFading] = useState(false)    // triggers CSS fade-out
  const loadedCountRef = useRef(0)
  const clearedRef = useRef(false)
  const initialTotal = Math.min(INITIAL_COUNT, sortedGalleryItems.length)

  const triggerFadeOut = useCallback(() => {
    if (clearedRef.current) return
    clearedRef.current = true
    setOverlayFading(true)                          // start CSS fade
    setTimeout(() => setOverlayVisible(false), 600) // unmount after fade done
  }, [])

  const onMediaLoaded = useCallback(() => {
    loadedCountRef.current += 1
    if (initialTotal > 0 && loadedCountRef.current / initialTotal >= READY_THRESHOLD) {
      setTimeout(triggerFadeOut, 120) // small settle delay
    }
  }, [initialTotal, triggerFadeOut])

  // Safety fallback — clear overlay after 1.2s (only 8 items load initially, not all 24)
  useEffect(() => {
    const t = setTimeout(triggerFadeOut, 1200)
    return () => clearTimeout(t)
  }, [triggerFadeOut])

  // Reset overlay + scroll every time gallery becomes visible
  useEffect(() => {
    if (!visible) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    clearedRef.current = false
    loadedCountRef.current = 0
    setOverlayFading(false)
    setOverlayVisible(true)
    setVisibleCount(INITIAL_COUNT)  // reset pagination when re-entering gallery
    const t = setTimeout(triggerFadeOut, 1200)
    return () => clearTimeout(t)
  }, [visible, triggerFadeOut])

  // ── Lightbox state ────────────────────────────────────────────────────────
  const [lbIndex, setLbIndex] = useState(null) // null = closed

  const openLightbox = (idx) => setLbIndex(idx)
  const closeLightbox = () => setLbIndex(null)
  const prevItem = () => setLbIndex((i) => Math.max(0, i - 1))
  const nextItem = () => setLbIndex((i) => Math.min(sortedGalleryItems.length - 1, i + 1))

  // ── Grid masonry: span calculation ───────────────────────────────
  const layout = useCallback(() => {
    const grid = gridRef.current
    if (grid) applyMasonrySpans(grid)
  }, [])

  // Re-run masonry + rewire observer whenever visibleCount changes
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    layout()

    const media = [...grid.querySelectorAll('img, video')]
    media.forEach((el) => {
      if (el.tagName === 'IMG') {
        if (!el.complete) el.addEventListener('load', layout, { once: true })
      } else {
        if (el.readyState < 1) el.addEventListener('loadedmetadata', layout, { once: true })
      }
    })

    const t = setTimeout(layout, 300)

    // Staggered reveal for ALL cards (newly added ones won't have .visible yet)
    const cards = grid.querySelectorAll('.gi-card:not(.visible)')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            const allCards = [...(grid.querySelectorAll('.gi-card') ?? [])]
            const delay = allCards.indexOf(entry.target) * 60
            setTimeout(() => entry.target.classList.add('visible'), delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06 }
    )
    cards.forEach((card) => observer.observe(card))

    const ro = new ResizeObserver(layout)
    ro.observe(grid)

    return () => {
      clearTimeout(t)
      observer.disconnect()
      ro.disconnect()
    }
  }, [layout, visibleCount]) // re-run when more items are loaded

  return (
    <div className="gallery-page" role="main" aria-label="Full Gallery">

      {/* ── Gallery loading overlay ────────────────────────── */}
      {overlayVisible && (
        <div
          className={`gallery-loading-overlay${overlayFading ? ' gallery-loading-overlay--out' : ''}`}
          aria-hidden="true"
        >
          <div className="gallery-loading-spinner">
            <svg viewBox="0 0 50 50" className="gls-ring" aria-hidden="true">
              <circle cx="25" cy="25" r="20" fill="none" strokeWidth="3" />
            </svg>
            <span className="gls-label">Loading Gallery…</span>
          </div>
        </div>
      )}

      {/* ── Grid masonry ─────────────────────────────── */}
      <div className="gallery-container">
        <div className="gallery-masonry" ref={gridRef} role="list">
          {visibleItems.map((item, idx) => (
            <article
              key={item.id}
              className="gi-card"
              role="listitem"
              aria-label={item.title}
              onClick={() => openLightbox(idx)}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(idx)}
            >
              <div className="gi-media-wrap">
                {isVideo(item.src) ? (
                  <>
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      autoPlay={VIDEO_AUTOPLAY}
                      controls={!VIDEO_AUTOPLAY}
                      className="gi-video"
                      aria-label={item.alt}
                      onLoadedMetadata={() => { layout(); onMediaLoaded() }}
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      onClick={(e) => {
                        // Desktop only: block lightbox, toggle play/pause
                        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                          e.stopPropagation()
                          e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause()
                        }
                      }}
                    />
                    <span className="gi-video-badge" aria-hidden="true">▶</span>
                  </>
                ) : (
                  <>
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className="gi-img"
                      onLoad={() => { layout(); onMediaLoaded() }}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <div className="no-save-overlay" />
                  </>
                )}

              </div>

              <div className="gi-info">
                <p className="gi-name">{item.title}</p>
                <p className="gi-type">{item.type}</p>
              </div>
            </article>
          ))}
        </div>

        {sortedGalleryItems.length === 0 && (
          <p className="gallery-empty">
            Gallery coming soon. Add images to <code>public/assests/</code> and register them in{' '}
            <code>src/data/galleryData.js</code>.
          </p>
        )}

        {/* ── Load More button ─────────────────────────── */}
        {hasMore && (
          <div className="gi-load-more-wrap">
            <button className="gi-load-more-btn" onClick={loadMore} aria-label="Load more gallery items">
              <span className="gi-load-more-label">Load More</span>
              <svg className="gi-load-more-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}

        {/* ── All loaded message ───────────────────────── */}
        {!hasMore && sortedGalleryItems.length > INITIAL_COUNT && (
          <div className="gi-all-loaded">
            <span className="gi-all-loaded-line" aria-hidden="true" />
            <span className="gi-all-loaded-text">All creations displayed</span>
            <span className="gi-all-loaded-line" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────── */}
      {lbIndex !== null && (
        <Lightbox
          items={sortedGalleryItems}
          activeIndex={lbIndex}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
        />
      )}
    </div>
  )
}
