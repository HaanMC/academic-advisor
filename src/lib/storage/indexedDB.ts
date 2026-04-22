const DB_NAME = 'northstar';
const DB_VERSION = 1;

export const STORES = [
  'intake',
  'transcripts',
  'cv',
  'activities',
  'essays',
  'dossierAnalyses',
  'schoolShortlist',
  'schoolReasoning',
  'interviewAnswers',
  'dashboardSnapshots',
  'stories',
] as const;

export type StoreName = (typeof STORES)[number];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this environment.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name);
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const s = tx.objectStore(store);
    Promise.resolve(fn(s)).then(
      (result) => {
        tx.oncomplete = () => {
          db.close();
          resolve(result);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      },
      (err) => {
        db.close();
        reject(err);
      },
    );
  });
}

export async function idbGet<T>(store: StoreName, key: string): Promise<T | undefined> {
  return withStore(store, 'readonly', (s) => {
    return new Promise<T | undefined>((resolve, reject) => {
      const req = s.get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  });
}

export async function idbPut<T>(store: StoreName, key: string, value: T): Promise<void> {
  await withStore(store, 'readwrite', (s) => {
    return new Promise<void>((resolve, reject) => {
      const req = s.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

export async function idbDelete(store: StoreName, key: string): Promise<void> {
  await withStore(store, 'readwrite', (s) => {
    return new Promise<void>((resolve, reject) => {
      const req = s.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

export async function idbAll<T>(store: StoreName): Promise<Array<{ key: string; value: T }>> {
  return withStore(store, 'readonly', (s) => {
    return new Promise<Array<{ key: string; value: T }>>((resolve, reject) => {
      const out: Array<{ key: string; value: T }> = [];
      const req = s.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          out.push({ key: String(cursor.key), value: cursor.value as T });
          cursor.continue();
        } else {
          resolve(out);
        }
      };
      req.onerror = () => reject(req.error);
    });
  });
}

export async function idbClear(store: StoreName): Promise<void> {
  await withStore(store, 'readwrite', (s) => {
    return new Promise<void>((resolve, reject) => {
      const req = s.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}
