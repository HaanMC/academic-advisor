import { RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AIModeBadge } from '../components/AIModeBadge';
import { ActivityBalance } from '../components/charts/ActivityBalance';
import { GpaTrend } from '../components/charts/GpaTrend';
import { ReadinessRadar } from '../components/charts/ReadinessRadar';
import { SubjectBars } from '../components/charts/SubjectBars';
import { Timeline } from '../components/charts/Timeline';
import { Button, LinkButton } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Panel } from '../components/ui/Panel';
import { useIndexedDBState } from '../hooks/useIndexedDBState';
import { useLocale } from '../hooks/useLocale';
import { summarizeProfile } from '../lib/ai/actions';
import { computeReadiness } from '../lib/readiness';
import { idbAll, idbPut } from '../lib/storage/indexedDB';
import {
  emptyIntake,
  type DashboardSnapshot,
  type EssayDraft,
  type IntakeData,
  type SchoolEntry,
} from '../lib/storage/schemas';

export default function Dashboard() {
  const { t, locale } = useLocale();
  const { value: intake, loaded: intakeLoaded } = useIndexedDBState<IntakeData>('intake', 'current', emptyIntake);

  const [drafts, setDrafts] = useState<EssayDraft[]>([]);
  const [shortlist, setShortlist] = useState<SchoolEntry[]>([]);
  const [loadedAux, setLoadedAux] = useState(false);
  const [summary, setSummary] = useState<string[] | null>(null);
  const [headline, setHeadline] = useState<string>('');

  useEffect(() => {
    let alive = true;
    Promise.all([
      idbAll<EssayDraft>('essays').then((rows) => rows.map((r) => r.value)),
      idbAll<SchoolEntry>('schoolShortlist').then((rows) => rows.map((r) => r.value)),
    ]).then(([d, s]) => {
      if (!alive) return;
      setDrafts(d);
      setShortlist(s);
      setLoadedAux(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const snapshot: DashboardSnapshot = useMemo(
    () => computeReadiness(intake, drafts, shortlist),
    [intake, drafts, shortlist],
  );

  useEffect(() => {
    if (!intakeLoaded || !loadedAux) return;
    idbPut('dashboardSnapshots', 'latest', snapshot).catch(() => undefined);
  }, [snapshot, intakeLoaded, loadedAux]);

  useEffect(() => {
    if (!intakeLoaded) return;
    if (!intake.fullName && intake.activities.length === 0 && !intake.gpa) {
      setSummary(null);
      setHeadline('');
      return;
    }
    summarizeProfile({ intake, locale }).then((r) => {
      setHeadline(r.headline);
      setSummary(r.paragraphs);
    });
  }, [intake, locale, intakeLoaded]);

  const intakeEmpty = !intake.fullName && intake.activities.length === 0 && !intake.gpa;

  if (!intakeLoaded || !loadedAux) {
    return (
      <section className="mx-auto max-w-[1320px] px-6 md:px-10 py-24">
        <p className="eyebrow">{t.common.loading}…</p>
      </section>
    );
  }

  if (intakeEmpty) {
    return (
      <section className="mx-auto max-w-[1320px] px-6 md:px-10 py-24">
        <Eyebrow>{t.dashboard.eyebrow}</Eyebrow>
        <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-6">{t.dashboard.title}</h1>
        <p className="lead max-w-xl mb-10">{t.dashboard.empty}</p>
        <LinkButton to="/intake" variant="primary">
          {t.home.primaryCta}
        </LinkButton>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-14 md:py-20 space-y-14">
      <header className="editorial-grid gap-y-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Eyebrow>{t.dashboard.eyebrow}</Eyebrow>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">{t.dashboard.title}</h1>
          {headline ? <p className="lead max-w-2xl">{headline}</p> : null}
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col justify-end gap-3">
          <AIModeBadge />
          <div className="text-xs text-slate">
            {t.dashboard.lastUpdated}: {new Date(snapshot.generatedAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
          </div>
        </div>
      </header>

      {/* Readiness + charts row */}
      <section className="editorial-grid border border-divider">
        <div className="col-span-12 md:col-span-4 p-8 md:p-10 border-b md:border-b-0 md:border-r border-divider">
          <p className="eyebrow mb-4">{t.dashboard.readiness}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-serif text-ink leading-none">{snapshot.readiness}</span>
            <span className="text-sm font-serif italic text-bronze mb-1">{t.dashboard.readinessOf}</span>
          </div>
          <div className="mt-6 h-1 bg-paper-sunken w-full overflow-hidden">
            <div className="h-full bg-forest" style={{ width: `${snapshot.readiness}%` }} />
          </div>
          <div className="mt-6 text-xs uppercase tracking-[0.22em] text-slate">
            {snapshot.readiness >= 80
              ? locale === 'vi' ? 'Đang ở vùng cạnh tranh' : 'In a competitive band'
              : snapshot.readiness >= 60
              ? locale === 'vi' ? 'Đang tiến tới cạnh tranh' : 'Approaching competitive'
              : locale === 'vi' ? 'Cần thêm nhiều việc' : 'Work remains'}
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 p-8 md:p-10">
          <p className="eyebrow mb-4">{t.dashboard.readinessRadar}</p>
          <ReadinessRadar data={snapshot.dimensions} />
        </div>
      </section>

      <section className="editorial-grid border border-divider">
        <div className="col-span-12 md:col-span-6 p-8 md:p-10 border-b md:border-b-0 md:border-r border-divider">
          <p className="eyebrow mb-4">{t.dashboard.gpaTrend}</p>
          <GpaTrend data={snapshot.gpaTrend} />
        </div>
        <div className="col-span-12 md:col-span-6 p-8 md:p-10">
          <p className="eyebrow mb-4">{t.dashboard.subjectStrength}</p>
          <SubjectBars data={snapshot.subjectStrength} />
        </div>
      </section>

      <section className="editorial-grid border border-divider">
        <div className="col-span-12 md:col-span-6 p-8 md:p-10 border-b md:border-b-0 md:border-r border-divider">
          <p className="eyebrow mb-4">{t.dashboard.activityBalance}</p>
          <ActivityBalance data={snapshot.activityBalance} />
        </div>
        <div className="col-span-12 md:col-span-6 p-8 md:p-10">
          <p className="eyebrow mb-4">{t.dashboard.timeline}</p>
          <Timeline items={snapshot.timeline} />
        </div>
      </section>

      {/* Lists */}
      <section className="editorial-grid gap-6">
        <Panel className="col-span-12 md:col-span-4 p-8">
          <p className="eyebrow text-forest mb-4">{t.dashboard.strengths}</p>
          <List items={snapshot.strengths} empty={t.common.empty} tone="forest" />
        </Panel>
        <Panel className="col-span-12 md:col-span-4 p-8" tone="alt">
          <p className="eyebrow text-oxblood mb-4">{t.dashboard.risks}</p>
          <List items={snapshot.risks} empty={t.common.empty} tone="oxblood" />
        </Panel>
        <Panel className="col-span-12 md:col-span-4 p-8" tone="alt">
          <p className="eyebrow mb-4">{t.dashboard.missing}</p>
          <List items={snapshot.missing} empty={t.common.empty} />
        </Panel>
      </section>

      <section className="editorial-grid gap-6">
        <Panel className="col-span-12 md:col-span-7 p-8">
          <p className="eyebrow mb-4">{t.dashboard.next}</p>
          <ol className="space-y-3 list-decimal list-inside marker:text-bronze">
            {snapshot.nextActions.length === 0 ? (
              <p className="text-sm italic text-slate">{t.common.empty}</p>
            ) : (
              snapshot.nextActions.map((a, i) => (
                <li key={i} className="text-sm text-ink leading-relaxed">
                  {a}
                </li>
              ))
            )}
          </ol>
        </Panel>

        <Panel className="col-span-12 md:col-span-5 p-8" tone="sunken">
          <div className="flex items-baseline justify-between mb-4">
            <p className="eyebrow">{t.dashboard.essays}</p>
            <Link to="/essay-lab" className="text-[11px] uppercase tracking-[0.24em] text-forest border-b border-forest/40 pb-0.5">
              {t.dashboard.essays} →
            </Link>
          </div>
          {drafts.length === 0 ? (
            <p className="text-sm italic text-slate">{t.common.empty}</p>
          ) : (
            <ul className="space-y-3">
              {drafts.map((d) => (
                <li key={d.id} className="flex items-center justify-between border-t border-divider pt-3 first:border-t-0 first:pt-0">
                  <span className="font-serif text-base truncate pr-4">{d.title || t.essay.untitled}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-bronze">
                    {d.wordCount} {t.common.words}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      {/* Profile summary */}
      {summary ? (
        <section className="border-t border-divider pt-10">
          <p className="eyebrow mb-3">{locale === 'vi' ? 'Định vị hồ sơ' : 'Profile positioning'}</p>
          <div className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-ink font-serif">
            {summary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="flex flex-wrap gap-3 pt-4 border-t border-divider">
        <LinkButton to="/dossier" variant="outline" size="sm">
          {t.dossier.title} →
        </LinkButton>
        <LinkButton to="/essay-lab" variant="outline" size="sm">
          {t.essay.title} →
        </LinkButton>
        <LinkButton to="/school-fit" variant="outline" size="sm">
          {t.schools.title} →
        </LinkButton>
        <LinkButton to="/interview-prep" variant="outline" size="sm">
          {t.interview.title} →
        </LinkButton>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className="ml-auto"
          aria-label={t.dashboard.refresh}
        >
          <RefreshCcw size={12} /> {t.dashboard.refresh}
        </Button>
      </footer>
    </div>
  );
}

function List({ items, empty, tone }: { items: string[]; empty: string; tone?: 'forest' | 'oxblood' }) {
  if (items.length === 0) return <p className="text-sm italic text-slate">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((s, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
          <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${tone === 'forest' ? 'bg-forest' : tone === 'oxblood' ? 'bg-oxblood' : 'bg-bronze'}`} aria-hidden />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}
