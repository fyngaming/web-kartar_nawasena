import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { LightboxModal } from '../common/LightboxModal';
import { Maximize2, Calendar, ImageOff } from 'lucide-react';

// ── Komponen gambar dengan fallback ──────────────────────────────────────────
const GalleryImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Skeleton saat loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Fallback saat error */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-slate-800/80 flex flex-col items-center justify-center gap-2">
          <ImageOff className="w-8 h-8 text-slate-500" />
          <p className="text-[10px] text-slate-500 text-center px-2">Gambar tidak tersedia</p>
        </div>
      )}

      {/* Gambar asli */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full h-full object-cover transition-all duration-500 ${
          status === 'loaded'
            ? 'opacity-100 group-hover:scale-110 filter brightness-95 group-hover:brightness-100'
            : 'opacity-0'
        }`}
      />
    </div>
  );
};

// ── Main Section ──────────────────────────────────────────────────────────────
export const GallerySection: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['Semua', 'Sosial', 'Olahraga', 'Keagamaan', '17 Agustus', 'Musyawarah', 'Lainnya'];

  const filteredGallery = selectedCategory === 'Semua'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  // Hanya tampilkan item yang punya URL valid
  const validGallery = filteredGallery.filter(g => g.url && g.url.trim() !== '');

  const lightboxItems = validGallery.map(g => ({
    url: g.url,
    title: g.title,
    caption: g.caption,
    category: g.category,
    date: g.date
  }));

  return (
    <section className="py-20 bg-[#022c22] text-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Dokumentasi Visual
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Galeri Foto & Video Kegiatan
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Abadikan setiap momen kebersamaan, perjuangan, dan keceriaan warga Perum GSI Ngangkruk.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 backdrop-blur-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {validGallery.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <ImageOff className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-slate-400 text-sm">
              {gallery.length === 0
                ? 'Belum ada foto kegiatan. Pengurus dapat menambahkan melalui panel admin.'
                : 'Tidak ada foto di kategori ini.'}
            </p>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-sm cursor-pointer hover:shadow-xl hover:border-emerald-500/30 transition-all h-64"
            >
              <GalleryImage
                src={item.url}
                alt={item.title}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-slate-900/80 text-amber-300 backdrop-blur-md border border-slate-700">
                  {item.category}
                </span>
              </div>

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-emerald-600 text-white shadow-lg">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                {/* Hanya tampilkan judul jika bukan nama file kamera */}
                {item.title && !/^(IMG|DSC|VID|MVI|PICT|Photo|Image|Foto|Gambar|Screenshot|WA|FILE)[\s_-]/i.test(item.title) && !/^\d{6,}/.test(item.title) && (
                  <h3 className="text-base font-bold leading-tight group-hover:text-amber-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                )}
                {item.caption && (
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.caption}</p>
                )}
                <div className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <LightboxModal
            items={lightboxItems}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={index => setLightboxIndex(index)}
          />
        )}
      </div>
    </section>
  );
};
