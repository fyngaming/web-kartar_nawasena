import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, ExternalLink, Clock, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { siteSettings } = useApp();

  return (
    <section className="py-20 bg-[#022c22] text-slate-100 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Pusat Informasi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Hubungi & Kunjungi Sekretariat
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Kami menyambut hangat kedatangan warga, calon anggota, mitra sponsorship, dan tamu undangan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Info Cards Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3">
                Alamat Sekretariat Utama
              </h3>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-sm">
                    {siteSettings.address}
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    {siteSettings.subDistrict}, {siteSettings.city} ({siteSettings.postalCode})
                  </p>
                  <p className="text-emerald-400 font-semibold mt-1">
                    (Barat Lapangan Bola Ngangkruk)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 pt-3 border-t border-white/10">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Layanan Warga: Setiap Hari 08.00 - 21.00 WIB</span>
              </div>
            </div>

            {/* Direct Contacts Card */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-white border-l-4 border-amber-400 pl-3">
                Kontak Cepat & Media Sosial
              </h3>

              <div className="space-y-3">
                <a
                  href={`https://instagram.com/${siteSettings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-emerald-400" />
                    <span>Instagram: {siteSettings.instagram}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 flex">
            <div className="w-full min-h-[350px] lg:min-h-full rounded-2xl overflow-hidden border border-white/10 shadow-xl relative bg-slate-900">
              <iframe
                title="Peta Lokasi Karang Taruna Nawasena GSI Ngangkruk"
                src={siteSettings.mapsEmbedUrl}
                className="w-full h-full min-h-[380px] border-0 filter contrast-105"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-300">Graha Selokaton Indah (GSI)</p>
                  <p className="text-[11px] text-slate-400">Barat Lapangan Bola Ngangkruk, Selokaton</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Selokaton+Gondangrejo+Karanganyar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Buka Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
