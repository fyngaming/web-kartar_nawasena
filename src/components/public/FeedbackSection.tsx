import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, MessageSquare, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

export const FeedbackSection: React.FC = () => {
  const { addFeedback } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    category: 'Saran' as 'Kritik' | 'Saran' | 'Pertanyaan',
    message: ''
  });

  // Simple CAPTCHA logic
  const [captchaNum1, setCaptchaNum1] = useState(() => Math.floor(Math.random() * 8) + 1);
  const [captchaNum2, setCaptchaNum2] = useState(() => Math.floor(Math.random() * 8) + 1);
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 1);
    setUserCaptcha('');
    setCaptchaError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError(false);

    const expectedAnswer = captchaNum1 + captchaNum2;
    if (parseInt(userCaptcha.trim(), 10) !== expectedAnswer) {
      setCaptchaError(true);
      return;
    }

    addFeedback({
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp || undefined,
      category: formData.category,
      message: formData.message
    });

    setIsSuccess(true);
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      category: 'Saran',
      message: ''
    });
    setUserCaptcha('');
    refreshCaptcha();
  };

  return (
    <section className="py-20 bg-[#022c22] text-slate-100 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Aspirasi Warga
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Kritik, Saran, & Masukan
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Sampaikan gagasan, pesan, atau masukan membangun untuk kemajuan Karang Taruna Nawasena dan lingkungan Perum GSI Ngangkruk.
          </p>
        </div>

        {/* Feedback Card Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl p-6 sm:p-10">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Pesan Berhasil Terkirim!
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Terima kasih telah memberikan masukan bernilai. Pesan Anda telah diteruskan langsung ke kotak masuk Pengurus Karang Taruna Nawasena.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
              >
                Kirim Pesan Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama Anda"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Email Aktif <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contoh@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* WhatsApp Optional */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Nomor WhatsApp <span className="text-slate-500 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Kategori Pesan <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Saran" className="bg-slate-900">Saran Pembangunan</option>
                    <option value="Kritik" className="bg-slate-900">Kritik Konstruktif</option>
                    <option value="Pertanyaan" className="bg-slate-900">Pertanyaan Umum</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Isi Pesan / Masukan <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan masukan atau pertanyaan Anda secara jelas..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* CAPTCHA Protection */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200">Verifikasi Keamanan CAPTCHA:</span>
                    <p className="text-xs text-slate-400">
                      Berapakah hasil dari <span className="font-extrabold text-amber-400 text-sm mx-1">{captchaNum1} + {captchaNum2}</span> = ?
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    placeholder="Jawaban"
                    value={userCaptcha}
                    onChange={e => setUserCaptcha(e.target.value)}
                    className="w-24 px-3 py-1.5 text-xs font-bold rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-emerald-500 text-center"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Acak Pertanyaan"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {captchaError && (
                <p className="text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  ❌ Jawaban verifikasi CAPTCHA belum tepat. Silakan hitung kembali!
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Aspirasi Sekarang</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
