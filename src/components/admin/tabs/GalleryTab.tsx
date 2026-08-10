import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { GalleryItem } from '../../../types';
import { Plus, Trash2, Upload, Link, X, CheckCircle2, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

type GalCategory = GalleryItem['category'];
const CATEGORIES: GalCategory[] = ['Sosial', 'Olahraga', 'Keagamaan', '17 Agustus', 'Musyawarah', 'Lainnya'];

/** Kompres gambar ke JPEG max 900px, quality 0.75 — agresif untuk galeri */
function compressForGallery(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        let w = img.width, h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('no ctx')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EMPTY: Omit<GalleryItem, 'id'> = {
  title: '', caption: '', category: 'Sosial', type: 'image', url: '',
  date: new Date().toISOString().slice(0, 10)
};

export const GalleryTab: React.FC = () => {
  const { gallery, addGalleryItem, deleteGalleryItem } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, 'id'>>(EMPTY);
  const [filterCat, setFilterCat] = useState<string>('Semua');

  // Upload state
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Success toast
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = useCallback(async (file: File) => {
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar (JPG, PNG, WEBP, dll)');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Ukuran file maks 15 MB');
      return;
    }
    setUploading(true);
    try {
      const compressed = await compressForGallery(file);
      set('url', compressed);
      // Auto-set judul dari nama file HANYA jika nama file terlihat informatif
      // (bukan pola kamera seperti IMG_xxxx, DSC_xxxx, 20260802_xxx, dll)
      if (!form.title.trim()) {
        const rawName = file.name.replace(/\.[^.]+$/, '');
        const isCameraName = /^(IMG|DSC|DCIM|VID|MOV|WA|Screenshot|Photo|Foto|Image|Gambar|PICT|SAM|MVI|PIC|FILE)[-_\s]/i.test(rawName)
          || /^\d{6,}/.test(rawName)
          || /^(IMG|DSC|VID|MVI|PICT)\d+$/i.test(rawName);
        if (!isCameraName) {
          const clean = rawName.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
          set('title', clean.charAt(0).toUpperCase() + clean.slice(1));
        }
        // Jika nama file tidak informatif, biarkan kosong agar admin isi sendiri
      }
      setUploadError('');
    } catch {
      setUploadError('Gagal memproses gambar. Coba format lain atau ukuran lebih kecil.');
    } finally {
      setUploading(false);
    }
  }, [form.title]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const applyUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    set('url', u);
    setUrlInput('');
    setUploadError('');
  };

  const clearImg = () => {
    set('url', '');
    setUrlInput('');
    setUploadError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const resetForm = () => {
    setForm(EMPTY);
    setUrlInput('');
    setUploadError('');
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const save = () => {
    if (!form.title.trim()) {
      setUploadError('Judul media wajib diisi!');
      return;
    }
    if (!form.url.trim()) {
      setUploadError('Upload gambar atau masukkan URL terlebih dahulu!');
      return;
    }
    try {
      addGalleryItem(form);
      resetForm();
      setShowForm(false);
      showSuccess(`✓ "${form.title || 'Media'}" berhasil ditambahkan ke galeri!`);
    } catch (e) {
      setUploadError('Gagal menyimpan. Coba kurangi ukuran gambar atau hapus beberapa item galeri lama.');
    }
  };

  const handleDelete = (item: GalleryItem) => {
    if (confirm(`Hapus "${item.title}" dari galeri?`)) {
      deleteGalleryItem(item.id);
      showSuccess(`Foto "${item.title}" berhasil dihapus.`);
    }
  };

  const filtered = filterCat === 'Semua' ? gallery : gallery.filter(g => g.category === filterCat);

  return (
    <div className="space-y-6">

      {/* ── Success Toast ── */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold shadow-2xl shadow-emerald-900/40 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Kelola Galeri Media</h2>
          <p className="text-xs text-slate-300 mt-1">
            Tambah atau hapus foto kegiatan. Perubahan langsung tampil di halaman publik.
            {' '}<span className="text-amber-400 font-semibold">{gallery.length} item</span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); resetForm(); }}
          className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Tutup Form' : 'Tambah Media'}</span>
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <div className="p-6 rounded-3xl bg-slate-900/95 border border-amber-400/30 space-y-5 shadow-2xl">
          <h3 className="text-sm font-bold text-amber-300">Tambah Foto / Gambar ke Galeri</h3>

          {/* Image upload area */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase block">
              Gambar <span className="text-red-400">*</span>
            </label>

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
              <button type="button" onClick={() => setUploadMode('file')}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${uploadMode === 'file' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
                <Upload className="w-3 h-3" /> Upload dari Perangkat
              </button>
              <button type="button" onClick={() => setUploadMode('url')}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${uploadMode === 'url' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
                <Link className="w-3 h-3" /> Dari URL
              </button>
            </div>

            {/* File upload zone */}
            {uploadMode === 'file' && !form.url && (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => !uploading && fileRef.current?.click()}
                className={`relative w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all py-10 flex flex-col items-center gap-3 ${
                  uploading ? 'border-emerald-400/60 bg-emerald-400/5 cursor-wait'
                  : dragOver ? 'border-amber-400 bg-amber-400/10'
                  : 'border-white/20 hover:border-emerald-500/60 hover:bg-white/5'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <p className="text-sm text-emerald-300 font-semibold">Mengompres & memproses gambar...</p>
                    <p className="text-xs text-slate-500">Mohon tunggu sebentar</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">
                        <span className="text-amber-400">Klik untuk pilih gambar</span> atau drag & drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP, GIF — Maks 15 MB (auto dikompres)</p>
                    </div>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileInput} />
              </div>
            )}

            {/* URL input */}
            {uploadMode === 'url' && !form.url && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyUrl()}
                  placeholder="https://contoh.com/foto.jpg"
                  className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500"
                />
                <button type="button" onClick={applyUrl}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap">
                  Pakai URL
                </button>
              </div>
            )}

            {/* Preview */}
            {form.url && !uploading && (
              <div className="relative inline-block w-full">
                <img
                  src={form.url}
                  alt="preview"
                  className="w-full max-h-52 object-cover rounded-xl border border-white/10 bg-slate-900"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
                />
                <button type="button" onClick={clearImg}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center shadow-lg">
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-1 text-[10px] text-slate-500 px-0.5">
                  {form.url.startsWith('data:') ? '📁 Gambar dari perangkat (dikompres otomatis)' : `🔗 ${form.url.slice(0, 70)}…`}
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {uploadError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold">{uploadError}</span>
            </div>
          )}

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Judul *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Nama kegiatan / judul foto"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tanggal</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => set('category', e.target.value as GalCategory)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Caption / Keterangan</label>
              <input
                value={form.caption}
                onChange={e => set('caption', e.target.value)}
                placeholder="Keterangan singkat foto ini"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={save}
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-wait text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Simpan ke Galeri
            </button>
            <button
              onClick={() => { setShowForm(false); resetForm(); }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {['Semua', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
              filterCat === c ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}>
            {c} {c === 'Semua' ? `(${gallery.length})` : `(${gallery.filter(g => g.category === c).length})`}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-700" />
          <p className="text-slate-400 text-sm">
            {gallery.length === 0
              ? 'Galeri masih kosong. Klik "Tambah Media" untuk mengunggah foto pertama.'
              : 'Tidak ada foto di kategori ini.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 group aspect-square">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-90"
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-[10px] font-bold text-amber-300 block">{item.category}</span>
                <p className="text-xs font-bold text-white leading-tight line-clamp-2">{item.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.date}</p>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow"
                title="Hapus"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
