const PREFIX = 'northstar.';

export function storageKey(key: string): string {
  return PREFIX + key;
}

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function removeLocal(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey(key));
  } catch {
    /* ignore */
  }
}
