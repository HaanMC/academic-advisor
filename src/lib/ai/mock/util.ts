import type { Locale } from '../../i18n';
import type { IntakeData } from '../../storage/schemas';

export function wordCount(s: string): number {
  return (s.trim().match(/\S+/g) ?? []).length;
}

export function sentenceCount(s: string): number {
  return (s.match(/[.!?…]+\s|[.!?…]+$/g) ?? []).length;
}

export function hasContent(s: string | undefined | null, minWords = 10): boolean {
  if (!s) return false;
  return wordCount(s) >= minWords;
}

export function stripLower(s: string): string {
  return s.toLowerCase();
}

export function containsAny(haystack: string, needles: string[]): string[] {
  const lower = haystack.toLowerCase();
  return needles.filter((n) => lower.includes(n.toLowerCase()));
}

export function intakeIsMostlyFilled(intake?: IntakeData | null): boolean {
  if (!intake) return false;
  let filled = 0;
  if (intake.gpa) filled++;
  if (intake.majors) filled++;
  if (intake.strengths) filled++;
  if (intake.activities.length > 0) filled++;
  if (intake.targetCountries.length > 0) filled++;
  return filled >= 3;
}

export function summarizeIntake(intake: IntakeData | null | undefined, locale: Locale): string {
  if (!intake) return '';
  const parts: string[] = [];
  if (intake.fullName) parts.push(intake.fullName);
  if (intake.grade) parts.push(locale === 'vi' ? `Lớp ${intake.grade}` : `Grade ${intake.grade}`);
  if (intake.gpa) parts.push(`GPA ${intake.gpa}${intake.gpaScale ? `/${intake.gpaScale}` : ''}`);
  if (intake.curriculum) parts.push(intake.curriculum);
  if (intake.majors) parts.push((locale === 'vi' ? 'Lĩnh vực: ' : 'Majors: ') + intake.majors);
  if (intake.targetCountries.length > 0) {
    parts.push((locale === 'vi' ? 'Quốc gia: ' : 'Countries: ') + intake.targetCountries.join(', '));
  }
  if (intake.activities.length > 0) {
    parts.push(
      (locale === 'vi' ? `${intake.activities.length} hoạt động` : `${intake.activities.length} activities`),
    );
  }
  return parts.join(' · ');
}

const GENERIC_PHRASES_EN = [
  'passion for learning',
  'passion for helping',
  'change the world',
  'make a difference',
  'outside my comfort zone',
  'stepped out of my comfort zone',
  'journey of self-discovery',
  'my journey',
  'ever since i was young',
  'ever since i was a child',
  'from a young age',
  'at the end of the day',
  'work hard',
  'hard-working',
  'dedication and perseverance',
  'perseverance and dedication',
  'true calling',
  'unwavering',
  'diverse background',
  'broadened my horizons',
  'broaden my horizons',
  'leadership skills',
  'think outside the box',
  'it was a life-changing experience',
  'life-changing',
  'life changing',
  'learned a lot about myself',
  'taught me the importance',
  "i've always been",
  'ever since i can remember',
  'leader who inspires',
  'gave it my all',
  'gave 110',
  'never give up',
];

const GENERIC_PHRASES_VI = [
  'đam mê',
  'thay đổi thế giới',
  'tạo nên sự khác biệt',
  'từ nhỏ tôi đã',
  'ngay từ nhỏ',
  'hành trình khám phá',
  'không bao giờ bỏ cuộc',
  'cống hiến hết mình',
  'bước ra khỏi vùng an toàn',
  'khả năng lãnh đạo',
  'tư duy đột phá',
  'bài học quý giá',
  'tôi luôn tin rằng',
  'mở mang tầm mắt',
  'thay đổi cuộc đời',
];

export function detectGenericPhrases(text: string, locale: Locale): string[] {
  const list = locale === 'vi' ? [...GENERIC_PHRASES_VI, ...GENERIC_PHRASES_EN] : GENERIC_PHRASES_EN;
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const p of list) {
    if (lower.includes(p.toLowerCase())) found.add(p);
  }
  return Array.from(found);
}

export function reflectionDensity(text: string): number {
  if (!text.trim()) return 0;
  const reflective = [
    'i realized', 'i learned', 'i understood', 'i noticed', 'i recognized',
    'i began to', 'i came to', 'it occurred to me', 'in retrospect',
    'tôi nhận ra', 'tôi hiểu rằng', 'tôi học được', 'nhìn lại', 'tôi bắt đầu',
  ];
  const lower = text.toLowerCase();
  const hits = reflective.reduce((n, term) => (lower.includes(term) ? n + 1 : n), 0);
  const sentences = Math.max(1, sentenceCount(text));
  return hits / sentences;
}

export function evidenceDensity(text: string): number {
  if (!text.trim()) return 0;
  const matches = text.match(/\d+(?:[.,]\d+)?%?|\$[\d,]+|\d+\s?(?:hours?|weeks?|years?|students?|people|km|kg|giờ|tuần|năm)/gi);
  return (matches?.length ?? 0) / Math.max(1, sentenceCount(text));
}

export async function simulateLatency(ms = 350): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}
