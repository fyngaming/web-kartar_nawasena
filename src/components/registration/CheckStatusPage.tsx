import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegistrationData } from '../../types';
import { Logo } from '../common/Logo';
import { Search, CheckCircle2, Clock, AlertCircle, XCircle, CreditCard, User, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';

export const CheckStatusPage: React.FC = () => {
  const { registrations, members } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<RegistrationData | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toLowerCase();

    const found = registrations.find(
      r =>
        r.id.toLowerCase() === trimmed ||
        r.email.toLowerCase() === trimmed ||
        r.whatsapp.replace(/[^0-9]/g, '').includes(trimmed.replace(/[^0-9]/g, ''))
    );

    setResult(found || null);
    setSearched(true);
  };

  const matchedMember = result?.memberId
    ? members.find(m => m.id === result.memberId)
    : undefined;

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Pelacakan Mandiri
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Cek Status Pendaftaran Anggota
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Masukkan Nomor Registrasi (contoh: KT-2026-0001), Email, atau Nomor WhatsApp yang Anda daftarkan.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-8 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Nomor Registrasi (KT-2026-XXXX) / Email / No. WA"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Cari Status</span>
            </button>
          </form>
        </div>

        {/* Search Result Output */}
        {searched && (
          <div className="animate-fadeIn">
            {result ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
                {/* Result Header Banner */}
                <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                      Nomor Registrasi:
                    </span>
                    <h2 className="text-2xl font-black font-mono tracking-wider text-white">
                      {result.id}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Didaftarkan pada: {result.appliedAt}</p>
                  </div>

                  <div>
                    {result.status === 'Menunggu Verifikasi' && (
                      <span className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                        Menunggu Verifikasi
                      </span>
                    )}
                    {result.status === 'Diproses' && (
                      <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-blue-400" />
                        Sedang Diproses Pengurus
                      </span>
                    )}
                    {result.status === 'Diterima' && (
                      <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Diterima Menjadi Anggota
                      </span>
                    )}
                    {result.status === 'Ditolak' && (
                      <span className="px-4 py-2 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-red-400" />
                        Pendaftaran Ditolak
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Stepper */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1">
                        1
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Dikirim</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                        result.status !== 'Menunggu Verifikasi' ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}>
                        2
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Verifikasi</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                        result.status === 'Diterima' ? 'bg-emerald-600 text-white' : result.status === 'Ditolak' ? 'bg-red-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}>
                        3
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Keputusan</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                        result.status === 'Diterima' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}>
                        4
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">KTA Digital</span>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Rejection Alert If Rejected */}
                  {result.status === 'Ditolak' && (
                    <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 space-y-2">
                      <h4 className="font-bold flex items-center gap-2 text-sm">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>Alasan Penolakan dari Pengurus:</span>
                      </h4>
                      <p className="text-xs sm:text-sm bg-white dark:bg-slate-900 p-3 rounded-xl border border-red-200 dark:border-red-900/40">
                        {result.rejectionReason || 'Tidak memenuhi kriteria domisili atau persyaratan organisasi.'}
                      </p>
                    </div>
                  )}

                  {/* Digital Member Card If Accepted */}
                  {result.status === 'Diterima' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Kartu Tanda Anggota (KTA) Digital Nawasena</span>
                      </h4>

                      {/* Card Graphic */}
                      <div className="max-w-md mx-auto rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-950 text-white p-6 shadow-2xl border-2 border-amber-400/60 relative overflow-hidden">
                        <div className="flex items-center justify-between pb-4 border-b border-emerald-700/60">
                          <Logo size="sm" showText={false} />
                          <div className="text-right">
                            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold block">
                              Kartu Tanda Anggota
                            </span>
                            <span className="text-xs font-extrabold text-white">
                              Karang Taruna Nawasena
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center gap-4">
                          <img
                            src={matchedMember?.avatar || result.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                            alt={result.fullName}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                          />
                          <div className="space-y-1 text-left">
                            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-400 text-slate-950 inline-block font-mono">
                              Nomer Anggota: {result.memberId || 'NAW-2026-001'}
                            </span>
                            <h3 className="text-base font-extrabold leading-tight text-white">{result.fullName}</h3>
                            <p className="text-[11px] text-emerald-200">{result.address}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-[10px] text-slate-300">
                          <span>Status: Anggota Aktif</span>
                          <span>Perum GSI Ngangkruk, Karanganyar</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registered Details Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block font-medium">Nama Lengkap:</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{result.fullName}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block font-medium">Alamat & RT/RW:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{result.address} ({result.rtRw})</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block font-medium">Kontak WA / Email:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{result.whatsapp} / {result.email}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400 block font-medium">Minat Divisi:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.interests.map(i => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Data Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Nomor registrasi, email, atau WhatsApp "<span className="font-bold text-slate-700 dark:text-slate-200">{query}</span>" tidak ditemukan dalam database pendaftaran. Mohon periksa kembali penulisan Anda.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
