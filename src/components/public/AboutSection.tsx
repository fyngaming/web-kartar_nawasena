import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Compass, Award, Heart, CheckCircle2, History, Shield, Users } from 'lucide-react';
import { motion } from 'motion/react';
import rapatImg from '@/assetImages/rapat/rapat.jfif';

export const AboutSection: React.FC = () => {
  const { siteSettings } = useApp();

  return (
    <section id="tentang-section" className="py-20 relative bg-[#022c22] text-slate-100 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md">
            Profil Organisasi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Tentang Karang Taruna Nawasena
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            Mengenal lebih dekat identitas, sejarah, visi misi, dan nilai pengabdian pemuda Perum Graha Selokaton Indah Ngangkruk.
          </p>
        </div>

        {/* Grid: Sejarah & Visual Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm">
              <History className="w-5 h-5 text-emerald-400" />
              <span>Sejarah Singkat Karangtaruna Nawasena GSI</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              Wadah Kebersamaan Pemuda Sejak Tahun 2022
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {siteSettings.history}
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
                <span className="text-xs text-amber-400 font-semibold">Wilayah Pengabdian</span>
                <p className="text-sm font-bold text-white mt-0.5">Perum GSI, RT 04 RW 15</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
                <span className="text-xs text-amber-400 font-semibold">Kecamatan & Kab.</span>
                <p className="text-sm font-bold text-white mt-0.5">Gondangrejo, Karanganyar</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-xl">
              <img
                src={rapatImg}
                alt="Kebersamaan Para Pemuda Karang Taruna Nawasena"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-6 text-white">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Musyawarah Pemuda</span>
                  <p className="text-base font-bold">Kebersamaan para Pemuda Perum Graha Selokaton Indah</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Visi */}
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Visi Utama</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              "{siteSettings.vision}"
            </p>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none" />
          </div>

          {/* Misi */}
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Misi Pembangunan</h3>
            <ul className="space-y-2.5">
              {siteSettings.mission.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nilai Organisasi Cards */}
        <div>
          <h3 className="text-center text-xl font-bold text-white mb-8">
            Nilai-Nilai Utama Karang Taruna Nawasena
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteSettings.values.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-md hover:border-amber-400/40 transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-4 border border-amber-400/30">
                  {idx === 0 ? <Shield className="w-5 h-5 text-amber-300" /> : idx === 1 ? <Users className="w-5 h-5 text-emerald-300" /> : idx === 2 ? <Award className="w-5 h-5 text-emerald-300" /> : <Heart className="w-5 h-5 text-amber-300" />}
                </div>
                <h4 className="text-base font-bold text-white">{val.title}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
