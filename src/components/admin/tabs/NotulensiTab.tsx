import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  MeetingMinutes, MeetingAgendaPoint, MeetingType, MeetingStatus
} from '../../../types';
import {
  Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp,
  FileText, Clock, MapPin, Users, BookOpen, Download,
  Search, Filter, Eye, Archive, CheckCircle2, AlertCircle,
  Printer, Calendar, User, ClipboardList
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────
const MEETING_TYPES: MeetingType[] = [
  'Rapat Rutin Bulanan','Rapat Luar Biasa','Musyawarah Besar',
  'Rapat Divisi','Rapat Koordinasi','Rapat Evaluasi Program','Lainnya'
];

const EMPTY_AGENDA_POINT: MeetingAgendaPoint = {
  no: 1, topic: '', discussion: '', decision: '', picName: '', deadline: ''
};

const buildEmpty = (user: string, count: number): Omit<MeetingMinutes, 'id'|'createdAt'|'updatedAt'> => {
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth()+1).padStart(2,'0');
  return {
    meetingNumber: `${String(count+1).padStart(2,'0')}/RAP/KARTAR-NSW/${
      ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][new Date().getMonth()+1]
    }/${y}`,
    title: '', type: 'Rapat Rutin Bulanan',
    date: new Date().toISOString().slice(0,10),
    startTime: '19:30', endTime: '21:30', location: 'Sekretariat GSI Ngangkruk',
    facilitator: '', secretary: user || 'Sekretaris',
    attendees: '', absentees: '', quorum: '',
    openingNotes: '', agendaPoints: [{ ...EMPTY_AGENDA_POINT }],
    closingNotes: '', nextMeetingDate: '', nextMeetingNotes: '',
    status: 'Draft', createdBy: user || 'Sekretaris', attachments: []
  };
};

// ── Helper badges ────────────────────────────────────────────────────────────
const statusBadge = (s: MeetingStatus) => {
  if (s === 'Draft')
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">Draft</span>;
  if (s === 'Final')
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Final</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">Diarsipkan</span>;
};

const inputCls = "w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-amber-400/50 placeholder-slate-500";
const labelCls = "text-[10px] font-bold text-slate-400 uppercase mb-1 block";
const sectionCls = "p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4";

