import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AIModeBadge } from '../components/AIModeBadge';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Panel } from '../components/ui/Panel';
import { useLocale } from '../hooks/useLocale';
import { reviewEssay } from '../lib/ai/actions';
import { idbAll, idbDelete, idbPut } from '../lib/storage/indexedDB';
import type { EssayDraft, EssayReviewResult, StoryEntry } from '../lib/storage/schemas';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function countWords(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length;
}

export default function EssayLab() {
  const { t, locale } = useLocale();
  const [drafts, setDrafts] = useState<EssayDraft[]>([]);
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    Promise.all([
      idbAll<EssayDraft>('essays').then((rows) => rows.map((r) => r.value)),
      idbAll<StoryEntry>('stories').then((rows) => rows.map((r) => r.value)),
    ]).then(([d, s]) => {
      const filtered = d.filter((x) => x.id);
      setDrafts(filtered.sort((a, b) => b.updatedAt - a.updatedAt));
      setStories(s.sort((a, b) => b.createdAt - a.createdAt));
      setActiveId((filtered[0]?.id) ?? null);
      setLoading(false);
    });
  }, []);

  const active = useMemo(() => drafts.find((d) => d.id === activeId) ?? null, [drafts, activeId]);

  async function upsertDraft(next: EssayDraft) {
    const merged = { ...next, wordCount: countWords(next.content), updatedAt: Date.now() };
    setDrafts((prev) => {
      const exists = prev.some((d) => d.id === merged.id);
      return exists ? prev.map((d) => (d.id === merged.id ? merged : d)) : [merged, ...prev];
    });
    await idbPut('essays', merged.id, merged);
  }

  async function newDraft() {
    const d: EssayDraft = {
      id: uid(),
      title: '',
      prompt: '',
      outline: '',
      content: '',
      wordCount: 0,
      updatedAt: Date.now(),
    };
    await idbPut('essays', d.id, d);
    setDrafts((prev) => [d, ...prev]);
    setActiveId(d.id);
  }

  async function deleteDraft(id: string) {
    if (!window.confirm(t.essay.deleteDraft + '?')) return;
    await idbDelete('essays', id);
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    if (activeId === id) setActiveId(null);
  }

  async function addStory() {
    const s: StoryEntry = { id: uid(), title: '', beats: '', mood: '', createdAt: Date.now() };
    await idbPut('stories', s.id, s);
    setStories((prev) => [s, ...prev]);
  }
  async function updateStory(id: string, patch: Partial<StoryEntry>) {
    const next = stories.find((s) => s.id === id);
    if (!next) return;
    const merged = { ...next, ...patch };
    setStories((prev) => prev.map((s) => (s.id === id ? merged : s)));
    await idbPut('stories', id, merged);
  }
  async function removeStory(id: string) {
    await idbDelete('stories', id);
    setStories((prev) => prev.filter((s) => s.id !== id));
  }

  async function runReview() {
    if (!active) return;
    setRunning(true);
    const result = await reviewEssay({
      prompt: active.prompt,
      outline: active.outline,
      content: active.content,
      locale,
    });
    const updated: EssayDraft = { ...active, review: result, updatedAt: Date.now() };
    setDrafts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    await idbPut('essays', updated.id, updated);
    setRunning(false);
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-[1320px] px-6 md:px-10 py-24">
        <p className="eyebrow">{t.common.loading}…</p>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-14 md:py-20 space-y-10">
      <header className="editorial-grid gap-y-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Eyebrow>{t.essay.eyebrow}</Eyebrow>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">{t.essay.title}</h1>
          <p className="lead max-w-xl">{t.essay.lede}</p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col justify-end">
          <AIModeBadge />
        </div>
      </header>

      <div className="editorial-grid gap-8">
        {/* LEFT: drafts + stories */}
        <aside className="col-span-12 lg:col-span-3 space-y-8">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <p className="eyebrow">{t.essay.drafts}</p>
              <button
                onClick={newDraft}
                className="text-[10px] uppercase tracking-[0.24em] text-forest inline-flex items-center gap-1"
              >
                <Plus size={12} /> {t.essay.newDraft}
              </button>
            </div>
            {drafts.length === 0 ? (
              <p className="text-sm italic text-slate">{t.common.empty}</p>
            ) : (
              <ul className="space-y-2">
                {drafts.map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => setActiveId(d.id)}
                      className={`w-full text-left px-3 py-2 border ${
                        activeId === d.id ? 'border-forest bg-paper-alt' : 'border-transparent hover:border-divider'
                      }`}
                    >
                      <div className="font-serif text-sm truncate">{d.title || t.essay.untitled}</div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-bronze mt-1">
                        {d.wordCount} {t.common.words}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-3">
              <p className="eyebrow">{t.essay.stories}</p>
              <button onClick={addStory} className="text-[10px] uppercase tracking-[0.24em] text-forest inline-flex items-center gap-1">
                <Plus size={12} /> {t.essay.addStory}
              </button>
            </div>
            {stories.length === 0 ? (
              <p className="text-sm italic text-slate">{t.common.empty}</p>
            ) : (
              <ul className="space-y-3">
                {stories.map((s) => (
                  <li key={s.id} className="border border-divider p-3 space-y-2">
                    <input
                      value={s.title}
                      onChange={(e) => updateStory(s.id, { title: e.target.value })}
                      placeholder={t.essay.storyTitle}
                      className="w-full bg-transparent font-serif text-sm focus:outline-none"
                    />
                    <input
                      value={s.mood}
                      onChange={(e) => updateStory(s.id, { mood: e.target.value })}
                      placeholder={t.essay.storyMood}
                      className="w-full bg-transparent text-[11px] uppercase tracking-[0.22em] text-bronze focus:outline-none"
                    />
                    <textarea
                      value={s.beats}
                      onChange={(e) => updateStory(s.id, { beats: e.target.value })}
                      placeholder={t.essay.storyBeats}
                      rows={2}
                      className="w-full bg-transparent text-xs text-slate font-light focus:outline-none resize-none"
                    />
                    <button onClick={() => removeStory(s.id)} className="text-[10px] uppercase tracking-[0.22em] text-oxblood">
                      {t.common.remove}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* CENTER: editor */}
        <section className="col-span-12 lg:col-span-6 space-y-6">
          {active ? (
            <>
              <input
                value={active.title}
                onChange={(e) => upsertDraft({ ...active, title: e.target.value })}
                placeholder={t.essay.untitled}
                className="w-full bg-transparent font-serif text-3xl md:text-4xl placeholder:text-ink/20 focus:outline-none border-b border-divider py-2"
              />
              <textarea
                value={active.prompt}
                onChange={(e) => upsertDraft({ ...active, prompt: e.target.value })}
                placeholder={t.essay.promptPlaceholder}
                rows={2}
                className="w-full bg-paper-alt border border-divider p-4 text-sm font-serif leading-relaxed focus:outline-none focus:border-forest"
              />
              <textarea
                value={active.outline}
                onChange={(e) => upsertDraft({ ...active, outline: e.target.value })}
                placeholder={t.essay.outline + ' — ' + t.essay.outlineHelp}
                rows={3}
                className="w-full bg-paper border border-divider p-4 text-sm font-serif leading-relaxed focus:outline-none focus:border-forest"
              />
              <textarea
                value={active.content}
                onChange={(e) => upsertDraft({ ...active, content: e.target.value })}
                placeholder={t.essay.draftPlaceholder}
                rows={18}
                className="w-full bg-paper border border-divider p-5 md:p-7 font-serif text-lg leading-[1.75] focus:outline-none focus:border-forest min-h-[460px]"
                spellCheck={false}
              />
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-xs text-slate">
                  {active.wordCount} {t.common.words}
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="danger" size="sm" onClick={() => deleteDraft(active.id)}>
                    <Trash2 size={12} /> {t.essay.deleteDraft}
                  </Button>
                  <Button onClick={runReview} disabled={running || countWords(active.content) < 40} variant="primary">
                    {running ? t.common.analyzing : t.essay.runReview}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Panel tone="alt" className="p-12 text-center">
              <p className="lead mb-6">{t.common.empty}</p>
              <Button onClick={newDraft} variant="secondary">
                <Plus size={12} /> {t.essay.newDraft}
              </Button>
            </Panel>
          )}
        </section>

        {/* RIGHT: review */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <ReviewView review={active?.review} running={running} />
        </aside>
      </div>
    </div>
  );
}

function ReviewView({ review, running }: { review?: EssayReviewResult; running: boolean }) {
  const { t } = useLocale();
  if (running) {
    return (
      <Panel tone="alt" className="p-6">
        <p className="eyebrow mb-3">{t.common.analyzing}</p>
        <div className="h-1 w-full bg-paper-sunken overflow-hidden">
          <div className="h-full bg-forest animate-pulse w-1/2" />
        </div>
      </Panel>
    );
  }
  if (!review) {
    return (
      <Panel tone="alt" className="p-6">
        <p className="eyebrow mb-2">{t.essay.review}</p>
        <p className="text-sm italic text-slate">{t.common.empty}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-5">
      <Block title={t.essay.works} items={review.works} tone="forest" />
      <Block title={t.essay.generic} items={review.generic} tone="oxblood" />
      <Block title={t.essay.reflection} items={review.reflection} />
      <Block title={t.essay.voice} items={review.voice} />
      <Block title={t.essay.revision} items={review.revision} tone="forest" />
      {review.phrasing.length > 0 ? <Block title={t.essay.phrasing} items={review.phrasing} /> : null}
      <div className="border-t border-divider pt-4">
        <p className="eyebrow mb-2">{t.essay.genericDetected}</p>
        {review.genericPhrasesDetected.length === 0 ? (
          <p className="text-sm italic text-slate">{t.essay.noneDetected}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {review.genericPhrasesDetected.map((p) => (
              <span key={p} className="text-[11px] px-2 py-1 bg-oxblood/10 text-oxblood border border-oxblood/20 font-mono">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Block({ title, items, tone }: { title: string; items: string[]; tone?: 'forest' | 'oxblood' }) {
  const { t } = useLocale();
  if (items.length === 0) return null;
  const dotCls = tone === 'forest' ? 'bg-forest' : tone === 'oxblood' ? 'bg-oxblood' : 'bg-bronze';
  return (
    <div>
      <p className={`eyebrow mb-2 ${tone === 'forest' ? 'text-forest' : tone === 'oxblood' ? 'text-oxblood' : ''}`}>{title}</p>
      {items.length === 0 ? (
        <p className="text-sm italic text-slate">{t.common.empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${dotCls}`} aria-hidden />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
