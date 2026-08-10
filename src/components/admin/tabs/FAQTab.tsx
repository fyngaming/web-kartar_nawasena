import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FAQItem } from '../../../types';
import { Plus, Edit2, Trash2, Save, X, Search } from 'lucide-react';

export const FAQTab: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useApp();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('Umum');

  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (faq: FAQItem) => {
    updateFAQ(faq.id, faq);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white">Kelola FAQ</h2>
            <p className="text-xs text-slate-300 mt-1">
              Tambahkan, edit, atau hapus pertanyaan yang tampil di halaman FAQ publik.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari FAQ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {filtered.map(faq => {
            const isEditing = editingId === faq.id;
            return (
              <div key={faq.id} className="rounded-3xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-amber-300 font-semibold uppercase mb-2">{faq.category}</p>
                    {isEditing ? (
                      <input
                        className="w-full mb-3 p-3 rounded-2xl bg-slate-900 border border-white/10 text-sm text-white"
                        value={faq.question}
                        onChange={e => updateFAQ(faq.id, { question: e.target.value })}
                      />
                    ) : (
                      <h3 className="text-base font-bold text-white">{faq.question}</h3>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-xl bg-slate-700 text-slate-200"
                        title="Batal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(faq.id)}
                        className="p-2 rounded-xl bg-emerald-500 text-slate-950"
                        title="Edit FAQ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteFAQ(faq.id)}
                      className="p-2 rounded-xl bg-rose-500 text-white"
                      title="Hapus FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  {isEditing ? (
                    <textarea
                      className="w-full h-28 p-3 rounded-2xl bg-slate-900 border border-white/10 text-sm text-white outline-none"
                      value={faq.answer}
                      onChange={e => updateFAQ(faq.id, { answer: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleSave(faq)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-slate-200 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Tambah FAQ Baru</h3>
                <p className="text-[11px] text-slate-400">Isi pertanyaan, jawaban, dan kategori untuk halaman publik.</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                {filtered.length} FAQ ditampilkan
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] text-slate-400 uppercase tracking-[0.2em]">Kategori</label>
              <input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Contoh: Keanggotaan"
                className="w-full p-3 rounded-2xl bg-slate-900 border border-white/10 text-sm text-white outline-none"
              />

              <label className="block text-[11px] text-slate-400 uppercase tracking-[0.2em]">Pertanyaan</label>
              <input
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="Masukkan pertanyaan umum"
                className="w-full p-3 rounded-2xl bg-slate-900 border border-white/10 text-sm text-white outline-none"
              />

              <label className="block text-[11px] text-slate-400 uppercase tracking-[0.2em]">Jawaban</label>
              <textarea
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                rows={5}
                placeholder="Isi jawaban yang jelas dan singkat"
                className="w-full p-3 rounded-2xl bg-slate-900 border border-white/10 text-sm text-white outline-none"
              />

              <button
                onClick={() => {
                  if (!newQuestion.trim() || !newAnswer.trim()) {
                    alert('Lengkapi pertanyaan dan jawaban terlebih dahulu.');
                    return;
                  }
                  addFAQ({
                    question: newQuestion.trim(),
                    answer: newAnswer.trim(),
                    category: newCategory.trim() || 'Umum'
                  });
                  setNewQuestion('');
                  setNewAnswer('');
                  setNewCategory('Umum');
                }}
                className="w-full px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah FAQ Baru
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
