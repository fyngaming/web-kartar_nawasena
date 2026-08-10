import {
  SiteSettings,
  MemberData,
  RegistrationData,
  NewsItem,
  ProgramItem,
  AgendaItem,
  GalleryItem,
  BoardMember,
  AchievementItem,
  FeedbackItem,
  FAQItem,
  SponsorItem,
  UserAccount
} from '../types';

export const initialSiteSettings: SiteSettings = {
  orgName: 'Karang Taruna Nawasena',
  subName: 'Perum Graha Selokaton Indah (GSI) Ngangkruk',
  slogan: 'Aditya Karya Mahatvayodha — Pemuda Tangguh, Inovatif, & Berpengabdian',
  address: 'Graha Selokaton Indah, Barat Lapangan Bola, RT 04 / RW 15, Ngangkruk, Selokaton',
  subDistrict: 'Gondangrejo',
  city: 'Kabupaten Karanganyar, Jawa Tengah',
  postalCode: '57188',
  whatsapp: '6281234567890',
  email: 'nawasenakarangtaruna1@gmail.com',
  instagram: '@kartar.nawasena_',
  facebook: 'Karang Taruna Nawasena GSI',
  youtube: 'Nawasena GSI Channel',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.457319973216!2d110.8354!3d-7.5089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a1661601660ab%3A0x5027a76e356e6d0!2sSelokaton%2C%20Gondangrejo%2C%20Karanganyar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  history: 'Karang Taruna Nawasena didirikan sebagai wadah pembinaan dan pengembangan generasi muda di Perumahan Graha Selokaton Indah (GSI) Ngangkruk, Desa Selokaton, Kecamatan Gondangrejo, Karanganyar. Mengusung nama "Nawasena" yang berasal dari bahasa Sansekerta yang berarti "Masa Depan yang Cerah", organisasi ini berkomitmen menciptakan pemuda pemudi yang aktif, kreatif, berakhlak mulia, serta tanggap terhadap kebutuhan sosial di lingkungan masyarakat.',
  vision: 'Mewujudkan Generasi Muda Karang Taruna Nawasena yang Unggul, Mandiri, Berkarakter, dan Berkontribusi Aktif dalam Pembangunan Kemasyarakatan berbasis Gotong Royong di Perum GSI Ngangkruk.',
  mission: [
    'Meningkatkan kepedulian sosial dan solidaritas antar warga masyarakat Perum Graha Selokaton Indah.',
    'Menyelenggarakan kegiatan kepemudaan berbasis olahraga, seni budaya, keagamaan, dan ekonomi kreatif.',
    'Mendorong keterlibatan aktif pemuda dalam pembangunan infrastruktur & lingkungan hijau perumahan.',
    'Mengembangkan potensi kewirausahaan muda (UMKM) serta penguasaan teknologi digital.',
    'Menjalin sinergi erat dengan Pemerintah Desa Selokaton, Pengurus RT/RW, dan tokoh masyarakat.'
  ],
  values: [
    { title: 'Aditya Karya Mahatvayodha', desc: 'Semangat juang dan pengabdian utama pemuda Indonesia.' },
    { title: 'Gotong Royong', desc: 'Kebersamaan dan kemitraan erat dalam setiap langkah.' },
    { title: 'Inovasi & Digital', desc: 'Menghadapi era modern dengan kreativitas dan solusi cerdas.' },
    { title: 'Integritas', desc: 'Kejujuran, transparansi, dan tanggung jawab organisasi.' }
  ],
  establishedYear: 2022
  ,
  expectedPaymentsPerYear: 12
};

export const initialAdminUsers: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Favian Yusuf (Ketua Umum)',
    username: 'adminKartarNawasenaGsI',
    email: 'admin@nawasena.or.id',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-05 19:42'
  },
  {
    id: 'usr-2',
    name: 'Rian Prasetyo (Sekretaris)',
    username: 'SekreKartar_Nawasena',
    email: 'sekretaris@nawasena.or.id',
    role: 'Editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-04 14:15'
  },
  {
    id: 'usr-3',
    name: 'Siti Rahmawati (Humas/Media)',
    username: 'humasNawasena',
    email: 'editor@nawasena.or.id',
    role: 'Editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-03 09:30'
  }
  ,
  {
    id: 'usr-4',
    name: 'Dewi Lestari (Bendahara)',
    username: 'BendaharaKartar_Nawasena',
    email: 'bendahara@nawasena.or.id',
    role: 'Bendahara',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-06 11:20'
  }
];

