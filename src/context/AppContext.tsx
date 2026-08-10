import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SiteSettings, MemberData, RegistrationData, NewsItem, ProgramItem,
  AgendaItem, GalleryItem, BoardMember, AchievementItem, FeedbackItem,
  FAQItem, SponsorItem, UserAccount, UserRole, MeetingMinutes, FinancialTransaction
} from '../types';
import {
  initialSiteSettings, initialAdminUsers, initialFAQs,
  initialNews, initialPrograms, initialAgenda, initialGallery,
  initialBoardMembers, initialAchievements
} from '../data/initialData';
import * as svc from '../lib/supabaseService';
import { supabase } from '../lib/supabase';

// ─── Tab types ────────────────────────────────────────────────────────────────
export type PublicTab =
  | 'home' | 'tentang' | 'program' | 'berita' | 'agenda'
  | 'galeri' | 'struktur' | 'prestasi' | 'faq' | 'kontak'
  | 'join-info' | 'register' | 'check-status';

export type AdminTab =
  | 'dashboard' | 'registrations' | 'members' | 'news' | 'programs'
  | 'agenda' | 'gallery' | 'board' | 'feedbacks' | 'faqs'
  | 'achievements' | 'sponsors' | 'users' | 'settings' | 'notulensi' | 'bendahara';

