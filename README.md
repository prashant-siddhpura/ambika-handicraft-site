# Ambika Handicraft & Photoframe — Frontend

> **Divine Craftsmanship. Timeless Devotion.**
> Premium 3D LED Wooden Deity PhotoFrames, handcrafted on custom order in Ranip, Ahmedabad, Gujarat.

---

## Overview

This is the complete frontend for the **Ambika Handicraft & Photoframe** business website — a premium, immersive single-page experience built with React + Vite. The site showcases handmade 3D LED Wooden Deity PhotoFrames through a cinematic hero video, a curated gallery, the artisan's process, and a contact/location section.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Vanilla CSS (custom design system) |
| Language | JavaScript (ESM) |
| Linting | ESLint + react-hooks + react-refresh |
| Media | WebP images + MP4 videos |

---

## Project Structure

```
frontend/
├── public/
│   ├── assests/              # All product images & videos (WebP + MP4)
│   ├── icons/                # PWA / browser icons
│   ├── favicon.svg
│   ├── logo.svg
│   ├── hero-with-audio.mp4   # Hero background video (with ambient audio)
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx  # Animated splash with progress ring + Enter button
│   │   ├── Navbar.jsx         # Sticky responsive navbar (dark / light theme)
│   │   ├── Hero.jsx           # Full-screen video hero with audio-once logic
│   │   ├── SacredCreations.jsx # Home preview of 3 featured PhotoFrames
│   │   ├── MastersDevation.jsx # "How We Create" — 5-step handmade process
│   │   ├── Sanctuary.jsx      # Contact info, Google Maps embed, WhatsApp CTA
│   │   ├── Gallery.jsx        # Full gallery with filter, lightbox, video player
│   │   ├── Lightbox.jsx       # Full-screen image/video lightbox component
│   │   └── Footer.jsx         # Links, social, copyright
│   │
│   ├── data/
│   │   └── galleryData.js     # ← Single source of truth for all gallery media
│   │
│   ├── App.jsx                # Root — routing, audio unlock, page mounting
│   ├── index.css              # Full design system (tokens, components, animations)
│   └── main.jsx               # React entry point
│
├── index.html                 # SEO head — OG tags, JSON-LD, geo meta, canonical
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Clone the repo
git clone https://github.com/prashant-siddhpura/ambika-handicraft-site.git
cd ambika-handicraft-site/frontend

# Install dependencies
npm install

# Start dev server (localhost only)
npm run dev

# Start dev server (accessible on local network — for mobile testing)
npm run dev:network
```

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## Branches

| Branch | Purpose |
|---|---|
| `main` | Stable production code |
| `preview` | Active development / staging |

---

## Adding Gallery Items

All gallery media is managed from a **single file**: [`src/data/galleryData.js`](src/data/galleryData.js)

### Steps

1. Drop your file into `public/assests/` (WebP images or MP4 videos)
2. Add an entry to the `galleryItems` array:

```js
{
  id: 15,           // unique number
  order: 15,        // display order in gallery (lower = first)
  homePreview: true, // optional — shows on home page (max 3 items)
  src: '/assests/your_file.webp',
  alt: 'Descriptive text for accessibility',
  title: 'Deity Name',
  type: '3D PhotoFrame'  // or '2D PhotoFrame'
}
```

### Supported formats

| Type | Extensions |
|---|---|
| Images | `.webp` `.png` `.jpg` `.jpeg` `.avif` `.gif` |
| Videos | `.mp4` `.webm` `.mov` |

The gallery **auto-detects** media type from the file extension — no extra config needed.

### Home preview items

Mark exactly **up to 3** items with `homePreview: true` to feature them in the *Sacred Creations* section on the homepage.

### Video autoplay toggle

In `galleryData.js`, line 26:

```js
export const VIDEO_AUTOPLAY = false  // true = autoplay muted loop | false = click to play
```

---

## Hero Audio — How It Works

The hero section plays a background video (`hero-with-audio.mp4`) with ambient audio that plays **once per page load**, then loops silently forever.

### Why it works across all browsers

Browsers (especially Safari) block unmuted audio unless triggered by a direct user gesture. The flow is:

1. **Loading screen** displays with a progress ring
2. Once loaded, an **"Enter the site →"** button appears
3. User clicks → `startAudio()` is called **synchronously inside the click handler** (satisfies Safari's autoplay policy)
4. Video plays with audio for one full loop
5. After the first loop ends (`ended` event fires — no `loop` attr initially), video mutes and switches to native `loop`
6. Page refresh → audio plays again (no session storage used)

### Why Home never unmounts

To prevent the Hero video from freezing on navigation back from Gallery, both the Home and Gallery pages are **always mounted** in the DOM — toggled via `display: none`. This means the video element is never destroyed.

```jsx
{/* Always mounted — toggled by display */}
<div style={{ display: onHome ? 'block' : 'none' }}>
  <Hero /> ...
</div>
<div style={{ display: onGallery ? 'block' : 'none' }}>
  <Gallery />
</div>
```

---

## SEO

All SEO is in [`index.html`](index.html):

| Tag | Coverage |
|---|---|
| `<title>` + `<meta description>` | Google search snippet |
| `<meta keywords>` | 20+ targeted keywords |
| Open Graph (`og:*`) | Facebook, WhatsApp, LinkedIn, Telegram, Discord |
| Twitter Card | Twitter / X |
| `geo.*` + `ICBM` | Local SEO — Ahmedabad, Gujarat |
| `<link rel="canonical">` | Prevents duplicate content |
| JSON-LD `LocalBusiness` | Google rich results (address, phone, products) |
| JSON-LD `WebSite` | Google Sitelinks Search Box |

**OG Image:** `public/assests/OG_card.png` (1200×630)

> ⚠️ Before deploying, update the domain in `index.html` from `https://www.ambikahandicraft.com/` to your actual live URL.

---

## Contact

**Ambika Handicraft & Photoframe**
Swaminarayan Castle, 7/1, Arjun Ashram Road, Ranip, Ahmedabad – 382481

📞 +91 99799 63800
🌐 [www.ambikahandicraft.com](https://www.ambikahandicraft.com)
📷 [@bhaskarsiddhpura](https://www.instagram.com/bhaskarsiddhpura)

---

*All PhotoFrames are made on custom order only. We do not keep ready stock.*
