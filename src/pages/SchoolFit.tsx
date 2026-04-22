import { ArrowLeftRight, MapPin, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AIModeBadge } from '../components/AIModeBadge';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Panel } from '../components/ui/Panel';
import { SUGGESTED_SCHOOLS } from '../data/schools';
import { useLocale } from '../hooks/useLocale';
import { reasonSchoolFit } from '../lib/ai/actions';
import { idbAll, idbDelete, idbGet, idbPut } from '../lib/storage/indexedDB';
import type { IntakeData, SchoolEntry } from '../lib/storage/schemas';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

type FilterTab = 'all' | 'fit' | 'stretch' | 'safer';

export default function SchoolFit() {
  const { t, locale } = useLocale();
  const [entries, setEntries] = useState<SchoolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [query, setQuery] = useState('');
  const [compare, setCompare] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  useEffect(() => {
    idbAll<SchoolEntry>('schoolShortlist').then((rows) => {
      setEntries(rows.map((r) => r.value).sort((a, b) => b.addedAt - a.addedAt));
      setLoading(false);
    });
  }, []);

  const suggestedFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SUGGESTED_SCHOOLS.filter((s) => {
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.tags.some((tg) => tg.includes(q));
    });
  }, [query]);

  const visibleEntries = useMemo(() => {
    return entries.filter((e) => filter === 'all' || e.category === filter);
  }, [entries, filter]);

  async function addFromSuggestion(s: (typeof SUGGESTED_SCHOOLS)[number]) {
    if (entries.some((e) => e.id === s.id)) return;
    const entry: SchoolEntry = {
      id: s.id,
      name: s.name,
      location: s.location,
      admitRate: s.admitRate,
      category: 'unassigned',
      addedAt: Date.now(),
    };
    await idbPut('schoolShortlist', entry.id, entry);
    setEntries((prev) => [entry, ...prev]);
  }

  async function addCustom() {
    if (!customName.trim()) return;
    const entry: SchoolEntry = {
      id: uid(),
      name: customName.trim(),
      location: customLocation.trim(),
      category: 'unassigned',
      addedAt: Date.now(),
    };
    await idbPut('schoolShortlist', entry.id, entry);
    setEntries((prev) => [entry, ...prev]);
    setCustomName('');
    setCustomLocation('');
  }

  async function updateEntry(id: string, patch: Partial<SchoolEntry>) {
    const current = entries.find((e) => e.id === id);
    if (!current) return;
    const merged = { ...current, ...patch };
    setEntries((prev) => prev.map((e) => (e.id === id ? merged : e)));
    await idbPut('schoolShortlist', id, merged);
  }

  async function removeEntry(id: string) {
    await idbDelete('schoolShortlist', id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setSelectedForCompare((prev) => prev.filter((x) => x !== id));
  }

  async function runReasoner(entry: SchoolEntry) {
    setRunningId(entry.id);
    const intake = (await idbGet<IntakeData>('intake', 'current')) ?? null;
    const reasoning = await reasonSchoolFit({
      intake,
      schoolName: entry.name,
      location: entry.location,
      admitRate: entry.admitRate,
      locale,
    });
    await updateEntry(entry.id, { reasoning });
    setRunningId(null);
  }

  function toggleCompare(id: string) {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  }

  const compareEntries = entries.filter((e) => selectedForCompare.includes(e.id));

  if (loading) {
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
          <Eyebrow>{t.schools.eyebrow}</Eyebrow>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">{t.schools.title}</h1>
          <p className="lead max-w-xl">{t.schools.lede}</p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col justify-end gap-3">
          <AIModeBadge />
          <Button onClick={() => setCompare((v) => !v)} variant="outline" size="sm">
            <ArrowLeftRight size={12} /> {compare ? t.schools.exitCompare : t.schools.compare}
          </Button>
        </div>
      </header>

      {compare && compareEntries.length >= 2 ? (
        <section className="border border-divider overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider">
                <th className="p-4 eyebrow">{locale === 'vi' ? 'Tiêu chí' : 'Axis'}</th>
                {compareEntries.map((e) => (
                  <th key={e.id} className="p-4 font-serif text-base">{e.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <Row label={t.schools.location} entries={compareEntries} get={(e) => e.location} />
              <Row label={t.schools.admitRate} entries={compareEntries} get={(e) => e.admitRate ?? '—'} />
              <Row label={t.schools.filterBy} entries={compareEntries} get={(e) => (t.schools.categories as Record<string, string>)[e.category] ?? e.category} />
              <Row label={t.schools.fitNotes} entries={compareEntries} get={(e) => e.reasoning?.whyFits.join(' · ') ?? '—'} />
              <Row label={t.schools.stretchNotes} entries={compareEntries} get={(e) => e.reasoning?.whyStretch.join(' · ') ?? '—'} />
              <Row label={t.schools.unknown} entries={compareEntries} get={(e) => e.reasoning?.uncertain.join(' · ') ?? '—'} />
            </tbody>
          </table>
        </section>
      ) : null}

      {/* Filters */}
      <section className="space-y-6">
        <div className="flex flex-wrap gap-1 border-b border-divider">
          {(['all', 'fit', 'stretch', 'safer'] as FilterTab[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors border-b-2 -mb-px ${
                filter === f ? 'text-forest border-forest' : 'text-slate border-transparent hover:text-ink'
              }`}
            >
              {f === 'all' ? t.schools.all : (t.schools.categories as Record<string, string>)[f]}
              {' · '}
              {f === 'all' ? entries.length : entries.filter((e) => e.category === f).length}
            </button>
          ))}
        </div>

        <p className="eyebrow">{t.schools.shortlist}</p>
        {visibleEntries.length === 0 ? (
          <Panel tone="alt" className="p-8">
            <p className="text-sm italic text-slate">{t.schools.empty}</p>
          </Panel>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleEntries.map((e) => (
              <li key={e.id}>
                <SchoolCard
                  entry={e}
                  onUpdate={(patch) => updateEntry(e.id, patch)}
                  onRemove={() => removeEntry(e.id)}
                  onRun={() => runReasoner(e)}
                  running={runningId === e.id}
                  compareMode={compare}
                  selectedForCompare={selectedForCompare.includes(e.id)}
                  toggleCompare={() => toggleCompare(e.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Add */}
      <section className="space-y-6">
        <p className="eyebrow">{t.schools.addSchool}</p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === 'vi' ? 'Tìm trường trong thư viện' : 'Search the suggestion library'}
            className="flex-1 bg-transparent border-b border-divider py-2 font-serif focus:outline-none focus:border-forest"
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {suggestedFiltered.slice(0, 18).map((s) => {
            const already = entries.some((e) => e.id === s.id);
            return (
              <button
                key={s.id}
                onClick={() => addFromSuggestion(s)}
                disabled={already}
                className="text-left p-3 border border-divider hover:border-ink/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="font-serif text-sm">{s.name}</div>
                <div className="text-xs text-slate flex items-center gap-1 mt-1">
                  <MapPin size={11} /> {s.location}
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-divider pt-6 flex flex-col md:flex-row gap-3 items-end">
          <label className="block flex-1 space-y-1">
            <span className="eyebrow">{t.schools.addCustom}</span>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={t.schools.name}
              className="w-full bg-transparent border-b border-divider py-2 font-serif focus:outline-none focus:border-forest"
            />
          </label>
          <label className="block flex-1 space-y-1">
            <span className="eyebrow">{t.schools.location}</span>
            <input
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder={t.schools.location}
              className="w-full bg-transparent border-b border-divider py-2 font-serif focus:outline-none focus:border-forest"
            />
          </label>
          <Button onClick={addCustom} disabled={!customName.trim()} variant="secondary" size="sm">
            <Plus size={12} /> {t.common.add}
          </Button>
        </div>
      </section>
    </div>
  );
}

function Row({ label, entries, get }: { label: string; entries: SchoolEntry[]; get: (e: SchoolEntry) => string }) {
  return (
    <tr className="border-b border-divider">
      <td className="p-4 eyebrow text-ink/60">{label}</td>
      {entries.map((e) => (
        <td key={e.id} className="p-4 align-top text-sm">{get(e)}</td>
      ))}
    </tr>
  );
}

function SchoolCard({
  entry,
  onUpdate,
  onRemove,
  onRun,
  running,
  compareMode,
  selectedForCompare,
  toggleCompare,
}: {
  entry: SchoolEntry;
  onUpdate: (patch: Partial<SchoolEntry>) => void;
  onRemove: () => void;
  onRun: () => void;
  running: boolean;
  compareMode: boolean;
  selectedForCompare: boolean;
  toggleCompare: () => void;
}) {
  const { t } = useLocale();
  return (
    <article
      className={`p-5 border flex flex-col gap-3 h-full ${
        selectedForCompare ? 'border-forest bg-paper-alt' : 'border-divider bg-paper'
      }`}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif text-lg leading-tight">{entry.name}</h3>
          <p className="text-xs text-slate flex items-center gap-1 mt-1">
            <MapPin size={11} /> {entry.location}
            {entry.admitRate ? <span className="ml-2 text-bronze">{entry.admitRate}</span> : null}
          </p>
        </div>
        {compareMode ? (
          <button
            onClick={toggleCompare}
            className={`text-[10px] uppercase tracking-[0.22em] px-2 py-1 border ${
              selectedForCompare ? 'bg-forest text-paper border-forest' : 'border-divider'
            }`}
          >
            {selectedForCompare ? '✓' : '+'}
          </button>
        ) : null}
      </header>

      <div className="flex flex-wrap gap-1">
        {(['fit', 'stretch', 'safer'] as const).map((c) => (
          <button
            key={c}
            onClick={() => onUpdate({ category: c })}
            className={`text-[10px] uppercase tracking-[0.22em] px-2 py-1 border ${
              entry.category === c ? (c === 'fit' ? 'bg-forest text-paper border-forest' : c === 'stretch' ? 'bg-oxblood text-paper border-oxblood' : 'bg-bronze text-paper border-bronze') : 'border-divider text-slate hover:border-ink/40'
            }`}
          >
            {(t.schools.categories as Record<string, string>)[c]}
          </button>
        ))}
      </div>

      <textarea
        value={entry.notes ?? ''}
        onChange={(e) => onUpdate({ notes: e.target.value })}
        placeholder={t.schools.notes}
        rows={2}
        className="w-full bg-paper-alt/60 border border-divider p-2 text-sm font-serif focus:outline-none focus:border-forest"
      />

      {entry.reasoning ? (
        <div className="space-y-2 text-xs text-slate">
          {entry.reasoning.whyFits.length > 0 ? (
            <div>
              <p className="eyebrow text-forest">{t.schools.fitNotes}</p>
              <ul className="list-disc list-inside marker:text-forest/40 text-[13px] text-ink/80">
                {entry.reasoning.whyFits.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ) : null}
          {entry.reasoning.whyStretch.length > 0 ? (
            <div>
              <p className="eyebrow text-oxblood">{t.schools.stretchNotes}</p>
              <ul className="list-disc list-inside marker:text-oxblood/40 text-[13px] text-ink/80">
                {entry.reasoning.whyStretch.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ) : null}
          {entry.reasoning.uncertain.length > 0 ? (
            <div>
              <p className="eyebrow">{t.schools.unknown}</p>
              <ul className="list-disc list-inside marker:text-bronze/40 text-[13px] text-ink/80">
                {entry.reasoning.uncertain.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ) : null}
          {entry.reasoning.verifyNext.length > 0 ? (
            <div>
              <p className="eyebrow">{t.schools.verify}</p>
              <ul className="list-disc list-inside marker:text-ink/20 text-[13px] text-ink/80">
                {entry.reasoning.verifyNext.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-divider">
        <button
          onClick={onRun}
          disabled={running}
          className="text-[11px] uppercase tracking-[0.22em] text-forest disabled:opacity-40"
        >
          {running ? t.common.analyzing : t.schools.runReasoner}
        </button>
        <button onClick={onRemove} className="text-[11px] uppercase tracking-[0.22em] text-oxblood inline-flex items-center gap-1">
          <Trash2 size={11} /> {t.common.remove}
        </button>
      </div>
    </article>
  );
}