// ─── Context type ─────────────────────────────────────────────────────────────
interface AppContextType {
  activeTab: PublicTab;
  setActiveTab: (tab: PublicTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  isAdminMode: boolean;
  setIsAdminMode: (v: boolean) => void;
  currentUser: UserAccount | null;
  setCurrentUser: (u: UserAccount | null) => void;
  loading: boolean;

  siteSettings: SiteSettings;
  updateSiteSettings: (s: Partial<SiteSettings>) => void;
  members: MemberData[];
  registrations: RegistrationData[];
  news: NewsItem[];
  programs: ProgramItem[];
  agenda: AgendaItem[];
  gallery: GalleryItem[];
  board: BoardMember[];
  achievements: AchievementItem[];
  feedbacks: FeedbackItem[];
  faqs: FAQItem[];
  sponsors: SponsorItem[];
  users: UserAccount[];
  meetingMinutes: MeetingMinutes[];
  transactions: import('../types').FinancialTransaction[];

  addRegistration: (reg: Omit<RegistrationData, 'id' | 'status' | 'appliedAt'>) => RegistrationData;
  approveRegistration: (id: string) => void;
  rejectRegistration: (id: string, reason: string) => void;

  addMember: (member: Omit<MemberData, 'id'>) => void;
  updateMember: (id: string, data: Partial<MemberData>) => void;
  deleteMember: (id: string) => void;

  addNews: (item: Omit<NewsItem, 'id' | 'slug' | 'views'>) => void;
  updateNews: (id: string, data: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  addProgram: (item: Omit<ProgramItem, 'id'>) => void;
  updateProgram: (id: string, data: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;

  addAgenda: (item: Omit<AgendaItem, 'id'>) => void;
  updateAgenda: (id: string, data: Partial<AgendaItem>) => void;
  deleteAgenda: (id: string) => void;

  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  addBoardMember: (member: Omit<BoardMember, 'id'>) => void;
  updateBoardMember: (id: string, data: Partial<BoardMember>) => void;
  deleteBoardMember: (id: string) => void;

  addFeedback: (fb: Omit<FeedbackItem, 'id' | 'status' | 'submittedAt'>) => void;
  replyFeedback: (id: string, replyText: string) => void;
  deleteFeedback: (id: string) => void;

  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, data: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  addAchievement: (ach: Omit<AchievementItem, 'id'>) => void;
  deleteAchievement: (id: string) => void;

  addSponsor: (sp: Omit<SponsorItem, 'id'>) => void;
  deleteSponsor: (id: string) => void;

  addUser: (usr: Omit<UserAccount, 'id'>) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  deleteUser: (id: string) => void;

  addMeetingMinutes: (m: Omit<MeetingMinutes, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMeetingMinutes: (id: string, data: Partial<MeetingMinutes>) => void;
  deleteMeetingMinutes: (id: string) => void;

  addTransaction: (t: Omit<import('../types').FinancialTransaction, 'id' | 'createdAt'>) => void;
  deleteRegistration: (id: string) => void;

  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Helper: generate ID ──────────────────────────────────────────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const nowStr = () => new Date().toISOString().replace('T', ' ').slice(0, 16);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<PublicTab>('home');
  const [adminTab, setAdminTab]   = useState<AdminTab>('dashboard');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading]     = useState(true);

  // ── State ──────────────────────────────────────────────────────────────────
  const [siteSettings,  setSiteSettings]  = useState<SiteSettings>(initialSiteSettings);
  const [members,       setMembers]       = useState<MemberData[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [news,          setNews]          = useState<NewsItem[]>([]);
  const [programs,      setPrograms]      = useState<ProgramItem[]>([]);
  const [agenda,        setAgenda]        = useState<AgendaItem[]>([]);
  const [gallery,       setGallery]       = useState<GalleryItem[]>([]);
  const [board,         setBoard]         = useState<BoardMember[]>([]);
  const [achievements,  setAchievements]  = useState<AchievementItem[]>([]);
  const [feedbacks,     setFeedbacks]     = useState<FeedbackItem[]>([]);
  const [faqs,          setFaqs]          = useState<FAQItem[]>([]);
  const [sponsors,      setSponsors]      = useState<SponsorItem[]>([]);
  const [users,         setUsers]         = useState<UserAccount[]>(initialAdminUsers);
  const [meetingMinutes,setMeetingMinutes]= useState<MeetingMinutes[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);

  // ── Load semua data dari Supabase saat pertama mount ──────────────────────
  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      setLoading(true);
      try {
        const [
          settings, newsData, programsData, agendaData, galleryData,
          boardData, membersData, regsData, feedbacksData, faqsData,
          minutesData, achievementsData, transactionsData
        ] = await Promise.all([
          svc.fetchSiteSettings(),
          svc.fetchNews(),
          svc.fetchPrograms(),
          svc.fetchAgenda(),
          svc.fetchGallery(),
          svc.fetchBoard(),
          svc.fetchMembers(),
          svc.fetchRegistrations(),
          svc.fetchFeedbacks(),
          svc.fetchFAQs(),
          svc.fetchMeetingMinutes(),
          svc.fetchAchievements(),
          svc.fetchTransactions(),
        ]);
        if (cancelled) return;
        console.log('[Supabase] Data loaded:', {
          news: newsData.length, programs: programsData.length,
          agenda: agendaData.length, gallery: galleryData.length,
          board: boardData.length, members: membersData.length
        });
        if (settings) setSiteSettings(settings as SiteSettings);
        setNews(newsData.length > 0 ? newsData : initialNews);
        setPrograms(programsData.length > 0 ? programsData : initialPrograms);
        setAgenda(agendaData.length > 0 ? agendaData : initialAgenda);
        setGallery(galleryData.length > 0 ? galleryData : initialGallery);
        setBoard(boardData.length > 0 ? boardData : initialBoardMembers);
        setMembers(membersData);
        setRegistrations(regsData);
        setFeedbacks(feedbacksData);
        setFaqs(faqsData.length > 0 ? faqsData : initialFAQs);
        setMeetingMinutes(minutesData);
        setTransactions(transactionsData || []);
        setAchievements(achievementsData.length > 0 ? achievementsData : initialAchievements);
      } catch (err) {
        console.error('[AppContext] Gagal load data dari Supabase:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAll();
    return () => { cancelled = true; };
  }, []);

  // Supabase realtime subscription for transactions (fallback to polling)
  useEffect(() => {
    let pollId: any = null;
    let channel: any = null;
    const setupRealtime = async () => {
      try {
        // v2 realtime channel
        // @ts-ignore
        if (supabase.channel) {
          // subscribe to all changes on transactions
          // @ts-ignore
          channel = supabase.channel('realtime-transactions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload: any) => {
              const ev = payload.eventType || payload.event;
              if (ev === 'INSERT' || ev === 'insert') {
                const r = payload.new || payload.record;
                const tx: FinancialTransaction = { id: r.id, memberId: r.member_id, amount: r.amount, type: r.type, note: r.note, createdAt: r.created_at };
                setTransactions(prev => [tx, ...prev.filter(x => x.id !== tx.id)]);
              } else if (ev === 'UPDATE' || ev === 'update') {
                const r = payload.new || payload.record;
                setTransactions(prev => prev.map(x => x.id === r.id ? { id: r.id, memberId: r.member_id, amount: r.amount, type: r.type, note: r.note, createdAt: r.created_at } : x));
              } else if (ev === 'DELETE' || ev === 'delete') {
                const r = payload.old || payload.record || payload;
                setTransactions(prev => prev.filter(x => x.id !== r.id));
              }
            }).subscribe();
        } else {
          throw new Error('no channel');
        }
      } catch (err) {
        console.warn('[AppContext] Realtime subscription failed, fallback to polling', err);
        pollId = setInterval(() => {
          svc.fetchTransactions().then(list => setTransactions(list)).catch(() => {});
        }, 5000);
      }
    };
    setupRealtime();
    return () => {
      if (pollId) clearInterval(pollId);
      try { if (channel && supabase.removeChannel) supabase.removeChannel(channel); } catch (e) {}
    };
  }, []);

  // ── Site Settings ──────────────────────────────────────────────────────────
  const updateSiteSettings = useCallback((s: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const next = { ...prev, ...s };
      svc.saveSiteSettings(next).catch(console.error);
      return next;
    });
  }, []);

  // ── Registrations ──────────────────────────────────────────────────────────
  const addRegistration = useCallback((data: Omit<RegistrationData, 'id' | 'status' | 'appliedAt'>): RegistrationData => {
    const year = new Date().getFullYear();
    const count = registrations.length + 1;
    const id = `KT-${year}-${String(count).padStart(4, '0')}`;
    const newReg: RegistrationData = { ...data, id, status: 'Menunggu Verifikasi', appliedAt: nowStr() };
    setRegistrations(prev => [newReg, ...prev]);
    svc.addRegistration(newReg).catch(console.error);
    return newReg;
  }, [registrations.length]);

  const approveRegistration = useCallback((id: string) => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;
    const year = new Date().getFullYear();
    const newMemberId = `NAW-${year}-${String(members.length + 1).padStart(3, '0')}`;
    const processedAt = nowStr();
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Diterima', memberId: newMemberId, processedAt } : r));
    svc.updateRegistration(id, { status: 'Diterima', memberId: newMemberId, processedAt }).catch(console.error);
    const newMember: MemberData = {
      id: newMemberId, registrationId: reg.id, fullName: reg.fullName, gender: reg.gender,
      address: reg.address, rtRw: reg.rtRw, whatsapp: reg.whatsapp, email: reg.email,
      interests: reg.interests, status: 'Aktif', joinedDate: new Date().toISOString().slice(0, 10),
      avatar: reg.photoUrl || ''
    };
    setMembers(prev => [newMember, ...prev]);
    svc.addMember(newMember, newMemberId).catch(console.error);
  }, [registrations, members.length]);