export const initialMembers: MemberData[] = [
  {
    id: 'NAW-2026-001',
    registrationId: 'KT-2026-0001',
    fullName: 'Aditya Pratama',
    gender: 'Laki-laki',
    address: 'Perum Graha Selokaton Indah Blok A No. 12',
    rtRw: '04/15',
    whatsapp: '081234567001',
    email: 'aditya.pratama@gmail.com',
    interests: ['Olahraga', 'Teknologi & Multimedia'],
    status: 'Aktif',
    joinedDate: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'NAW-2026-002',
    registrationId: 'KT-2026-0002',
    fullName: 'Nabila Putri Permata',
    gender: 'Perempuan',
    address: 'Perum Graha Selokaton Indah Blok B No. 05',
    rtRw: '04/15',
    whatsapp: '081234567002',
    email: 'nabila.putri@gmail.com',
    interests: ['Kewirausahaan & UMKM', 'Seni & Budaya'],
    status: 'Aktif',
    joinedDate: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'NAW-2026-003',
    registrationId: 'KT-2026-0003',
    fullName: 'Bagas Prasetyo',
    gender: 'Laki-laki',
    address: 'Perum Graha Selokaton Indah Blok C No. 08',
    rtRw: '04/15',
    whatsapp: '081234567003',
    email: 'bagas.prasetyo@gmail.com',
    interests: ['Olahraga', 'Lingkungan Hidup'],
    status: 'Aktif',
    joinedDate: '2026-02-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialRegistrations: RegistrationData[] = [
  {
    id: 'KT-2026-0001',
    fullName: 'Aditya Pratama',
    pob: 'Karanganyar',
    dob: '2004-05-12',
    gender: 'Laki-laki',
    address: 'Perum Graha Selokaton Indah Blok A No. 12',
    rtRw: '04/15',
    whatsapp: '081234567001',
    email: 'aditya.pratama@gmail.com',
    education: 'S1 Teknik Informatika',
    occupation: 'Software Engineer',
    orgExperience: 'Ketua OSIS SMA (2021)',
    motivation: 'Ingin berkontribusi aktif dalam kegiatan olahraga dan kepemudaan GSI Ngangkruk.',
    interests: ['Olahraga', 'Teknologi & Multimedia'],
    status: 'Diterima',
    appliedAt: '2026-01-14 10:30',
    processedAt: '2026-01-15 08:00',
    memberId: 'NAW-2026-001'
  },
  {
    id: 'KT-2026-0002',
    fullName: 'Nabila Putri Permata',
    pob: 'Surakarta',
    dob: '2005-08-20',
    gender: 'Perempuan',
    address: 'Perum Graha Selokaton Indah Blok B No. 05',
    rtRw: '04/15',
    whatsapp: '081234567002',
    email: 'nabila.putri@gmail.com',
    education: 'D3 Manajemen Usaha',
    occupation: 'Wirausaha Kuliner',
    orgExperience: 'Anggota PMR (2022)',
    motivation: 'Ingin mengembangkan UMKM kuliner muda serta kegiatan kreasi kerajinan.',
    interests: ['Kewirausahaan & UMKM', 'Seni & Budaya'],
    status: 'Diterima',
    appliedAt: '2026-01-31 15:45',
    processedAt: '2026-02-01 09:15',
    memberId: 'NAW-2026-002'
  },
  {
    id: 'KT-2026-0004',
    fullName: 'Rizky Kurniawan',
    pob: 'Boyolali',
    dob: '2003-11-04',
    gender: 'Laki-laki',
    address: 'Perum Graha Selokaton Indah Blok D No. 14',
    rtRw: '04/15',
    whatsapp: '081234567004',
    email: 'rizky.kurnia@gmail.com',
    education: 'SMA Negeri 1 Gondangrejo',
    occupation: 'Karyawan Swasta',
    orgExperience: 'Pengurus Karang Taruna RT (2023)',
    motivation: 'Ingin ikut serta mengelola tim multimedia dan event 17 Agustusan.',
    interests: ['Teknologi & Multimedia', 'Olahraga'],
    status: 'Menunggu Verifikasi',
    appliedAt: '2026-08-08 19:20'
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Sukses Gelar Senam Bersama & Bazaar UMKM Pemuda GSI Ngangkruk',
    slug: 'senam-bersama-bazaar-umkm-gsi-ngangkruk',
    summary: 'Karang Taruna Nawasena sukses mengumpulkan ratusan warga Perum GSI Ngangkruk dalam kegiatan sehat dan pemberdayaan ekonomi warga.',
    content: `<p><strong>NGANGKRUK, SELOKATON</strong> — Karang Taruna Nawasena Perum Graha Selokaton Indah (GSI) sukses menggelar agenda tahunan Senam Sehat Bersama dan Bazaar UMKM Pemuda di area barat Lapangan Bola Ngangkruk, Minggu kemarin.</p><p>Acara dibuka secara resmi oleh Ketua RW 15 beserta Pengurus Karang Taruna Nawasena. Kegiatan ini dihadiri oleh lebih dari 300 warga yang antusias mengikuti senam aerobik sejak pukul 06.00 WIB, dilanjutkan dengan pengundian doorprize utama berupa sepeda gunung dan peralatan rumah tangga.</p><p>Selain senam, sebanyak 20 pelaku UMKM binaan pemuda menjajakan berbagai olahan kuliner lokal, kerajinan tangan, serta produk kebutuhan rumah tangga. Ketua Karang Taruna Nawasena mengungkapkan bahwa kegiatan ini bertujuan untuk mempererat tali silaturahmi antar warga perumahan sekaligus memicu pertumbuhan ekonomi skala mikro.</p><blockquote class="border-l-4 border-emerald-600 pl-4 italic my-4 text-emerald-800">"Sinergi antar pemuda dan warga senior di GSI Ngangkruk sangat terasa. InsyaAllah kegiatan serupa akan rutin digelar tiap triwulan," ujar Ketua Nawasena.</blockquote>`,
    category: 'Kegiatan',
    author: 'Humas Nawasena',
    date: '2026-08-01',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    status: 'Published',
    views: 342
  },
  {
    id: 'news-2',
    title: 'Persiapan Peringatan HUT RI ke-81: Nawasena Bentuk Panitia Semarak Agustus',
    slug: 'persiapan-peringatan-hut-ri-81-nawasena',
    summary: 'Musyawarah pemuda menetapkan jajaran panitia lomba 17-an, tirakatan malam kemerdekaan, dan panggung prajurit seni.',
    content: `<p>Dalam rangka menyambut Hari Ulang Tahun Kemerdekaan Republik Indonesia ke-81, Karang Taruna Nawasena Perum GSI Ngangkruk telah melaksanakan Musyawarah Pemuda di Balai Warga RT 04 Selokaton.</p><p>Rapat menyepakati berbagai rangkaian perlombaan menarik bagi kategori anak-anak, ibu-ibu, dan bapak-bapak, seperti lomba jalan sehat keluarga, voli plastik malam, hingga lomba mewarnai. Puncak acara akan ditutup dengan Malam Resepsi & Panggung Pentas Seni Budaya.</p>`,
    category: 'Pengumuman',
    author: 'Sekretariat',
    date: '2026-07-25',
    thumbnail: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80',
    status: 'Published',
    views: 215
  },
  {
    id: 'news-3',
    title: 'Aksi Hijau Nawasena: Penanaman 100 Tabebuya & Pembuatan Bank Sampah',
    slug: 'aksi-hijau-nawasena-penanaman-tabebuya-bank-sampah',
    summary: 'Komitmen melestarikan lingkungan perumahan yang asri, sejuk, dan bebas sampah plastik.',
    content: `<p>Sebagai bagian dari Program Lingkungan Hidup, Karang Taruna Nawasena berkolaborasi dengan DLH Kabupaten Karanganyar melakukan penanaman bibit pohon Tabebuya di sepanjang jalan utama Perum Graha Selokaton Indah.</p><p>Selain penanaman pohon, Nawasena resmi meresmikan Sistem Bank Sampah 'Nawasena Resik' yang melayani pemilahan sampah anorganik warga setiap akhir pekan.</p>`,
    category: 'Lingkungan',
    author: 'Divisi Lingkungan',
    date: '2026-07-10',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    status: 'Published',
    views: 189
  }
];

export const initialPrograms: ProgramItem[] = [
  {
    id: 'prog-1',
    title: 'Nawasena Sport & Wellness',
    description: 'Turnamen olahraga bulanan (Futsal, Badminton, Voli Plastik) antar RT di Perum GSI Ngangkruk.',
    fullDetails: 'Fasilitasi kesehatan fisik dan kekompakan pemuda melalui kompetisi olahraga bergilir serta latihan rutin mingguan di lapangan bola Ngangkruk.',
    category: 'Olahraga',
    status: 'Berlangsung',
    target: 'Seluruh Pemuda & Warga RT 01 - RT 06 GSI',
    budget: 'Rp 4.500.000',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80',
    coordinator: 'Aris Nugroho (Divisi Olahraga)'
  },
  {
    id: 'prog-2',
    title: 'Bank Sampah & Nawasena Green Village',
    description: 'Gerakan pemilahan sampah daur ulang dan penghijauan lingkungan taman perumahan.',
    fullDetails: 'Mengelola penimbangan sampah terpilah warga tiap Sabtu minggu ke-2, hasil penjualan ditabung untuk kas kas sosial pemuda dan dana kebersihan.',
    category: 'Lingkungan',
    status: 'Berlangsung',
    target: 'Seluruh KK Perum Graha Selokaton Indah',
    budget: 'Rp 2.000.000',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    coordinator: 'Dhea Kurnia (Divisi Lingkungan)'
  },
  {
    id: 'prog-3',
    title: 'Digital Youth Academy & Podcast GSI',
    description: 'Pelatihan pembuatan konten, desain grafis, editing video, dan podcast aspirasi pemuda.',
    fullDetails: 'Memberikan skill praktis teknologi informasi bagi remaja GSI agar mampu menghasilkan karya kreatif bernilai ekonomis.',
    category: 'Multimedia & Teknologi',
    status: 'Terencana',
    target: 'Remaja Usia 15 - 24 Tahun',
    budget: 'Rp 3.500.000',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    coordinator: 'Bagas Aditya (Divisi Multimedia)'
  },
  {
    id: 'prog-4',
    title: 'Nawasena Peduli Social Care',
    description: 'Tanggap bencana lokal, santunan anak yatim & dhuafa, serta kerja bakti pembersihan fasum.',
    fullDetails: 'Aksi nyata bantuan kemanusiaan saat terjadi bencana alam atau warga berduka/sakit, dibantu armada ambulans dan sukarelawan Nawasena.',
    category: 'Sosial',
    status: 'Berlangsung',
    target: 'Warga Kurang Mampu & Fasilitas Umum',
    budget: 'Rp 6.000.000',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    coordinator: 'Anisa Wulandari (Divisi Sosial)'
  }
];

export const initialAgenda: AgendaItem[] = [
  {
    id: 'agenda-1',
    title: 'Kerja Bakti Massal & Pemasangan Bendera Semarak HUT RI',
    description: 'Gotong royong pembersihan saluran air, pengecatan kanstin jalan perumahan, dan pemasangan umbul-umbul Kemerdekaan RI.',
    date: '2026-08-10',
    time: '07:00 - 11:30 WIB',
    location: 'Sepanjang Jalan Utama Perum GSI Ngangkruk',
    poster: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
    status: 'Akan Datang',
    category: '17 Agustus'
  },
  {
    id: 'agenda-2',
    title: 'Malam Tirakatan & Doa Bersama HUT RI ke-81',
    description: 'Acara kebersamaan seluruh warga GSI Ngangkruk, pemotongan tumpeng kemerdekaan, dan renungan suci.',
    date: '2026-08-16',
    time: '19:30 WIB - Selesai',
    location: 'Gedung Serbaguna / Lapangan Bola Ngangkruk',
    poster: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    status: 'Akan Datang',
    category: 'Musyawarah & Keagamaan'
  },
  {
    id: 'agenda-3',
    title: 'Jalan Sehat Kemerdekaan & Panggung Pentas Seni',
    description: 'Puncak peringatan 17 Agustus dengan hadiah utama sepeda listrik, panggung hiburan pemuda, dan bazaar kuliner.',
    date: '2026-08-23',
    time: '06:00 - 14:00 WIB',
    location: 'Barat Lapangan Bola Ngangkruk, GSI Selokaton',
    poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    status: 'Akan Datang',
    category: '17 Agustus'
  },
  {
    id: 'agenda-4',
    title: 'Musyawarah Triwulan Pemuda Nawasena & Evaluasi Program',
    description: 'Pertemuan rutin seluruh anggota untuk laporan keuangan kas, koordinasi event, dan penerimaan anggota baru.',
    date: '2026-07-20',
    time: '19:30 - 21:30 WIB',
    location: 'Balai Pertemuan GSI RT 04',
    poster: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
    status: 'Selesai',
    category: 'Musyawarah'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Kegiatan Senam Aerobik Warga GSI',
    caption: 'Keceriaan warga Perum GSI Ngangkruk mengikuti senam sehat pembuka bazaar UMKM.',
    category: 'Olahraga',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&auto=format&fit=crop&q=80',
    date: '2026-08-01'
  },
  {
    id: 'gal-2',
    title: 'Lomba Voli Plastik Antar RT',
    caption: 'Semarak laga final turnamen voli plastik malam di lapangan perumahan.',
    category: 'Olahraga',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1000&auto=format&fit=crop&q=80',
    date: '2026-07-28'
  },
  {
    id: 'gal-3',
    title: 'Kerja Bakti Pembersihan Taman & Lapangan Bola',
    caption: 'Aksi pemuda gotong royong menjaga kebersihan dan keasrian sarana publik GSI Ngangkruk.',
    category: 'Sosial',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&auto=format&fit=crop&q=80',
    date: '2026-07-15'
  },
  {
    id: 'gal-4',
    title: 'Pengajian & Halal Bihalal Pemuda',
    caption: 'Momen kehangatan silaturahmi keagamaan dalam menyambut Idul Fitri.',
    category: 'Keagamaan',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1000&auto=format&fit=crop&q=80',
    date: '2026-04-14'
  },
  {
    id: 'gal-5',
    title: 'Pawai Obor & Semarak Malam 17 Agustus',
    caption: 'Dokumentasi merah putih keliling komplek perumahan disambut meriah warga.',
    category: '17 Agustus',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1000&auto=format&fit=crop&q=80',
    date: '2025-08-17'
  },
  {
    id: 'gal-6',
    title: 'Musyawarah Besar Pembentukan Pengurus Nawasena',
    caption: 'Sesi perumusan visi misi dan pemilihan pengurus harian Karang Taruna Nawasena.',
    category: 'Musyawarah',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    date: '2024-01-10'
  }
];

export const initialBoardMembers: BoardMember[] = [
  {
    id: 'board-1',
    name: 'Favian Yusuf',
    position: 'Ketua Umum',
    period: '2024 - 2026',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    order: 1,
    phone: '081234567890',
    email: 'favian.yusuf@nawasena.or.id',
    instagram: '@favianyusuf'
  },
  {
    id: 'board-2',
    name: 'Ahmad Faisal',
    position: 'Wakil Ketua',
    period: '2024 - 2026',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    order: 2,
    phone: '081234567892',
    instagram: '@ahmadfaisal'
  },
  {
    id: 'board-3',
    name: 'Rian Prasetyo',
    position: 'Sekretaris I',
    period: '2024 - 2026',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    order: 3,
    phone: '081234567893',
    instagram: '@rianpras'
  },
  {
    id: 'board-4',
    name: 'Siti Rahmawati',
    position: 'Bendahara I',
    period: '2024 - 2026',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    order: 4,
    phone: '081234567894',
    instagram: '@sitirahma'
  },
  {
    id: 'board-5',
    name: 'Aris Nugroho',
    position: 'Koordinator Divisi Olahraga',
    period: '2024 - 2026',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    order: 5,
    instagram: '@aris_nugroho'
  },
  {
    id: 'board-6',
    name: 'Bagas Aditya',
    position: 'Koordinator Divisi Multimedia & Kominfo',
    period: '2024 - 2026',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    order: 6,
    instagram: '@bagasaditya'
  }
];

export const initialAchievements: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Juara 1 Karang Taruna Berprestasi Tingkat Kecamatan Gondangrejo',
    year: '2025',
    category: 'Organisasi',
    description: 'Penghargaan atas keaktifan program inovasi sosial, kelengkapan administrasi, dan dampak kemasyarakatan di wilayah Gondangrejo.',
    organizer: 'Camat Gondangrejo & Karanganyar Youth Forum'
  },
  {
    id: 'ach-2',
    title: 'Juara 2 Turnamen Futsal Pemuda Karanganyar Cup',
    year: '2025',
    category: 'Olahraga',
    description: 'Tim Futsal Nawasena GSI meraih posisi runner-up dari 32 tim perwakilan karang taruna se-Kabupaten Karanganyar.',
    organizer: 'Disparpora Kabupaten Karanganyar'
  },
  {
    id: 'ach-3',
    title: 'Penghargaan Bank Sampah Inovatif Desa Selokaton',
    year: '2024',
    category: 'Lingkungan',
    description: 'Apresiasi atas keberhasilan mengedukasi warga memilah sampah daur ulang secara konsisten.',
    organizer: 'Pemerintah Desa Selokaton'
  }
];

