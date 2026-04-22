import { Check, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SelectField, TextArea, TextField } from '../components/ui/Field';
import { Button, LinkButton } from '../components/ui/Button';
import { useLocale } from '../hooks/useLocale';
import { useIndexedDBState } from '../hooks/useIndexedDBState';
import { emptyIntake, type IntakeActivity, type IntakeData, type IntakeHonor } from '../lib/storage/schemas';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function Intake() {
  const { t, locale } = useLocale();
  const navigate = useNavigate();

  const { value: intake, setValue: setIntake, loaded } = useIndexedDBState<IntakeData>('intake', 'current', emptyIntake);

  const [stepIndex, setStepIndex] = useState(0);

  function goTo(n: number) {
    const clamped = Math.max(0, Math.min(t.intake.steps.length - 1, n));
    setStepIndex(clamped);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function update<K extends keyof IntakeData>(key: K, value: IntakeData[K]) {
    setIntake((prev) => ({ ...prev, [key]: value, updatedAt: Date.now() }));
  }

  function markComplete(stepKey: string) {
    setIntake((prev) =>
      prev.completedSteps.includes(stepKey)
        ? prev
        : { ...prev, completedSteps: [...prev.completedSteps, stepKey], updatedAt: Date.now() },
    );
  }

  function addActivity() {
    const a: IntakeActivity = { id: uid(), name: '', role: '', hoursPerWeek: 0, weeksPerYear: 0, description: '' };
    setIntake((p) => ({ ...p, activities: [...p.activities, a], updatedAt: Date.now() }));
  }
  function updateActivity(id: string, patch: Partial<IntakeActivity>) {
    setIntake((p) => ({
      ...p,
      activities: p.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      updatedAt: Date.now(),
    }));
  }
  function removeActivity(id: string) {
    setIntake((p) => ({ ...p, activities: p.activities.filter((a) => a.id !== id), updatedAt: Date.now() }));
  }

  function addHonor() {
    const h: IntakeHonor = { id: uid(), name: '', level: 'School', year: '', description: '' };
    setIntake((p) => ({ ...p, honors: [...p.honors, h], updatedAt: Date.now() }));
  }
  function updateHonor(id: string, patch: Partial<IntakeHonor>) {
    setIntake((p) => ({ ...p, honors: p.honors.map((h) => (h.id === id ? { ...h, ...patch } : h)), updatedAt: Date.now() }));
  }
  function removeHonor(id: string) {
    setIntake((p) => ({ ...p, honors: p.honors.filter((h) => h.id !== id), updatedAt: Date.now() }));
  }

  const step = t.intake.steps[stepIndex];

  function next() {
    markComplete(step.key);
    if (stepIndex === t.intake.steps.length - 1) {
      setIntake((p) => ({ ...p, updatedAt: Date.now() }));
      navigate('/dashboard');
    } else {
      goTo(stepIndex + 1);
    }
  }

  function onResetIntake() {
    if (typeof window !== 'undefined' && !window.confirm(t.intake.resetConfirm)) return;
    setIntake({ ...emptyIntake, updatedAt: Date.now() });
    goTo(0);
  }

  if (!loaded) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-32">
        <p className="eyebrow">{t.common.loading}…</p>
      </section>
    );
  }

  return (
    <div>
      <section className="border-b border-divider">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-14 md:py-20 editorial-grid gap-y-6">
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <Eyebrow>{t.intake.eyebrow}</Eyebrow>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight">{t.intake.title}</h1>
            <p className="lead max-w-xl">{t.intake.lede}</p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:pl-10 flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2">
              {t.intake.steps.map((s, i) => {
                const isDone = intake.completedSteps.includes(s.key);
                const isActive = i === stepIndex;
                return (
                  <button
                    key={s.key}
                    onClick={() => goTo(i)}
                    className={`text-[10px] uppercase tracking-[0.22em] px-2.5 py-1.5 border transition-colors ${
                      isActive
                        ? 'bg-ink text-paper border-ink'
                        : isDone
                        ? 'bg-forest/10 text-forest border-forest/40'
                        : 'text-slate border-divider hover:border-ink/40'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')} · {s.title}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 h-px bg-divider relative">
              <motion.div
                className="absolute left-0 top-0 h-px bg-forest"
                initial={false}
                animate={{ width: `${((stepIndex + 1) / t.intake.steps.length) * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 md:px-10 py-16">
        <div className="mb-10">
          <p className="eyebrow mb-3">{`0${stepIndex + 1} / 0${t.intake.steps.length}`}</p>
          <h2 className="font-serif text-3xl md:text-4xl">{step.title}</h2>
          <p className="text-sm text-slate mt-2">{step.description}</p>
        </div>

        <div className="border border-divider bg-paper p-6 md:p-12 space-y-10">
          {step.key === 'identity' && (
            <div className="grid md:grid-cols-2 gap-8">
              <TextField label={t.intake.field.fullName} value={intake.fullName} onChange={(e) => update('fullName', e.target.value)} />
              <TextField label={t.intake.field.grade} value={intake.grade} onChange={(e) => update('grade', e.target.value)} />
              <TextField label={t.intake.field.school} value={intake.school} onChange={(e) => update('school', e.target.value)} />
              <TextField label={t.intake.field.country} value={intake.country} onChange={(e) => update('country', e.target.value)} />
            </div>
          )}

          {step.key === 'academic' && (
            <div className="grid md:grid-cols-2 gap-8">
              <TextField label={t.intake.field.gpa} value={intake.gpa} onChange={(e) => update('gpa', e.target.value)} />
              <TextField label={t.intake.field.gpaScale} value={intake.gpaScale} onChange={(e) => update('gpaScale', e.target.value)} />
              <TextField
                label={t.intake.field.curriculum}
                help={t.intake.field.curriculumHelp}
                value={intake.curriculum}
                onChange={(e) => update('curriculum', e.target.value)}
              />
              <TextField
                label={t.intake.field.testScores}
                help={t.intake.field.testHelp}
                value={intake.testScores}
                onChange={(e) => update('testScores', e.target.value)}
              />
              <div className="md:col-span-2">
                <TextArea
                  rows={4}
                  label={t.intake.field.rigor}
                  help={t.intake.field.rigorHelp}
                  value={intake.rigor}
                  onChange={(e) => update('rigor', e.target.value)}
                />
              </div>
            </div>
          )}

          {step.key === 'strengths' && (
            <div className="grid md:grid-cols-2 gap-8">
              <TextArea
                rows={6}
                label={t.intake.field.strengths}
                help={t.intake.field.strengthsHelp}
                value={intake.strengths}
                onChange={(e) => update('strengths', e.target.value)}
              />
              <TextArea
                rows={6}
                label={t.intake.field.weaknesses}
                help={t.intake.field.weaknessesHelp}
                value={intake.weaknesses}
                onChange={(e) => update('weaknesses', e.target.value)}
              />
            </div>
          )}

          {step.key === 'goals' && (
            <div className="space-y-8">
              <TextArea
                rows={3}
                label={t.intake.field.majors}
                help={t.intake.field.majorsHelp}
                value={intake.majors}
                onChange={(e) => update('majors', e.target.value)}
              />
              <TextArea
                rows={4}
                label={t.intake.field.ambition}
                value={intake.ambition}
                onChange={(e) => update('ambition', e.target.value)}
                optional
              />
            </div>
          )}

          {step.key === 'geography' && (
            <div className="space-y-6">
              <p className="eyebrow">{t.intake.field.countries}</p>
              <div className="flex flex-wrap gap-2">
                {t.intake.countryOptions.map((c) => {
                  const selected = intake.targetCountries.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        update(
                          'targetCountries',
                          selected ? intake.targetCountries.filter((x) => x !== c) : [...intake.targetCountries, c],
                        )
                      }
                      className={`text-sm font-serif px-4 py-2 border transition-colors ${
                        selected ? 'bg-forest text-paper border-forest' : 'border-divider hover:border-ink/40'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step.key === 'activities' && (
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">{t.intake.field.activities}</p>
                  <Button size="sm" variant="outline" onClick={addActivity}>
                    <Plus size={12} /> {t.intake.addActivity}
                  </Button>
                </div>
                {intake.activities.length === 0 ? (
                  <p className="text-sm text-slate italic">{t.common.empty}</p>
                ) : (
                  <div className="space-y-6">
                    {intake.activities.map((a) => (
                      <div key={a.id} className="border border-divider p-5 md:p-6 space-y-4 bg-paper-alt/60">
                        <div className="grid md:grid-cols-2 gap-6">
                          <TextField label={t.intake.activity.name} value={a.name} onChange={(e) => updateActivity(a.id, { name: e.target.value })} />
                          <TextField label={t.intake.activity.role} value={a.role} onChange={(e) => updateActivity(a.id, { role: e.target.value })} />
                          <TextField
                            label={t.intake.activity.hoursWeek}
                            type="number"
                            min={0}
                            value={a.hoursPerWeek || ''}
                            onChange={(e) => updateActivity(a.id, { hoursPerWeek: Number(e.target.value) || 0 })}
                          />
                          <TextField
                            label={t.intake.activity.weeksYear}
                            type="number"
                            min={0}
                            value={a.weeksPerYear || ''}
                            onChange={(e) => updateActivity(a.id, { weeksPerYear: Number(e.target.value) || 0 })}
                          />
                        </div>
                        <TextArea
                          rows={3}
                          label={t.intake.activity.description}
                          value={a.description}
                          onChange={(e) => updateActivity(a.id, { description: e.target.value })}
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeActivity(a.id)}
                            className="text-[10px] uppercase tracking-[0.22em] text-oxblood hover:underline inline-flex items-center gap-1"
                          >
                            <Trash2 size={12} /> {t.common.remove}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">{t.intake.field.honors}</p>
                  <Button size="sm" variant="outline" onClick={addHonor}>
                    <Plus size={12} /> {t.intake.addHonor}
                  </Button>
                </div>
                {intake.honors.length === 0 ? (
                  <p className="text-sm text-slate italic">{t.common.empty}</p>
                ) : (
                  <div className="space-y-6">
                    {intake.honors.map((h) => (
                      <div key={h.id} className="border border-divider p-5 md:p-6 space-y-4 bg-paper-alt/60">
                        <div className="grid md:grid-cols-3 gap-6">
                          <TextField label={t.intake.honor.name} value={h.name} onChange={(e) => updateHonor(h.id, { name: e.target.value })} />
                          <SelectField
                            label={t.intake.honor.level}
                            options={t.intake.levels}
                            value={(h.level === 'School'
                              ? t.intake.levels[0]
                              : h.level === 'Regional'
                              ? t.intake.levels[1]
                              : h.level === 'National'
                              ? t.intake.levels[2]
                              : t.intake.levels[3])}
                            onChange={(v) => {
                              const idx = t.intake.levels.indexOf(v);
                              const levels: IntakeHonor['level'][] = ['School', 'Regional', 'National', 'International'];
                              updateHonor(h.id, { level: levels[idx] ?? 'School' });
                            }}
                          />
                          <TextField label={t.intake.honor.year} value={h.year} onChange={(e) => updateHonor(h.id, { year: e.target.value })} />
                        </div>
                        <TextArea
                          rows={2}
                          label={t.intake.honor.description}
                          value={h.description}
                          onChange={(e) => updateHonor(h.id, { description: e.target.value })}
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeHonor(h.id)}
                            className="text-[10px] uppercase tracking-[0.22em] text-oxblood hover:underline inline-flex items-center gap-1"
                          >
                            <Trash2 size={12} /> {t.common.remove}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step.key === 'essays' && (
            <div className="space-y-8">
              <SelectField
                label={t.intake.field.essayStatus}
                options={t.intake.essayStatuses}
                value={intake.essayStatus}
                onChange={(v) => update('essayStatus', v)}
                placeholder="—"
              />
            </div>
          )}

          {step.key === 'constraints' && (
            <div className="grid md:grid-cols-2 gap-8">
              <TextArea rows={3} label={t.intake.field.budget} value={intake.budget} onChange={(e) => update('budget', e.target.value)} optional />
              <TextArea rows={3} label={t.intake.field.deadlines} value={intake.deadlines} onChange={(e) => update('deadlines', e.target.value)} optional />
              <div className="md:col-span-2">
                <TextArea rows={3} label={t.intake.field.family} value={intake.family} onChange={(e) => update('family', e.target.value)} optional />
              </div>
            </div>
          )}

          {step.key === 'review' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <SummaryItem label={t.intake.field.fullName} value={intake.fullName} locale={locale} />
                <SummaryItem label={t.intake.field.school} value={intake.school} locale={locale} />
                <SummaryItem label={t.intake.field.gpa} value={intake.gpa ? `${intake.gpa} / ${intake.gpaScale}` : ''} locale={locale} />
                <SummaryItem label={t.intake.field.curriculum} value={intake.curriculum} locale={locale} />
                <SummaryItem label={t.intake.field.testScores} value={intake.testScores} locale={locale} />
                <SummaryItem label={t.intake.field.majors} value={intake.majors} locale={locale} />
                <SummaryItem label={t.intake.field.countries} value={intake.targetCountries.join(', ')} locale={locale} />
                <SummaryItem
                  label={t.intake.field.activities}
                  value={`${intake.activities.length}`}
                  locale={locale}
                />
                <SummaryItem label={t.intake.field.honors} value={`${intake.honors.length}`} locale={locale} />
                <SummaryItem label={t.intake.field.essayStatus} value={intake.essayStatus} locale={locale} />
              </div>
              <div className="border-t border-divider pt-6 flex items-center gap-3 text-forest">
                <Check size={16} />
                <span className="text-sm">{t.intake.submitted}</span>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-divider flex items-center justify-between">
            <button
              type="button"
              onClick={() => goTo(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
              className="text-[11px] uppercase tracking-[0.24em] text-slate disabled:opacity-0"
            >
              ← {t.common.back}
            </button>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onResetIntake}
                className="text-[11px] uppercase tracking-[0.24em] text-slate hover:text-oxblood"
              >
                {t.intake.resetIntake}
              </button>
              {stepIndex === t.intake.steps.length - 1 ? (
                <LinkButton to="/dashboard" variant="primary">
                  {t.intake.goDashboard}
                </LinkButton>
              ) : (
                <Button onClick={next} variant="secondary">
                  {t.common.next} →
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryItem({ label, value, locale }: { label: string; value: string; locale: string }) {
  return (
    <div className="border-t border-divider pt-3">
      <p className="eyebrow">{label}</p>
      <p className="font-serif mt-1 text-ink">{value || (locale === 'vi' ? '—' : '—')}</p>
    </div>
  );
}
