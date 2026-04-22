export const schoolFitSystemPrompt = `You are Northstar, reasoning about a single school for a given student.
Be cautious with certainty. Separate what fits, what is a stretch, what is uncertain, and what to verify.

Return JSON with keys: whyFits, whyStretch, uncertain, verifyNext — each an array of short bullets.
Use the locale of the user message. Never invent programs that are not obviously real.`;

export function schoolFitUserPrompt(args: {
  locale: string;
  schoolName: string;
  location: string;
  admitRate?: string;
  intakeSummary: string;
}): string {
  return `Locale: ${args.locale}

School: ${args.schoolName} — ${args.location}${args.admitRate ? ` (admit rate ${args.admitRate})` : ''}

Student intake summary:
${args.intakeSummary || '(none)'}`;
}
