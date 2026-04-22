import { en, type Dictionary } from '../dictionaries/en';
import { vi } from '../dictionaries/vi';

export type Locale = 'en' | 'vi';

export const dictionaries: Record<Locale, Dictionary> = { en, vi };

export const LOCALE_STORAGE_KEY = 'northstar.locale';

export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'en' || stored === 'vi') return stored;
  const nav = window.navigator?.language?.toLowerCase() ?? '';
  return nav.startsWith('vi') ? 'vi' : 'en';
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
