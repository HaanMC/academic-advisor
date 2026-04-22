import type { DashboardSnapshot, EssayDraft, IntakeData, SchoolEntry } from './storage/schemas';

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

export function computeReadiness(
  intake: IntakeData | null | undefined,
  drafts: EssayDraft[],
  shortlist: SchoolEntry[],
): DashboardSnapshot {
  const i = intake;

  // Academics (0–100)
  const gpaNum = i?.gpa ? parseFloat(i.gpa.replace(',', '.')) : NaN;
  const gpaScale = i?.gpaScale ? parseFloat(i.gpaScale.replace(',', '.')) : 4;
  const gpaRatio = !isNaN(gpaNum) && !isNaN(gpaScale) && gpaScale > 0 ? gpaNum / gpaScale : 0;
  let academics = clamp(Math.round(gpaRatio * 100));
  if (i?.curriculum) academics = clamp(academics + 4);
  if (i?.rigor && i.rigor.length > 20) academics = clamp(academics + 6);

  // Activities
  const acts = i?.activities ?? [];
  const sustained = acts.filter((a) => a.hoursPerWeek >= 3 && a.weeksPerYear >= 20).length;
  let activities = clamp(30 + acts.length * 6 + sustained * 8);
  if (acts.length > 10 && sustained < 3) activities = clamp(activities - 10);
  if (acts.some((a) => a.description && a.description.length > 40)) activities = clamp(activities + 6);

  // Essays
  const polished = drafts.filter((d) => d.wordCount >= 500).length;
  const essays = clamp(drafts.length === 0 ? 0 : 20 + polished * 25 + drafts.length * 6);

  // Recommendations (we can't really know — use heuristic: curriculum + rigor + honors imply teachers)
  const honors = i?.honors?.length ?? 0;
  const recommendations = clamp(35 + Math.min(30, honors * 8) + (i?.rigor ? 15 : 0) + (i?.curriculum ? 10 : 0));

  // Tests
  const testScores = i?.testScores?.trim() ?? '';
  const tests = testScores.length > 10 ? 80 : testScores.length > 0 ? 50 : 20;

  // Fit
  const fitEntries = shortlist.filter((s) => s.category === 'fit').length;
  const stretchEntries = shortlist.filter((s) => s.category === 'stretch').length;
  const saferEntries = shortlist.filter((s) => s.category === 'safer').length;
  let fit = 20;
  if (fitEntries >= 2) fit += 25;
  if (stretchEntries >= 1) fit += 20;
  if (saferEntries >= 1) fit += 20;
  if (shortlist.length >= 6 && shortlist.length <= 12) fit += 15;
  fit = clamp(fit);

  const dims = [
    { key: 'academics', score: academics },
    { key: 'activities', score: activities },
    { key: 'essays', score: essays },
    { key: 'recommendations', score: recommendations },
    { key: 'tests', score: tests },
    { key: 'fit', score: fit },
  ];

  const readiness = Math.round(dims.reduce((s, d) => s + d.score, 0) / dims.length);

  const strengths: string[] = [];
  if (academics >= 85) strengths.push('Academics');
  if (activities >= 70) strengths.push('Activities');
  if (essays >= 70) strengths.push('Essays');
  if (recommendations >= 70) strengths.push('Recommendations');
  if (tests >= 70) strengths.push('Tests');
  if (fit >= 70) strengths.push('School fit');

  const risks: string[] = [];
  if (academics < 60) risks.push('Academic signal needs reinforcement');
  if (activities < 50) risks.push('Activity list is thin or unverified');
  if (essays < 40) risks.push('Essays lag behind other dimensions');
  if (tests < 40) risks.push('Standardized test line is unclear');
  if (fit < 40) risks.push('School list is not calibrated');

  const missing: string[] = [];
  if (!i?.gpa) missing.push('GPA');
  if (!i?.curriculum) missing.push('Curriculum');
  if (!i?.majors) missing.push('Target majors');
  if ((i?.activities?.length ?? 0) === 0) missing.push('Activity list');
  if ((i?.honors?.length ?? 0) === 0) missing.push('Honors');
  if (drafts.length === 0) missing.push('At least one essay draft');
  if (shortlist.length === 0) missing.push('School shortlist');

  const nextActions: string[] = [];
  if (!i) nextActions.push('Complete intake');
  else {
    if ((i.activities?.length ?? 0) < 4) nextActions.push('Add the rest of your activities');
    if (drafts.length === 0) nextActions.push('Start a draft in Essay Lab');
    if (shortlist.length < 4) nextActions.push('Add four to six schools to your shortlist');
    if (!i.testScores) nextActions.push('Confirm test-taking plan');
  }

  const subjects = ['Math', 'Science', 'Language', 'Humanities', 'Arts'];
  const subjectStrength = subjects.map((s, idx) => {
    const variance = [8, 6, 4, 5, 7][idx] * (Math.sin((academics + idx * 17) / 13) + 1) / 2;
    return { subject: s, score: Math.max(40, Math.round(academics - 6 + variance)) };
  });

  const gpaTrend = (() => {
    const base = isNaN(gpaRatio) || gpaRatio === 0 ? 0.8 : gpaRatio;
    const terms = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    const target = Math.min(1, base);
    return terms.map((t, idx) => ({ term: t, gpa: Number(Math.max(0.5, target - 0.06 + idx * 0.012 + Math.sin(idx) * 0.015).toFixed(2)) }));
  })();

  const buckets: Record<string, number> = {};
  for (const a of acts) {
    const bucket = classifyActivity(a.name + ' ' + a.role + ' ' + a.description);
    buckets[bucket] = (buckets[bucket] ?? 0) + (a.hoursPerWeek || 1) * (a.weeksPerYear || 1);
  }
  const activityBalance = Object.keys(buckets).length
    ? Object.entries(buckets).map(([category, hours]) => ({ category, hours }))
    : [
        { category: 'Academic', hours: 0 },
        { category: 'Creative', hours: 0 },
        { category: 'Service', hours: 0 },
        { category: 'Leadership', hours: 0 },
      ];

  const timeline: DashboardSnapshot['timeline'] = [];
  if (i) timeline.push({ title: 'Intake complete', date: new Date(i.updatedAt || Date.now()).toISOString().slice(0, 10), state: 'done' });
  if (drafts.length) timeline.push({ title: `${drafts.length} essay draft${drafts.length > 1 ? 's' : ''} in progress`, date: new Date().toISOString().slice(0, 10), state: 'now' });
  if (shortlist.length) timeline.push({ title: `${shortlist.length} school${shortlist.length > 1 ? 's' : ''} on shortlist`, date: new Date().toISOString().slice(0, 10), state: 'now' });
  timeline.push({ title: 'Application season', date: '2026-11-01', state: 'soon' });

  return {
    readiness,
    dimensions: dims,
    strengths,
    risks,
    missing,
    nextActions,
    gpaTrend,
    subjectStrength,
    activityBalance,
    timeline,
    generatedAt: Date.now(),
  };
}

function classifyActivity(text: string): string {
  const t = text.toLowerCase();
  if (/(research|lab|olympiad|math|science|physics|chem|biology|competition)/.test(t)) return 'Academic';
  if (/(music|art|theater|theatre|dance|writing|film|design)/.test(t)) return 'Creative';
  if (/(volunteer|community|charity|tutor|mentor|non-profit)/.test(t)) return 'Service';
  if (/(lead|president|captain|founder|chair|editor-in-chief)/.test(t)) return 'Leadership';
  if (/(sport|soccer|football|basketball|tennis|swim|run|track)/.test(t)) return 'Athletic';
  if (/(club|society|council)/.test(t)) return 'Leadership';
  return 'Other';
}
