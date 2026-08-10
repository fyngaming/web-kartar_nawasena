import React, { useRef, useState, useCallback } from 'react';
import { Upload, Link, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  round?: boolean;
  previewClass?: string;
  required?: boolean;
}

/** Kompres gambar ke JPEG max-width 1200px, kualitas 0.82, return base64 */
function compressImage(file: File, maxW = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxW) { h = Math.round((h * maxW) / w); w = maxW; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas ctx null')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const ImageUpload: React.FC<Props> = ({
  value,
  onChange,
  label = 'Foto / Gambar',
  round = false,
  previewClass = 'h-32',
  required = false,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value.startsWith('http') ? value : '');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WEBP, GIF, dll)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maks 10 MB');
      return;
    }
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      setError('Gagal memproses gambar. Coba file lain.');
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange(trimmed);
  };

  const clear = () => {
    onChange('');
    setUrlInput('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const hasValue = Boolean(value);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Mode tab toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
            mode === 'upload' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-3 h-3" />
          Upload dari Perangkat
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
            mode === 'url' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Link className="w-3 h-3" />
          Dari URL
        </button>
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !loading && fileRef.current?.click()}
          className={`relative w-full rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 py-6 select-none ${
            loading
              ? 'border-emerald-400/50 bg-emerald-400/5 cursor-wait'
              : dragOver
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-white/20 bg-white/3 hover:border-emerald-500/60 hover:bg-white/5'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              <p className="text-xs text-emerald-300 font-semibold">Memproses gambar...</p>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-400" />
              <p className="text-xs text-slate-400 text-center px-4">
                <span className="font-bold text-amber-400">Klik untuk pilih file</span>
                {' '}atau drag & drop gambar ke sini
              </p>
              <p className="text-[10px] text-slate-500">JPG, PNG, WEBP, GIF — Maks 10 MB (dikompres otomatis)</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyUrl()}
            placeholder="https://contoh.com/gambar.jpg"
            className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap"
          >
            Pakai URL
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-400 font-semibold bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
          ⚠ {error}
        </p>
      )}

      {/* Preview */}
      {hasValue && !loading && (
        <div className={`relative inline-block ${round ? '' : 'w-full'}`}>
          <img
            src={value}
            alt="preview"
            className={`${previewClass} ${
              round
                ? 'w-20 h-20 rounded-full object-cover'
                : 'w-full rounded-xl object-cover'
            } border border-white/10 bg-slate-900`}
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
            }}
          />
          <button
            type="button"
            onClick={clear}
            title="Hapus gambar"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center shadow-lg z-10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="mt-1 text-[10px] text-slate-500 truncate max-w-full px-0.5">
            {value.startsWith('data:') ? '📁 Gambar dari perangkat (tersimpan)' : `🔗 ${value.slice(0, 60)}${value.length > 60 ? '…' : ''}`}
          </div>
        </div>
      )}

      {/* Empty placeholder */}
      {!hasValue && !loading && (
        <div className={`${
          round
            ? 'w-20 h-20 rounded-full'
            : `w-full ${previewClass} rounded-xl`
        } border-2 border-dashed border-white/10 bg-white/3 flex items-center justify-center`}>
          <ImageIcon className="w-6 h-6 text-slate-700" />
        </div>
      )}
    </div>
  );
};
