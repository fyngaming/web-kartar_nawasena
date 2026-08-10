-- ═══════════════════════════════════════════════════════════════
-- Schema Karang Taruna Nawasena — Supabase PostgreSQL
-- Jalankan seluruh file ini di Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Site Settings (satu baris saja) ─────────────────────────────
create table if not exists site_settings (
  id            text primary key default 'main',
  org_name      text,
  sub_name      text,
  slogan        text,
  address       text,
  sub_district  text,
  city          text,
  postal_code   text,
  whatsapp      text,
  email         text,
  instagram     text,
  facebook      text,
  youtube       text,
  maps_embed_url text,
  history       text,
  vision        text,
  mission       text[],
  values        jsonb,
  established_year integer,
  updated_at    timestamptz default now()
);

-- ── Berita & Pengumuman ──────────────────────────────────────────
create table if not exists news (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text,
  summary     text,
  content     text,
  category    text,
  author      text,
  date        date,
  thumbnail   text,   -- URL dari Supabase Storage
  status      text default 'Published',
  views       integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Program Kerja ────────────────────────────────────────────────
create table if not exists programs (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text,
  full_details text,
  category     text,
  status       text default 'Terencana',
  target       text,
  budget       text,
  image        text,   -- URL dari Supabase Storage
  coordinator  text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Agenda Kegiatan ──────────────────────────────────────────────
create table if not exists agenda (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  date        date,
  time        text,
  location    text,
  maps_url    text,
  poster      text,   -- URL dari Supabase Storage
  status      text default 'Akan Datang',
  category    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Galeri Media ─────────────────────────────────────────────────
create table if not exists gallery (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  caption    text,
  category   text,
  type       text default 'image',
  url        text not null,   -- URL dari Supabase Storage
  date       date,
  created_at timestamptz default now()
);

-- ── Struktur Pengurus ────────────────────────────────────────────
create table if not exists board_members (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  position   text,
  period     text,
  photo      text,   -- URL dari Supabase Storage
  "order"    integer default 99,
  phone      text,
  email      text,
  instagram  text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Anggota ──────────────────────────────────────────────────────
create table if not exists members (
  id              text primary key,   -- e.g. NAW-2026-001
  registration_id text,
  full_name       text not null,
  gender          text,
  address         text,
  rt_rw           text,
  whatsapp        text,
  email           text,
  interests       text[],
  status          text default 'Aktif',
  joined_date     date,
  avatar          text,   -- URL dari Supabase Storage
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Pendaftaran Anggota ──────────────────────────────────────────
create table if not exists registrations (
  id                text primary key,   -- e.g. KT-2026-0001
  full_name         text not null,
  pob               text,
  dob               date,
  gender            text,
  address           text,
  rt_rw             text,
  whatsapp          text,
  email             text,
  education         text,
  occupation        text,
  interests         text[],
  motivation        text,
  org_experience    text,
  photo_url         text,
  document_url      text,
  status            text default 'Menunggu Verifikasi',
  rejection_reason  text,
  member_id         text,
  applied_at        timestamptz default now(),
  processed_at      timestamptz
);

-- ── Pesan & Aspirasi ─────────────────────────────────────────────
create table if not exists feedbacks (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  email         text,
  whatsapp      text,
  category      text,
  message       text not null,
  status        text default 'Belum Dibaca',
  reply_text    text,
  replied_at    timestamptz,
  submitted_at  timestamptz default now()
);

-- ── FAQ ──────────────────────────────────────────────────────────
create table if not exists faqs (
  id       uuid primary key default uuid_generate_v4(),
  question text not null,
  answer   text,
  category text,
  created_at timestamptz default now()
);

-- ── Notulensi Rapat ──────────────────────────────────────────────
create table if not exists meeting_minutes (
  id                  uuid primary key default uuid_generate_v4(),
  meeting_number      text,
  title               text not null,
  type                text,
  date                date,
  start_time          text,
  end_time            text,
  location            text,
  facilitator         text,
  secretary           text,
  attendees           text,
  absentees           text,
  quorum              text,
  opening_notes       text,
  agenda_points       jsonb default '[]',
  closing_notes       text,
  next_meeting_date   date,
  next_meeting_notes  text,
  status              text default 'Draft',
  created_by          text,
  attachments         text[],
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ── Prestasi ─────────────────────────────────────────────────────
create table if not exists achievements (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  year        text,
  category    text,
  description text,
  organizer   text,
  certificate_url text,
  created_at  timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════
-- RLS (Row Level Security) — baca publik, tulis bebas (untuk dev)
-- Setelah production, tambahkan auth check
-- ═══════════════════════════════════════════════════════════════

alter table site_settings  enable row level security;
alter table news            enable row level security;
alter table programs        enable row level security;
alter table agenda          enable row level security;
alter table gallery         enable row level security;
alter table board_members   enable row level security;
alter table members         enable row level security;
alter table registrations   enable row level security;
alter table feedbacks       enable row level security;
alter table faqs            enable row level security;
alter table meeting_minutes enable row level security;
alter table achievements    enable row level security;

-- Policy: semua orang bisa baca
do $$ begin
  create policy "public read" on site_settings  for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on news            for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on programs        for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on agenda          for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on gallery         for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on board_members   for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on members         for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on faqs            for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read" on achievements    for select using (true);
exception when duplicate_object then null; end $$;

-- Policy: semua orang bisa write (untuk development — ganti ke auth setelah go live)
do $$ begin
  create policy "anon write" on site_settings  for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on news            for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on programs        for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on agenda          for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on gallery         for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on board_members   for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on members         for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on registrations   for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on feedbacks       for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on faqs            for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on meeting_minutes for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon write" on achievements    for all using (true) with check (true);
exception when duplicate_object then null; end $$;

-- ═══════════════════════════════════════════════════════════════
-- Storage Bucket untuk gambar
-- Buat manual di: Supabase Dashboard → Storage → New Bucket
--   Nama: "media", Public: ON
-- ═══════════════════════════════════════════════════════════════
