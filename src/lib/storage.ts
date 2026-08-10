/**
 * storage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Lapisan penyimpanan hybrid:
 *   • Teks/JSON  → localStorage  (cepat, sinkron, aman untuk data kecil)
 *   • Gambar base64 → IndexedDB  (async, kuota jauh lebih besar ~250 MB+)
 *
 * Semua fungsi bersifat "best effort" — tidak pernah melempar error ke UI.
 */

const IDB_NAME   = 'KT_NAWASENA_IMAGES';
const IDB_STORE  = 'images';
const IDB_VER    = 1;
const LS_KEY     = 'KT_NAWASENA_STORE_V3';

// ─── IndexedDB helpers ───────────────────────────────────────────────────────

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => { _db = req.result; resolve(req.result); };
    req.onerror   = () => reject(req.error);
  });
}

export async function idbSet(key: string, value: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  } catch { /* silently ignore */ }
}

export async function idbGet(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror   = () => reject(req.error);
    });
  } catch { return null; }
}

export async function idbDelete(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => resolve();
    });
  } catch { /* silently ignore */ }
}

export async function idbClear(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror    = () => resolve();
    });
  } catch { /* silently ignore */ }
}

// ─── localStorage helpers (teks/JSON saja) ──────────────────────────────────

export function lsSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(LS_KEY + key, JSON.stringify(value));
  } catch {
    // Quota: coba bersihkan key-key lama yang tidak kritis lalu simpan ulang
    try {
      // Hapus achievements & sponsors yang jarang berubah sebagai fallback
      localStorage.removeItem(LS_KEY + '_ACHIEVEMENTS');
      localStorage.removeItem(LS_KEY + '_SPONSORS');
      localStorage.setItem(LS_KEY + key, JSON.stringify(value));
    } catch {
      console.warn('[storage] localStorage penuh, data tidak tersimpan untuk key:', key);
    }
  }
}

export function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_KEY + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function lsClear(): void {
  // Hanya hapus key milik aplikasi ini, bukan semua localStorage
  const keys = Object.keys(localStorage).filter(k => k.startsWith(LS_KEY));
  keys.forEach(k => localStorage.removeItem(k));
}

// ─── Fungsi khusus untuk GalleryItem dengan gambar ──────────────────────────

/**
 * Simpan galeri: URL eksternal (https://) langsung di JSON,
 * gambar base64 (data:) dipindah ke IndexedDB dengan key = item ID.
 * Yang tersimpan di localStorage hanya metadata + placeholder.
 */
export async function saveGallery(items: import('../types').GalleryItem[]): Promise<void> {
  const slim = await Promise.all(items.map(async item => {
    if (item.url.startsWith('data:')) {
      // Simpan base64 ke IndexedDB
      await idbSet(`gallery_${item.id}`, item.url);
      // Di localStorage, simpan placeholder agar bisa direkonstruksi
      return { ...item, url: `__idb__gallery_${item.id}` };
    }
    return item;
  }));
  lsSet('_GALLERY', slim);
}

/**
 * Muat galeri: rekonstruksi URL gambar dari IndexedDB.
 */
export async function loadGallery(fallback: import('../types').GalleryItem[]): Promise<import('../types').GalleryItem[]> {
  const raw = lsGet<import('../types').GalleryItem[]>('_GALLERY', fallback);
  const restored = await Promise.all(raw.map(async item => {
    if (item.url.startsWith('__idb__')) {
      const idbKey = item.url.replace('__idb__', '');
      const base64 = await idbGet(idbKey);
      return { ...item, url: base64 || '' };
    }
    return item;
  }));
  return restored;
}

/**
 * Simpan BoardMember dengan foto: sama seperti galeri, foto base64 ke IndexedDB.
 */
export async function saveBoard(items: import('../types').BoardMember[]): Promise<void> {
  const slim = await Promise.all(items.map(async item => {
    if (item.photo?.startsWith('data:')) {
      await idbSet(`board_${item.id}`, item.photo);
      return { ...item, photo: `__idb__board_${item.id}` };
    }
    return item;
  }));
  lsSet('_BOARD', slim);
}

