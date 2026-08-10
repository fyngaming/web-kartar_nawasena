export type UserRole = 'Super Admin' | 'Admin' | 'Editor' | 'Bendahara';

export interface UserAccount {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
}

export type RegistrationStatus = 'Menunggu Verifikasi' | 'Diproses' | 'Diterima' | 'Ditolak';

export type MemberStatus = 'Aktif' | 'Tidak Aktif' | 'Mengundurkan Diri' | 'Alumni';

export interface RegistrationData {
  id: string; // e.g. KT-2026-0001
  fullName: string;
  pob: string; // Tempat Lahir
  dob: string; // Tanggal Lahir
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  rtRw: string;
  whatsapp: string;
  email: string;
  education: string;
  occupation: string;
  interests: string[];
  motivation: string;
  orgExperience: string;
  photoUrl?: string;
  documentUrl?: string;
  status: RegistrationStatus;
  rejectionReason?: string;
  appliedAt: string;
  processedAt?: string;
  memberId?: string;
}

export interface MemberData {
  id: string; // e.g. NAW-2026-001
  registrationId?: string;
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  rtRw?: string;
  whatsapp: string;
  email: string;
  interests: string[];
  status: MemberStatus;
  joinedDate: string;
  avatar?: string;
}

export interface FinancialTransaction {
  id: string;
  memberId: string; // NAW-... or member id
  amount: number; // positive for credit (setoran), negative for debit (pengeluaran)
  type: 'Setoran' | 'Penarikan' | 'Pengeluaran' | 'Penyesuaian';
  note?: string;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  thumbnail: string;
  status: 'Published' | 'Draft';
  views: number;
}

export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  fullDetails?: string;
  category: string;
  status: 'Terencana' | 'Berlangsung' | 'Selesai';
  target: string;
  budget?: string;
  image: string;
  coordinator?: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mapsUrl?: string;
  poster: string;       // gambar utama / thumbnail
  images?: string[];    // galeri foto tambahan (multi-gambar)
  status: 'Akan Datang' | 'Berlangsung' | 'Selesai';
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'Sosial' | 'Olahraga' | 'Keagamaan' | '17 Agustus' | 'Musyawarah' | 'Lainnya';
  type: 'image' | 'video';
  url: string;
  date: string;
}

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  period: string;
  photo: string;
  order: number;
  phone?: string;
  email?: string;
  instagram?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  organizer: string;
  certificateUrl?: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  category: 'Kritik' | 'Saran' | 'Pertanyaan';
  message: string;
  status: 'Belum Dibaca' | 'Dibalas' | 'Diarsipkan';
  submittedAt: string;
  replyText?: string;
  repliedAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SponsorItem {
  id: string;
  name: string;
  logo: string;
  category: 'Mitra Utama' | 'Sponsor Resmi' | 'Pendukung';
  websiteUrl?: string;
}

export interface SiteSettings {
  orgName: string;
  subName: string;
  slogan: string;
  address: string;
  subDistrict: string;
  city: string;
  postalCode: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  mapsEmbedUrl: string;
  history: string;
  vision: string;
  mission: string[];
  values: { title: string; desc: string }[];
  heroVideoUrl?: string;
  establishedYear: number;
  expectedPaymentsPerYear?: number;
}

// ── Notulensi Rapat ──────────────────────────────────────────────────────────

export type MeetingType =
  | 'Rapat Rutin Bulanan'
  | 'Rapat Luar Biasa'
  | 'Musyawarah Besar'
  | 'Rapat Divisi'
  | 'Rapat Koordinasi'
  | 'Rapat Evaluasi Program'
  | 'Lainnya';

export type MeetingStatus = 'Draft' | 'Final' | 'Diarsipkan';

export interface MeetingAgendaPoint {
  no: number;
  topic: string;
  discussion: string;
  decision: string;
  picName: string; // Penanggung jawab (Person In Charge)
  deadline?: string;
}

export interface MeetingMinutes {
  id: string;
  // ── Identitas Rapat ──
  meetingNumber: string;          // Nomor rapat: e.g. 01/RAP/KARTAR-NSW/VIII/2026
  title: string;                   // Judul/nama rapat
  type: MeetingType;
  // ── Waktu & Tempat ──
  date: string;                    // YYYY-MM-DD
  startTime: string;               // HH:MM
  endTime: string;                 // HH:MM
  location: string;
  // ── Peserta ──
  facilitator: string;             // Pemimpin rapat
  secretary: string;               // Notulis
  attendees: string;               // Nama-nama peserta hadir (multiline/free text)
  absentees?: string;              // Peserta tidak hadir
  quorum: string;                  // Kuorum: e.g. "15 dari 20 anggota"
  // ── Agenda & Isi ──
  openingNotes: string;            // Pembukaan / kata pengantar
  agendaPoints: MeetingAgendaPoint[];
  closingNotes: string;            // Penutupan
  nextMeetingDate?: string;        // Rencana rapat berikutnya
  nextMeetingNotes?: string;
  // ── Meta ──
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  attachments?: string[];          // URL lampiran dokumen/foto
}
