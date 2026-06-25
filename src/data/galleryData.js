// ─────────────────────────────────────────────────────────────────────────────
// GALLERY DATA — single source of truth for all media.
//
// HOW TO ADD MEDIA:
//   1. Drop your file inside  public/assests/
//   2. Add an entry below.
//
// IMAGE formats supported : .png  .jpg  .jpeg  .webp  .gif  .avif
// VIDEO formats supported  : .mp4  .webm  .mov
//
// FIELDS:
//   id          — unique number, used as React key
//   order       — controls display ORDER in the full gallery page (lower = first)
//   homePreview — set to true on exactly 3 items to show them on the home page
//   src         — path to file inside public/
//   alt         — accessibility description
//   title       — card title
//   type        — card subtitle
//
// The gallery auto-detects the media type from the file extension.
// ─────────────────────────────────────────────────────────────────────────────

// ── VIDEO AUTOPLAY TOGGLE ─────────────────────────────────────────────────────
// Set to  true  to autoplay all videos silently (muted, loop).
// Set to  false  to show a static thumbnail — user must press ▶ to play.
export const VIDEO_AUTOPLAY = false   // ← change this line to enable/disable
// ─────────────────────────────────────────────────────────────────────────────

export const galleryItems = [
  {
    id: 1,
    order: 1,
    // homePreview: true,                 // ← shows on home page (slot 1)
    src: '/assests/3d_mahakali_maa.webp',
    alt: 'Mahakali Maa 3D LED wooden frame with intricate carved border and glowing LED lights',
    title: 'Shree Mahakali Maa',
    type: '3D LED Frame',
  },
  {
    id: 2,
    order: 2,
    homePreview: true,                 // ← shows on home page (slot 2)
    src: '/assests/3d_brahmani_maa.webp',
    alt: 'Brahmani Maa 3D LED wooden frame with gold accents and warm glowing lights',
    title: 'Shree Brahmani Maa',
    type: '3D LED Frame',
  },
  {
    id: 3,
    order: 5,
    homePreview: true,                 // ← shows on home page (slot 3)
    src: '/assests/3d_goga_maharaj.webp',
    alt: 'Goga Maharaj 3D LED wooden frame with traditional Rajasthani motifs',
    title: 'Goga Maharaj',
    type: '3D LED Frame',
  },
  {
    id: 4,
    order: 3,
    src: '/assests/3d_sikotar_maa.webp',
    alt: 'Sikotar Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Sikotar Maa',
    type: '3D LED Frame',
  },
  {
    id: 5,
    order: 7,
    src: '/assests/3d_baan_maa.webp',
    alt: 'Baan Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Baan Maa',
    type: '3D LED Frame',
  },
  {
    id: 6,
    order: 8,
    src: '/assests/3d_sadhi_maa.webp',
    alt: 'sadhi Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Sadhi Maa',
    type: '3D LED Frame',
  },
  {
    id: 7,
    order: 6,
    src: '/assests/3d_meldi_maa_video.mp4',
    alt: 'Meldi Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Meldi Maa',
    type: '3D LED Frame',
  },
  {
    id: 8,
    order: 4,
    src: '/assests/3d_shiv_parivar_video.mp4',
    alt: 'shiv parivar video',
    title: 'Shiv Parivar',
    type: '3D LED Frame',
  },
  {
    id: 9,
    order: 9,
    src: '/assests/3d_goga_maharaj_video.mp4',
    alt: 'goga maharaj video',
    title: 'Goga Maharaj',
    type: '3D LED Frame',
  },
  {
    id: 10,
    order: 10,
    src: '/assests/3d_mogal_maa.webp',
    alt: '3d Mogal Maa',
    title: 'Mogal Maa',
    type: '3D LED Frame'

  },
  {
    id: 11,
    order: 11,
    homePreview: true,
    src: '/assests/3d_meldi_maa.webp',
    alt: '3d Meldi Maa',
    title: 'Meldi Maa',
    type: '3D LED Frame'

  }
]

// ── Helper — detects video by extension ──────────────────────────────────────
const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.ogg']
export const isVideo = (src) =>
  VIDEO_EXTS.some((ext) => src.toLowerCase().endsWith(ext))

// ── Home preview items — filtered by homePreview: true, max 3 ────────────────
export const homePreviewItems = galleryItems
  .filter((item) => item.homePreview === true)
  .slice(0, 3)

// ── Gallery items — sorted by order field ────────────────────────────────────
export const sortedGalleryItems = [...galleryItems].sort((a, b) => a.order - b.order)
