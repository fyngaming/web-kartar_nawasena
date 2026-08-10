/**
 * firebase.ts
 * ─────────────────────────────────────────────────────────────────────
 * Konfigurasi Firebase untuk Karang Taruna Nawasena
 *
 * CARA SETUP:
 * 1. Buat project di https://console.firebase.google.com
 * 2. Aktifkan Firestore Database + Storage
 * 3. Tambahkan Web App di Project Settings
 * 4. Isi nilai di bawah dengan config dari Firebase Console
 *    (atau gunakan .env.local dengan prefix VITE_)
 *
 * FIRESTORE RULES (salin ke console Firebase → Firestore → Rules):
 * ─────────────────────────────────────────────────────────────────────
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Siapa saja bisa baca (halaman publik)
 *     match /{document=**} {
 *       allow read: if true;
 *     }
 *     // Hanya admin yang bisa write (nanti bisa ditambah auth check)
 *     match /{document=**} {
 *       allow write: if true; // Ganti ke: request.auth != null setelah Auth aktif
 *     }
 *   }
 * }
 *
 * STORAGE RULES:
 * ─────────────────────────────────────────────────────────────────────
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     match /{allPaths=**} {
 *       allow read: if true;
 *       allow write: if true; // Ganti ke: request.auth != null setelah Auth aktif
 *     }
 *   }
 * }
 */

// @ts-nocheck
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ── Ganti dengan config dari Firebase Console Anda ───────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'GANTI_DENGAN_API_KEY_ANDA',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'GANTI.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'GANTI_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'GANTI.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:000:web:000'
};

// Hindari inisialisasi ganda (hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
