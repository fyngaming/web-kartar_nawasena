import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Trophy, Star, ShieldCheck } from 'lucide-react';

export const AchievementsSection: React.FC = () => {
  const { achievements } = useApp();

  return (
    <section className="py-20 bg-[#022c22] text-slate-100 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
            Prestasi & Penghargaan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Jejak Karya & Rekam Prestasi
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Bukti nyata kerja keras dan dedikasi pemuda Karang Taruna Nawasena Perum GSI Ngangkruk.
          </p>
        </div>

        {/* Timeline Achievements */}
        <div className="max-w-4xl mx-auto space-y-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:shadow-xl hover:border-amber-400/30 transition-all flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Trophy className="w-7 h-7" />
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-slate-950">
                    Tahun {item.year}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 text-xs font-medium text-slate-400">
                  <span className="font-semibold text-slate-200">Penyelenggara / Penyelaras:</span> {item.organizer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
