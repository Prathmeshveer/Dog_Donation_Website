import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { X, ZoomIn, ChevronLeft, ChevronRight, Search, Grid3X3, LayoutGrid } from 'lucide-react'

export default function Photos() {
  const [photos, setPhotos] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [layout, setLayout] = useState('masonry')

  useEffect(() => {
    fetchPhotos()
  }, [])

  useEffect(() => {
    let result = photos
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.caption && p.caption.toLowerCase().includes(q))
    }
    setFiltered(result)
  }, [photos, searchQuery])

  async function fetchPhotos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false })

    if (!error && data) setPhotos(data)
    setLoading(false)
  }

  const openLightbox = (idx) => setLightboxIndex(idx)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const prevPhoto = useCallback(() => {
    setLightboxIndex(i => (i > 0 ? i - 1 : filtered.length - 1))
  }, [filtered.length])

  const nextPhoto = useCallback(() => {
    setLightboxIndex(i => (i < filtered.length - 1 ? i + 1 : 0))
  }, [filtered.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, closeLightbox, prevPhoto, nextPhoto])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .photos-page { font-family: 'DM Sans', system-ui, sans-serif; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .photo-card { break-inside: avoid; }

        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes lb-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .lb-img { animation: lb-in 0.25s ease; }

        .grid-card {
          animation: fadeScaleIn 0.5s ease both;
        }
      `}</style>

      <div className="photos-page min-h-screen bg-[#080808]">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden pt-28 pb-20 px-6">
          {/* Ambient blobs */}
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[140px]"
            style={{ background: 'radial-gradient(circle, #E60023, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.04] blur-[100px]"
            style={{ background: 'radial-gradient(circle, #FF9500, transparent)' }} />

          {/* Thin top rule */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-7">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-white/35 text-[11px] tracking-[0.25em] uppercase font-medium">Visava Shwan Ashram · Pune</span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <h1
              className="text-white leading-none mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Our{' '}
              <span style={{
                background: 'linear-gradient(135deg, #E60023 0%, #FF6B6B 50%, #FF9500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Gallery
              </span>
            </h1>

            <p className="text-white/35 text-base md:text-lg max-w-md mx-auto leading-relaxed" style={{ fontWeight: 300 }}>
              Twenty years of love, rescue, and second chances — captured in every frame.
            </p>

            {/* Stat pills */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="text-center">
                <div className="text-white font-semibold text-2xl">{photos.length}</div>
                <div className="text-white/25 text-[11px] tracking-widest uppercase mt-0.5">Photos</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-white font-semibold text-2xl">20+</div>
                <div className="text-white/25 text-[11px] tracking-widest uppercase mt-0.5">Years</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-white font-semibold text-2xl">∞</div>
                <div className="text-white/25 text-[11px] tracking-widest uppercase mt-0.5">Love</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Controls ── */}
        <div className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">

            {/* Photo count */}
            <span className="text-white/30 text-xs hidden sm:block">
              {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>

            <div className="flex items-center gap-3 ml-auto">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search captions…"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-full pl-8 pr-4 py-2 text-xs text-white/60 placeholder-white/20 focus:outline-none focus:border-white/20 w-40 transition-all focus:w-48"
                />
              </div>

              {/* Layout toggle */}
              <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-full p-1 gap-0.5">
                <button
                  onClick={() => setLayout('masonry')}
                  className={`p-1.5 rounded-full transition-all ${layout === 'masonry' ? 'bg-white/15 text-white' : 'text-white/25 hover:text-white/50'}`}
                  title="Masonry layout"
                >
                  <LayoutGrid size={12} />
                </button>
                <button
                  onClick={() => setLayout('grid')}
                  className={`p-1.5 rounded-full transition-all ${layout === 'grid' ? 'bg-white/15 text-white' : 'text-white/25 hover:text-white/50'}`}
                  title="Grid layout"
                >
                  <Grid3X3 size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Gallery Body ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {loading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState hasPhotos={photos.length > 0} searchQuery={searchQuery} />
          ) : layout === 'masonry' ? (
            <MasonryGrid photos={filtered} onOpen={openLightbox} />
          ) : (
            <UniformGrid photos={filtered} onOpen={openLightbox} />
          )}
        </div>

        {/* ── Lightbox ── */}
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <Lightbox
            photo={filtered[lightboxIndex]}
            index={lightboxIndex}
            total={filtered.length}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </div>
    </>
  )
}

/* ─── Masonry Grid ─── */
function MasonryGrid({ photos, onOpen }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
      {photos.map((photo, idx) => (
        <PhotoCard key={photo.id} photo={photo} idx={idx} onOpen={onOpen} masonry />
      ))}
    </div>
  )
}

/* ─── Uniform Grid ─── */
function UniformGrid({ photos, onOpen }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((photo, idx) => (
        <PhotoCard key={photo.id} photo={photo} idx={idx} onOpen={onOpen} masonry={false} />
      ))}
    </div>
  )
}

/* ─── Photo Card ─── */
function PhotoCard({ photo, idx, onOpen, masonry }) {
  return (
    <div
      onClick={() => onOpen(idx)}
      className={`photo-card grid-card group relative cursor-pointer overflow-hidden rounded-xl
        bg-white/[0.03] border border-white/[0.05]
        hover:border-white/15 transition-all duration-500
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)]
        ${masonry ? 'mb-3' : 'aspect-square'}`}
      style={{ animationDelay: `${Math.min(idx * 35, 400)}ms` }}
    >
      <img
        src={photo.url}
        alt={photo.caption || 'Gallery photo'}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${masonry ? '' : 'h-full'}`}
      />

      {/* Dark vignette on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />

      {/* Caption */}
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3.5 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white/90 text-xs leading-snug line-clamp-2">{photo.caption}</p>
        </div>
      )}

      {/* Zoom button */}
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
        <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-full p-1.5">
          <ZoomIn size={12} className="text-white/80" />
        </div>
      </div>

      {/* Subtle index badge — only first few */}
      {idx < 3 && (
        <div className="absolute top-2.5 left-2.5">
          <div className="w-1.5 h-1.5 bg-[#E60023] rounded-full opacity-60" />
        </div>
      )}
    </div>
  )
}

