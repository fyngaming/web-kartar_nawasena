import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { BoardMember } from '../../../types';
import { Plus, Trash2, Edit2, Check, X, User } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

const EMPTY: Omit<BoardMember, 'id'> = {
  name: '', position: '', period: '2024 - 2026', photo: '',
  order: 99, phone: '', email: '', instagram: ''
};

export const BoardTab: React.FC = () => {
  const { board, addBoardMember, updateBoardMember, deleteBoardMember } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<BoardMember, 'id'>>(EMPTY);

  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm({ ...EMPTY, order: board.length + 1 }); setEditId(null); setShowForm(true); };
  const openEdit = (b: BoardMember) => {
    const { id, ...rest } = b;
    setForm(rest); setEditId(id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(EMPTY); };

  const save = () => {
    if (!form.name.trim() || !form.position.trim()) return;
    if (editId) updateBoardMember(editId, form);
    else addBoardMember(form);
    cancel();
  };

  const sorted = [...board].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Kelola Struktur Pengurus</h2>
          <p className="text-xs text-slate-300 mt-1">
            Tambah, edit, atau hapus anggota kepengurusan. Perubahan langsung tampil di halaman publik.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" /><span>Tambah Pengurus</span>
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-400/30 space-y-4">
          <h3 className="text-sm font-bold text-amber-300">
            {editId ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nama Lengkap *</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Nama pengurus"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500"
              />
            </div>
            {/* Jabatan */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Jabatan *</label>
              <input
                value={form.position}
                onChange={e => set('position', e.target.value)}
                placeholder="Jabatan dalam kepengurusan"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500"
              />
            </div>
            {/* Masa Bakti */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Masa Bakti</label>
              <input
                value={form.period}
                onChange={e => set('period', e.target.value)}
                placeholder="2024 - 2026"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500"
              />
            </div>
            {/* Urutan */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Urutan Tampil</label>
              <input
                type="number"
                value={form.order}
                onChange={e => set('order', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none"
                min={1}
              />
            </div>
            {/* Foto */}
            <div className="sm:col-span-2">
              <ImageUpload
                value={form.photo}
                onChange={v => set('photo', v)}
                label="Foto Pengurus"
                round
                previewClass="h-20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={save}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {editId ? 'Simpan Perubahan' : 'Tambahkan Pengurus'}
            </button>
            <button
              onClick={cancel}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />Batal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.length === 0 && (
          <p className="col-span-3 text-center text-slate-400 text-sm py-8">Belum ada data pengurus.</p>
        )}
        {sorted.map(b => (
          <div key={b.id} className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-600/30 shrink-0 bg-slate-700 flex items-center justify-center">
              {b.photo
                ? <img src={b.photo} alt={b.name} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                : <User className="w-6 h-6 text-slate-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-400 block">{b.position}</span>
              <h3 className="text-sm font-bold text-white truncate">{b.name}</h3>
              <p className="text-[10px] text-amber-400 mt-0.5">Masa Bakti: {b.period}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => openEdit(b)}
                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { if (confirm(`Hapus pengurus "${b.name}"?`)) deleteBoardMember(b.id); }}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
