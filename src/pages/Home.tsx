import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIModeBadge } from '../components/AIModeBadge';
import { ActivityBalance } from '../components/charts/ActivityBalance';
import { GpaTrend } from '../components/charts/GpaTrend';
import { ReadinessRadar } from '../components/charts/ReadinessRadar';
import { Eyebrow } from '../components/ui/Eyebrow';
import { LinkButton } from '../components/ui/Button';
import { useLocale } from '../hooks/useLocale';

const PREVIEW_GPA = [
  { term: 'T1', gpa: 0.82 },
  { term: 'T2', gpa: 0.86 },
  { term: 'T3', gpa: 0.88 },
  { term: 'T4', gpa: 0.91 },
  { term: 'T5', gpa: 0.93 },
  { term: 'T6', gpa: 0.94 },
];

const PREVIEW_DIMS = [
  { key: 'academics', score: 88 },
  { key: 'activities', score: 72 },
  { key: 'essays', score: 58 },
  { key: 'recommendations', score: 76 },
  { key: 'tests', score: 82 },
  { key: 'fit', score: 64 },
];

const PREVIEW_BALANCE = [
  { category: 'Academic', hours: 520 },
  { category: 'Creative', hours: 260 },
  { category: 'Service', hours: 180 },
  { category: 'Leadership', hours: 220 },
];

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="text-ink">
      {/* HERO */}
      <section className="border-b border-divider">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28 editorial-grid gap-y-10">
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <Eyebrow>{t.home.eyebrow}</Eyebrow>
            <h1 className="font-serif text-[42px] sm:text-6xl lg:text-7xl leading-[1.04] tracking-tight text-ink">
              {t.home.titleA}
              <span className="italic text-forest">{t.home.titleItalic}</span>
              {t.home.titleB}
            </h1>
            <p className="lead max-w-xl">{t.home.lede}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <LinkButton to="/intake" variant="primary">
                {t.home.primaryCta} <ArrowRight size={14} />
              </LinkButton>
              <Link
                to="/dossier"
                className="text-[11px] uppercase tracking-[0.24em] text-slate hover:text-ink border-b border-divider-strong pb-1"
              >
                {t.home.secondaryCta}
              </Link>
            </div>
            <div className="pt-4">
              <AIModeBadge />
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col justify-end">
            <div className="border-l border-divider pl-8 space-y-6 py-6">
              <Eyebrow>{t.home.chartsTitle.split(' ').slice(0, 2).join(' ')}</Eyebrow>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate">{t.dashboard.gpaTrend}</p>
                  <p className="font-serif italic text-2xl text-forest">0.94</p>
                </div>
                <GpaTrend data={PREVIEW_GPA} />
              </div>
              <div className="rule" />
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate">{t.dashboard.readinessRadar}</p>
                <ReadinessRadar data={PREVIEW_DIMS} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CORE VALUE */}
      <section className="border-b border-divider">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-20 md:py-28 editorial-grid gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <Eyebrow>{t.home.capabilities}</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight max-w-md">{t.home.coreTitle}</h2>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:pl-10 lg:border-l border-divider">
            <p className="lead max-w-xl">{t.home.coreLede}</p>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="border-b border-divider">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {t.home.capabilityList.map((c, idx) => (
              <article
                key={c.id}
                className={`p-8 md:p-10 border-b border-divider lg:border-r ${
                  (idx + 1) % 3 === 0 ? 'lg:border-r-0' : ''
                } ${idx >= t.home.capabilityList.length - 3 ? 'lg:border-b-0' : ''}`}
              >
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="font-serif italic text-2xl text-bronze">{c.id}</span>
                  <div className="h-px flex-1 bg-divider" />
                </div>
                <h3 className="font-serif text-2xl text-ink mb-3">{c.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="border-b border-divider">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-20 md:py-28 editorial-grid gap-y-12">
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Eyebrow>Workflow</Eyebrow>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">{t.home.workflowTitle}</h2>
            <p className="lead">{t.home.workflowLede}</p>
          </div>
          <ol className="col-span-12 lg:col-span-8 lg:pl-10 space-y-10">
            {t.home.workflowSteps.map((s, idx) => (
              <li key={s.n} className="editorial-grid gap-8 items-baseline">
                <div className="col-span-12 md:col-span-2">
                  <span className="font-serif italic text-4xl text-bronze">{s.n}</span>
                </div>
                <div className="col-span-12 md:col-span-10 border-t border-divider pt-4">
                  <h3 className="font-serif text-2xl mb-2">{s.title}</h3>
                  <p className="text-sm text-slate max-w-xl leading-relaxed">{s.desc}</p>
                </div>
                {idx < t.home.workflowSteps.length - 1 ? null : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CHARTS PREVIEW */}
      <section className="border-b border-divider bg-paper-alt">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-20 md:py-28 editorial-grid gap-y-10">
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <Eyebrow>Evidence</Eyebrow>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">{t.home.chartsTitle}</h2>
            <p className="lead max-w-md">{t.home.chartsLede}</p>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:pl-10 grid sm:grid-cols-2 gap-10">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate">{t.dashboard.activityBalance}</p>
              <ActivityBalance data={PREVIEW_BALANCE} />
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate">{t.dashboard.readinessRadar}</p>
              <ReadinessRadar data={PREVIEW_DIMS} />
            </div>
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="border-b border-divider">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-20 md:py-28 editorial-grid gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <Eyebrow>Outcomes</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight">{t.home.outcomesTitle}</h2>
          </div>
          <div className="col-span-12 lg:col-span-8 lg:pl-10 grid md:grid-cols-2 gap-8">
            {t.home.outcomes.map((o, idx) => (
              <div key={idx} className="border-t border-divider pt-6">
                <p className="eyebrow mb-3">{String(idx + 1).padStart(2, '0')}</p>
                <h3 className="font-serif text-xl text-ink mb-2">{o.label}</h3>
                <p className="text-sm text-slate leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-24 md:py-32 editorial-grid gap-y-8 items-center">
          <div className="col-span-12 lg:col-span-8 space-y-5">
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">{t.home.ctaTitle}</h2>
            <p className="lead max-w-xl">{t.home.ctaLede}</p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:pl-10 lg:text-right">
            <LinkButton to="/intake" variant="secondary">
              {t.home.primaryCta} <ArrowRight size={14} />
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
