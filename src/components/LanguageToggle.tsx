import { Languages } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label="Toggle language"
      className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] font-medium text-slate hover:text-ink transition-colors ${className}`}
    >
      <Languages size={14} className="text-bronze" aria-hidden />
      <span>{locale === 'en' ? 'EN · VI' : 'VI · EN'}</span>
    </button>
  );
}
