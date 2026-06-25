import { useEffect, useRef, useCallback, useState } from 'react'
import { isVideo } from '../data/galleryData'

/**
 * Lightbox — full-screen overlay that opens when a gallery card is clicked.
 * Supports images and videos. Close via ✕ button, backdrop click, or Escape key.
 * Navigate with left/right arrows or keyboard arrow keys.
 *
 * Zoom features (images only):
 *  - Scroll wheel  → zoom in / out (centred on cursor)
 *  - Double-click  → toggle 2× zoom at click point / reset
 *  - Click & drag  → pan when zoomed in
 *  - Pinch gesture → zoom on touch devices
 */
export default function Lightbox({ items, activeIndex, onClose, onPrev, onNext }) {
  const overlayRef = useRef(null)
  const videoRef = useRef(null)
  const imgRef = useRef(null)

  const item = items[activeIndex] ?? null

  // ── Zoom / pan state ────────────────────────────────────────────────────────
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // refs to avoid stale closures in pointer handlers
  const scaleRef = useRef(1)
  const offsetRef = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const lastPinchDist = useRef(null)

  const MIN_SCALE = 1
  const MAX_SCALE = 6

  // Clamp offset so image never drifts too far from centre
  function clampOffset(ox, oy, s, el) {
    if (!el) return { x: ox, y: oy }
    const rect = el.getBoundingClientRect()
    const maxX = Math.max(0, (rect.width * (s - 1)) / 2)
    const maxY = Math.max(0, (rect.height * (s - 1)) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, ox)),
      y: Math.max(-maxY, Math.min(maxY, oy)),
    }
  }

  function applyZoom(newScale, newOffset) {
    const el = imgRef.current
    scaleRef.current = newScale
    offsetRef.current = newOffset
    setScale(newScale)
    setOffset(newOffset)
    // cursor feedback
    if (el) el.style.cursor = newScale > 1 ? 'grab' : 'default'
  }

  function resetZoom() {
    applyZoom(1, { x: 0, y: 0 })
  }

  // Reset zoom when image changes
  useEffect(() => { resetZoom() }, [activeIndex]) // eslint-disable-line

  // ── Keyboard navigation ──────────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') { onClose() }
    if (e.key === 'ArrowLeft') { onPrev(); resetZoom() }
    if (e.key === 'ArrowRight') { onNext(); resetZoom() }
  }, [onClose, onPrev, onNext]) // eslint-disable-line

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  // ── Reset video on item change ───────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => { })
    }
  }, [activeIndex])

  // ── Wheel zoom ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = imgRef.current
    if (!el || isVideo(item?.src)) return

    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scaleRef.current * factor))

      // Zoom toward/away from cursor position
      const cursorX = e.clientX - rect.left - rect.width / 2
      const cursorY = e.clientY - rect.top - rect.height / 2
      const ratio = newScale / scaleRef.current
      const newOx = offsetRef.current.x * ratio + cursorX * (ratio - 1)
      const newOy = offsetRef.current.y * ratio + cursorY * (ratio - 1)
      const clamped = clampOffset(newOx, newOy, newScale, el)

      applyZoom(newScale, clamped)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [item]) // re-attach when item changes

  // ── Double-click to zoom toggle ──────────────────────────────────────────
  const handleDoubleClick = (e) => {
    if (isVideo(item?.src)) return
    e.stopPropagation()
    const el = imgRef.current
    if (!el) return

    if (scaleRef.current > 1) {
      resetZoom()
    } else {
      const rect = el.getBoundingClientRect()
      const cx = e.clientX - rect.left - rect.width / 2
      const cy = e.clientY - rect.top - rect.height / 2
      const s = 2.5
      const clamped = clampOffset(cx * (s - 1), cy * (s - 1), s, el)
      applyZoom(s, clamped)
    }
  }

  // ── Drag to pan ──────────────────────────────────────────────────────────
  const handlePointerDown = (e) => {
    if (isVideo(item?.src) || scaleRef.current <= 1) return
    e.preventDefault()
    dragging.current = true
    dragStart.current = {
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    }
    if (imgRef.current) imgRef.current.style.cursor = 'grabbing'
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragging.current) return
    const el = imgRef.current
    const newOx = e.clientX - dragStart.current.x
    const newOy = e.clientY - dragStart.current.y
    const clamped = clampOffset(newOx, newOy, scaleRef.current, el)
    applyZoom(scaleRef.current, clamped)
  }

  const handlePointerUp = () => {
    dragging.current = false
    if (imgRef.current) imgRef.current.style.cursor = scaleRef.current > 1 ? 'grab' : 'default'
  }

  // ── Pinch-to-zoom (touch) ────────────────────────────────────────────────
  const handleTouchMove = (e) => {
    if (isVideo(item?.src) || e.touches.length !== 2) return
    e.preventDefault()
    const t1 = e.touches[0]
    const t2 = e.touches[1]
    const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)

    if (lastPinchDist.current !== null) {
      const factor = dist / lastPinchDist.current
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scaleRef.current * factor))
      const el = imgRef.current
      const mx = (t1.clientX + t2.clientX) / 2
      const my = (t1.clientY + t2.clientY) / 2
      const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 }
      const cx = mx - rect.left - rect.width / 2
      const cy = my - rect.top - rect.height / 2
      const ratio = newScale / scaleRef.current
      const newOx = offsetRef.current.x * ratio + cx * (ratio - 1)
      const newOy = offsetRef.current.y * ratio + cy * (ratio - 1)
      applyZoom(newScale, clampOffset(newOx, newOy, newScale, el))
    }

    lastPinchDist.current = dist
  }

  const handleTouchEnd = () => { lastPinchDist.current = null }

  if (!item) return null

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < items.length - 1

  const imgStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
    transformOrigin: 'center center',
    transition: dragging.current ? 'none' : 'transform 0.08s ease-out',
    willChange: 'transform',
    userSelect: 'none',
    touchAction: 'none',
  }

  return (
    <div
      className="lb-overlay"
      ref={overlayRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${item.title}`}
    >
      {/* ── Close button ── */}
      <button className="lb-close" onClick={onClose} aria-label="Close lightbox">
        ✕
      </button>

      {/* ── Zoom indicator ── */}
      {scale > 1.05 && (
        <div className="lb-zoom-badge" aria-live="polite">
          {Math.round(scale * 10) / 10}×
        </div>
      )}

      {/* ── Prev arrow ── */}
      {hasPrev && (
        <button className="lb-arrow lb-arrow-prev" onClick={() => { onPrev(); resetZoom() }} aria-label="Previous image">
          ‹
        </button>
      )}

      {/* ── Media panel ── */}
      <div className="lb-panel" onClick={(e) => e.stopPropagation()}>
        <div className="lb-media-wrap">
          {isVideo(item.src) ? (
            <video
              ref={videoRef}
              src={item.src}
              className="lb-media"
              controls
              autoPlay
              muted
              loop
              playsInline
              aria-label={item.alt}
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <img
              ref={imgRef}
              src={item.src}
              alt={item.alt}
              className="lb-media lb-media--zoomable"
              draggable={false}
              style={imgStyle}
              onDoubleClick={handleDoubleClick}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          )}
        </div>

        {/* ── Zoom hint (shown only once, fades out) ── */}
        {!isVideo(item.src) && scale <= 1.05 && (
          <p className="lb-zoom-hint-text" aria-hidden="true">
            Scroll or double-click to zoom · Drag to pan
          </p>
        )}

        {/* ── Caption ── */}
        <div className="lb-caption">
          <p className="lb-caption-title">{item.title}</p>
          <p className="lb-caption-type">{item.type}</p>
          <span className="lb-caption-counter">
            {activeIndex + 1} / {items.length}
          </span>
        </div>
      </div>

      {/* ── Next arrow ── */}
      {hasNext && (
        <button className="lb-arrow lb-arrow-next" onClick={() => { onNext(); resetZoom() }} aria-label="Next image">
          ›
        </button>
      )}
    </div>
  )
}