  const rejectRegistration = useCallback((id: string, reason: string) => {
    const processedAt = nowStr();
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Ditolak', rejectionReason: reason, processedAt } : r));
    svc.updateRegistration(id, { status: 'Ditolak', rejectionReason: reason, processedAt }).catch(console.error);
  }, []);

  // ── Members ────────────────────────────────────────────────────────────────
  const addMember = useCallback((member: Omit<MemberData, 'id'>) => {
    const id = `NAW-${new Date().getFullYear()}-${String(members.length + 1).padStart(3, '0')}`;
    const newMember = { ...member, id };
    setMembers(prev => [newMember, ...prev]);
    svc.addMember(newMember, id).catch(console.error);
  }, [members.length]);

  const updateMember = useCallback((id: string, data: Partial<MemberData>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    svc.updateMember(id, data).catch(console.error);
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    svc.deleteMember(id).catch(console.error);
  }, []);

  // ── News ───────────────────────────────────────────────────────────────────
  const addNews = useCallback((item: Omit<NewsItem, 'id' | 'slug' | 'views'>) => {
    const tempId = `news-${uid()}`;
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const optimistic: NewsItem = { ...item, id: tempId, slug, views: 0 };
    setNews(prev => [optimistic, ...prev]);
    svc.addNews(item).then(saved => {
      setNews(prev => prev.map(n => n.id === tempId ? saved : n));
    }).catch(console.error);
  }, []);