/* ─── Lightbox ─── */
function Lightbox({ photo, index, total, onClose, onPrev, onNext }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(24px)' }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
        <div
          className="text-white/30 text-xs tracking-widest uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {index + 1} <span className="text-white/15 mx-1.5">/</span> {total}
        </div>

        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/60 hover:text-white transition-all"
        >
          <X size={15} />
        </button>
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-3 md:left-6 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/60 hover:text-white transition-all hover:scale-105"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Image */}
      <div
        className="relative w-full max-w-4xl mx-16 md:mx-24 px-2"
        onClick={e => e.stopPropagation()}
      >
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.caption || 'Gallery photo'}
          className="lb-img w-full max-h-[80vh] object-contain rounded-2xl"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
        />

        {/* Caption below image */}
        {photo.caption && (
          <div className="mt-5 text-center px-4">
            <p
              className="text-white/50 text-sm leading-relaxed max-w-xl mx-auto"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontStyle: 'italic' }}
            >
              "{photo.caption}"
            </p>
          </div>
        )}

        {/* Dot navigation */}
        {total > 1 && total <= 20 && (
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${i === index ? 'w-4 h-1.5 bg-white/60' : 'w-1.5 h-1.5 bg-white/15'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-3 md:right-6 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/60 hover:text-white transition-all hover:scale-105"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  const heights = [220, 280, 190, 320, 240, 200, 270, 180, 300]
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
      {heights.map((h, i) => (
        <div
          key={i}
          className="mb-3 break-inside-avoid rounded-xl bg-white/[0.04] animate-pulse"
          style={{ height: h }}
        />
      ))}
    </div>
  )
}

/* ─── Empty State ─── */
function EmptyState({ hasPhotos, searchQuery }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="text-5xl mb-5 opacity-60">🐾</div>
      <h3 className="text-white/40 text-base font-medium mb-2">
        {hasPhotos ? 'No photos match your search' : 'Gallery coming soon'}
      </h3>
      <p className="text-white/20 text-sm">
        {hasPhotos
          ? `No captions contain "${searchQuery}"`
          : 'Check back soon — our team is adding photos.'}
      </p>
    </div>
  )
}
