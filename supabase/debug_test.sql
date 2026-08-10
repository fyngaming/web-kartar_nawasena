-- ═══════════════════════════════════════════════════════════════
-- debug_test.sql
-- Jalankan di SQL Editor untuk diagnosa masalah INSERT
-- ═══════════════════════════════════════════════════════════════

-- 1. Test INSERT ke agenda
insert into agenda (title, description, date, time, location, status, category)
values ('Test Agenda', 'Deskripsi test', '2026-08-10', '08:00', 'Sekretariat', 'Akan Datang', 'Musyawarah');

-- 2. Cek apakah data masuk
select * from agenda order by created_at desc limit 5;

-- 3. Cek RLS status semua tabel
select schemaname, tablename, rowsecurity 
from pg_tables 
where schemaname = 'public'
order by tablename;

-- 4. Cek semua policies yang aktif
select schemaname, tablename, policyname, cmd, qual
from pg_policies
where schemaname = 'public'
order by tablename;
