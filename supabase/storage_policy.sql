-- ═══════════════════════════════════════════════════════════════
-- Storage Policy untuk bucket "media"
-- JANGAN dijalankan di SQL Editor!
-- Buat policy lewat Dashboard Supabase → Storage → media → Policies
-- ═══════════════════════════════════════════════════════════════
-- Cara yang benar ada di bawah (lewat Dashboard UI):
-- 
-- 1. Buka: Supabase Dashboard → Storage → Buckets → media
-- 2. Klik tab "Policies"
-- 3. Klik "New Policy" → "For full customization"
-- 4. Buat 3 policy berikut:
--
-- Policy 1 - SELECT (baca/lihat gambar):
--   Policy name : public read
--   Allowed operation : SELECT
--   Target roles : public
--   USING expression : true
--
-- Policy 2 - INSERT (upload gambar):
--   Policy name : anon upload
--   Allowed operation : INSERT
--   Target roles : public
--   WITH CHECK expression : true
--
-- Policy 3 - DELETE (hapus gambar):
--   Policy name : anon delete
--   Allowed operation : DELETE
--   Target roles : public
--   USING expression : true
-- ═══════════════════════════════════════════════════════════════

-- Alternatif: jalankan query ini saja di SQL Editor
-- (menggunakan fungsi internal Supabase yang benar)

create policy "public read"
  on storage.objects for select
  using ( bucket_id = 'media' );

create policy "anon upload"
  on storage.objects for insert
  with check ( bucket_id = 'media' );

create policy "anon update"
  on storage.objects for update
  using ( bucket_id = 'media' );

create policy "anon delete"
  on storage.objects for delete
  using ( bucket_id = 'media' );
