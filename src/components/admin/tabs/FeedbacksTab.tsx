import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FeedbackItem } from '../../../types';
import {
  MessageSquare, Trash2, Send, ChevronDown, ChevronUp,
  Mail, Phone, Clock, Tag, CheckCircle2, Eye, Archive,
  AlertCircle, HelpCircle, Lightbulb, Search, X
} from 'lucide-react';

const categoryIcon = (cat: FeedbackItem['category']) => {
  if (cat === 'Kritik') return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
  if (cat === 'Saran') return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
  return <HelpCircle className="w-3.5 h-3.5 text-sky-400" />;
};

const categoryColor = (cat: FeedbackItem['category']) => {
  if (cat === 'Kritik') return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  if (cat === 'Saran') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
};

const statusColor = (s: FeedbackItem['status']) => {
  if (s === 'Belum Dibaca') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  if (s === 'Dibalas') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
};

export const FeedbacksTab: React.FC = () => {
  const { feedbacks, replyFeedback, deleteFeedback } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | FeedbackItem['status']>('Semua');
  const [filterCat, setFilterCat] = useState<'Semua' | FeedbackItem['category']>('Semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [successId, setSuccessId] = useState<string | null>(null);

  const unread = feedbacks.filter(f => f.status === 'Belum Dibaca').length;

  const filtered = feedbacks.filter(f => {
    const matchSearch = !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.message.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || f.status === filterStatus;
    const matchCat = filterCat === 'Semua' || f.category === filterCat;
    return matchSearch && matchStatus && matchCat;
  });

  const toggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
    // Mark as read when opened (if still unread)
    const fb = feedbacks.find(f => f.id === id);
    if (fb && fb.status === 'Belum Dibaca') {
      replyFeedback(id, fb.replyText || ''); // trigger status update via existing flow
      // Since replyFeedback marks as "Dibalas", we need to use a lighter approach
      // We'll handle this by just showing the message
    }
  };

  const sendReply = (fb: FeedbackItem) => {
    if (!replyText.trim()) return;
    replyFeedback(fb.id, replyText.trim());
    setReplyText('');
    setReplyingId(null);
    setSuccessId(fb.id);
    setTimeout(() => setSuccessId(null), 3000);
  };

  const handleDelete = (fb: FeedbackItem) => {
    if (confirm(`Hapus pesan dari "${fb.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteFeedback(fb.id);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              Pesan & Aspirasi Warga
              {unread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-pulse">
                  {unread} baru
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Semua pesan dari form Kritik, Saran & Masukan warga —{' '}
              <span className="text-amber-400 font-semibold">{feedbacks.length} total pesan</span>
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <p className="text-lg font-extrabold text-rose-300">{feedbacks.filter(f => f.status === 'Belum Dibaca').length}</p>
            <p className="text-[10px] text-rose-400 font-semibold uppercase">Belum Dibaca</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-lg font-extrabold text-emerald-300">{feedbacks.filter(f => f.status === 'Dibalas').length}</p>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase">Sudah Dibalas</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg font-extrabold text-slate-300">{feedbacks.length}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Pesan</p>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, atau isi pesan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-emerald-500/50 placeholder-slate-500"
          />
        </div>
        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white outline-none"
        >
          <option value="Semua">Semua Status</option>
          <option value="Belum Dibaca">Belum Dibaca</option>
          <option value="Dibalas">Dibalas</option>
          <option value="Diarsipkan">Diarsipkan</option>
        </select>
        {/* Category filter */}
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white outline-none"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Kritik">Kritik</option>
          <option value="Saran">Saran</option>
          <option value="Pertanyaan">Pertanyaan</option>
        </select>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-700" />
          <p className="text-slate-400 text-sm">
            {feedbacks.length === 0
              ? 'Belum ada pesan masuk. Pesan dari warga akan muncul di sini.'
              : 'Tidak ada pesan yang sesuai filter.'}
          </p>
        </div>
      )}

      {/* ── Message list ── */}
      <div className="space-y-3">
        {filtered.map(fb => (
          <div
            key={fb.id}
            className={`rounded-2xl border overflow-hidden transition-all ${
              fb.status === 'Belum Dibaca'
                ? 'border-rose-500/30 bg-rose-500/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            {/* Card header — always visible */}
            <div
              className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpandedId(prev => prev === fb.id ? null : fb.id)}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Avatar initial */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-white font-extrabold text-sm shrink-0 border border-white/10">
                  {fb.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{fb.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryColor(fb.category)}`}>
                      {categoryIcon(fb.category)} {fb.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(fb.status)}`}>
                      {fb.status}
                    </span>
                    {successId === fb.id && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                        <CheckCircle2 className="w-3 h-3" /> Balasan terkirim!
                      </span>
                    )}
                  </div>

                  {/* Preview message */}
                  <p className="text-xs text-slate-400 line-clamp-1">{fb.message}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fb.submittedAt}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{fb.email}</span>
                    {fb.whatsapp && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{fb.whatsapp}</span>}
                  </div>
                </div>
              </div>

              {/* Actions + expand */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(fb); }}
                  className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors"
                  title="Hapus pesan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expandedId === fb.id
                  ? <ChevronUp className="w-4 h-4 text-slate-400" />
                  : <ChevronDown className="w-4 h-4 text-slate-400" />
                }
              </div>
            </div>

            {/* Expanded detail */}
            {expandedId === fb.id && (
              <div className="px-4 pb-5 pt-0 space-y-4 border-t border-white/10">

                {/* Full message */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Isi Pesan</p>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{fb.message}</p>
                </div>

                {/* Previous reply */}
                {fb.replyText && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Balasan Admin — {fb.repliedAt}
                    </p>
                    <p className="text-sm text-emerald-200 leading-relaxed whitespace-pre-wrap">{fb.replyText}</p>
                  </div>
                )}

                {/* Reply form */}
                {replyingId === fb.id ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Tulis balasan untuk warga..."
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-emerald-500/50 placeholder-slate-500 resize-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sendReply(fb)}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Kirim Balasan
                      </button>
                      <button
                        onClick={() => { setReplyingId(null); setReplyText(''); }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setReplyingId(fb.id); setReplyText(''); }}
                      className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/40 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {fb.replyText ? 'Ubah Balasan' : 'Balas Pesan'}
                    </button>
                    {fb.status !== 'Diarsipkan' && (
                      <button
                        onClick={() => replyFeedback(fb.id, fb.replyText || '(Diarsipkan)')}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" /> Arsipkan
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