  const updateNews = useCallback((id: string, data: Partial<NewsItem>) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
    svc.updateNews(id, data).catch(console.error);
  }, []);

  const deleteNews = useCallback((id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
    svc.deleteNews(id).catch(console.error);
  }, []);

  // ── Programs ───────────────────────────────────────────────────────────────
  const addProgram = useCallback((item: Omit<ProgramItem, 'id'>) => {
    const tempId = `prog-${uid()}`;
    setPrograms(prev => [{ ...item, id: tempId }, ...prev]);
    svc.addProgram(item).then(saved => {
      setPrograms(prev => prev.map(p => p.id === tempId ? saved : p));
    }).catch(console.error);
  }, []);

  const updateProgram = useCallback((id: string, data: Partial<ProgramItem>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    svc.updateProgram(id, data).catch(console.error);
  }, []);

  const deleteProgram = useCallback((id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
    svc.deleteProgram(id).catch(console.error);
  }, []);

  // ── Agenda ─────────────────────────────────────────────────────────────────
  const addAgenda = useCallback((item: Omit<AgendaItem, 'id'>) => {
    const tempId = `agenda-${uid()}`;
    setAgenda(prev => [{ ...item, id: tempId }, ...prev]);
    svc.addAgenda(item).then(saved => {
      setAgenda(prev => prev.map(a => a.id === tempId ? saved : a));
      console.log('[Supabase] Agenda tersimpan:', saved.id);
    }).catch(err => {
      console.error('[Supabase] GAGAL simpan agenda:', err);
      // Rollback optimistic update jika gagal
      setAgenda(prev => prev.filter(a => a.id !== tempId));
      alert('Gagal menyimpan agenda ke database: ' + (err?.message || JSON.stringify(err)));
    });
  }, []);

  const updateAgenda = useCallback((id: string, data: Partial<AgendaItem>) => {
    setAgenda(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    svc.updateAgenda(id, data).catch(console.error);
  }, []);

  const deleteAgenda = useCallback((id: string) => {
    setAgenda(prev => prev.filter(a => a.id !== id));
    svc.deleteAgenda(id).catch(console.error);
  }, []);

  // ── Gallery ────────────────────────────────────────────────────────────────
  const addGalleryItem = useCallback((item: Omit<GalleryItem, 'id'>) => {
    const tempId = `gal-${uid()}`;
    setGallery(prev => [{ ...item, id: tempId }, ...prev]);
    svc.addGalleryItem(item).then(saved => {
      setGallery(prev => prev.map(g => g.id === tempId ? saved : g));
    }).catch(console.error);
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    svc.deleteGalleryItem(id).catch(console.error);
  }, []);

  // ── Board ──────────────────────────────────────────────────────────────────
  const addBoardMember = useCallback((member: Omit<BoardMember, 'id'>) => {
    const tempId = `board-${uid()}`;
    setBoard(prev => [{ ...member, id: tempId }, ...prev]);
    svc.addBoardMember(member).then(saved => {
      setBoard(prev => prev.map(b => b.id === tempId ? saved : b));
    }).catch(console.error);
  }, []);

  const updateBoardMember = useCallback((id: string, data: Partial<BoardMember>) => {
    setBoard(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    svc.updateBoardMember(id, data).catch(console.error);
  }, []);

  const deleteBoardMember = useCallback((id: string) => {
    setBoard(prev => prev.filter(b => b.id !== id));
    svc.deleteBoardMember(id).catch(console.error);
  }, []);

  // ── Feedbacks ──────────────────────────────────────────────────────────────
  const addFeedback = useCallback((fb: Omit<FeedbackItem, 'id' | 'status' | 'submittedAt'>) => {
    const tempId = `fb-${uid()}`;
    const optimistic: FeedbackItem = { ...fb, id: tempId, status: 'Belum Dibaca', submittedAt: nowStr() };
    setFeedbacks(prev => [optimistic, ...prev]);
    svc.addFeedback(fb).then(saved => {
      setFeedbacks(prev => prev.map(f => f.id === tempId ? saved : f));
    }).catch(console.error);
  }, []);

  const replyFeedback = useCallback((id: string, replyText: string) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'Dibalas', replyText, repliedAt: nowStr() } : f));
    svc.replyFeedback(id, replyText).catch(console.error);
  }, []);

  const deleteFeedback = useCallback((id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    svc.deleteFeedback(id).catch(console.error);
  }, []);

  // ── FAQs ───────────────────────────────────────────────────────────────────
  const addFAQ = useCallback((faq: Omit<FAQItem, 'id'>) => {
    const tempId = `faq-${uid()}`;
    setFaqs(prev => [{ ...faq, id: tempId }, ...prev]);
    svc.addFAQ(faq).then(saved => {
      setFaqs(prev => prev.map(f => f.id === tempId ? saved : f));
    }).catch(console.error);
  }, []);

  const updateFAQ = useCallback((id: string, data: Partial<FAQItem>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    svc.updateFAQ(id, data).catch(console.error);
  }, []);

  const deleteFAQ = useCallback((id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    svc.deleteFAQ(id).catch(console.error);
  }, []);

  // ── Achievements ───────────────────────────────────────────────────────────
  const addAchievement = useCallback((ach: Omit<AchievementItem, 'id'>) => {
    const id = `ach-${uid()}`;
    setAchievements(prev => [{ ...ach, id }, ...prev]);
  }, []);

  const deleteAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  }, []);

  // ── Sponsors (local only, tidak kritis) ───────────────────────────────────
  const addSponsor = useCallback((sp: Omit<SponsorItem, 'id'>) => {
    setSponsors(prev => [{ ...sp, id: `sp-${uid()}` }, ...prev]);
  }, []);

  const deleteSponsor = useCallback((id: string) => {
    setSponsors(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── Users (local only — admin accounts) ───────────────────────────────────
  const addUser = useCallback((usr: Omit<UserAccount, 'id'>) => {
    setUsers(prev => [{ ...usr, id: `usr-${uid()}` }, ...prev]);
  }, []);

  const updateUserRole = useCallback((id: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // ── Meeting Minutes ────────────────────────────────────────────────────────
  const addMeetingMinutes = useCallback((m: Omit<MeetingMinutes, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `minutes-${uid()}`;
    const ts = nowStr();
    const optimistic: MeetingMinutes = { ...m, id: tempId, createdAt: ts, updatedAt: ts };
    setMeetingMinutes(prev => [optimistic, ...prev]);
    svc.addMeetingMinutes(m).then(saved => {
      setMeetingMinutes(prev => prev.map(x => x.id === tempId ? saved : x));
    }).catch(console.error);
  }, []);

  const updateMeetingMinutes = useCallback((id: string, data: Partial<MeetingMinutes>) => {
    setMeetingMinutes(prev => prev.map(m => m.id === id ? { ...m, ...data, updatedAt: nowStr() } : m));
    svc.updateMeetingMinutes(id, data).catch(console.error);
  }, []);

  const deleteMeetingMinutes = useCallback((id: string) => {
    setMeetingMinutes(prev => prev.filter(m => m.id !== id));
    svc.deleteMeetingMinutes(id).catch(console.error);
  }, []);

  // ── Transactions (Bendahara) ─────────────────────────────────────────────
  const addTransaction = useCallback(async (t: Omit<FinancialTransaction, 'id' | 'createdAt'> & { createdAt?: string }) => {
    const tempId = `tx-temp-${uid()}`;
    const tx: FinancialTransaction = { ...t as any, id: tempId, createdAt: t.createdAt || nowStr() };
    setTransactions(prev => [tx, ...prev]);
    try {
      const saved = await svc.addTransaction({ memberId: t.memberId, amount: t.amount, type: t.type, note: t.note, createdAt: t.createdAt });
      setTransactions(prev => prev.map(x => x.id === tempId ? saved : x));
    } catch (err) {
      console.error('[Supabase] Gagal simpan transaksi:', err);
    }
  }, []);

  const deleteRegistration = useCallback((id: string) => {
    const reg = registrations.find(r => r.id === id);
    setRegistrations(prev => prev.filter(r => r.id !== id));
    if (reg?.memberId) setMembers(prev => prev.filter(m => m.id !== reg.memberId));
    svc.deleteRegistration(id).catch(console.error);
  }, [registrations]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetToDefaultData = useCallback(() => {
    // Reset hanya local state — tidak hapus Supabase
    setSiteSettings(initialSiteSettings);
    setMembers([]);
    setRegistrations([]);
    setNews([]);
    setPrograms([]);
    setAgenda([]);
    setGallery([]);
    setBoard([]);
    setAchievements([]);
    setFeedbacks([]);
    setFaqs([]);
    setMeetingMinutes([]);
  }, []);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab, adminTab, setAdminTab,
      isAdminMode, setIsAdminMode, currentUser, setCurrentUser, loading,
      siteSettings, updateSiteSettings,
      members, registrations, news, programs, agenda, gallery,
      board, achievements, feedbacks, faqs, sponsors, users, meetingMinutes, transactions,
      addRegistration, approveRegistration, rejectRegistration,
      addMember, updateMember, deleteMember,
      addNews, updateNews, deleteNews,
      addProgram, updateProgram, deleteProgram,
      addAgenda, updateAgenda, deleteAgenda,
      addGalleryItem, deleteGalleryItem,
      addBoardMember, updateBoardMember, deleteBoardMember,
      addFeedback, replyFeedback, deleteFeedback,
      addFAQ, updateFAQ, deleteFAQ,
      addAchievement, deleteAchievement,
      addSponsor, deleteSponsor,
      addUser, updateUserRole, deleteUser,
      addMeetingMinutes, updateMeetingMinutes, deleteMeetingMinutes,
      addTransaction, deleteRegistration,
      resetToDefaultData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