export const initialFeedbacks: FeedbackItem[] = [
  {
    id: 'fb-1',
    name: 'Pak Bambang Setyo',
    email: 'bambang.setyo@gmail.com',
    whatsapp: '081234112233',
    category: 'Saran',
    message: 'Mohon untuk lampu penerangan di area lapangan bola barat disiapkan lebih terang jika ada kegiatan voli malam hari. Semangat terus anak-anak Karang Taruna Nawasena!',
    status: 'Dibalas',
    submittedAt: '2026-08-03 14:20',
    replyText: 'Terima kasih atas sarannya Pak Bambang. Pengurus sudah berkoordinasi dengan Ketua RT/RW untuk penambahan spotlight LED minggu ini.',
    repliedAt: '2026-08-04 09:10'
  },
  {
    id: 'fb-2',
    name: 'Ibu Ratna',
    email: 'ratna.gsi@yahoo.com',
    whatsapp: '085788990011',
    category: 'Pertanyaan',
    message: 'Apakah bazar UMKM 17 Agustus nanti juga membuka pendaftaran untuk stan makanan rumahan warga RT 03? Terima kasih.',
    status: 'Belum Dibaca',
    submittedAt: '2026-08-05 11:45'
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Siapa saja yang bisa mendaftar menjadi anggota Karang Taruna Nawasena?',
    answer: 'Seluruh pemuda pemudi berusia 13 hingga 45 tahun yang berdomisili atau bertempat tinggal di Perumahan Graha Selokaton Indah (GSI) RW 15 Ngangkruk, Desa Selokaton, Gondangrejo, Karanganyar.',
    category: 'Keanggotaan'
  },
  {
    id: 'faq-2',
    question: 'Apakah ada biaya pendaftaran atau iuran bulanan?',
    answer: 'Pendaftaran anggota Karang Taruna Nawasena adalah 100% GRATIS (tidak dipungut biaya). Penggalangan dana kegiatan diperoleh dari kas usaha kreatif, sponsor, dan swadaya yang transparan.',
    category: 'Keanggotaan'
  },
  {
    id: 'faq-3',
    question: 'Berapa lama proses verifikasi formulir pendaftaran anggota?',
    answer: 'Proses verifikasi oleh pengurus membutuhkan waktu 1 - 3 hari kerja. Anda dapat mengecek status pendaftaran secara berkala melalui menu "Cek Status Pendaftaran" menggunakan Nomor Registrasi, Email, atau WhatsApp.',
    category: 'Pendaftaran'
  },
  {
    id: 'faq-4',
    question: 'Bagaimana cara mengajukan proposal kerjasama atau sponsorship kegiatan?',
    answer: 'Anda dapat menghubungi tim Humas/Sekretariat Nawasena via WhatsApp official (+62 812-3456-7890) atau datang langsung ke Sekretariat GSI Ngangkruk barat lapangan bola.',
    category: 'Kerjasama'
  },
  {
    id: 'faq-5',
    question: 'Apa saja syarat dokumen yang dibutuhkan saat mendaftar anggota?',
    answer: 'Biasanya hanya diperlukan foto KTP/KK atau identitas sekolah, pas foto terbaru, dan informasi kontak WA. Detail dokumen dapat disesuaikan pada formulir pendaftaran.',
    category: 'Pendaftaran'
  },
  {
    id: 'faq-6',
    question: 'Apa keuntungan menjadi anggota Karang Taruna Nawasena?',
    answer: 'Anggota dapat mengikuti kegiatan sosial, pelatihan kepemudaan, jaringan komunitas, akses beasiswa pelatihan, dan kesempatan terlibat dalam program pemberdayaan masyarakat.',
    category: 'Keuntungan'
  },
  {
    id: 'faq-7',
    question: 'Bagaimana jika saya ingin mengubah data anggota setelah terdaftar?',
    answer: 'Silakan hubungi admin melalui fasilitas kontak resmi Nawasena atau laporkan ke Sekretariat saat pertemuan rutin agar data dapat diperbarui oleh pengurus.',
    category: 'Keanggotaan'
  },
  {
    id: 'faq-8',
    question: 'Bagaimana sistem kas/iuran anggota dikelola?',
    answer: 'Kas dikelola oleh Bendahara Nawasena dengan transparansi untuk kebutuhan kegiatan dan operasional. Setiap pemasukan kas dicatat dan dilaporkan pada rapat rutin.',
    category: 'Keuangan'
  }
];

