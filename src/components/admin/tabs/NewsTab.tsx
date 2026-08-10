import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { NewsItem } from '../../../types';
import { Plus, Trash2, Edit2, Check, X, Eye } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

const EMPTY: Omit<NewsItem, 'id' | 'slug' | 'views'> = {
  title: '', summary: '', content: '', category: 'Kegiatan',
  author: '', date: new Date().toISOString().slice(0,10),
  thumbnail: '', status: 'Published'
};

export const NewsTab: React.FC = () => {
  const { news, addNews, updateNews, deleteNews, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<NewsItem, 'id' | 'slug' | 'views'>>(EMPTY);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => {
    setForm({ ...EMPTY, author: currentUser?.name || 'Sekretariat', date: new Date().toISOString().slice(0,10) });
    setEditId(null); setShowForm(true);
  };
  const openEdit = (n: NewsItem) => {
    const { id, slug, views, ...rest } = n;
    setForm(rest); setEditId(id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(EMPTY); };

  const save = () => {
    if (!form.title.trim()) return;
    if (editId) updateNews(editId, form);
    else addNews(form);
    cancel();
  };

  const statusColor = (s: string) =>
    s === 'Published' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Kelola Berita & Informasi Warga</h2>
          <p className="text-xs text-slate-300 mt-1">Tambah, edit, atau hapus berita. Perubahan langsung tampil di halaman publik.</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shrink-0">
          <Plus className="w-4 h-4" /><span>Tambah Berita</span>
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-400/30 space-y-4">
          <h3 className="text-sm font-bold text-amber-300">{editId ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Judul Berita *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul berita" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none">
                {['Kegiatan','Pengumuman','Lingkungan','Sosial','Olahraga','Lainnya'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value as 'Published'|'Draft')} className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Penulis</label>
              <input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Nama penulis" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tanggal</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload
                value={form.thumbnail}
                onChange={v => set('thumbnail', v)}
                label="Thumbnail / Foto Berita"
                previewClass="h-28"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Ringkasan *</label>
              <textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={2} placeholder="Ringkasan singkat berita..." className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Isi Berita</label>
              <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5} placeholder="Isi lengkap berita..." className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={save} className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"><Check className="w-4 h-4" />{editId ? 'Simpan Perubahan' : 'Publikasikan Berita'}</button>
            <button onClick={cancel} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5"><X className="w-4 h-4" />Batal</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {news.length === 0 && <p className="text-center text-slate-400 text-sm py-8">Belum ada berita. Klik "Tambah Berita" untuk menambahkan.</p>}
        {news.map(n => (
          <div key={n.id} className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {n.thumbnail && <img src={n.thumbnail} alt={n.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{n.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(n.status)}`}>{n.status}</span>
                </div>
                <h3 className="text-sm font-bold text-white truncate">{n.title}</h3>
                <p className="text-xs text-slate-400">{n.date} • {n.author} • <Eye className="w-3 h-3 inline mr-0.5" />{n.views}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => openEdit(n)} className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => { if (confirm(`Hapus berita "${n.title}"?`)) deleteNews(n.id); }} className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
