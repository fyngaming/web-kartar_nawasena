import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, KeyRound, AlertCircle, LogIn, User } from 'lucide-react';

const AUTH_CREDENTIALS: Record<string, { password: string; role: 'Admin' | 'Editor' | 'Bendahara' }> = {
  adminKartarNawasenaGsI: { password: 'AdminGanteng_$123', role: 'Admin' },
  SekreKartar_Nawasena: { password: 'Sekre_josjisPol*', role: 'Editor' },
  BendaharaKartar_Nawasena: { password: 'DoBayarOKasGokss', role: 'Bendahara' }
};

export const AdminLoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { users, setCurrentUser, setIsAdminMode } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = username.trim();
    const auth = AUTH_CREDENTIALS[normalized];
    const foundUser = users.find(u => u.username?.toLowerCase() === normalized.toLowerCase());

    if (!auth || auth.password !== password) {
      setError('Username atau password tidak valid. Coba lagi dengan kredensial yang benar.');
      return;
    }

    if (!foundUser) {
      setError('Pengguna tidak ditemukan. Pastikan username sudah terdaftar di sistem.');
      return;
    }

    setCurrentUser(foundUser);
    setIsAdminMode(true);
    setError('');
    setUsername('');
    setPassword('');
    onClose();
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/20 shadow-2xl backdrop-blur-2xl text-white">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-0.5 shadow-lg shadow-emerald-900/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">Portal Login Pengurus</h3>
          <p className="text-xs text-slate-300 mt-1">
            Masukkan username dan password Anda untuk mengakses dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username Pengurus
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kata Sandi / Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="off"
                className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[10px] font-semibold text-slate-400 hover:text-amber-400 transition-colors px-1 py-0.5 rounded"
              >
                {showPassword ? 'Tutup' : 'Lihat'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Dashboard Pengurus</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[10px] text-slate-500">
            Hanya pengurus resmi Karang Taruna Nawasena yang memiliki akses.
            <br />Hubungi admin jika Anda lupa kredensial.
          </p>
        </div>
      </div>
    </div>
  );
};

