/**
 * firestoreService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Layer abstraksi untuk semua operasi Firestore & Firebase Storage.
 *
 * Struktur koleksi Firestore:
 *   /settings/main          → SiteSettings (dokumen tunggal)
 *   /news/{id}              → NewsItem[]
 *   /programs/{id}          → ProgramItem[]
 *   /agenda/{id}            → AgendaItem[]
 *   /gallery/{id}           → GalleryItem[]
 *   /board/{id}             → BoardMember[]
 *   /members/{id}           → MemberData[]
 *   /registrations/{id}     → RegistrationData[]
 *   /achievements/{id}      → AchievementItem[]
 *   /feedbacks/{id}         → FeedbackItem[]
 *   /faqs/{id}              → FAQItem[]
 *   /meetingMinutes/{id}    → MeetingMinutes[]
 *
 * Gambar/file:
 *   Firebase Storage bucket: /images/{category}/{filename}
 */

// @ts-nocheck
import {
  collection, doc, getDocs, getDoc,
  setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, onSnapshot, Unsubscribe,
  serverTimestamp, DocumentData
} from 'firebase/firestore';
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from './firebase';

// ─── Generic helpers ─────────────────────────────────────────────────────────

/** Ambil semua dokumen dari koleksi sebagai array */
export async function getCollection<T>(col: string): Promise<T[]> {
  const snapshot = await getDocs(collection(db, col));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
}

/** Ambil satu dokumen */
export async function getDocument<T>(col: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

/** Tambah dokumen baru (ID auto) */
export async function addDocument<T extends object>(col: string, data: T): Promise<string> {
  const ref2 = await addDoc(collection(db, col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref2.id;
}

/** Set/overwrite dokumen dengan ID tertentu */
export async function setDocument<T extends object>(col: string, id: string, data: T): Promise<void> {
  await setDoc(doc(db, col, id), {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/** Update sebagian field dokumen */
export async function updateDocument(col: string, id: string, data: Partial<DocumentData>): Promise<void> {
  await updateDoc(doc(db, col, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

/** Hapus dokumen */
export async function deleteDocument(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, id));
}

// ─── Realtime listener ───────────────────────────────────────────────────────

/**
 * Subscribe realtime ke koleksi.
 * Callback dipanggil setiap ada perubahan data.
 * Return fungsi unsubscribe.
 */
export function subscribeCollection<T>(
  col: string,
  callback: (items: T[]) => void
): Unsubscribe {
  return onSnapshot(collection(db, col), snapshot => {
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
    callback(items);
  });
}

// ─── Upload gambar ke Firebase Storage ───────────────────────────────────────

/**
 * Upload file/base64 ke Firebase Storage.
 * Mengembalikan URL publik yang bisa langsung dipakai di <img src="...">.
 *
 * @param base64OrFile  - base64 data URL ("data:image/...") atau File object
 * @param path          - path di storage, contoh: "gallery/foto-kegiatan.jpg"
 */
export async function uploadImage(
  base64OrFile: string | File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);

  if (typeof base64OrFile === 'string' && base64OrFile.startsWith('data:')) {
    // Convert base64 → Blob
    const res  = await fetch(base64OrFile);
    const blob = await res.blob();
    await uploadBytes(storageRef, blob);
  } else if (base64OrFile instanceof File) {
    await uploadBytes(storageRef, base64OrFile);
  } else {
    // Sudah URL https, tidak perlu upload ulang
    return base64OrFile;
  }

  return getDownloadURL(storageRef);
}

/**
 * Hapus file dari Firebase Storage berdasarkan URL-nya.
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Tidak perlu error jika file tidak ada
  }
}

// ─── Site Settings (dokumen tunggal) ─────────────────────────────────────────

export async function loadSiteSettings(fallback: object) {
  const snap = await getDoc(doc(db, 'settings', 'main'));
  return snap.exists() ? snap.data() : fallback;
}

export async function saveSiteSettings(data: object): Promise<void> {
  await setDoc(doc(db, 'settings', 'main'), data);
}

// ─── Contoh penggunaan di AppContext (baca petunjuk di bawah) ─────────────────
/**
 * CARA MIGRASI AppContext ke Firebase:
 *
 * 1. Ganti `useState` initial value dengan Firestore load:
 *
 *    // Sebelum (localStorage):
 *    const [news, setNews] = useState(() => lsGet('_NEWS', initialNews));
 *
 *    // Sesudah (Firestore):
 *    const [news, setNews] = useState<NewsItem[]>([]);
 *    useEffect(() => {
 *      getCollection<NewsItem>('news').then(setNews);
 *      // atau realtime:
 *      return subscribeCollection<NewsItem>('news', setNews);
 *    }, []);
 *
 * 2. Ganti fungsi add/update/delete dengan Firestore:
 *
 *    // addNews:
 *    const addNews = async (item) => {
 *      if (item.thumbnail?.startsWith('data:')) {
 *        const url = await uploadImage(item.thumbnail, `news/${Date.now()}.jpg`);
 *        item = { ...item, thumbnail: url };
 *      }
 *      const id = await addDocument('news', item);
 *      setNews(prev => [{ ...item, id }, ...prev]);
 *    };
 *
 *    // deleteNews:
 *    const deleteNews = async (id) => {
 *      await deleteDocument('news', id);
 *      setNews(prev => prev.filter(n => n.id !== id));
 *    };
 *
 * 3. Untuk deploy, tambahkan variabel environment di hosting:
 *    - Vercel: Dashboard → Project → Settings → Environment Variables
 *    - Netlify: Site Settings → Build & Deploy → Environment
 */
