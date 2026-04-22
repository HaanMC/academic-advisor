import type { Locale } from '../../i18n';

/**
 * Mock translation is intentionally conservative. It does NOT attempt to machine-translate
 * arbitrary student writing — that would produce low-quality output and is exactly what the
 * spec says to avoid for static UI. It only flips short bilingual response templates used
 * in mock outputs, and for free text it returns the original with a locale tag. When a real
 * server provider is wired in, translate() can delegate to an LLM.
 */
export function runTranslateMock(text: string, from: Locale, to: Locale): string {
  if (from === to) return text;
  if (!text.trim()) return text;
  // Conservative: leave the text intact with a clear locale marker, so the user sees it wasn't translated.
  const marker = to === 'vi' ? '(chưa dịch · chỉ có ở chế độ máy chủ)' : '(not translated · available in server mode)';
  return `${text}\n\n— ${marker}`;
}
