import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  console.log('[VITE CONFIG] process.cwd():', process.cwd());
  console.log('[VITE CONFIG] process.env.VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
  console.log('[VITE CONFIG] process.env.VITE_SUPABASE_ANON_KEY prefix:', process.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    publicDir: 'public',
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Aktifkan range requests untuk streaming video lokal
      headers: {
        'Accept-Ranges': 'bytes',
      },
      fs: {
        allow: ['.'],
      },
    },
  };
});
