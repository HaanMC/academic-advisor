import { useLocale } from '../hooks/useLocale';
import { LinkButton } from '../components/ui/Button';

export default function NotFound() {
  const { t } = useLocale();
  return (
    <section className="max-w-3xl mx-auto px-6 py-32 text-center">
      <h1 className="text-5xl font-serif mb-6">{t.notFound.title}</h1>
      <p className="lead mb-10">{t.notFound.lede}</p>
      <LinkButton to="/" variant="outline">{t.notFound.cta}</LinkButton>
    </section>
  );
}
