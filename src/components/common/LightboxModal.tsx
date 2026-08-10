import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag, ImageOff } from 'lucide-react';

interface LightboxItem {
  url: string;
  title: string;
  caption?: string;
  category?: string;
  date?: string;
}

interface LightboxModalProps {
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Komponen gambar lightbox dengan loading + error state
const LightboxImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <>
      {status === 'loading' && (
        <div className="w-64 h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      )}
      {status === 'error' && (
        <div className="w-64 h-48 flex flex-col items-center justify-center gap-3">
          <ImageOff className="w-10 h-10 text-slate-500" />
          <p className="text-sm text-slate-400">Gambar tidak dapat dimuat</p>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`max-h-[70vh] w-auto max-w-full object-contain select-none transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0 absolute'
        }`}
      />
    </>
  );
};

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  onClose,
  onNavigate
}) => {
  const item = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-red-600 transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Previous */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 z-50 p-3 rounded-full bg-slate-800/80 text-white hover:bg-emerald-600 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Next */}
      {currentIndex < items.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 z-50 p-3 rounded-full bg-slate-800/80 text-white hover:bg-emerald-600 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
        <div className="relative overflow-hidden rounded-xl shadow-2xl border border-slate-700 bg-slate-950 flex items-center justify-center min-w-[300px] min-h-[200px]">
          <LightboxImage src={item.url} alt={item.title} />
        </div>

        {/* Caption Info */}
        <div className="mt-4 text-center max-w-2xl text-white">
          <div className="flex items-center justify-center gap-3 mb-1">
            {item.category && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600/80 text-white flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {item.category}
              </span>
            )}
            {item.date && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            )}
          </div>
          <h4 className="text-lg font-bold">{item.title}</h4>
          {item.caption && <p className="text-sm text-slate-300 mt-1">{item.caption}</p>}
          <p className="text-xs text-slate-500 mt-2">
            {currentIndex + 1} dari {items.length} foto/video
          </p>
        </div>
      </div>
    </div>
  );
};
