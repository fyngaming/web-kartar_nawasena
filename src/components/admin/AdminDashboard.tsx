import React, { useState } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  FileText,
  Calendar,
  Image,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Check,
  X,
  Building2,
  Sparkles,
  Layers,
  BarChart3,
  ClipboardList,
  Wallet
} from 'lucide-react';
import { NewsTab } from './tabs/NewsTab';
import { ProgramsTab } from './tabs/ProgramsTab';
import { AgendaTab } from './tabs/AgendaTab';
import { GalleryTab } from './tabs/GalleryTab';
import { BoardTab } from './tabs/BoardTab';
import { MembersTab } from './tabs/MembersTab';
import { FeedbacksTab } from './tabs/FeedbacksTab';
import { FAQTab } from './tabs/FAQTab';
import { NotulensiTab } from './tabs/NotulensiTab';
import { BendaharaTab } from './tabs/BendaharaTab';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setIsAdminMode,
    currentUser,
    setCurrentUser,
    siteSettings,
    updateSiteSettings,
    members,
    registrations,
    approveRegistration,
    rejectRegistration,
    updateMember,
    deleteRegistration,
    programs,
    agenda,
    gallery,
    board,
    feedbacks,
    resetToDefaultData
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
  };

  // ── Role-based access control ─────────────────────────────────────────────
  const role = currentUser?.role || 'Editor';
  const isSecretary = role === 'Editor' || (currentUser?.name || '').toLowerCase().includes('sekretaris');
  const isTreasurer = role === 'Bendahara' || (currentUser?.name || '').toLowerCase().includes('bendahara');
  const isSuperAdmin = role === 'Super Admin';
  const isAdmin = role === 'Admin' || isSuperAdmin;

  // Tab yang boleh diakses setiap role
  const ADMIN_TABS: AdminTab[] = [
    'dashboard', 'registrations', 'members', 'news', 'programs',
    'agenda', 'gallery', 'board', 'notulensi', 'bendahara', 'feedbacks', 'faqs', 'settings'
  ];
  const allowedTabs = ADMIN_TABS;

  React.useEffect(() => {
    if (!allowedTabs.includes(adminTab)) {
      setAdminTab('dashboard');
    }
  }, [allowedTabs, adminTab]);

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan CMS', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'registrations',
      label: 'Verifikasi Pendaftar',
      icon: <UserCheck className="w-4 h-4" />,
      badge: registrations.filter(r => r.status === 'Menunggu Verifikasi').length
    },
    { id: 'members', label: 'Data Anggota', icon: <Users className="w-4 h-4" />, badge: members.length },
    { id: 'notulensi', label: 'Notulensi Rapat (Sekretaris)', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'bendahara', label: 'Keuangan & Kas (Bendahara)', icon: <Wallet className="w-4 h-4" /> },
    { id: 'news', label: 'Berita & Pengumuman', icon: <FileText className="w-4 h-4" /> },
    { id: 'programs', label: 'Program Kerja', icon: <Layers className="w-4 h-4" /> },
    { id: 'agenda', label: 'Agenda & Event', icon: <Calendar className="w-4 h-4" /> },
    { id: 'gallery', label: 'Galeri Media', icon: <Image className="w-4 h-4" /> },
    { id: 'board', label: 'Struktur Pengurus', icon: <Building2 className="w-4 h-4" /> },
    {
      id: 'feedbacks',
      label: 'Pesan & Aspirasi',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: feedbacks.filter(f => f.status === 'Belum Dibaca').length
    },
    { id: 'faqs', label: 'FAQ System', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan Organisasi', icon: <Settings className="w-4 h-4" /> }
  ] as Array<{ id: AdminTab; label: string; icon: React.ReactNode; badge?: number }>;
  const filteredNavItems = navItems.filter(item => allowedTabs.includes(item.id));

  return (
    <div className="min-h-screen bg-[#022c22] text-slate-100 flex flex-col pt-16">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Admin Top Banner / Navbar */}
      <div className="relative z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTAL CMS ADMINISTRATOR</span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">
            Karang Taruna Nawasena — GSI Ngangkruk
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* user name hidden by request */}

          <button
            onClick={() => setIsAdminMode(false)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-200 transition-colors"
          >
            Lihat Mode Publik
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main CMS Workspace Layout */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          {/* Role badge */}
          {isSecretary && (
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 mb-2">
              <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Login sebagai Sekretaris
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Akses terbatas: hanya pengelolaan Notulensi Rapat.
              </p>
            </div>
          )}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
              Menu Pengelolaan CMS
            </p>
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    adminTab === item.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        adminTab === item.id
                          ? 'bg-slate-950 text-amber-300'
                          : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Reset Master Data removed by request */}
        </aside>

        {/* CMS Main Content Area */}
        <main className="lg:col-span-9">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {adminTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
                <h2 className="text-xl font-extrabold text-white">Ringkasan Karang Taruna CMS</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Selamat datang kembali, {currentUser?.name || 'Pengurus'}. Kelola portal Karang Taruna Nawasena GSI secara real-time.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <p className="text-xs text-slate-400 font-semibold">Total Anggota</p>
                  <p className="text-2xl font-extrabold text-amber-400 mt-1">{members.length}</p>
                  <span className="text-[10px] text-emerald-400">Aktif & Terverifikasi</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <p className="text-xs text-slate-400 font-semibold">Pending Verifikasi</p>
                  <p className="text-2xl font-extrabold text-amber-300 mt-1">
                    {registrations.filter(r => r.status === 'Menunggu Verifikasi').length}
                  </p>
                  <span className="text-[10px] text-amber-400">Perlu Peninjauan</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <p className="text-xs text-slate-400 font-semibold">Program Kerja</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{programs.length}</p>
                  <span className="text-[10px] text-slate-300">Terencana & Berjalan</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <p className="text-xs text-slate-400 font-semibold">Aspirasi Baru</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                    {feedbacks.filter(f => f.status === 'Belum Dibaca').length}
                  </p>
                  <span className="text-[10px] text-emerald-300">Pesan Warga</span>
                </div>
              </div>

              {/* Recent Registrations Quick Table */}
              <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-400 pl-3">
                    Pendaftar Anggota Baru Terbaru
                  </h3>
                  <button
                    onClick={() => setAdminTab('registrations')}
                    className="text-xs text-amber-300 hover:underline font-semibold"
                  >
                    Kelola Semua →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-200">
                    <thead className="bg-white/10 text-slate-300 uppercase text-[10px]">
                      <tr>
                        <th className="p-3 rounded-l-lg">ID / Tanggal</th>
                        <th className="p-3">Nama Lengkap</th>
                        <th className="p-3">RT / RW</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-lg text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {registrations.slice(0, 5).map(reg => (
                        <tr key={reg.id} className="hover:bg-white/5">
                          <td className="p-3 font-mono font-bold text-amber-300">{reg.id}</td>
                          <td className="p-3 font-semibold text-white">{reg.fullName}</td>
                          <td className="p-3 text-slate-300">{reg.rtRw}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                reg.status === 'Diterima'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : reg.status === 'Ditolak'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {reg.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {reg.status === 'Menunggu Verifikasi' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => approveRegistration(reg.id)}
                                  className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40"
                                  title="Setujui"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setRejectingId(reg.id)}
                                  className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40"
                                  title="Tolak"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTRATIONS VERIFICATION */}
          {adminTab === 'registrations' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Verifikasi Pendaftaran Anggota</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Verifikasi dan setujui calon anggota Karang Taruna Nawasena GSI Ngangkruk.
                  </p>
                </div>
              </div>

              {/* Registrations List */}
              <div className="space-y-4">
                {registrations.map(reg => (
                  <div
                    key={reg.id}
                    className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {reg.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            reg.status === 'Diterima'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : reg.status === 'Ditolak'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{reg.fullName}</h3>
                      <p className="text-xs text-slate-300">
                        {reg.gender} • RT/RW {reg.rtRw} • WA: {reg.whatsapp}
                      </p>
                      <p className="text-xs text-slate-400 italic">"{reg.motivation}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {reg.status === 'Menunggu Verifikasi' && (
                        <>
                          <button
                            onClick={() => approveRegistration(reg.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                          >
                            <Check className="w-4 h-4" />
                            <span>Setujui</span>
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Masukkan alasan penolakan pendaftaran:');
                              if (reason) rejectRegistration(reg.id, reason);
                            }}
                            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pendaftaran ${reg.fullName} dan anggota terkait (jika ada)?`)) {
                              deleteRegistration(reg.id);
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold"
                        >
                          Hapus
                        </button>

                        {reg.status === 'Diterima' && (
                          <>
                            <button
                              onClick={() => {
                                // toggle member active/inactive
                                if (!reg.memberId) return;
                                const member = members.find(m => m.id === reg.memberId);
                                if (!member) return;
                                const newStatus = member.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
                                if (confirm(`Ubah status anggota ${member.fullName} menjadi ${newStatus}?`)) {
                                  updateMember(member.id, { status: newStatus });
                                }
                              }}
                              className="px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold"
                            >
                              Toggle Aktif
                            </button>
                          </>
                        )}
                      </div>
                      {reg.status === 'Diterima' && (
                        <span className="text-xs font-bold text-emerald-400">
                          NIA: {reg.memberId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERS */}
          {adminTab === 'members' && <MembersTab />}

          {/* TAB 4: NEWS */}
          {adminTab === 'news' && <NewsTab />}

          {/* TAB 5: PROGRAMS */}
          {adminTab === 'programs' && <ProgramsTab />}

          {/* TAB 6: AGENDA */}
          {adminTab === 'agenda' && <AgendaTab />}

          {/* TAB 7: GALLERY */}
          {adminTab === 'gallery' && <GalleryTab />}

          {/* TAB 8: BOARD / STRUKTUR PENGURUS */}
          {adminTab === 'board' && <BoardTab />}

          {/* TAB 9: NOTULENSI (SEKRETARIS) */}
          {adminTab === 'notulensi' && <NotulensiTab />}

          {/* TAB 10: BENDAHARA (KEUANGAN & KAS) */}
          {adminTab === 'bendahara' && <BendaharaTab />}

          {/* TAB 11: FEEDBACKS / ASPIRASI */}
          {adminTab === 'feedbacks' && <FeedbacksTab />}

          {/* TAB 12: FAQ MANAGEMENT */}
          {adminTab === 'faqs' && <FAQTab />}

          {/* OTHER TABS - settings */}
          {adminTab === 'settings' && (
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 text-center space-y-4">
              <h2 className="text-xl font-extrabold text-white capitalize">
                Kelola Modul: {adminTab}
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Modul ini tersedia dan terintegrasi dengan database lokal.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
