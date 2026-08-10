-- ═══════════════════════════════════════════════════════════════════════
-- fix_all_rls.sql
-- Jalankan SELURUH file ini di Supabase SQL Editor
-- Fix: 401 Unauthorized pada semua request
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. Hapus SEMUA policy lama yang mungkin konflik ─────────────────────

do $$ 
declare
  r record;
begin
  for r in (
    select policyname, tablename 
    from pg_policies 
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists %I on %I', r.policyname, r.tablename);
  end loop;
end $$;

-- ── 2. MATIKAN RLS sementara untuk semua tabel ──────────────────────────
-- (cara paling simpel untuk development/testing)

alter table site_settings  disable row level security;
alter table news            disable row level security;
alter table programs        disable row level security;
alter table agenda          disable row level security;
alter table gallery         disable row level security;
alter table board_members   disable row level security;
alter table members         disable row level security;
alter table registrations   disable row level security;
alter table feedbacks       disable row level security;
alter table faqs            disable row level security;
alter table meeting_minutes disable row level security;
alter table achievements    disable row level security;

-- ── 3. Grant akses penuh ke role anon dan authenticated ─────────────────

grant usage on schema public to anon, authenticated;

grant all on site_settings  to anon, authenticated;
grant all on news            to anon, authenticated;
grant all on programs        to anon, authenticated;
grant all on agenda          to anon, authenticated;
grant all on gallery         to anon, authenticated;
grant all on board_members   to anon, authenticated;
grant all on members         to anon, authenticated;
grant all on registrations   to anon, authenticated;
grant all on feedbacks       to anon, authenticated;
grant all on faqs            to anon, authenticated;
grant all on meeting_minutes to anon, authenticated;
grant all on achievements    to anon, authenticated;

-- Grant sequence (untuk auto-increment UUID)
grant usage, select on all sequences in schema public to anon, authenticated;

-- ── 4. Verifikasi — cek status RLS ──────────────────────────────────────

select 
  tablename,
  rowsecurity as rls_enabled
from pg_tables 
where schemaname = 'public'
order by tablename;
