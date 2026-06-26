import { useEffect, useRef, useCallback, useState } from 'react'
import { sortedGalleryItems, isVideo, VIDEO_AUTOPLAY } from '../data/galleryData'
import Lightbox from './Lightbox'

const WA_NUMBER = '919979963800'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20creation.`

// Row unit must match grid-auto-rows in CSS
const ROW_UNIT = 10  // px — matches grid-auto-rows: 10px
const ROW_GAP = 14  // px — matches gap: 14px

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

export default function Gallery({ onGalleryClick, onHomeClick }) {
  const gridRef = useRef(null)

  // ── Lightbox state ────────────────────────────────────────────────────────
  const [lbIndex, setLbIndex] = useState(null) // null = closed

  const openLightbox = (idx) => setLbIndex(idx)
  const closeLightbox = () => setLbIndex(null)
  const prevItem = () => setLbIndex((i) => Math.max(0, i - 1))
  const nextItem = () => setLbIndex((i) => Math.min(sortedGalleryItems.length - 1, i + 1))

  // ── Staggered reveal (IntersectionObserver) ──────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    const cards = gridRef.current?.querySelectorAll('.gi-card') ?? []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            const allCards = [...(gridRef.current?.querySelectorAll('.gi-card') ?? [])]
            const delay = allCards.indexOf(entry.target) * 60
            setTimeout(() => entry.target.classList.add('visible'), delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06 }
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  // ── Grid masonry: span calculation ───────────────────────────────
  const layout = useCallback(() => {
    const grid = gridRef.current
    if (grid) applyMasonrySpans(grid)
  }, [])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    // Run once immediately (for any already-cached images)
    layout()

    // Re-run when each image/video finishes loading
    const media = [...grid.querySelectorAll('img, video')]
    media.forEach((el) => {
      if (el.tagName === 'IMG') {
        if (!el.complete) el.addEventListener('load', layout, { once: true })
      } else {
        if (el.readyState < 1) el.addEventListener('loadedmetadata', layout, { once: true })
      }
    })

    // Also run a short delay pass in case lazy images load just after mount
    const t = setTimeout(layout, 300)

    // Re-layout on every resize
    const ro = new ResizeObserver(layout)
    ro.observe(grid)

    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [layout])

  return (
    <div className="gallery-page" role="main" aria-label="Full Gallery">

      {/* ── Gallery title ─────────────────────────────── */}
      {/* <div className="gallery-title-row">
        <h1 className="gp-title">Our Creations</h1>
        <p className="gp-subtitle">
          {sortedGalleryItems.length} work{sortedGalleryItems.length !== 1 ? 's' : ''} · 3D LED Wooden Frames
        </p>
      </div> */}

      {/* ── Grid masonry ─────────────────────────────── */}
      <div className="gallery-container">
        <div className="gallery-masonry" ref={gridRef} role="list">
          {sortedGalleryItems.map((item, idx) => (
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
                      onLoadedMetadata={layout}
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
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="gi-img"
                    onLoad={layout}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
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
