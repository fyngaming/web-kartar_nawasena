/**
 * supabase.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Konfigurasi Supabase client untuk Karang Taruna Nawasena
 *
 * CARA SETUP:
 * 1. Buka https://supabase.com → New Project
 * 2. Jalankan supabase/schema.sql di SQL Editor
 * 3. Buat Storage Bucket bernama "media" (Public: ON)
 *    Dashboard → Storage → New Bucket → nama: media → Public ✓
 * 4. Isi .env.local:
 *       VITE_SUPABASE_URL=https://xxxxx.supabase.co
 *       VITE_SUPABASE_ANON_KEY=eyJhbGci...
 */

import { createClient } from '@supabase/supabase-js';

const viteEnv = import.meta as any;
const supabaseUrl = viteEnv.env?.VITE_SUPABASE_URL as string;
const supabaseKey = viteEnv.env?.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === 'https://GANTI.supabase.co') {
  console.warn('[Supabase] VITE_SUPABASE_URL belum diisi di .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
