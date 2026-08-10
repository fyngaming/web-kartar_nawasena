-- Jalankan di Supabase SQL Editor
-- Tambah kolom images (array URL) ke tabel agenda

alter table agenda add column if not exists images text[] default '{}';

-- Verifikasi
select column_name, data_type from information_schema.columns
where table_name = 'agenda' and column_name = 'images';
