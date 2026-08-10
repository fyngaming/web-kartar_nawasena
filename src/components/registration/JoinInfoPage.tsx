import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckSquare, UserPlus, ArrowRight, FileText, Award, Heart, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const JoinInfoPage: React.FC = () => {
  const { setActiveTab } = useApp();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Portal Keanggotaan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Bergabung Menjadi Anggota Nawasena
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Mari bersama-sama membangun pemuda Perum Graha Selokaton Indah (GSI) Ngangkruk yang aktif, kreatif, dan berintegritas.
          </p>
        </div>

        {/* Benefits Card */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl text-white p-8 mb-10 shadow-xl border border-emerald-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Manfaat Bergabung
            </span>
            <h2 className="text-2xl font-extrabold">Mengapa Bergabung dengan Karang Taruna Nawasena?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-slate-200">
                  Wadah pengembangan skill digital, kepemimpinan, dan manajemen event.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-slate-200">
                  Mempererat relasi kekeluargaan antar warga pemuda di komplek perumahan GSI.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-slate-200">
                  Kesempatan mengikuti pelatihan UMKM, olahraga rutin, dan bakti sosial.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-slate-200">
                  Mendapatkan ID Card Resmi Anggota & Sertifikat Kepengurusan Organisasi.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Persyaratan & Dokumen */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Persyaratan & Dokumen</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">Persyaratan Anggota:</span>
                <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>• Berdomisili di Perum Graha Selokaton Indah (GSI) RW 12 Ngangkruk.</li>
                  <li>• Usia produktif 13 s/d 45 tahun.</li>
                  <li>• Bersedia aktif mengikuti kegiatan kepemudaan.</li>
                  <li>• Mengisi data pendaftaran dengan jujur dan benar.</li>
                  <li>• Menjunjung tinggi nilai gotong royong dan kebersamaan.</li>
                </ul>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">Dokumen yang Disiapkan:</span>
                <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>• Pasfoto Diri (File Gambar).</li>
                  <li>• KTP / Kartu Pelajar (Opsional).</li>
                  <li>• Nomor WhatsApp Aktif.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hak & Kewajiban */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>Hak & Kewajiban Anggota</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Hak Anggota:</span>
                <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>• Mengikuti seluruh program dan kegiatan organisasi.</li>
                  <li>• Berhak menyampaikan pendapat dalam musyawarah.</li>
                  <li>• Mengembangkan bakat, minat, dan potensi kewirausahaan.</li>
                  <li>• Memperoleh informasi perkembangan organisasi.</li>
                </ul>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Kewajiban Anggota:</span>
                <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>• Menjaga nama baik Karang Taruna Nawasena & lingkungan Perum GSI.</li>
                  <li>• Berpartisipasi aktif sesuai divisi dan minat yang dipilih.</li>
                  <li>• Mematuhi Anggaran Dasar & Anggaran Rumah Tangga (AD/ART).</li>
                  <li>• Menghormati seluruh jajaran pengurus dan antar sesama warga.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Note */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs mb-8 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Ketentuan Verifikasi Pendaftaran:</span>
            <p className="mt-0.5 leading-relaxed">
              Seluruh data calon anggota akan diverifikasi secara teliti oleh Pengurus Karang Taruna Nawasena sebelum diterbitkan Nomor Anggota Resmi. Pendaftaran 100% Bebas Biaya (Gratis).
            </p>
          </div>
        </div>

        {/* Checkbox Gate & Proceed Action */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-md text-center space-y-6">
          <label className="flex items-center justify-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Saya telah membaca dan menyetujui seluruh syarat dan ketentuan di atas.
            </span>
          </label>

          <div>
            <button
              disabled={!agreed}
              onClick={() => {
                setActiveTab('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 mx-auto ${
                agreed
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-emerald-700/30 hover:scale-105'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Lanjutkan Pendaftaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!agreed && (
              <p className="text-[11px] text-slate-400 mt-2">
                *Centang persetujuan di atas untuk mengaktifkan tombol pendaftaran.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
