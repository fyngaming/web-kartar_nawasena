-- ═══════════════════════════════════════════════════════════════
-- fix_policies.sql
-- Jalankan file ini jika schema.sql sudah pernah dijalankan
-- dan muncul error "policy already exists"
-- ═══════════════════════════════════════════════════════════════

-- Hapus semua policy lama yang duplikat
drop policy if exists "public read" on site_settings;
drop policy if exists "public read" on news;
drop policy if exists "public read" on programs;
drop policy if exists "public read" on agenda;
drop policy if exists "public read" on gallery;
drop policy if exists "public read" on board_members;
drop policy if exists "public read" on members;
drop policy if exists "public read" on faqs;
drop policy if exists "public read" on achievements;
drop policy if exists "public read" on registrations;
drop policy if exists "public read" on feedbacks;
drop policy if exists "public read" on meeting_minutes;

drop policy if exists "anon write" on site_settings;
drop policy if exists "anon write" on news;
drop policy if exists "anon write" on programs;
drop policy if exists "anon write" on agenda;
drop policy if exists "anon write" on gallery;
drop policy if exists "anon write" on board_members;
drop policy if exists "anon write" on members;
drop policy if exists "anon write" on registrations;
drop policy if exists "anon write" on feedbacks;
drop policy if exists "anon write" on faqs;
drop policy if exists "anon write" on meeting_minutes;
drop policy if exists "anon write" on achievements;

-- Buat ulang policies yang benar
create policy "public read" on site_settings  for select using (true);
create policy "public read" on news            for select using (true);
create policy "public read" on programs        for select using (true);
create policy "public read" on agenda          for select using (true);
create policy "public read" on gallery         for select using (true);
create policy "public read" on board_members   for select using (true);
create policy "public read" on members         for select using (true);
create policy "public read" on faqs            for select using (true);
create policy "public read" on achievements    for select using (true);
create policy "public read" on registrations   for select using (true);
create policy "public read" on feedbacks       for select using (true);
create policy "public read" on meeting_minutes for select using (true);

create policy "anon write" on site_settings  for all using (true) with check (true);
create policy "anon write" on news            for all using (true) with check (true);
create policy "anon write" on programs        for all using (true) with check (true);
create policy "anon write" on agenda          for all using (true) with check (true);
create policy "anon write" on gallery         for all using (true) with check (true);
create policy "anon write" on board_members   for all using (true) with check (true);
create policy "anon write" on members         for all using (true) with check (true);
create policy "anon write" on registrations   for all using (true) with check (true);
create policy "anon write" on feedbacks       for all using (true) with check (true);
create policy "anon write" on faqs            for all using (true) with check (true);
create policy "anon write" on meeting_minutes for all using (true) with check (true);
create policy "anon write" on achievements    for all using (true) with check (true);
