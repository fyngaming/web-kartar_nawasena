import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUpload } from '../admin/tabs/ImageUpload';
import { RegistrationData } from '../../types';
import { UserPlus, CheckCircle2, Copy, Search, Upload, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const RegistrationForm: React.FC = () => {
  const { addRegistration, setActiveTab } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    pob: 'Karanganyar',
    dob: '2005-01-01',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    address: 'Perum Graha Selokaton Indah (GSI) Ngangkruk',
    rtRw: 'RT 04 / RW 15',
    whatsapp: '',
    email: '',
    education: 'SMA / S1 Sederajat',
    occupation: 'Mahasiswa / Karyawan',
    interests: ['Sosial', 'Olahraga'],
    motivation: '',
    orgExperience: '',
    photoFileName: '',
    docFileName: '',
    photo: ''
  });

  const availableInterests = [
    'Sosial',
    'Olahraga',
    'Multimedia',
    'Lingkungan',
    'Keagamaan',
    'UMKM',
    'Event Organizer'
  ];

  const [submittedResult, setSubmittedResult] = useState<RegistrationData | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  // photo will be a compressed data URL (handled by ImageUpload)
  const handlePhotoUpload = (value: string) => {
    setFormData(prev => ({ ...prev, photo: value, photoFileName: value ? 'uploaded' : '' }));
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, docFileName: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created = addRegistration({
      fullName: formData.fullName,
      pob: formData.pob,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      rtRw: formData.rtRw,
      whatsapp: formData.whatsapp,
      email: formData.email,
      education: formData.education,
      occupation: formData.occupation,
      interests: formData.interests,
      motivation: formData.motivation,
      orgExperience: formData.orgExperience,
      photoUrl: formData.photo || undefined,
      documentUrl: formData.docFileName ? `Dokumen: ${formData.docFileName}` : undefined
    });

    setSubmittedResult(created);
  };

  const handleCopyId = () => {
    if (submittedResult) {
      navigator.clipboard.writeText(submittedResult.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submittedResult ? (
          /* Success Screen */
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto animate-fadeIn space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Pendaftaran Berhasil Dikirim
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                Terima kasih, {submittedResult.fullName}!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Formulir pendaftaran Anda telah berhasil tercatat dalam sistem database Karang Taruna Nawasena.
              </p>
            </div>

            {/* Reg Number Box */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Nomor Registrasi Anda:
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-wider">
                  {submittedResult.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                  title="Salin Nomor Registrasi"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-400 font-semibold">Tersalin ke clipboard!</p>}
              <p className="text-[11px] text-slate-400">
                Simpan nomor ini untuk mengecek status pendaftaran Anda kapan saja.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
              <p><span className="font-bold">Status Awal:</span> <span className="text-amber-600 dark:text-amber-400 font-bold">Menunggu Verifikasi Pengurus</span></p>
              <p><span className="font-bold">Waktu Pengajuan:</span> {submittedResult.appliedAt}</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setActiveTab('check-status');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Cek Status Sekarang</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Formulir Pendaftaran
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
                Isi Data Pendaftaran Anggota
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Harap melengkapi data pribadi, latar belakang, dan minat Anda secara akurat.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-10 space-y-8">
              {/* Section 1: Data Pribadi */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-emerald-600 pl-3">
                  1. Data Pribadi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap sesuai KTP"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Tempat Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Karanganyar / Surakarta"
                      value={formData.pob}
                      onChange={e => setFormData({ ...formData, pob: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Alamat Domisili Perumahan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Perum GSI Blok C No. 15, Ngangkruk"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      RT / RW <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="RT 03 / RW 15"
                      value={formData.rtRw}
                      onChange={e => setFormData({ ...formData, rtRw: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08123456789"
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Email Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pendidikan & Pekerjaan */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
                  2. Pendidikan & Pekerjaan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Pendidikan Terakhir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="SMA / SMK / D3 / S1 / S2"
                      value={formData.education}
                      onChange={e => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                      Pekerjaan Saat Ini <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Pelajar / Mahasiswa / Swasta / Wirausaha"
                      value={formData.occupation}
                      onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Minat & Divisi */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-emerald-600 pl-3">
                  3. Minat Divisi Organisasi <span className="text-slate-400 text-xs font-normal">(Bisa pilih lebih dari satu)</span>
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {availableInterests.map(interest => {
                    const isSelected = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Motivasi & Pengalaman */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
                  4. Motivasi & Pengalaman
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                    Mengapa Anda Ingin Bergabung dengan Nawasena? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tuliskan motivasi dan kontribusi yang ingin Anda berikan..."
                    value={formData.motivation}
                    onChange={e => setFormData({ ...formData, motivation: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-1.5">
                    Pengalaman Organisasi Sebelumnya <span className="text-slate-400 text-xs font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan pengalaman organisasi di sekolah, kampus, atau lingkungan warga..."
                    value={formData.orgExperience}
                    onChange={e => setFormData({ ...formData, orgExperience: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Section 5: Upload File Dokumen */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-emerald-600 pl-3">
                  5. Upload Dokumen Pendukung
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Foto Diri */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <ImageUpload
                      value={formData.photo}
                      onChange={handlePhotoUpload}
                      label="Pasfoto Diri"
                      previewClass="h-36"
                      required
                    />
                  </div>

                  {/* Dokumen Pendukung */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center">
                    <Upload className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Upload KTP / Kartu Pelajar</span>
                    <span className="text-[11px] text-slate-500 block mb-3">Format PDF/JPG (Opsional)</span>
                    <label className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer inline-block transition-colors">
                      Pilih Dokumen
                      <input type="file" accept="image/*,.pdf" onChange={handleDocUpload} className="hidden" />
                    </label>
                    {formData.docFileName && (
                      <p className="text-xs text-amber-600 font-semibold mt-2">✓ {formData.docFileName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-700/30 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5 text-amber-300" />
                  <span>Kirim Pendaftaran Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
