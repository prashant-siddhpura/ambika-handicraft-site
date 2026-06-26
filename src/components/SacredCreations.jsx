import { useEffect, useRef, useState } from 'react'
import { galleryItems, homePreviewItems, isVideo, VIDEO_AUTOPLAY } from '../data/galleryData'
import Lightbox from './Lightbox'

export default function SacredCreations({ onViewAll }) {
  const headerRef = useRef(null)
  const titleRef = useRef(null)
  const cardRefs = useRef([])

  // ── Lightbox state ───────────────────────────────────
  const [lbIndex, setLbIndex] = useState(null)
  const openLightbox = (idx) => setLbIndex(idx)
  const closeLightbox = () => setLbIndex(null)
  const prevItem = () => setLbIndex((i) => Math.max(0, i - 1))
  const nextItem = () => setLbIndex((i) => Math.min(homePreviewItems.length - 1, i + 1))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')]
            const delay = siblings.indexOf(entry.target) * 80
            setTimeout(() => entry.target.classList.add('visible'), delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    if (headerRef.current) observer.observe(headerRef.current)
    if (titleRef.current) observer.observe(titleRef.current)
    cardRefs.current.forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section id="gallery" className="sacred-creations" aria-label="Our Sacred Creations">
        <div className="container">
          {/* Title — stays centered */}
          <header className="section-header reveal" ref={headerRef}>
            <div className="reveal-title" ref={titleRef}>
              <h2 className="section-title reveal-title-inner">Our Sacred Creations</h2>
            </div>
            <div className="section-divider">
              <span className="diamond" aria-hidden="true">✦</span>
            </div>
          </header>

          {/* "See more" pinned above the last card (right side) */}
          {galleryItems.length > 3 && (
            <div className="masonry-pre-row">
              <button
                className="btn-see-more"
                onClick={onViewAll}
                aria-label={`View all ${galleryItems.length} creations in full gallery`}
              >
                See more <span className="vg-arrow" aria-hidden="true">›</span>
              </button>
            </div>
          )}

          {/* 3 hand-picked home preview cards — set homePreview: true in galleryData.js */}
          <div className="products-masonry" role="list">
            {homePreviewItems.map((item, idx) => (
              <article
                key={item.id}
                className="product-card reveal"
                ref={(el) => (cardRefs.current[idx] = el)}
                role="listitem"
                aria-label={`${item.title} — ${item.type}`}
                onClick={() => openLightbox(idx)}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(idx)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-img-wrap">
                  {isVideo(item.src) ? (
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      autoPlay={VIDEO_AUTOPLAY}
                      controls={!VIDEO_AUTOPLAY}
                      aria-label={item.alt}
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    <>
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                      <div className="no-save-overlay" />
                    </>
                  )}

                </div>
                <div className="product-info">
                  <p className="name">{item.title}</p>
                  <p className="type">{item.type}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lbIndex !== null && (
        <Lightbox
          items={homePreviewItems}
          activeIndex={lbIndex}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
        />
      )}
    </>
  )
}
