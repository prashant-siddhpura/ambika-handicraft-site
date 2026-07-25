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
    type: '3D PhotoFrame',
  },
  {
    id: 2,
    order: 2,
    src: '/assests/3d_brahmani_maa.webp',
    alt: 'Brahmani Maa 3D LED wooden frame with gold accents and warm glowing lights',
    title: 'Shree Brahmani Maa',
    type: '3D PhotoFrame',
  },
  {
    id: 11,
    order: 11,
    homePreview: true,
    src: '/assests/3d_meldi_maa.webp',
    alt: '3d Meldi Maa',
    title: 'Meldi Maa',
    type: '3D PhotoFrame'

  },
  {
    id: 3,
    order: 5,
    homePreview: true,                 // ← shows on home page (slot 3)
    src: '/assests/3d_goga_maharaj.webp',
    alt: 'Goga Maharaj 3D LED wooden frame with traditional Rajasthani motifs',
    title: 'Goga Maharaj',
    type: '3D PhotoFrame',
  },
  {
    id: 4,
    order: 3,
    src: '/assests/3d_sikotar_maa.webp',
    alt: 'Sikotar Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Sikotar Maa',
    type: '3D PhotoFrame',
  },
  {
    id: 5,
    order: 7,
    src: '/assests/3d_baan_maa.webp',
    alt: 'Baan Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Baan Maa',
    type: '3D PhotoFrame',
  },
  {
    id: 6,
    order: 8,
    src: '/assests/3d_sadhi_maa.webp',
    alt: 'sadhi Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Sadhi Maa',
    type: '3D PhotoFrame',
  },
  {
    id: 7,
    order: 6,
    src: '/assests/3d_meldi_maa_video.mp4',
    alt: 'Meldi Maa 3D LED wooden frame with traditional motifs',
    title: 'Shree Meldi Maa',
    type: '3D PhotoFrame',
  },
  {
    id: 8,
    order: 4,
    src: '/assests/3d_shivparivar_video.mp4',
    alt: 'shiv parivar video',
    title: 'Shiv Parivar',
    type: '3D PhotoFrame',
  },
  {
    id: 9,
    order: 9,
    src: '/assests/3d_goga_maharaj_video.mp4',
    alt: 'goga maharaj video',
    title: 'Goga Maharaj',
    type: '3D PhotoFrame',
  },
  {
    id: 10,
    order: 10,
    src: '/assests/3d_mogal_maa.webp',
    alt: '3d Mogal Maa',
    title: 'Mogal Maa',
    type: '3D PhotoFrame'

  },

  {
    id: 12,
    order: 12,
    src: '/assests/2d_chamunda_maa.webp',
    alt: '2d Chamunda Maa',
    title: 'Chamunda Maa',
    type: '2D PhotoFrame'
  },
  {
    id: 13,
    order: 13,
    src: '/assests/3d_jogni_maa.webp',
    alt: '3d Jogni Maa',
    title: 'Jogni Maa',
    type: '3D PhotoFrame'
  },
  {
    id: 14,
    order: 14,
    src: '/assests/ramapir_video.mp4',
    alt: 'Ramapir Video',
    title: 'Jay Ramapir',
    type: '2D PhotoFrame'
  },
  {
    id: 15,
    order: 15,
    src: '/assests/3d_bahuchar_maa.webp',
    alt: '3D Bahuchar Maa',
    title: 'Bahuchar Maa',
    type: '3D PhotoFrame'
  },
  {
    id: 16,
    order: 16,
    src: '/assests/2d_dwarkadhis.webp',
    alt: '2D DwarkaDhis',
    title: 'Dwarkadhis',
    type: '2D PhotoFrame'
  },
  {
    id: 17,
    order: 17,
    src: '/assests/2d_khodiyar_maa.webp',
    alt: '2D Khodiyar Maa',
    title: 'Khodiyar Maa',
    type: '2D PhotoFrame',
    homePreview: true
  },
  {
    id: 18,
    order: 18,
    src: '/assests/2d_vishvakarma_dada.webp',
    alt: '2D Vishvakarma Dada',
    title: 'Vishvakarma Dada',
    type: '2D PhotoFrame'
  },
  {
    id: 19,
    order: 19,
    src: '/assests/3d_balapir_maharaj.webp',
    alt: '3D Balapir Maharaj',
    title: 'Balapir Maharaj',
    type: '3D PhotoFrame'
  },
  {
    id: 20,
    order: 20,
    src: '/assests/3d_nagneshvari_maa.webp',
    alt: '3D Nagneshvari Maa',
    title: 'Nagneshvari Maa',
    type: '3D PhotoFrame'
  },
  {
    id: 21,
    order: 21,
    src: '/assests/3d_shundha_maa.webp',
    alt: '3D Shundha Maa',
    title: 'Shundha Maa',
    type: '3D PhotoFrame'
  },
  {
    id: 22,
    order: 22,
    src: '/assests/3d_swaminarayan.webp',
    alt: '3D Swaminarayan',
    title: 'Swaminarayan',
    type: '3D PhotoFrame'
  },
  {
    id: 23,
    order: 23,
    src: '/assests/3d_but_bhavani_maa.webp',
    alt: '3D But Bhavani Maa',
    title: 'But Bhavani Maa',
    type: '3D PhotoFrame'
  },
  {
    id: 24,
    order: 24,
    src: '/assests/3d_maa_bhadrakali.webp',
    alt: '3D Maa Bhadrakali',
    title: 'Maa Bhadrakali',
    type: '3D PhotoFrame'
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
