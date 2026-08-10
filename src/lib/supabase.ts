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

const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

console.log('[DEBUG] VITE_SUPABASE_URL:', supabaseUrl);
console.log('[DEBUG] VITE_SUPABASE_ANON_KEY prefix:', supabaseKey?.substring(0, 20));

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diisi di .env.local.\n' +
    'Pastikan file .env.local ada di root project dan server sudah di-restart setelah mengubah .env.local.'
  );
}

// Use fallback placeholder to prevent createClient from throwing during SSR/build,
// actual API calls will fail gracefully instead of crashing the entire app.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
export default supabase;
