import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { AgendaItem } from '../../types';
import {
  Clock, MapPin, CheckCircle, AlertCircle, ImageIcon,
  X, ChevronLeft, ChevronRight, Images
} from 'lucide-react';

// ── Lightbox Slider ────────────────────────────────────────────────────────
interface LightboxProps {
  photos: string[];   // semua foto (poster + images[])
  startIndex: number;
  title: string;
  onClose: () => void;
}

const AgendaLightbox: React.FC<LightboxProps> = ({ photos, startIndex, title, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % photos.length), [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')       onClose();
      if (e.key === 'ArrowLeft')    prev();
      if (e.key === 'ArrowRight')   next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-bold backdrop-blur-md border border-white/10">
        {current + 1} / {photos.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors z-10"
        aria-label="Tutup"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main image */}
      <div
        className="relative w-full max-w-3xl flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Prev button */}
        {photos.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-0 -translate-x-2 sm:-translate-x-14 z-10 p-3 rounded-full bg-white/10 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/15 transition-all shadow-lg"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Image */}
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
          <img
            key={current}
            src={photos[current]}
            alt={`${title} — foto ${current + 1}`}
            className="w-full max-h-[72vh] object-contain animate-fadeIn"
            onError={e => ((e.target as HTMLImageElement).style.opacity = '0.3')}
          />
        </div>

        {/* Next button */}
        {photos.length > 1 && (
          <button
            onClick={next}
            className="absolute right-0 translate-x-2 sm:translate-x-14 z-10 p-3 rounded-full bg-white/10 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/15 transition-all shadow-lg"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Title */}
      <p
        className="mt-4 text-sm font-semibold text-slate-200 text-center max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {title}
      </p>

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div
          className="flex items-center gap-1.5 mt-3"
          onClick={e => e.stopPropagation()}
        >
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Foto ${i + 1}`}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-5 h-2 bg-emerald-400'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip (jika foto > 1) */}
      {photos.length > 1 && (
        <div
          className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 max-w-lg scrollbar-none"
          onClick={e => e.stopPropagation()}
        >
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                i === current
                  ? 'border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30'
                  : 'border-white/15 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={p} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Status badge ───────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: AgendaItem['status'] }> = ({ status }) => {
  if (status === 'Akan Datang') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
      <AlertCircle className="w-3 h-3" /> Akan Datang
    </span>
  );
  if (status === 'Berlangsung') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Berlangsung
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white/10 text-slate-400 border border-white/10">
      <CheckCircle className="w-3 h-3" /> Selesai
    </span>
  );
};

// ── Main Section ───────────────────────────────────────────────────────────
export const AgendaSection: React.FC = () => {
  const { agenda } = useApp();

  // State lightbox: simpan semua foto dan index awal
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number; title: string } | null>(null);

  /** Kumpulkan semua foto suatu agenda: poster dulu, lalu images[] */
  const getPhotos = (item: AgendaItem): string[] => {
    const all: string[] = [];
    if (item.poster) all.push(item.poster);
    if (item.images?.length) all.push(...item.images.filter(Boolean));
    return all;
  };

  const openLightbox = (item: AgendaItem, startIndex = 0) => {
    const photos = getPhotos(item);
    if (photos.length === 0) return;
    setLightbox({ photos, index: startIndex, title: item.title });
  };

  return (
    <section className="py-20 bg-[#022c22] text-slate-100 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Jadwal & Agenda
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Agenda Kegiatan Nawasena
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Ikuti berbagai kegiatan seru, musyawarah warga, bakti sosial, dan perayaan hari besar nasional di Perum GSI Ngangkruk.
          </p>
        </div>

        {/* Empty state */}
        {agenda.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-sm">Belum ada agenda kegiatan yang dijadwalkan.</p>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {agenda.map(item => {
            const photos = getPhotos(item);
            const hasPhotos = photos.length > 0;
            const photoCount = photos.length;

            return (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-stretch">

                  {/* Date badge */}
                  <div className="sm:w-24 flex-shrink-0 bg-gradient-to-b from-emerald-700 to-emerald-900 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 px-4 py-3 sm:px-0 sm:py-5">
                    <span className="text-3xl sm:text-4xl font-black text-white leading-none">
                      {new Date(item.date).getDate()}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 sm:mt-1">
                      {new Date(item.date).toLocaleString('id-ID', { month: 'short' })}
                    </span>
                    <span className="text-[10px] text-emerald-300/60 sm:mt-0.5">
                      {new Date(item.date).getFullYear()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">

                    {/* Top: info + action button */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {item.category}
                          </span>
                          <StatusBadge status={item.status} />
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                          {item.time && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              {item.time}
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              {item.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      {hasPhotos && (
                        <div className="shrink-0">
                          <button
                            onClick={() => openLightbox(item, 0)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/40 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
                          >
                            {photoCount > 1
                              ? <><Images className="w-4 h-4" /> Lihat {photoCount} Foto</>
                              : <><ImageIcon className="w-4 h-4" /> Lihat Gambar</>
                            }
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail strip — tampil jika ada lebih dari 1 foto */}
                    {photos.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
                        {photos.map((photo, idx) => (
                          <button
                            key={idx}
                            onClick={() => openLightbox(item, idx)}
                            className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 hover:border-emerald-400 transition-all bg-slate-900 group"
                            aria-label={`Foto ${idx + 1}`}
                          >
                            <img
                              src={photo}
                              alt={`${item.title} foto ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={e => ((e.target as HTMLImageElement).style.opacity = '0.3')}
                            />
                          </button>
                        ))}
                        <span className="shrink-0 text-[10px] text-slate-500 font-semibold pl-1">
                          {photos.length} foto
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <AgendaLightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
};
