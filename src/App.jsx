import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleHashChange = () => {
      const isGallery = window.location.hash === '#gallery'
      setPage((prevPage) => {
        if (prevPage === 'gallery' && !isGallery) {
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
        return isGallery ? 'gallery' : 'home'
      })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const goGallery = () => { window.location.hash = '#gallery' }
  const goHome = () => { window.location.hash = '#home' }

  if (page === 'gallery') {
    return (
      <>
        {showSplash && <LoadingScreen onDone={() => setShowSplash(false)} />}
        <Navbar onGalleryClick={goGallery} onHomeClick={goHome} theme="light" />
        <Gallery onGalleryClick={goGallery} onHomeClick={goHome} />
      </>
    )
  }

  return (
    <>
      {showSplash && <LoadingScreen onDone={() => setShowSplash(false)} />}
      <Navbar onGalleryClick={goGallery} onHomeClick={goHome} />
      <main>
        <Hero active={!showSplash} />
        <SacredCreations onViewAll={goGallery} />
        <MastersDevation />
        <Sanctuary />
      </main>
      <Footer />
    </>
  )
}
