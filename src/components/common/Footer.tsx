import React from 'react';
import { Logo } from './Logo';
import { useApp, PublicTab } from '../../context/AppContext';
import { MapPin, Mail, Shield, ArrowUp } from 'lucide-react';

export const Footer: React.FC<{ onOpenAdminLogin: () => void }> = ({ onOpenAdminLogin }) => {
  const { siteSettings, setActiveTab } = useApp();

  const handleNavClick = (tab: PublicTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 relative pt-16 pb-8 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Slogan */}
          <div className="space-y-4">
            <Logo size="lg" showText={true} className="text-white" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Wadah kepemudaan resmi Perumahan Graha Selokaton Indah (GSI) Ngangkruk, Desa Selokaton, Gondangrejo, Karanganyar. Mengabdi untuk kemajuan sosial, olahraga, dan seni kebudayaan.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/kartar.nawasena_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white shadow-lg transition-all hover:scale-[1.04] active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)' }}
                aria-label="Ikuti Instagram Karang Taruna Nawasena"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>kartar.nawasena_</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-amber-400 transition-colors">
                  • Beranda Utama
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('tentang')} className="hover:text-amber-400 transition-colors">
                  • Tentang & Sejarah
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('program')} className="hover:text-amber-400 transition-colors">
                  • Program Kerja Unggulan
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('berita')} className="hover:text-amber-400 transition-colors">
                  • Berita & Informasi Warga
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('agenda')} className="hover:text-amber-400 transition-colors">
                  • Agenda Kegiatan & Kalender
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('galeri')} className="hover:text-amber-400 transition-colors">
                  • Galeri Foto & Video
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('struktur')} className="hover:text-amber-400 transition-colors">
                  • Pengurus Karang Taruna
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Membership & Verification */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-3">
              Keanggotaan & Layanan
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('join-info')} className="hover:text-amber-400 transition-colors font-medium text-emerald-400">
                  ➜ Informasi Syarat Pendaftaran
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('register')} className="hover:text-amber-400 transition-colors">
                  ➜ Formulir Online Anggota Baru
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('check-status')} className="hover:text-amber-400 transition-colors">
                  ➜ Cek Status Pendaftaran
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('faq')} className="hover:text-amber-400 transition-colors">
                  ➜ FAQ & Pertanyaan Umum
                </button>
              </li>
            </ul>

            <div className="mt-6 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[11px]">
              <p className="font-semibold text-white">Ingin Jadi Bagian Nawasena?</p>
              <p className="text-slate-400 mt-0.5">Terbuka untuk pemuda GSI Ngangkruk usia 13 - 30 tahun.</p>
            </div>
          </div>

          {/* Column 4: Sekretariat & Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Sekretariat Nawasena
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-tight">
                  {siteSettings.address}, {siteSettings.subDistrict}, {siteSettings.city} ({siteSettings.postalCode})
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-slate-400">{siteSettings.email}</span>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={onOpenAdminLogin}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-600 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Portal Pengurus / Admin Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {siteSettings.orgName} — {siteSettings.subName}. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600">Aditya Karya Mahatvayodha</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:bg-emerald-600 hover:border-emerald-500 text-slate-400 hover:text-white transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
