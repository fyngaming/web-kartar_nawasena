import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, KeyRound, AlertCircle, LogIn } from 'lucide-react';

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
    onClose();
  };

  const handleQuickDemo = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword(AUTH_CREDENTIALS[demoUsername]?.password || '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/20 shadow-2xl backdrop-blur-2xl text-white">
        <button
          onClick={onClose}
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
            Masuk dengan username dan password Pengurus
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
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="adminKartarNawasenaGsI"
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
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
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

        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[11px] font-semibold text-amber-300 text-center uppercase tracking-wider mb-2">
            Akses Cepat (Demo)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('adminKartarNawasenaGsI')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-200 text-left transition-colors"
            >
              <span className="font-bold block text-emerald-400">Admin</span>
              <span className="text-[10px] text-slate-400">adminKartarNawasenaGsI</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('SekreKartar_Nawasena')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-200 text-left transition-colors"
            >
              <span className="font-bold block text-amber-400">Sekretaris</span>
              <span className="text-[10px] text-slate-400">SekreKartar_Nawasena</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('BendaharaKartar_Nawasena')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-200 text-left transition-colors"
            >
              <span className="font-bold block text-emerald-300">Bendahara</span>
              <span className="text-[10px] text-slate-400">BendaharaKartar_Nawasena</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
