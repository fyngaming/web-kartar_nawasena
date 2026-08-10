import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MemberData, MemberStatus } from '../../../types';
import { Plus, Trash2, Edit2, Check, X, User, Search } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

const INTERESTS_LIST = [
  'Olahraga', 'Sosial & Humas', 'Multimedia', 'Event Organizer',
  'Keagamaan', 'UMKM', 'Lingkungan', 'Seni & Budaya', 'Lainnya'
];

const STATUS_LIST: MemberStatus[] = ['Aktif', 'Tidak Aktif', 'Mengundurkan Diri', 'Alumni'];

const EMPTY: Omit<MemberData, 'id'> = {
  fullName: '', gender: 'Laki-laki', address: '', rtRw: '',
  whatsapp: '', email: '', interests: [], status: 'Aktif',
  joinedDate: new Date().toISOString().slice(0, 10), avatar: ''
};

const statusColor = (s: MemberStatus) => {
  if (s === 'Aktif') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (s === 'Alumni') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
};

export const MembersTab: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useApp();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<MemberData, 'id'>>(EMPTY);

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (interest: string) => {
    set('interests', form.interests.includes(interest)
      ? form.interests.filter(i => i !== interest)
      : [...form.interests, interest]
    );
  };

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (m: MemberData) => {
    const { id, ...rest } = m;
    setForm(rest); setEditId(id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm(EMPTY); };

  const save = () => {
    if (!form.fullName.trim() || !form.whatsapp.trim()) return;
    if (editId) updateMember(editId, form);
    else addMember(form);
    cancel();
  };

  const filtered = members.filter(m =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.whatsapp.includes(search) ||
    (m.rtRw || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Database Anggota Resmi</h2>
          <p className="text-xs text-slate-300 mt-1">
            Kelola data anggota aktif Karang Taruna Nawasena — {members.length} anggota terdaftar.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" /><span>Tambah Anggota</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari nama, WhatsApp, atau RT/RW..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-emerald-500/50 placeholder-slate-500"
        />
      </div>

      {/* Form Add / Edit */}
      {showForm && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-400/30 space-y-5">
          <h3 className="text-sm font-bold text-amber-300">
            {editId ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
          </h3>

          {/* Foto */}
          <ImageUpload
            value={form.avatar || ''}
            onChange={v => set('avatar', v)}
            label="Foto Profil Anggota"
            round
            previewClass="h-20"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nama Lengkap *</label>
              <input
                value={form.fullName}
                onChange={e => set('fullName', e.target.value)}
                placeholder="Nama lengkap anggota"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Jenis Kelamin</label>
              <select
                value={form.gender}
                onChange={e => set('gender', e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value as MemberStatus)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none"
              >
                {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">WhatsApp *</label>
              <input
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="email@contoh.com"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">RT / RW</label>
              <input
                value={form.rtRw || ''}
                onChange={e => set('rtRw', e.target.value)}
                placeholder="RT 04 / RW 15"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tanggal Bergabung</label>
              <input
                type="date"
                value={form.joinedDate}
                onChange={e => set('joinedDate', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Alamat</label>
              <input
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="Perum GSI Blok... No. ..."
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none placeholder-slate-500"
              />
            </div>

            {/* Minat */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Bidang Minat</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_LIST.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      form.interests.includes(i)
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-white/5 border-white/15 text-slate-400 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={save}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {editId ? 'Simpan Perubahan' : 'Tambahkan Anggota'}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />Batal
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">
            {members.length === 0 ? 'Belum ada anggota. Klik "Tambah Anggota" untuk menambahkan.' : 'Tidak ada anggota yang cocok dengan pencarian.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-3">
            {/* Header card */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600/30 shrink-0 bg-slate-700 flex items-center justify-center">
                {m.avatar
                  ? <img src={m.avatar} alt={m.fullName} className="w-full h-full object-cover" />
                  : <User className="w-5 h-5 text-slate-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono font-bold text-amber-400 block">{m.id}</span>
                <h3 className="text-sm font-bold text-white truncate">{m.fullName}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 ${statusColor(m.status)}`}>
                  {m.status}
                </span>
              </div>
            </div>

            {/* Detail */}
            <div className="space-y-1 text-xs text-slate-300">
              <p>📱 {m.whatsapp}</p>
              {m.rtRw && <p>🏠 {m.rtRw}</p>}
              <p className="text-slate-500 text-[11px] truncate">{m.address}</p>
              {m.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {m.interests.map(i => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">{i}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => openEdit(m)}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>

                {/* Toggle Active/Inactive */}
                <button
                  onClick={() => {
                    const toStatus: MemberStatus = m.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
                    if (confirm(`Ubah status anggota "${m.fullName}" menjadi "${toStatus}"?`)) {
                      updateMember(m.id, { status: toStatus });
                    }
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${m.status === 'Aktif' ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'}`}
                >
                  {m.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Hapus anggota "${m.fullName}"? Tindakan ini tidak dapat dibatalkan.`))
                      deleteMember(m.id);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
