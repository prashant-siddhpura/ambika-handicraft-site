import { useState, useEffect, useRef } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SacredCreations from './components/SacredCreations'
import MastersDevation from './components/MastersDevation'
import Sanctuary from './components/Sanctuary'
import Footer from './components/Footer'
import Gallery from './components/Gallery'

export default function App() {
  const [page, setPage] = useState(() => {
    return window.location.hash === '#gallery' ? 'gallery' : 'home'
  })
  const [showSplash, setShowSplash] = useState(true)

  // Ref to Hero so we can call startAudio() synchronously from the Enter
  // button's click handler — required for Safari autoplay-with-sound policy
  const heroRef = useRef(null)

  useEffect(() => {
    const handleHashChange = () => {
      const isGallery = window.location.hash === '#gallery'
      setPage((prevPage) => {
        if (prevPage === 'gallery' && !isGallery) {
          // Coming back to home — scroll to the right section
          const targetId = window.location.hash.slice(1)
          if (!targetId || targetId === 'home') {
            requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
          } else {
            requestAnimationFrame(() => {
              const el = document.getElementById(targetId)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            })
          }
        }
        if (isGallery && prevPage !== 'gallery') {
          // Going to gallery — always scroll to top
          requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
        }
        return isGallery ? 'gallery' : 'home'
      })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const goGallery = () => { window.location.hash = '#gallery' }
  const goHome = () => { window.location.hash = '#home' }

  // Called synchronously inside the Enter button's onClick — starts audio
  // while still inside the browser's user-gesture context (works on Safari)
  const handleEnterClick = () => {
    heroRef.current?.startAudio()
  }

  // Single render — both pages always stay mounted.
  // We toggle visibility with display:none so Hero (and its video) never
  // unmounts/remounts when the user navigates between home and gallery.
  const onHome = page !== 'gallery'
  const onGallery = page === 'gallery'

  return (
    <>
      {showSplash && <LoadingScreen onDone={() => setShowSplash(false)} onEnterClick={handleEnterClick} />}

      <Navbar
        onGalleryClick={goGallery}
        onHomeClick={goHome}
        theme={onGallery ? 'light' : undefined}
      />

      {/* ── Home page — always mounted, hidden when on gallery ── */}
      <div style={{ display: onHome ? 'block' : 'none' }}>
        <main>
          <Hero ref={heroRef} active={!showSplash} />
          <SacredCreations onViewAll={goGallery} />
          <MastersDevation />
          <Sanctuary />
        </main>
        <Footer />
      </div>

      {/* ── Gallery page — always mounted, hidden when on home ── */}
      <div style={{ display: onGallery ? 'block' : 'none' }}>
        <Gallery onGalleryClick={goGallery} onHomeClick={goHome} visible={onGallery} />
      </div>
    </>
  )
}