export const initialSponsors: SponsorItem[] = [
  {
    id: 'sp-1',
    name: 'Pemerintah Desa Selokaton',
    logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&auto=format&fit=crop&q=80',
    category: 'Mitra Utama'
  },
  {
    id: 'sp-2',
    name: 'Pengurus RW 15 GSI Ngangkruk',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80',
    category: 'Mitra Utama'
  },
  {
    id: 'sp-3',
    name: 'Toko Kelontong Berkah GSI',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&auto=format&fit=crop&q=80',
    category: 'Sponsor Resmi'
  }
];

export const initialMeetingMinutes: import('../types').MeetingMinutes[] = [
  {
    id: 'min-1',
    meetingNumber: '01/RAP/KARTAR-NSW/VIII/2026',
    title: 'Musyawarah Persiapan Panitia HUT RI ke-81 & Lomba Pemuda GSI',
    type: 'Rapat Rutin Bulanan',
    date: '2026-08-05',
    startTime: '19:30',
    endTime: '21:30',
    location: 'Sekretariat GSI Ngangkruk',
    facilitator: 'Favian Yusuf (Ketua)',
    secretary: 'Rian Prasetyo (Sekretaris)',
    attendees: 'Favian Yusuf, Rian Prasetyo, Siti Rahmawati, Aris Nugroho, Bagas Aditya',
    absentees: '-',
    quorum: 'Kuorum Terpenuhi (15 Pengurus)',
    openingNotes: 'Rapat dibuka pukul 19.35 WIB oleh Ketua Umum dengan doa bersama dan pembacaan agenda rapat.',
    agendaPoints: [
      {
        no: 1,
        topic: 'Pembentukan Panitia Jalan Sehat 17 Agustus',
        discussion: 'Disepakati pembagian seksi acara, konsumsi, perlengkapan, dan penggalangan sponsor.',
        decision: 'Aris Nugroho ditunjuk sebagai Ketua Panitia Pelaksana Jalan Sehat.',
        picName: 'Aris Nugroho',
        deadline: '2026-08-12'
      },
      {
        no: 2,
        topic: 'Pengelolaan Kas Iuran Anggota',
        discussion: 'Penyampaian laporan keuangan kas bulan Juli oleh Bendahara dan pembahasan iuran wajib.',
        decision: 'Iuran anggota berjalan rutin tiap minggu dan dicatat digital via modul Bendahara.',
        picName: 'Siti Rahmawati',
        deadline: '2026-08-15'
      }
    ],
    closingNotes: 'Rapat ditutup pukul 21.30 WIB dengan pembacaan hasil notulensi oleh Sekretaris.',
    status: 'Final',
    createdBy: 'Rian Prasetyo (Sekretaris)',
    createdAt: '2026-08-05 21:40',
    updatedAt: '2026-08-05 21:40'
  }
];

export const initialTransactions: import('../types').FinancialTransaction[] = [
  {
    id: 'tx-1',
    memberId: 'NAW-2026-001',
    amount: 50000,
    type: 'Setoran',
    note: 'Setoran Kas Iuran Anggota Bulan Agustus 2026',
    createdAt: '2026-08-01 10:00'
  },
  {
    id: 'tx-2',
    memberId: 'NAW-2026-002',
    amount: 50000,
    type: 'Setoran',
    note: 'Setoran Kas Iuran Anggota Bulan Agustus 2026',
    createdAt: '2026-08-02 11:30'
  },
  {
    id: 'tx-3',
    memberId: 'NAW-2026-003',
    amount: 50000,
    type: 'Setoran',
    note: 'Setoran Kas Iuran Anggota Bulan Agustus 2026',
    createdAt: '2026-08-03 14:15'
  }
];
