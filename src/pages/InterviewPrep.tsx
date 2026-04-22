import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AIModeBadge } from '../components/AIModeBadge';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Panel } from '../components/ui/Panel';
import { INTERVIEW_QUESTIONS } from '../data/questions';
import { useLocale } from '../hooks/useLocale';
import { evaluateInterview } from '../lib/ai/actions';
import { idbAll, idbDelete, idbPut } from '../lib/storage/indexedDB';
import type { InterviewAnswer, InterviewFeedback } from '../lib/storage/schemas';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function InterviewPrep() {
  const { t, locale } = useLocale();
  const [activeId, setActiveId] = useState<string>(INTERVIEW_QUESTIONS[0].id);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [history, setHistory] = useState<InterviewAnswer[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    idbAll<InterviewAnswer>('interviewAnswers').then((rows) => {
      setHistory(rows.map((r) => r.value).sort((a, b) => b.createdAt - a.createdAt));
    });
  }, []);

  const question = useMemo(() => INTERVIEW_QUESTIONS.find((q) => q.id === activeId) ?? INTERVIEW_QUESTIONS[0], [activeId]);

  async function runFeedback() {
    setRunning(true);
    const f = await evaluateInterview({
      questionText: locale === 'vi' ? question.vi : question.en,
      category: question.category,
      answer,
      locale,
    });
    setFeedback(f);
    setRunning(false);
  }

  async function saveAnswer() {
    const entry: InterviewAnswer = {
      id: uid(),
      questionId: question.id,
      questionText: locale === 'vi' ? question.vi : question.en,
      category: question.category,
      answer,
      feedback: feedback ?? undefined,
      createdAt: Date.now(),
    };
    await idbPut('interviewAnswers', entry.id, entry);
    setHistory((prev) => [entry, ...prev]);
    setAnswer('');
    setFeedback(null);
  }

  async function removeEntry(id: string) {
    await idbDelete('interviewAnswers', id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }

  function categoriesOf(cat: string): string {
    const map = t.interview.questionCategories as Record<string, string>;
    return map[cat] ?? cat;
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-14 md:py-20 space-y-12">
      <header className="editorial-grid gap-y-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Eyebrow>{t.interview.eyebrow}</Eyebrow>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">{t.interview.title}</h1>
          <p className="lead max-w-xl">{t.interview.lede}</p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col justify-end">
          <AIModeBadge />
        </div>
      </header>

      <div className="editorial-grid gap-8">
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <p className="eyebrow">{t.interview.pickQuestion}</p>
          <ul className="space-y-2">
            {INTERVIEW_QUESTIONS.map((q) => (
              <li key={q.id}>
                <button
                  onClick={() => { setActiveId(q.id); setAnswer(''); setFeedback(null); }}
                  className={`w-full text-left p-4 border transition-colors ${
                    activeId === q.id ? 'border-forest bg-paper-alt' : 'border-divider hover:border-ink/40'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] text-bronze mb-1">{categoriesOf(q.category)}</div>
                  <div className="font-serif text-[15px] leading-snug">{locale === 'vi' ? q.vi : q.en}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="col-span-12 lg:col-span-8 space-y-8">
          <Panel tone="paper" className="p-8">
            <div className="mb-4">
              <p className="eyebrow mb-2">{categoriesOf(question.category)}</p>
              <h2 className="font-serif text-2xl md:text-3xl leading-tight">{locale === 'vi' ? question.vi : question.en}</h2>
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.interview.placeholder}
              rows={10}
              className="w-full bg-paper border border-divider p-5 font-serif text-base leading-relaxed focus:outline-none focus:border-forest min-h-[240px]"
              spellCheck={false}
            />
            <div className="flex flex-wrap gap-3 mt-4 items-center">
              <Button onClick={runFeedback} variant="primary" disabled={running || answer.trim().length < 20}>
                {running ? t.common.analyzing : t.interview.runFeedback}
              </Button>
              <Button onClick={saveAnswer} variant="outline" size="sm" disabled={answer.trim().length === 0}>
                {t.interview.addAnswer}
              </Button>
              <span className="text-xs text-slate ml-auto">
                {(answer.trim().match(/\S+/g) ?? []).length} {t.common.words}
              </span>
            </div>
          </Panel>

          {feedback ? <FeedbackPanel feedback={feedback} /> : null}

          <section>
            <div className="flex items-baseline justify-between mb-4">
              <p className="eyebrow">{t.interview.history}</p>
              <span className="text-xs text-slate">{history.length}</span>
            </div>
            {history.length === 0 ? (
              <p className="text-sm italic text-slate">{t.interview.noHistory}</p>
            ) : (
              <ul className="space-y-4">
                {history.map((h) => (
                  <li key={h.id} className="border border-divider p-4">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <p className="font-serif text-[15px] leading-snug">{h.questionText}</p>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-bronze">
                        {categoriesOf(h.category)} · {new Date(h.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                      </span>
                    </div>
                    <p className="text-sm text-slate mt-2 leading-relaxed whitespace-pre-wrap">{h.answer}</p>
                    {h.feedback ? (
                      <div className="mt-3 border-t border-divider pt-3 text-xs text-slate space-y-1">
                        <p>{t.interview.better}: <span className="text-ink">{h.feedback.better}</span></p>
                        <p>{t.interview.followUp}: <span className="text-ink">{h.feedback.followUp}</span></p>
                      </div>
                    ) : null}
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => removeEntry(h.id)}
                        className="text-[10px] uppercase tracking-[0.22em] text-oxblood inline-flex items-center gap-1"
                      >
                        <Trash2 size={11} /> {t.common.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}

function FeedbackPanel({ feedback }: { feedback: InterviewFeedback }) {
  const { t } = useLocale();
  return (
    <Panel tone="alt" className="p-8 space-y-6">
      <div>
        <p className="eyebrow mb-3">{t.interview.rubric}</p>
        <ul className="space-y-2">
          {feedback.rubric.map((r) => (
            <li key={r.label} className="grid grid-cols-[140px_140px_1fr] items-center gap-3 border-t border-divider pt-2 first:border-t-0 first:pt-0">
              <span className="text-[11px] uppercase tracking-[0.22em] text-slate">{r.label}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`w-4 h-1 ${s <= r.score ? 'bg-forest' : 'bg-paper-sunken'}`}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="text-xs text-ink font-serif leading-snug">{r.note}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Block title={t.interview.strengths} items={feedback.strengths} tone="forest" />
        <Block title={t.interview.weak} items={feedback.weak} tone="oxblood" />
      </div>
      {feedback.vague.length > 0 ? (
        <div>
          <p className="eyebrow mb-2">{t.interview.vague}</p>
          <div className="flex flex-wrap gap-2">
            {feedback.vague.map((v) => (
              <span key={v} className="text-[11px] px-2 py-1 bg-oxblood/10 text-oxblood border border-oxblood/20 font-mono">
                {v}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="border-t border-divider pt-4">
        <p className="eyebrow mb-2">{t.interview.better}</p>
        <p className="font-serif text-[15px] leading-relaxed">{feedback.better}</p>
      </div>
      <div className="border-t border-divider pt-4">
        <p className="eyebrow mb-2">{t.interview.followUp}</p>
        <p className="font-serif italic text-[15px]">{feedback.followUp}</p>
      </div>
    </Panel>
  );
}

function Block({ title, items, tone }: { title: string; items: string[]; tone?: 'forest' | 'oxblood' }) {
  const { t } = useLocale();
  const dotCls = tone === 'forest' ? 'bg-forest' : tone === 'oxblood' ? 'bg-oxblood' : 'bg-bronze';
  return (
    <div>
      <p className={`eyebrow mb-2 ${tone === 'forest' ? 'text-forest' : tone === 'oxblood' ? 'text-oxblood' : ''}`}>{title}</p>
      {items.length === 0 ? (
        <p className="text-sm italic text-slate">{t.common.empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${dotCls}`} aria-hidden />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
