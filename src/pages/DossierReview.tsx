import { useEffect, useMemo, useState } from 'react';
import { AIModeBadge } from '../components/AIModeBadge';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Panel } from '../components/ui/Panel';
import { useIndexedDBState } from '../hooks/useIndexedDBState';
import { useLocale } from '../hooks/useLocale';
import { reviewDossier } from '../lib/ai/actions';
import { idbGet, idbPut } from '../lib/storage/indexedDB';
import { emptyIntake, type DossierAnalysis, type DossierInputs, type IntakeData } from '../lib/storage/schemas';

type TabKey = keyof DossierInputs;

const TABS: TabKey[] = ['transcript', 'cv', 'activities', 'honors', 'essay'];

export default function DossierReview() {
  const { t, locale } = useLocale();
  const [activeTab, setActiveTab] = useState<TabKey>('transcript');
  const [running, setRunning] = useState(false);
  const [analysis, setAnalysis] = useState<DossierAnalysis | null>(null);

  const { value: transcript, setValue: setTranscript, loaded: tl } = useIndexedDBState<{ text: string }>('transcripts', 'current', { text: '' });
  const { value: cv, setValue: setCv, loaded: cvl } = useIndexedDBState<{ text: string }>('cv', 'current', { text: '' });
  const { value: activitiesText, setValue: setActivitiesText, loaded: al } = useIndexedDBState<{ text: string }>('activities', 'paste', { text: '' });
  const { value: honorsText, setValue: setHonorsText, loaded: hl } = useIndexedDBState<{ text: string }>('activities', 'honors', { text: '' });
  const { value: essayText, setValue: setEssayText, loaded: el } = useIndexedDBState<{ text: string }>('essays', 'dossierPaste', { text: '' });

  const allLoaded = tl && cvl && al && hl && el;

  useEffect(() => {
    idbGet<DossierAnalysis>('dossierAnalyses', 'latest').then((a) => {
      if (a) setAnalysis(a);
    });
  }, []);

  const inputs: DossierInputs = useMemo(
    () => ({
      transcript: transcript.text,
      cv: cv.text,
      activities: activitiesText.text,
      honors: honorsText.text,
      essay: essayText.text,
    }),
    [transcript, cv, activitiesText, honorsText, essayText],
  );

  const totalChars = inputs.transcript.length + inputs.cv.length + inputs.activities.length + inputs.honors.length + inputs.essay.length;
  const readyToRun = totalChars >= 100;

  async function run() {
    setRunning(true);
    const intake = (await idbGet<IntakeData>('intake', 'current')) ?? emptyIntake;
    const result = await reviewDossier({ inputs, intake, locale });
    setAnalysis(result);
    await idbPut('dossierAnalyses', 'latest', result);
    setRunning(false);
  }

  function placeholder(tab: TabKey) {
    return t.dossier.placeholders[tab];
  }

  const valueByTab: Record<TabKey, { text: string }> = {
    transcript, cv, activities: activitiesText, honors: honorsText, essay: essayText,
  };
  const setByTab: Record<TabKey, (v: { text: string }) => void> = {
    transcript: (v) => setTranscript(v),
    cv: (v) => setCv(v),
    activities: (v) => setActivitiesText(v),
    honors: (v) => setHonorsText(v),
    essay: (v) => setEssayText(v),
  };

  if (!allLoaded) {
    return (
      <section className="mx-auto max-w-[1320px] px-6 md:px-10 py-24">
        <p className="eyebrow">{t.common.loading}…</p>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-14 md:py-20 space-y-14">
      <header className="editorial-grid gap-y-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Eyebrow>{t.dossier.eyebrow}</Eyebrow>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">{t.dossier.title}</h1>
          <p className="lead max-w-xl">{t.dossier.lede}</p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col justify-end">
          <AIModeBadge />
        </div>
      </header>

      <section className="editorial-grid gap-10">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex flex-wrap gap-0 border-b border-divider">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? 'text-forest border-forest' : 'text-slate border-transparent hover:text-ink'
                }`}
              >
                {t.dossier.tabs[tab]}
              </button>
            ))}
          </div>

          <textarea
            value={valueByTab[activeTab].text}
            onChange={(e) => setByTab[activeTab]({ text: e.target.value })}
            placeholder={placeholder(activeTab)}
            className="w-full min-h-[360px] md:min-h-[440px] bg-paper border border-divider p-5 md:p-6 font-serif text-base leading-relaxed focus:outline-none focus:border-forest placeholder:text-ink/30"
            spellCheck={false}
          />

          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={run} disabled={!readyToRun || running} variant="primary">
              {running ? t.common.analyzing : t.dossier.analyze}
            </Button>
            <span className="text-xs text-slate">
              {totalChars.toLocaleString()} {t.common.characters}
            </span>
            {!readyToRun && (
              <span className="text-xs text-oxblood italic">{t.dossier.inputTooShort}</span>
            )}
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-5 space-y-4 lg:pl-8 lg:border-l border-divider lg:pt-0 pt-8 border-t">
          <ResultView analysis={analysis} running={running} />
        </aside>
      </section>
    </div>
  );
}

function ResultView({ analysis, running }: { analysis: DossierAnalysis | null; running: boolean }) {
  const { t, locale } = useLocale();

  if (running) {
    return (
      <Panel tone="alt" className="p-8 space-y-3">
        <p className="eyebrow">{t.common.analyzing}</p>
        <div className="h-1 w-full bg-paper-sunken overflow-hidden">
          <div className="h-full bg-forest animate-pulse w-1/2" />
        </div>
      </Panel>
    );
  }

  if (!analysis) {
    return (
      <Panel tone="alt" className="p-8">
        <p className="eyebrow mb-3">{t.dossier.sections.snapshot}</p>
        <p className="text-sm italic text-slate">{t.dossier.emptyResult}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">{t.dossier.sections.snapshot}</p>
        <p className="font-serif text-[17px] leading-relaxed text-ink">{analysis.snapshot}</p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-bronze mt-3">
          {locale === 'vi' ? 'Tạo lúc ' : 'Generated '}
          {new Date(analysis.generatedAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
        </p>
      </div>

      <Section title={t.dossier.sections.strengths} tone="forest">
        {analysis.strengths.length === 0 ? (
          <p className="text-sm italic text-slate">{t.common.empty}</p>
        ) : (
          <ul className="space-y-3">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="border-l-2 border-forest pl-4">
                <p className="font-serif text-[15px] text-ink">{s.title}</p>
                <p className="text-xs text-slate mt-1">{s.evidence}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <BulletSection title={t.dossier.sections.weak} items={analysis.weak} />
      <BulletSection title={t.dossier.sections.coherence} items={analysis.coherence} />
      <BulletSection title={t.dossier.sections.risks} items={analysis.risks} tone="oxblood" />
      <BulletSection title={t.dossier.sections.priorities} items={analysis.priorities} tone="forest" />
      <BulletSection title={t.dossier.sections.actions} items={analysis.actions} />
    </div>
  );
}

function Section({ title, children, tone }: { title: string; children: React.ReactNode; tone?: 'forest' | 'oxblood' }) {
  return (
    <div className="border-t border-divider pt-6">
      <p className={`eyebrow mb-3 ${tone === 'forest' ? 'text-forest' : tone === 'oxblood' ? 'text-oxblood' : ''}`}>{title}</p>
      {children}
    </div>
  );
}

function BulletSection({ title, items, tone }: { title: string; items: string[]; tone?: 'forest' | 'oxblood' }) {
  const { t } = useLocale();
  return (
    <Section title={title} tone={tone}>
      {items.length === 0 ? (
        <p className="text-sm italic text-slate">{t.common.empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${tone === 'oxblood' ? 'bg-oxblood' : tone === 'forest' ? 'bg-forest' : 'bg-bronze'}`} aria-hidden />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
