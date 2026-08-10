import React from 'react';
import { useApp } from '../../context/AppContext';
import { User } from 'lucide-react';

export const StructureSection: React.FC = () => {
  const { board } = useApp();

  const sortedBoard = [...board].sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 bg-[#022c22] text-slate-100 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Jajaran Kepengurusan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Struktur Organisasi Nawasena
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Pengurus Karang Taruna Nawasena Perum Graha Selokaton Indah Ngangkruk Masa Bakti 2024 - 2026.
          </p>
        </div>

        {/* Board Members Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBoard.map((member) => (
            <div
              key={member.id}
              className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all text-center flex flex-col items-center p-6"
            >
              {/* Photo */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-600/30 group-hover:border-amber-400 transition-all mb-4 shadow-md">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      (e.currentTarget.parentElement!.querySelector('.fallback-icon') as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="fallback-icon w-full h-full bg-slate-700 items-center justify-center"
                  style={{ display: member.photo ? 'none' : 'flex' }}
                >
                  <User className="w-12 h-12 text-slate-400" />
                </div>
              </div>

              {/* Position Tag */}
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
                {member.position}
              </span>

              {/* Name */}
              <h3 className="text-lg font-extrabold text-white leading-snug">
                {member.name}
              </h3>

              {/* Tenure Period */}
              <p className="text-xs font-semibold text-amber-400 mt-1.5">
                Masa Bakti: {member.period}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