export async function loadBoard(fallback: import('../types').BoardMember[]): Promise<import('../types').BoardMember[]> {
  const raw = lsGet<import('../types').BoardMember[]>('_BOARD', fallback);
  const restored = await Promise.all(raw.map(async item => {
    if (item.photo?.startsWith('__idb__')) {
      const idbKey = item.photo.replace('__idb__', '');
      const base64 = await idbGet(idbKey);
      return { ...item, photo: base64 || '' };
    }
    return item;
  }));
  return restored;
}

/**
 * Simpan News dengan thumbnail base64.
 */
export async function saveNews(items: import('../types').NewsItem[]): Promise<void> {
  const slim = await Promise.all(items.map(async item => {
    if (item.thumbnail?.startsWith('data:')) {
      await idbSet(`news_${item.id}`, item.thumbnail);
      return { ...item, thumbnail: `__idb__news_${item.id}` };
    }
    return item;
  }));
  lsSet('_NEWS', slim);
}

export async function loadNews(fallback: import('../types').NewsItem[]): Promise<import('../types').NewsItem[]> {
  const raw = lsGet<import('../types').NewsItem[]>('_NEWS', fallback);
  const restored = await Promise.all(raw.map(async item => {
    if (item.thumbnail?.startsWith('__idb__')) {
      const idbKey = item.thumbnail.replace('__idb__', '');
      const base64 = await idbGet(idbKey);
      return { ...item, thumbnail: base64 || '' };
    }
    return item;
  }));
  return restored;
}

/**
 * Simpan Programs dengan gambar base64.
 */
export async function savePrograms(items: import('../types').ProgramItem[]): Promise<void> {
  const slim = await Promise.all(items.map(async item => {
    if (item.image?.startsWith('data:')) {
      await idbSet(`prog_${item.id}`, item.image);
      return { ...item, image: `__idb__prog_${item.id}` };
    }
    return item;
  }));
  lsSet('_PROGRAMS', slim);
}

export async function loadPrograms(fallback: import('../types').ProgramItem[]): Promise<import('../types').ProgramItem[]> {
  const raw = lsGet<import('../types').ProgramItem[]>('_PROGRAMS', fallback);
  const restored = await Promise.all(raw.map(async item => {
    if (item.image?.startsWith('__idb__')) {
      const idbKey = item.image.replace('__idb__', '');
      const base64 = await idbGet(idbKey);
      return { ...item, image: base64 || '' };
    }
    return item;
  }));
  return restored;
}

/**
 * Simpan Agenda dengan poster base64.
 */
export async function saveAgenda(items: import('../types').AgendaItem[]): Promise<void> {
  const slim = await Promise.all(items.map(async item => {
    if (item.poster?.startsWith('data:')) {
      await idbSet(`agenda_${item.id}`, item.poster);
      return { ...item, poster: `__idb__agenda_${item.id}` };
    }
    return item;
  }));
  lsSet('_AGENDA', slim);
}

export async function loadAgenda(fallback: import('../types').AgendaItem[]): Promise<import('../types').AgendaItem[]> {
  const raw = lsGet<import('../types').AgendaItem[]>('_AGENDA', fallback);
  const restored = await Promise.all(raw.map(async item => {
    if (item.poster?.startsWith('__idb__')) {
      const idbKey = item.poster.replace('__idb__', '');
      const base64 = await idbGet(idbKey);
      return { ...item, poster: base64 || '' };
    }
    return item;
  }));
  return restored;
}

/**
 * Simpan MemberData dengan avatar base64.
 */
export async function saveMembers(items: import('../types').MemberData[]): Promise<void> {
  const slim = await Promise.all(items.map(async item => {
    if (item.avatar?.startsWith('data:')) {
      await idbSet(`member_${item.id}`, item.avatar);
      return { ...item, avatar: `__idb__member_${item.id}` };
    }
    return item;
  }));
  lsSet('_MEMBERS', slim);
}

export async function loadMembers(fallback: import('../types').MemberData[]): Promise<import('../types').MemberData[]> {
  const raw = lsGet<import('../types').MemberData[]>('_MEMBERS', fallback);
  const restored = await Promise.all(raw.map(async item => {
    if (item.avatar?.startsWith('__idb__')) {
      const idbKey = item.avatar.replace('__idb__', '');
      const base64 = await idbGet(idbKey);
      return { ...item, avatar: base64 || '' };
    }
    return item;
  }));
  return restored;
}
