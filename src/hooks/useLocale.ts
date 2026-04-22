import { useLanguage } from '../context/LanguageContext';

export function useLocale() {
  const { locale, setLocale, toggleLocale, t } = useLanguage();
  return { locale, setLocale, toggleLocale, t };
}
