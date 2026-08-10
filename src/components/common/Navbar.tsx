import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useApp, PublicTab } from '../../context/AppContext';
import { Menu, X, UserPlus, SearchCheck, ShieldCheck, ChevronRight, Phone } from 'lucide-react';

export const Navbar: React.FC<{ onOpenAdminLogin: () => void }> = ({ onOpenAdminLogin }) => {
  const { activeTab, setActiveTab, isAdminMode, setIsAdminMode, currentUser } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; tab: PublicTab }[] = [
    { label: 'Beranda', tab: 'home' },
    { label: 'Tentang Kami', tab: 'tentang' },
    { label: 'Program Kerja', tab: 'program' },
    { label: 'Berita', tab: 'berita' },
    { label: 'Agenda', tab: 'agenda' },
    { label: 'Galeri', tab: 'galeri' },
    { label: 'Struktur Pengurus', tab: 'struktur' },
    { label: 'FAQ', tab: 'faq' },
    { label: 'Kontak', tab: 'kontak' }
  ];

  const handleNavClick = (tab: PublicTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#022c22]/80 backdrop-blur-xl shadow-2xl py-2.5 border-b border-white/10 text-white'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent py-4 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group flex items-center focus:outline-none"
            aria-label="Karang Taruna Nawasena Home"
          >
            <Logo size="md" showText={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = activeTab === link.tab;
              return (
                <button
                  key={link.tab}
                  onClick={() => handleNavClick(link.tab)}
                  className={`px-3.5 py-1.5 text-xs xl:text-sm font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-400/20'
                      : 'text-slate-200 hover:text-amber-300 hover:bg-white/10 backdrop-blur-md'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Admin Switch */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Cek Status Registration */}
            <button
              onClick={() => handleNavClick('check-status')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all backdrop-blur-md ${
                activeTab === 'check-status'
                  ? 'bg-amber-400 border-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-400/20'
                  : 'border-white/20 text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <SearchCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Cek Status</span>
            </button>

            {/* Bergabung Menjadi Anggota CTA */}
            <button
              onClick={() => handleNavClick('join-info')}
              className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-emerald-950 shadow-xl shadow-amber-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all border border-amber-300/40"
            >
              <UserPlus className="w-4 h-4 text-emerald-950" />
              <span>Bergabung Anggota</span>
            </button>

            {/* Admin Login Button */}
            <button
              onClick={() => {
                if (isAdminMode && currentUser) {
                  setIsAdminMode(true);
                } else {
                  onOpenAdminLogin();
                }
              }}
              title="Portal Admin Pengurus"
              className={`p-2 rounded-full border text-xs font-medium transition-colors backdrop-blur-md ${
                isAdminMode
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'border-white/20 text-slate-300 hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('join-info')}
              className="px-3 py-1.5 text-xs font-bold rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 border border-amber-300/50 shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-950" />
              <span>Daftar</span>
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl px-4 pt-3 pb-6 animate-fadeIn text-white">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map(link => (
              <button
                key={link.tab}
                onClick={() => handleNavClick(link.tab)}
                className={`px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center justify-between transition-all ${
                  activeTab === link.tab
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('check-status')}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl border border-white/20 text-slate-200 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <SearchCheck className="w-4 h-4 text-amber-400" />
              <span>Cek Status Pendaftaran</span>
            </button>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminLogin();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Login Portal Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
