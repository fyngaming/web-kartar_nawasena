import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, ExternalLink, Film } from 'lucide-react';

const IG_URL =
  'https://www.instagram.com/kartar.nawasena_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';

interface VideoItem {
  id: number;
  title: string;
  src: string;
  description: string;
}

const videos: VideoItem[] = [
  {
    id: 1,
    src: '/videos/video5.mp4',
    title: 'Buka Bersama Karang Taruna Nawasena',
    description: 'Momen kebersamaan dan silaturahmi buka bersama pemuda Karang Taruna Nawasena GSI Ngangkruk.'
  },
  {
    id: 2,
    src: '/videos/video3.mp4',
    title: 'Lomba 17 Agustus – Balap Kelereng & Estafet Kardus',
    description: 'Kemeriahan hari pertama lomba 17 Agustus dengan perlombaan balap kelereng dan estafet kardus seru.'
  },
  {
    id: 3,
    src: '/videos/video2.mp4',
    title: 'Lomba 17 Agustus – Sesi 2 Balap Kelereng & Estafet',
    description: 'Lanjutan lomba seru hari pertama penuh semangat dan keceriaan warga GSI Ngangkruk.'
  },
  {
    id: 4,
    src: '/videos/video4.mp4',
    title: 'Lomba 17 Agustus – Memasukkan Pensil & Pecah Air',
    description: 'Hari kedua lomba 17 Agustus dengan kompetisi memasukkan pensil ke botol dan pecah air yang seru.'
  },
  {
    id: 5,
    src: '/videos/video6.mp4',
    title: 'Hari Kedua Penuh Tawa & Semangat',
    description: 'Arena lomba dipenuhi keceriaan anak-anak dan warga GSI di hari kedua perayaan kemerdekaan.'
  },
  {
    id: 6,
    src: '/videos/video1.mp4',
    title: 'Kenangan Bersama Karang Taruna Nawasena',
    description: 'Ada hal-hal berharga yang tak bisa dibeli, tak bisa diulang — hanya bisa dikenang bersama.'
  }
];

export const SocialMediaSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentIndex];

  // Reset & reload when video changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.load();
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [currentIndex]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = Number(e.target.value);
    video.currentTime = (val / 100) * video.duration;
    setProgress(val);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goPrev = () => goTo((currentIndex - 1 + videos.length) % videos.length);
  const goNext = () => goTo((currentIndex + 1) % videos.length);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-20 bg-[#022c22] text-slate-100 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
            Informasi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Media Sosial Kami
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Ikuti perkembangan terbaru kegiatan Karang Taruna Nawasena melalui konten video dan media sosial resmi kami.
          </p>
        </div>

        {/* ── Main Video Player ── */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

          {/* Video container — fixed 16:9 aspect */}
          <div className="relative w-full" style={{ aspectRatio: '16/9', background: '#000' }}>
            <video
              ref={videoRef}
              key={currentVideo.src}
              src={currentVideo.src}
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              onClick={handlePlayPause}
              className="w-full h-full object-contain cursor-pointer"
              preload="metadata"
            />

            {/* Big play overlay when paused */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                aria-label="Putar video"
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-700/70 transition-all shadow-2xl">
                  <Play className="w-9 h-9 text-white fill-white ml-1.5" />
                </div>
              </button>
            )}

            {/* Video number badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-bold text-white border border-white/20">
              <Film className="w-3.5 h-3.5 inline-block mr-1.5 text-emerald-400" />
              {currentIndex + 1} / {videos.length}
            </div>
          </div>

          {/* ── Controls Bar ── */}
          <div className="px-5 py-4 space-y-3">
            {/* Title & description */}
            <div>
              <h3 className="text-base font-extrabold text-white leading-tight">{currentVideo.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{currentVideo.description}</p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 w-9 shrink-0 tabular-nums">
                {videoRef.current ? formatTime(videoRef.current.currentTime) : '0:00'}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-400"
                style={{
                  background: `linear-gradient(to right, #34d399 ${progress}%, rgba(255,255,255,0.15) ${progress}%)`
                }}
                aria-label="Progress video"
              />
              <span className="text-[11px] text-slate-400 w-9 shrink-0 tabular-nums text-right">
                {duration > 0 ? formatTime(duration) : '--:--'}
              </span>
            </div>

            {/* Buttons row */}
            <div className="flex items-center justify-between">
              {/* Prev / Play-Pause / Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  aria-label="Video sebelumnya"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all"
                >
                  {isPlaying
                    ? <Pause className="w-5 h-5 fill-white" />
                    : <Play className="w-5 h-5 fill-white ml-0.5" />
                  }
                </button>
                <button
                  onClick={goNext}
                  aria-label="Video berikutnya"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Aktifkan suara' : 'Matikan suara'}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all"
              >
                {isMuted
                  ? <VolumeX className="w-4 h-4 text-red-400" />
                  : <Volume2 className="w-4 h-4 text-emerald-400" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Thumbnail Strip (slide selector) ── */}
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {videos.map((video, idx) => (
            <button
              key={video.id}
              onClick={() => goTo(idx)}
              aria-label={`Pilih video: ${video.title}`}
              className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all focus:outline-none ${
                idx === currentIndex
                  ? 'border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                  : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              {/* Thumbnail via video poster — use first-frame via JS trick */}
              <video
                src={video.src}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover pointer-events-none"
              />
              {/* Overlay with index number */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                {idx === currentIndex ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                  </div>
                ) : (
                  <span className="text-xs font-extrabold text-white drop-shadow">{idx + 1}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* ── Dot Indicators ── */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Video ${i + 1}`}
              className={`rounded-full transition-all ${
                currentIndex === i
                  ? 'w-6 h-2 bg-emerald-400'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* ── Instagram Follow Button ── */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-slate-300 text-sm text-center">
            Jangan lewatkan konten terbaru dari akun resmi kami
          </p>
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl font-extrabold text-sm text-white shadow-2xl transition-all hover:scale-[1.04] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#022c22]"
            style={{
              background: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 shrink-0"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Ikuti Media Sosial Kami</span>
            <span className="opacity-80 font-semibold text-xs">kartar.nawasena_</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </div>

      </div>
    </section>
  );
};
