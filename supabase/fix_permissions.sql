-- ═══════════════════════════════════════════════════════════════════
-- fix_permissions.sql  — Jalankan di Supabase SQL Editor
-- Fix: "permission denied for table agenda" (dan tabel lainnya)
-- ═══════════════════════════════════════════════════════════════════

-- 1. Matikan RLS di semua tabel
alter table if exists site_settings  disable row level security;
alter table if exists news            disable row level security;
alter table if exists programs        disable row level security;
alter table if exists agenda          disable row level security;
alter table if exists gallery         disable row level security;
alter table if exists board_members   disable row level security;
alter table if exists members         disable row level security;
alter table if exists registrations   disable row level security;
alter table if exists feedbacks       disable row level security;
alter table if exists faqs            disable row level security;
alter table if exists meeting_minutes disable row level security;
alter table if exists achievements    disable row level security;

-- 2. Grant schema usage
grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant usage on schema public to service_role;

-- 3. Grant ALL privileges per tabel ke anon
grant all privileges on table site_settings  to anon;
grant all privileges on table news            to anon;
grant all privileges on table programs        to anon;
grant all privileges on table agenda          to anon;
grant all privileges on table gallery         to anon;
grant all privileges on table board_members   to anon;
grant all privileges on table members         to anon;
grant all privileges on table registrations   to anon;
grant all privileges on table feedbacks       to anon;
grant all privileges on table faqs            to anon;
grant all privileges on table meeting_minutes to anon;
grant all privileges on table achievements    to anon;

-- 4. Grant ALL privileges per tabel ke authenticated
grant all privileges on table site_settings  to authenticated;
grant all privileges on table news            to authenticated;
grant all privileges on table programs        to authenticated;
grant all privileges on table agenda          to authenticated;
grant all privileges on table gallery         to authenticated;
grant all privileges on table board_members   to authenticated;
grant all privileges on table members         to authenticated;
grant all privileges on table registrations   to authenticated;
grant all privileges on table feedbacks       to authenticated;
grant all privileges on table faqs            to authenticated;
grant all privileges on table meeting_minutes to authenticated;
grant all privileges on table achievements    to authenticated;

-- 5. Grant sequence (penting untuk UUID auto-generate)
grant usage, select on all sequences in schema public to anon;
grant usage, select on all sequences in schema public to authenticated;

-- 6. Verifikasi — harusnya semua rls_enabled = false
select tablename, rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;
