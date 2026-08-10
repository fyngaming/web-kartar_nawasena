import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { AgendaItem } from '../../../types';
import { Plus, Trash2, Edit2, Check, X, Upload, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

// ── Kompres gambar sebelum upload ──────────────────────────────────────────
function compressImage(file: File, maxW = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('no ctx')); return; }
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

const EMPTY: Omit<AgendaItem, 'id'> = {
  title: '', description: '', date: '', time: '', location: '',
  poster: '', images: [], status: 'Akan Datang', category: 'Musyawarah'
};

const inputCls = "w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500";
const labelCls = "text-[10px] font-bold text-slate-400 uppercase mb-1 block";

// ── Sub-komponen: upload zona satu gambar ──────────────────────────────────
const SingleImageUpload: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label: string;
  round?: boolean;
}> = ({ value, onChange, label, round = false }) => {
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLoading(true);
    try { onChange(await compressImage(file)); }
    catch { /* skip */ }
    finally { setLoading(false); }
  }, [onChange]);

  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {!value ? (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
          onClick={() => ref.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 py-5 transition-all ${
            loading ? 'border-emerald-400/40 bg-emerald-400/5' : drag ? 'border-amber-400 bg-amber-400/10' : 'border-white/20 hover:border-emerald-500/50 hover:bg-white/5'
          }`}
        >
          {loading
            ? <><Loader2 className="w-5 h-5 text-emerald-400 animate-spin" /><p className="text-xs text-emerald-300">Memproses...</p></>
            : <><Upload className="w-5 h-5 text-slate-400" /><p className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Klik</span> atau drag gambar</p></>
          }
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ''; }} />
        </div>
      ) : (
        <div className="relative inline-block w-full">
          <img src={value} alt="preview"
            className={`w-full object-cover border border-white/10 bg-slate-900 ${round ? 'rounded-full h-20 w-20' : 'rounded-xl h-32'}`}
            onError={e => (e.currentTarget.style.opacity = '0.3')} />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center shadow-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

// ── Sub-komponen: upload multi-gambar ──────────────────────────────────────
const MultiImageUpload: React.FC<{
  images: string[];
  onChange: (images: string[]) => void;
}> = ({ images, onChange }) => {
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    setLoading(true);
    try {
      const compressed = await Promise.all(
        Array.from(files)
          .filter(f => f.type.startsWith('image/'))
          .map(f => compressImage(f, 1000, 0.8))
      );
      onChange([...images, ...compressed]);
    } catch { /* skip */ }
    finally { setLoading(false); }
  }, [images, onChange]);

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const move = (from: number, to: number) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Galeri Foto Kegiatan ({images.length} foto)</label>
        <button type="button" onClick={() => ref.current?.click()}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/40 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Tambah Foto
        </button>
        <input ref={ref} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }} />
      </div>

      {images.length === 0 ? (
        <div
          onClick={() => ref.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-white/15 py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-amber-400/40 hover:bg-white/3 transition-all"
        >
          <ImageIcon className="w-6 h-6 text-slate-600" />
          <p className="text-xs text-slate-500">Klik atau pilih beberapa foto sekaligus</p>
          <p className="text-[10px] text-slate-600">JPG, PNG, WEBP — dikompres otomatis</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square bg-slate-900">
              <img src={img} alt={`foto-${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx > 0 && (
                  <button type="button" onClick={() => move(idx, idx - 1)}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-bold flex items-center justify-center">
                    ←
                  </button>
                )}
                <button type="button" onClick={() => remove(idx)}
                  className="w-6 h-6 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white flex items-center justify-center">
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx < images.length - 1 && (
                  <button type="button" onClick={() => move(idx, idx + 1)}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-bold flex items-center justify-center">
                    →
                  </button>
                )}
              </div>
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/50 text-white text-[10px] font-bold flex items-center justify-center">
                {idx + 1}
              </div>
            </div>
          ))}
          {/* Tombol tambah lagi */}
          <div
            onClick={() => ref.current?.click()}
            className="rounded-xl border-2 border-dashed border-white/15 aspect-square flex items-center justify-center cursor-pointer hover:border-amber-400/40 hover:bg-white/5 transition-all"
          >
            {loading
              ? <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              : <Plus className="w-5 h-5 text-slate-500" />
            }
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export const AgendaTab: React.FC = () => {
  const { agenda, addAgenda, updateAgenda, deleteAgenda } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<AgendaItem, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm({ ...EMPTY, images: [] }); setEditId(null); setShowForm(true); };
  const openEdit = (a: AgendaItem) => {
    const { id, ...rest } = a;
    setForm({ ...rest, images: rest.images || [] });
    setEditId(id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title.trim()) { showToast('⚠ Judul kegiatan wajib diisi!'); return; }
    if (!form.date.trim())  { showToast('⚠ Tanggal wajib diisi!'); return; }
    setSaving(true);
    try {
      if (editId) updateAgenda(editId, form);
      else addAgenda(form);
      showToast('✓ Agenda berhasil disimpan!');
      cancel();
    } catch (e: any) {
      showToast('❌ Gagal simpan: ' + (e?.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (s: string) =>
    s === 'Akan Datang' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : s === 'Berlangsung' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />{toast}
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Kelola Agenda & Event</h2>
          <p className="text-xs text-slate-300 mt-1">
            Tambah, edit, hapus agenda. Bisa upload banyak foto per kegiatan. Data tersimpan ke Supabase.
          </p>
        </div>
        <button onClick={openAdd}
          className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shrink-0">
          <Plus className="w-4 h-4" /><span>Tambah Agenda</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 rounded-3xl bg-slate-900/95 border border-amber-400/30 space-y-5 shadow-2xl">
          <h3 className="text-sm font-bold text-amber-300">
            {editId ? '✏️ Edit Agenda' : '➕ Tambah Agenda Baru'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Judul */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Judul Kegiatan *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Nama kegiatan" className={inputCls} />
            </div>

            {/* Tanggal + Waktu + Lokasi */}
            <div>
              <label className={labelCls}>Tanggal *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
            </div>
            <div>
              <label className={labelCls}>Waktu</label>
              <input value={form.time} onChange={e => set('time', e.target.value)}
                placeholder="08:00 - 12:00 WIB" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Lokasi</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="Tempat pelaksanaan" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Kategori</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none">
                {['Musyawarah','17 Agustus','Musyawarah & Keagamaan','Sosial','Olahraga','Lainnya'].map(c =>
                  <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none">
                <option>Akan Datang</option>
                <option>Berlangsung</option>
                <option>Selesai</option>
              </select>
            </div>

            {/* Deskripsi */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Deskripsi</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={3} placeholder="Deskripsi singkat kegiatan..."
                className={inputCls + ' resize-y'} />
            </div>

            {/* Poster utama */}
            <div className="sm:col-span-2">
              <SingleImageUpload
                value={form.poster}
                onChange={v => set('poster', v)}
                label="Poster / Thumbnail Utama"
              />
            </div>

            {/* Multi gambar */}
            <div className="sm:col-span-2">
              <MultiImageUpload
                images={form.images || []}
                onChange={imgs => set('images', imgs)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={save} disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {editId ? 'Simpan Perubahan' : 'Tambahkan Agenda'}
            </button>
            <button onClick={cancel}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5">
              <X className="w-4 h-4" />Batal
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {agenda.length === 0 && !showForm && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-sm">Belum ada agenda. Klik "Tambah Agenda" untuk memulai.</p>
        </div>
      )}

      <div className="space-y-3">
        {agenda.map(a => (
          <div key={a.id}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/20 transition-all">
            <div className="flex items-start justify-between gap-4">
              {/* Tanggal badge + info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                  <span className="text-lg font-black leading-none">
                    {a.date ? new Date(a.date).getDate() : '--'}
                  </span>
                  <span className="text-[10px] font-bold uppercase">
                    {a.date ? new Date(a.date).toLocaleString('id-ID', { month: 'short' }) : ''}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {a.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{a.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time} • {a.location}</p>

                  {/* Thumbnail foto-foto */}
                  {(a.images?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {a.images!.slice(0, 5).map((img, idx) => (
                        <img key={idx} src={img} alt={`foto-${idx}`}
                          className="w-9 h-9 rounded-lg object-cover border border-white/10 bg-slate-900"
                          onError={e => (e.currentTarget.style.display = 'none')} />
                      ))}
                      {(a.images?.length ?? 0) > 5 && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          +{(a.images?.length ?? 0) - 5} foto
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEdit(a)}
                  className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors" title="Edit">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (confirm(`Hapus agenda "${a.title}"?`)) deleteAgenda(a.id); }}
                  className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors" title="Hapus">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