// ── Component ────────────────────────────────────────────────────────────────
export const NotulensiTab: React.FC = () => {
  const { meetingMinutes, addMeetingMinutes, updateMeetingMinutes, deleteMeetingMinutes, currentUser } = useApp();

  const [view, setView]         = useState<'list'|'form'|'detail'>('list');
  const [editId, setEditId]     = useState<string|null>(null);
  const [detailId, setDetailId] = useState<string|null>(null);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua'|MeetingStatus>('Semua');
  const [toast, setToast]       = useState('');

  const [form, setForm] = useState<Omit<MeetingMinutes,'id'|'createdAt'|'updatedAt'>>(
    () => buildEmpty(currentUser?.name || 'Sekretaris', meetingMinutes.length)
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  // ── form field helpers ──
  const sf = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const setAP = (idx: number, k: keyof MeetingAgendaPoint, v: string) =>
    setForm(f => ({
      ...f,
      agendaPoints: f.agendaPoints.map((ap, i) => i === idx ? { ...ap, [k]: v } : ap)
    }));

  const addAP = () =>
    setForm(f => ({
      ...f,
      agendaPoints: [...f.agendaPoints, { ...EMPTY_AGENDA_POINT, no: f.agendaPoints.length + 1 }]
    }));

  const removeAP = (idx: number) =>
    setForm(f => ({
      ...f,
      agendaPoints: f.agendaPoints
        .filter((_, i) => i !== idx)
        .map((ap, i) => ({ ...ap, no: i + 1 }))
    }));

  // ── CRUD actions ──
  const openAdd = () => {
    setForm(buildEmpty(currentUser?.name || 'Sekretaris', meetingMinutes.length));
    setEditId(null);
    setView('form');
  };

  const openEdit = (m: MeetingMinutes) => {
    const { id, createdAt, updatedAt, ...rest } = m;
    setForm(rest);
    setEditId(id);
    setView('form');
  };

  const openDetail = (id: string) => {
    setDetailId(id);
    setView('detail');
  };

  const save = () => {
    if (!form.title.trim()) { showToast('⚠ Judul rapat wajib diisi!'); return; }
    if (!form.date)          { showToast('⚠ Tanggal rapat wajib diisi!'); return; }
    if (!form.facilitator.trim()) { showToast('⚠ Nama pemimpin rapat wajib diisi!'); return; }
    if (editId) {
      updateMeetingMinutes(editId, form);
      showToast('✓ Notulensi berhasil diperbarui!');
    } else {
      addMeetingMinutes(form);
      showToast('✓ Notulensi baru berhasil disimpan!');
    }
    setView('list');
    setEditId(null);
  };

  const handleDelete = (m: MeetingMinutes) => {
    if (confirm(`Hapus notulensi "${m.title}"?\nTindakan ini tidak dapat dibatalkan.`)) {
      deleteMeetingMinutes(m.id);
      showToast(`Notulensi "${m.title}" dihapus.`);
      if (view !== 'list') setView('list');
    }
  };

  const finalize = (m: MeetingMinutes) => {
    updateMeetingMinutes(m.id, { status: 'Final' });
    showToast('✓ Notulensi ditandai sebagai Final!');
  };

  const archive = (m: MeetingMinutes) => {
    updateMeetingMinutes(m.id, { status: 'Diarsipkan' });
    showToast('Notulensi diarsipkan.');
  };

  // ── Filter ──
  const filtered = meetingMinutes.filter(m => {
    const matchS = filterStatus === 'Semua' || m.status === filterStatus;
    const matchQ = !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.meetingNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase());
    return matchS && matchQ;
  });

  const detailItem = meetingMinutes.find(m => m.id === detailId);

  // ── Print helper ──
  const printMinutes = (m: MeetingMinutes) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Notulensi – ${m.title}</title>
      <style>
        body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;font-size:13px;color:#111}
        h1{font-size:18px;text-align:center;margin-bottom:4px}
        h2{font-size:14px;margin-top:24px;border-bottom:1px solid #ccc;padding-bottom:4px}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        th,td{border:1px solid #bbb;padding:6px 10px;text-align:left;vertical-align:top}
        th{background:#f0f0f0;font-weight:bold}
        .meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-bottom:16px}
        .meta-row{display:flex;gap:8px}
        .meta-label{font-weight:bold;min-width:140px}
        pre{white-space:pre-wrap;font-family:inherit;margin:4px 0}
        .footer{margin-top:48px;display:flex;justify-content:space-between}
        .sign{text-align:center;min-width:180px}
        .sign .line{border-top:1px solid #111;margin-top:48px;padding-top:4px}
      </style></head><body>
      <h1>NOTULENSI RAPAT</h1>
      <p style="text-align:center;font-size:12px;color:#555">Karang Taruna Nawasena – Perum GSI Ngangkruk</p>
      <p style="text-align:center;margin-bottom:20px">${m.meetingNumber}</p>
      <h2>A. Informasi Rapat</h2>
      <div class="meta">
        <div class="meta-row"><span class="meta-label">Nama Rapat</span><span>${m.title}</span></div>
        <div class="meta-row"><span class="meta-label">Jenis Rapat</span><span>${m.type}</span></div>
        <div class="meta-row"><span class="meta-label">Hari/Tanggal</span><span>${new Date(m.date).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span></div>
        <div class="meta-row"><span class="meta-label">Waktu</span><span>${m.startTime} – ${m.endTime} WIB</span></div>
        <div class="meta-row"><span class="meta-label">Tempat</span><span>${m.location}</span></div>
        <div class="meta-row"><span class="meta-label">Pimpinan Rapat</span><span>${m.facilitator}</span></div>
        <div class="meta-row"><span class="meta-label">Notulis</span><span>${m.secretary}</span></div>
        <div class="meta-row"><span class="meta-label">Kuorum</span><span>${m.quorum}</span></div>
      </div>
      <h2>B. Peserta Hadir</h2><pre>${m.attendees}</pre>
      ${m.absentees ? `<h2>C. Peserta Tidak Hadir</h2><pre>${m.absentees}</pre>` : ''}
      <h2>D. Pembukaan</h2><pre>${m.openingNotes}</pre>
      <h2>E. Agenda & Hasil Pembahasan</h2>
      <table><thead><tr><th>No</th><th>Topik</th><th>Pembahasan</th><th>Keputusan</th><th>PIC</th><th>Deadline</th></tr></thead>
      <tbody>${m.agendaPoints.map(ap=>`<tr><td>${ap.no}</td><td>${ap.topic}</td><td><pre>${ap.discussion}</pre></td><td><pre>${ap.decision}</pre></td><td>${ap.picName}</td><td>${ap.deadline||'-'}</td></tr>`).join('')}
      </tbody></table>
      <h2>F. Penutupan</h2><pre>${m.closingNotes}</pre>
      ${m.nextMeetingDate?`<h2>G. Rencana Rapat Berikutnya</h2><p>${new Date(m.nextMeetingDate).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>${m.nextMeetingNotes?`<pre>${m.nextMeetingNotes}</pre>`:''}` : ''}
      <div class="footer">
        <div class="sign"><p>Pimpinan Rapat,</p><div class="line">${m.facilitator}</div></div>
        <div class="sign"><p>Notulis,</p><div class="line">${m.secretary}</div></div>
      </div>
      </body></html>`);
    w.document.close();
    w.print();
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />{toast}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-400" />
            Notulensi Rapat
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Catat, kelola, dan cetak hasil rapat secara terstruktur. —{' '}
            <span className="text-amber-400 font-semibold">{meetingMinutes.length} notulensi tersimpan</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {view !== 'list' && (
            <button onClick={() => setView('list')}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5">
              <ChevronDown className="w-4 h-4 rotate-90" /> Kembali
            </button>
          )}
          {view === 'list' && (
            <button onClick={openAdd}
              className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
              <Plus className="w-4 h-4" /> Buat Notulensi Baru
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          VIEW: LIST
      ════════════════════════════════════════ */}
      {view === 'list' && (
        <div className="space-y-5">

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {([['Draft','bg-amber-500/10 border-amber-500/20 text-amber-300'],
               ['Final','bg-emerald-500/10 border-emerald-500/20 text-emerald-300'],
               ['Diarsipkan','bg-slate-500/10 border-slate-500/20 text-slate-400']] as const).map(([s,cls]) => (
              <div key={s} className={`p-3 rounded-xl border text-center ${cls.split(' ').slice(0,2).join(' ')}`}>
                <p className={`text-lg font-extrabold ${cls.split(' ')[2]}`}>
                  {meetingMinutes.filter(m=>m.status===s).length}
                </p>
                <p className="text-[10px] font-semibold uppercase text-slate-400">{s}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari judul, nomor, atau jenis rapat..."
                value={search} onChange={e=>setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-emerald-500/50 placeholder-slate-500" />
            </div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white outline-none">
              <option value="Semua">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Final">Final</option>
              <option value="Diarsipkan">Diarsipkan</option>
            </select>
          </div>

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <ClipboardList className="w-12 h-12 mx-auto text-slate-700" />
              <p className="text-slate-400 text-sm">
                {meetingMinutes.length === 0
                  ? 'Belum ada notulensi. Klik "Buat Notulensi Baru" untuk memulai.'
                  : 'Tidak ada notulensi yang sesuai filter.'}
              </p>
            </div>
          )}

          {/* Cards */}
          <div className="space-y-3">
            {filtered.map(m => (
              <div key={m.id}
                className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {m.meetingNumber}
                      </span>
                      {statusBadge(m.status)}
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {m.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white truncate">{m.title || '(Belum diberi judul)'}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        {new Date(m.date).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {m.startTime} – {m.endTime} WIB
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        {m.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-violet-400" />
                        Notulis: {m.secretary}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1">
                      Disimpan: {m.createdAt} · Diperbarui: {m.updatedAt}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={()=>openDetail(m.id)}
                      className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 transition-colors" title="Lihat Detail">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={()=>openEdit(m)}
                      className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={()=>printMinutes(m)}
                      className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 transition-colors" title="Cetak / Print">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={()=>handleDelete(m)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors" title="Hapus">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick actions bottom */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  {m.status === 'Draft' && (
                    <button onClick={()=>finalize(m)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/40 text-emerald-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all">
                      <Check className="w-3.5 h-3.5" /> Finalisasi
                    </button>
                  )}
                  {m.status === 'Final' && (
                    <button onClick={()=>archive(m)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-[11px] font-semibold flex items-center gap-1.5 transition-all">
                      <Archive className="w-3.5 h-3.5" /> Arsipkan
                    </button>
                  )}
                  <span className="text-[10px] text-slate-500 ml-auto">
                    {m.agendaPoints.length} agenda point · {m.quorum}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          VIEW: FORM (Add / Edit)
      ════════════════════════════════════════ */}
      {view === 'form' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20">
            <ClipboardList className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-300">{editId ? 'Edit Notulensi Rapat' : 'Formulir Notulensi Rapat Baru'}</p>
              <p className="text-[11px] text-amber-400/70">Isi selengkap mungkin. Bisa disimpan sebagai Draft terlebih dahulu.</p>
            </div>
          </div>

          {/* ── SEKSI A: Identitas Rapat ── */}
          <div className={sectionCls}>
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider border-l-2 border-amber-400 pl-2">
              A. Identitas Rapat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Nomor Rapat / Surat</label>
                <input value={form.meetingNumber} onChange={e=>sf('meetingNumber',e.target.value)}
                  placeholder="01/RAP/KARTAR-NSW/VIII/2026" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Judul / Nama Rapat *</label>
                <input value={form.title} onChange={e=>sf('title',e.target.value)}
                  placeholder="Contoh: Rapat Koordinasi Persiapan HUT RI ke-81" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Jenis Rapat</label>
                <select value={form.type} onChange={e=>sf('type',e.target.value as MeetingType)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none">
                  {MEETING_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={e=>sf('status',e.target.value as MeetingStatus)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none">
                  <option value="Draft">Draft</option>
                  <option value="Final">Final</option>
                  <option value="Diarsipkan">Diarsipkan</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── SEKSI B: Waktu & Tempat ── */}
          <div className={sectionCls}>
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider border-l-2 border-emerald-400 pl-2">
              B. Waktu & Tempat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Tanggal Rapat *</label>
                <input type="date" value={form.date} onChange={e=>sf('date',e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
              </div>
              <div>
                <label className={labelCls}>Jam Mulai *</label>
                <input type="time" value={form.startTime} onChange={e=>sf('startTime',e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
              </div>
              <div>
                <label className={labelCls}>Jam Selesai</label>
                <input type="time" value={form.endTime} onChange={e=>sf('endTime',e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
              </div>
              <div className="sm:col-span-3">
                <label className={labelCls}>Tempat / Lokasi Rapat</label>
                <input value={form.location} onChange={e=>sf('location',e.target.value)}
                  placeholder="Contoh: Balai Pertemuan GSI RT 04 / Sekretariat Nawasena" className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── SEKSI C: Pimpinan & Peserta ── */}
          <div className={sectionCls}>
            <h3 className="text-xs font-extrabold text-sky-400 uppercase tracking-wider border-l-2 border-sky-400 pl-2">
              C. Pimpinan Rapat & Peserta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Pimpinan Rapat *</label>
                <input value={form.facilitator} onChange={e=>sf('facilitator',e.target.value)}
                  placeholder="Nama ketua / pimpinan rapat" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Notulis / Sekretaris</label>
                <input value={form.secretary} onChange={e=>sf('secretary',e.target.value)}
                  placeholder="Nama notulis" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Kuorum</label>
                <input value={form.quorum} onChange={e=>sf('quorum',e.target.value)}
                  placeholder="Contoh: 18 dari 25 anggota hadir" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Daftar Peserta Hadir (1 nama per baris)</label>
              <textarea rows={5} value={form.attendees} onChange={e=>sf('attendees',e.target.value)}
                placeholder={"1. Budi Santoso (Ketua)\n2. Siti Rahayu (Sekretaris)\n3. Ahmad Fauzi (Bendahara)\n..."}
                className={inputCls + ' resize-y'} />
            </div>
            <div>
              <label className={labelCls}>Peserta Tidak Hadir (opsional)</label>
              <textarea rows={3} value={form.absentees || ''} onChange={e=>sf('absentees',e.target.value)}
                placeholder="Nama dan alasan tidak hadir (jika ada)..."
                className={inputCls + ' resize-y'} />
            </div>
          </div>

          {/* ── SEKSI D: Pembukaan ── */}
          <div className={sectionCls}>
            <h3 className="text-xs font-extrabold text-violet-400 uppercase tracking-wider border-l-2 border-violet-400 pl-2">
              D. Pembukaan Rapat
            </h3>
            <div>
              <label className={labelCls}>Catatan Pembukaan / Kata Pengantar</label>
              <textarea rows={4} value={form.openingNotes} onChange={e=>sf('openingNotes',e.target.value)}
                placeholder="Rapat dibuka pukul ... oleh ... dengan membaca basmalah / doa bersama. Pimpinan rapat menyampaikan..."
                className={inputCls + ' resize-y'} />
            </div>
          </div>

          {/* ── SEKSI E: Agenda Points (dinamis) ── */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider border-l-2 border-amber-300 pl-2">
                E. Agenda & Hasil Pembahasan
              </h3>
              <button onClick={addAP}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 border border-amber-400/30">
                <Plus className="w-3.5 h-3.5" /> Tambah Poin Agenda
              </button>
            </div>

            {form.agendaPoints.map((ap, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-white/10 space-y-3 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-amber-400">Poin Agenda #{ap.no}</span>
                  {form.agendaPoints.length > 1 && (
                    <button onClick={()=>removeAP(idx)}
                      className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Topik / Judul Agenda</label>
                    <input value={ap.topic} onChange={e=>setAP(idx,'topic',e.target.value)}
                      placeholder="Contoh: Laporan Keuangan Bulan Juli 2026" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Isi Pembahasan</label>
                    <textarea rows={3} value={ap.discussion} onChange={e=>setAP(idx,'discussion',e.target.value)}
                      placeholder="Uraikan hasil diskusi, pertanyaan, dan tanggapan anggota..."
                      className={inputCls + ' resize-y'} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Keputusan / Kesimpulan</label>
                    <textarea rows={2} value={ap.decision} onChange={e=>setAP(idx,'decision',e.target.value)}
                      placeholder="Keputusan yang diambil secara musyawarah mufakat..."
                      className={inputCls + ' resize-y'} />
                  </div>
                  <div>
                    <label className={labelCls}>Penanggung Jawab (PIC)</label>
                    <input value={ap.picName} onChange={e=>setAP(idx,'picName',e.target.value)}
                      placeholder="Nama PIC / divisi" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Batas Waktu (Deadline)</label>
                    <input type="date" value={ap.deadline||''} onChange={e=>setAP(idx,'deadline',e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── SEKSI F: Penutup ── */}
          <div className={sectionCls}>
            <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider border-l-2 border-rose-400 pl-2">
              F. Penutupan & Rencana Tindak Lanjut
            </h3>
            <div>
              <label className={labelCls}>Catatan Penutupan</label>
              <textarea rows={3} value={form.closingNotes} onChange={e=>sf('closingNotes',e.target.value)}
                placeholder="Rapat ditutup pukul ... oleh ... dengan membaca hamdalah / doa penutup."
                className={inputCls + ' resize-y'} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Rencana Rapat Berikutnya</label>
                <input type="date" value={form.nextMeetingDate||''} onChange={e=>sf('nextMeetingDate',e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white outline-none" />
              </div>
              <div>
                <label className={labelCls}>Catatan Rapat Berikutnya</label>
                <input value={form.nextMeetingNotes||''} onChange={e=>sf('nextMeetingNotes',e.target.value)}
                  placeholder="Agenda / topik yang akan dibahas..." className={inputCls} />
              </div>
            </div>
          </div>

          {/* Save buttons */}
          <div className="flex items-center gap-3 pt-2 pb-4">
            <button onClick={save}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all">
              <Check className="w-4 h-4" />
              {editId ? 'Simpan Perubahan' : 'Simpan Notulensi'}
            </button>
            <button onClick={()=>{sf('status','Draft'); save();}}
              disabled={!!editId}
              className="px-5 py-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <FileText className="w-4 h-4" /> Simpan sebagai Draft
            </button>
            <button onClick={()=>setView('list')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-all">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          VIEW: DETAIL
      ════════════════════════════════════════ */}
      {view === 'detail' && detailItem && (
        <div className="space-y-5">
          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-2">
            {statusBadge(detailItem.status)}
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {detailItem.meetingNumber}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={()=>openEdit(detailItem)}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-400/30">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={()=>printMinutes(detailItem)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                <Printer className="w-3.5 h-3.5" /> Cetak / Print
              </button>
              {detailItem.status === 'Draft' && (
                <button onClick={()=>{ finalize(detailItem); updateMeetingMinutes(detailItem.id,{status:'Final'}); }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Finalisasi
                </button>
              )}
              <button onClick={()=>handleDelete(detailItem)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-500/30">
                <Trash2 className="w-3.5 h-3.5" /> Hapus
              </button>
            </div>
          </div>

          {/* Title + meta */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h2 className="text-2xl font-extrabold text-white">{detailItem.title}</h2>
            <p className="text-xs text-slate-400">{detailItem.type}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                ['Tanggal', new Date(detailItem.date).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}), 'text-emerald-400'],
                ['Waktu', `${detailItem.startTime} – ${detailItem.endTime} WIB`, 'text-amber-400'],
                ['Tempat', detailItem.location, 'text-sky-400'],
                ['Kuorum', detailItem.quorum, 'text-violet-400'],
              ].map(([l,v,c]) => (
                <div key={l} className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                  <p className={`text-[10px] font-bold uppercase ${c}`}>{l}</p>
                  <p className="text-white font-semibold mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <p className="text-[10px] font-bold uppercase text-slate-400">Pimpinan Rapat</p>
                <p className="text-white font-semibold mt-0.5">{detailItem.facilitator}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <p className="text-[10px] font-bold uppercase text-slate-400">Notulis</p>
                <p className="text-white font-semibold mt-0.5">{detailItem.secretary}</p>
              </div>
            </div>
          </div>

          {/* Peserta */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold text-sky-400 uppercase tracking-wider border-l-2 border-sky-400 pl-2">Peserta Hadir</h3>
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{detailItem.attendees}</pre>
            {detailItem.absentees && (
              <>
                <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider border-l-2 border-rose-400 pl-2 mt-3">Tidak Hadir</h3>
                <pre className="text-xs text-slate-400 whitespace-pre-wrap font-sans">{detailItem.absentees}</pre>
              </>
            )}
          </div>

          {/* Pembukaan */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xs font-extrabold text-violet-400 uppercase tracking-wider border-l-2 border-violet-400 pl-2 mb-3">Pembukaan</h3>
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{detailItem.openingNotes}</pre>
          </div>

          {/* Agenda Points */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider border-l-2 border-amber-300 pl-2">
              Agenda & Hasil Pembahasan
            </h3>
            {detailItem.agendaPoints.map((ap,i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold flex items-center justify-center shrink-0">{ap.no}</span>
                  <h4 className="text-sm font-extrabold text-white">{ap.topic}</h4>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Pembahasan</p>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{ap.discussion}</pre>
                </div>
                {ap.decision && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Keputusan</p>
                    <pre className="text-xs text-emerald-200 whitespace-pre-wrap font-sans leading-relaxed">{ap.decision}</pre>
                  </div>
                )}
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  {ap.picName && <span className="flex items-center gap-1"><User className="w-3 h-3 text-amber-400" /> PIC: <strong className="text-amber-300">{ap.picName}</strong></span>}
                  {ap.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-rose-400" /> Deadline: <strong className="text-rose-300">{new Date(ap.deadline).toLocaleDateString('id-ID')}</strong></span>}
                </div>
              </div>
            ))}
          </div>

          {/* Penutupan */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider border-l-2 border-rose-400 pl-2 mb-3">Penutupan</h3>
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{detailItem.closingNotes}</pre>
          </div>

          {/* Rapat berikutnya */}
          {detailItem.nextMeetingDate && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Rencana Rapat Berikutnya
              </p>
              <p className="text-sm font-bold text-white">
                {new Date(detailItem.nextMeetingDate).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
              </p>
              {detailItem.nextMeetingNotes && (
                <p className="text-xs text-emerald-200 mt-1">{detailItem.nextMeetingNotes}</p>
              )}
            </div>
          )}

          {/* Footer meta */}
          <p className="text-[10px] text-slate-600 text-center pb-4">
            Dibuat: {detailItem.createdAt} oleh {detailItem.createdBy} · Terakhir diperbarui: {detailItem.updatedAt}
          </p>
        </div>
      )}

    </div>
  );
};
