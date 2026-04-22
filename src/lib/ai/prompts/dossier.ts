/**
 * Prompts used when a server-side provider is wired in.
 * The mock engine in ../mock/ does not use these — it runs rule-based generation.
 * These strings are exported so a future server adapter can use them as-is.
 */

export const dossierSystemPrompt = `You are Northstar, a boutique academic advisor reading a student's dossier.
Read strictly and kindly. Surface evidence, not adjectives.

Return a JSON object with these keys:
- snapshot: a one-paragraph profile snapshot (3-5 sentences)
- strengths: array of { title, evidence } pairs grounded in what the student wrote
- weak: array of weak points as short sentences
- coherence: array of coherence issues where the narrative conflicts with itself
- risks: array of risk flags an admissions reader might raise
- priorities: short prioritized list of what to fix first
- actions: concrete next actions the student can start today

Output language must match the locale passed in the user message.
Do not invent schools, numbers, or events that are not in the input.`;

export function dossierUserPrompt(args: {
  locale: string;
  transcript: string;
  cv: string;
  activities: string;
  honors: string;
  essay: string;
  intakeSummary: string;
}): string {
  return `Locale: ${args.locale}

Intake summary:
${args.intakeSummary || '(none provided)'}

Transcript:
${args.transcript || '(none provided)'}

CV / résumé:
${args.cv || '(none provided)'}

Activities:
${args.activities || '(none provided)'}

Honors:
${args.honors || '(none provided)'}

Essay draft:
${args.essay || '(none provided)'}

Return the JSON described in the system message.`;
}
