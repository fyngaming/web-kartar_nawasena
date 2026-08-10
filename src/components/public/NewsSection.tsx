import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NewsItem } from '../../types';
import { Calendar, User, Eye, Search, Tag, X, ChevronRight, Share2 } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const publishedNews = news.filter(n => n.status === 'Published');
  const categories = ['Semua', ...Array.from(new Set(publishedNews.map(n => n.category)))];

  const filteredNews = publishedNews.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 relative bg-[#022c22] text-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Kabar Nawasena
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Berita & Informasi Terkini
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Informasi terkini kegiatan kepemudaan, liputan bazaar, dan pengumuman resmi organisasi.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berita & informasi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 backdrop-blur-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map(item => (
            <article
              key={item.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-600 text-white">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      {item.author}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {item.views} Dilihat
                </span>

                <button
                  onClick={() => setSelectedNews(item)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-white/10 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/20">
            <p className="text-sm text-slate-400">Tidak ada berita ditemukan untuk pencarian ini.</p>
          </div>
        )}

        {/* News Detail Modal */}
        {selectedNews && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900/95 backdrop-blur-xl max-w-3xl w-full rounded-2xl border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="relative h-64 bg-slate-900">
                <img
                  src={selectedNews.thumbnail}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover filter brightness-90"
                />
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-600 text-white">
                    {selectedNews.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedNews.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    Penulis: {selectedNews.author}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-white leading-tight">
                  {selectedNews.title}
                </h3>

                <div
                  className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                />
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-500">Karang Taruna Nawasena Official Publication</span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Tutup Berita
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
