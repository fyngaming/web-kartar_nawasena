import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Sparkles, ChevronDown, Play, Pause, Layers, ShieldCheck, MapPin } from 'lucide-react';

import heroRapat from '@/assetImages/rapat/rapat.jfif';
import heroLomba1 from '@/assetImages/lomba/effaf9e8-d271-4cf7-b3f1-ba791000171b.jfif';
import heroLomba2 from '@/assetImages/lomba/0bcfbae9-d59b-4fb2-80a3-dba25fb51695.jfif';

const heroSlides = [
  {
    image: heroRapat,
    title: 'Semangat Pemuda GSI Ngangkruk',
    subtitle: 'Membangun Kebersamaan Melalui Olahraga, Seni, & Pemberdayaan Ekonomi'
  },
  {
    image: heroLomba1,
    title: 'Aksi Lingkungan & Peduli Sosial',
    subtitle: 'Gotong Royong Mewujudkan Lingkungan Asri, Bersih, & Mandiri Sampah'
  },
  {
    image: heroLomba2,
    title: 'Semarak HUT Kemerdekaan RI',
    subtitle: 'Melestarikan Jiwa Nasionalisme dan Kebudayaan di Perum Graha Selokaton Indah'
  }
];

export const HeroSection: React.FC = () => {
  const { siteSettings, setActiveTab } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const scrollToNext = () => {
    const target = document.getElementById('tentang-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('tentang');
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white pt-20 pb-16">
      {/* Background Slideshow / Visual Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={heroSlides[currentSlide].image}
            alt="Kegiatan Karang Taruna Nawasena"
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-105"
          />
        </motion.div>
      </AnimatePresence>

      {/* Radial Gradient & Grid Overlays */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/40 pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg backdrop-blur-md"
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Perum Graha Selokaton Indah (GSI) Ngangkruk, Gondangrejo</span>
        </motion.div>

        {/* Central Logo Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4"
        >
          <Logo size="xl" showText={false} className="mx-auto" />
        </motion.div>

        {/* Organization Name & Slogan */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
        >
          KARANG TARUNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">NAWASENA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-3 text-sm sm:text-lg font-semibold text-amber-300 max-w-2xl tracking-wide uppercase"
        >
          {siteSettings.slogan}
        </motion.p>

        {/* Slide Dynamic Subtitle */}
        <motion.p
          key={`sub-${currentSlide}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal"
        >
          {heroSlides[currentSlide].subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Main Join CTA */}
          <button
            onClick={() => setActiveTab('join-info')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-900/50 hover:shadow-emerald-700/60 transition-all border border-amber-400/50 flex items-center justify-center gap-2.5 group hover:scale-[1.03]"
          >
            <UserPlus className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Bergabung Menjadi Anggota</span>
          </button>

          {/* See Programs CTA */}
          <button
            onClick={() => setActiveTab('program')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-100 font-bold text-sm sm:text-base border border-slate-700 hover:border-emerald-500 backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:scale-[1.03]"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Lihat Program Kerja</span>
          </button>
        </motion.div>

        {/* Controls Bar & Slide Indicators */}
        <div className="mt-12 flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Down Arrow Cue */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToNext}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 p-2 text-slate-400 hover:text-white transition-colors"
        aria-label="Scroll down to About Us"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
};
