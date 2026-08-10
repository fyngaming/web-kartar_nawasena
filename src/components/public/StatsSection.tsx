import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Layers, CalendarCheck, Award, Flag } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { members, programs, agenda, achievements, siteSettings } = useApp();

  const activeMembersCount = members.filter(m => m.status === 'Aktif').length;
  const totalProgramsCount = programs.length;
  const totalAgendaCount = agenda.length;
  const totalAchievementsCount = achievements.length;
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - siteSettings.establishedYear;

  const stats = [
    {
      label: 'Total Anggota Aktif',
      value: activeMembersCount,
      suffix: '+ Pemuda',
      icon: Users,
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      label: 'Program Kerja',
      value: totalProgramsCount,
      suffix: ' Program',
      icon: Layers,
      color: 'from-amber-500 to-amber-600'
    },
    {
      label: 'Agenda Kegiatan',
      value: totalAgendaCount,
      suffix: ' Agenda',
      icon: CalendarCheck,
      color: 'from-emerald-700 to-emerald-800'
    },
    {
      label: 'Tahun Berdiri',
      value: siteSettings.establishedYear,
      suffix: ` (${yearsActive} Th Pengabdian)`,
      icon: Flag,
      color: 'from-slate-800 to-slate-900',
      isYear: true
    }
  ];

  return (
    <section className="py-16 bg-[#022c22]/90 text-white relative overflow-hidden border-y border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.1),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest rounded-full bg-amber-400/10 border border-amber-400/20 backdrop-blur-md">
            Data Real-Time Organisasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight text-white">
            Statistik Dampak & Keaktifan Nawasena
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-amber-400/50 hover:bg-white/15 transition-all text-center group flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
                  {stat.isYear ? (
                    stat.value
                  ) : (
                    <AnimatedCounter value={stat.value} />
                  )}
                </div>
                
                <span className="text-xs font-bold text-amber-300">{stat.suffix}</span>
                <span className="text-xs text-slate-300 mt-2 font-medium">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / (value || 1)));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};
