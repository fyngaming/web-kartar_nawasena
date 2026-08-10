import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramItem } from '../../types';
import { Layers, CheckCircle2, Clock, Calendar, X, ArrowRight, UserCheck, DollarSign } from 'lucide-react';

export const ProgramsSection: React.FC = () => {
  const { programs } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  const categories = ['Semua', ...Array.from(new Set(programs.map(p => p.category)))];

  const filteredPrograms = selectedCategory === 'Semua'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  const getStatusBadge = (status: ProgramItem['status']) => {
    switch (status) {
      case 'Berlangsung':
        return (
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Berlangsung
          </span>
        );
      case 'Terencana':
        return (
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-300" />
            Terencana
          </span>
        );
      case 'Selesai':
        return (
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30 backdrop-blur-md flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-slate-300" />
            Selesai
          </span>
        );
    }
  };

  return (
    <section className="py-20 relative bg-[#022c22] text-slate-100 overflow-hidden">
      {/* Ambient Lights */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md">
              Agenda & Kerja Nyata
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Program Kerja Karang Taruna
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Rangkaian program strategis dalam bidang olahraga, lingkungan, multimedia, keagamaan, dan pemberdayaan sosial masyarakat.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 backdrop-blur-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map(program => (
            <div
              key={program.id}
              className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Card Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-slate-950/80 text-amber-300 backdrop-blur-md border border-white/10">
                      {program.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(program.status)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {program.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Target: {program.target}</span>
                    </p>
                    {program.coordinator && (
                      <p className="text-[11px] text-slate-400 italic">
                        PJ: {program.coordinator}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="w-full py-2.5 px-4 rounded-full bg-white/10 border border-white/15 text-white font-bold text-xs hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 transition-all flex items-center justify-center gap-2 group/btn backdrop-blur-md"
                >
                  <span>Detail Program Kerja</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detail Program */}
        {selectedProgram && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900/90 max-w-2xl w-full rounded-3xl border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white backdrop-blur-2xl">
              {/* Header Image */}
              <div className="relative h-56 bg-slate-900">
                <img
                  src={selectedProgram.image}
                  alt={selectedProgram.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-400 text-slate-950">
                    {selectedProgram.category}
                  </span>
                  {getStatusBadge(selectedProgram.status)}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <h3 className="text-2xl font-extrabold text-white">
                  {selectedProgram.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedProgram.fullDetails || selectedProgram.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                    <span className="text-amber-400 font-semibold">Sasaran / Target:</span>
                    <p className="font-bold text-white mt-0.5">{selectedProgram.target}</p>
                  </div>
                  {selectedProgram.budget && (
                    <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs">
                      <span className="text-amber-300 font-semibold flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        Estimasi Anggaran:
                      </span>
                      <p className="font-bold text-amber-200 mt-0.5">{selectedProgram.budget}</p>
                    </div>
                  )}
                </div>

                {selectedProgram.coordinator && (
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Penanggung Jawab:</span> {selectedProgram.coordinator}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-400/20"
                >
                  Tutup Modul Detail
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
