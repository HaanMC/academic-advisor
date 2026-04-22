import type { Locale } from '../../i18n';
import type { InterviewFeedback } from '../../storage/schemas';
import { detectGenericPhrases, evidenceDensity, reflectionDensity, sentenceCount, wordCount } from './util';

interface Strings {
  rubric: { clarity: string; specificity: string; reflection: string; evidence: string; presence: string };
  notes: {
    good: string;
    tooShort: string;
    tooLong: string;
    thinEvidence: string;
    thinReflection: string;
    vague: string;
    confident: string;
    tentative: string;
  };
  better: {
    reflectionCategory: string;
    academicCategory: string;
    personalCategory: string;
    fitCategory: string;
    visionCategory: string;
    fallback: string;
  };
  followUp: {
    Personal: string;
    Academic: string;
    Critical: string;
    Vision: string;
    Fit: string;
    default: string;
  };
}

const en: Strings = {
  rubric: {
    clarity: 'Clarity',
    specificity: 'Specificity',
    reflection: 'Reflection',
    evidence: 'Evidence',
    presence: 'Presence',
  },
  notes: {
    good: 'Good calibration — the answer sounds like the person, not a script.',
    tooShort: 'Too short to leave a reader with anything to hold on to.',
    tooLong: 'Answer is long enough that the interviewer will lose the thread.',
    thinEvidence: 'Almost no specifics (names, numbers, moments) — the answer is mostly abstract.',
    thinReflection: 'You describe what happened but not what changed.',
    vague: 'A few phrases an interviewer will hear twenty times today.',
    confident: 'Tone is steady and grounded.',
    tentative: 'Tone is tentative — hedges are doing a lot of the work.',
  },
  better: {
    reflectionCategory: 'Pick one moment where you noticed the failure in real time. Describe what you saw and what you tried next. End with what you now ask yourself before starting a project.',
    academicCategory: 'Anchor in one question you actually worked on. Describe the method you tried, the dead end, and what the field does well or badly with this problem.',
    personalCategory: 'Open with one scene from a regular day that is unmistakably yours. Let the listener infer character from the scene rather than naming adjectives.',
    fitCategory: 'Name one specific thing about the school — a course, a professor, a tradition — and the reason it maps onto something in your current life, not a general aspiration.',
    visionCategory: 'Be specific about a two-year horizon you can actually control. Explain the five-year version as a consequence of that, not a separate aspiration.',
    fallback: 'Cut the generalities in the opening and start with one moment that actually happened.',
  },
  followUp: {
    Personal: 'What is something you used to believe about yourself that you no longer do?',
    Academic: 'If this problem were solved tomorrow, what would you work on next?',
    Critical: 'What did you do differently the second time?',
    Vision: 'What would have to be true in two years for that vision to be on track?',
    Fit: 'What would you regret about this school if you chose it and it went well?',
    default: 'Can you give one example that contradicts what you just said?',
  },
};

const vi: Strings = {
  rubric: {
    clarity: 'Rõ ràng',
    specificity: 'Cụ thể',
    reflection: 'Chiêm nghiệm',
    evidence: 'Bằng chứng',
    presence: 'Hiện diện',
  },
  notes: {
    good: 'Hiệu chỉnh tốt — câu trả lời nghe như người, không như kịch bản.',
    tooShort: 'Quá ngắn để người nghe có gì mà giữ.',
    tooLong: 'Đủ dài để người phỏng vấn mất mạch.',
    thinEvidence: 'Gần như không có chi tiết (tên, con số, khoảnh khắc) — câu trả lời chủ yếu trừu tượng.',
    thinReflection: 'Bạn kể việc xảy ra nhưng không kể điều gì đã thay đổi.',
    vague: 'Vài cụm mà người phỏng vấn sẽ nghe hai mươi lần hôm nay.',
    confident: 'Giọng ổn định, đĩnh đạc.',
    tentative: 'Giọng còn do dự — câu rào đang gánh phần lớn.',
  },
  better: {
    reflectionCategory: 'Chọn một khoảnh khắc khi bạn nhận ra thất bại ngay lúc đó. Mô tả điều bạn thấy và điều bạn thử tiếp. Kết bằng câu hỏi bạn hỏi bản thân trước khi khởi dự án.',
    academicCategory: 'Neo vào một câu hỏi bạn thực sự làm việc với. Mô tả phương pháp, ngõ cụt, và lĩnh vực làm tốt/kém thế nào với câu hỏi này.',
    personalCategory: 'Bắt đầu bằng một cảnh từ một ngày thường không lẫn được là của bạn. Để người nghe suy luận tính cách từ cảnh thay vì gọi tên tính từ.',
    fitCategory: 'Nêu một điều cụ thể về trường — một khoá học, một giáo sư, một truyền thống — và lý do nó kết nối với điều đang có trong đời bạn, không phải một ước muốn chung.',
    visionCategory: 'Cụ thể về chân trời hai năm bạn có thể kiểm soát. Phiên bản năm năm là hệ quả của nó, không phải một khát vọng riêng.',
    fallback: 'Cắt các câu chung chung ở mở đầu và bắt đầu bằng một khoảnh khắc thật sự xảy ra.',
  },
  followUp: {
    Personal: 'Điều gì bạn từng tin về bản thân mà giờ không còn tin nữa?',
    Academic: 'Nếu vấn đề này được giải xong ngày mai, bạn sẽ làm gì tiếp?',
    Critical: 'Lần thứ hai bạn làm khác gì?',
    Vision: 'Điều gì phải đúng trong hai năm tới để tầm nhìn đó ở trên đà?',
    Fit: 'Nếu chọn trường này và mọi thứ tốt, bạn sẽ tiếc điều gì?',
    default: 'Cho một ví dụ mâu thuẫn với điều bạn vừa nói.',
  },
};

function scoreBetween(lo: number, hi: number, v: number): number {
  if (v <= lo) return 1;
  if (v >= hi) return 5;
  return Math.round(1 + ((v - lo) / (hi - lo)) * 4);
}

export function runInterviewMock(args: {
  questionText: string;
  category: string;
  answer: string;
  locale: Locale;
}): InterviewFeedback {
  const { answer, category, locale } = args;
  const s = locale === 'vi' ? vi : en;

  const words = wordCount(answer);
  const sents = Math.max(1, sentenceCount(answer));
  const avg = words / sents;
  const reflection = reflectionDensity(answer);
  const evidence = evidenceDensity(answer);
  const generic = detectGenericPhrases(answer, locale);

  if (words < 15) {
    return {
      rubric: [
        { label: s.rubric.clarity, score: 1, note: s.notes.tooShort },
        { label: s.rubric.specificity, score: 1, note: s.notes.tooShort },
        { label: s.rubric.reflection, score: 1, note: s.notes.tooShort },
        { label: s.rubric.evidence, score: 1, note: s.notes.tooShort },
        { label: s.rubric.presence, score: 2, note: s.notes.tooShort },
      ],
      strengths: [],
      weak: [s.notes.tooShort],
      vague: [],
      better: s.better.fallback,
      followUp: (s.followUp as Record<string, string>)[category] ?? s.followUp.default,
      generatedAt: Date.now(),
    };
  }

  const clarity = scoreBetween(25, 15, avg); // shorter avg sentences => clearer
  const specificity = scoreBetween(0.05, 0.35, evidence);
  const reflectionScore = scoreBetween(0.05, 0.25, reflection);
  const evidenceScore = scoreBetween(0.05, 0.35, evidence);
  const presence = Math.max(1, Math.min(5, 5 - Math.min(3, generic.length)));

  const rubric = [
    { label: s.rubric.clarity, score: clarity, note: clarity >= 4 ? s.notes.confident : s.notes.tentative },
    { label: s.rubric.specificity, score: specificity, note: specificity >= 3 ? s.notes.good : s.notes.thinEvidence },
    { label: s.rubric.reflection, score: reflectionScore, note: reflectionScore >= 3 ? s.notes.good : s.notes.thinReflection },
    { label: s.rubric.evidence, score: evidenceScore, note: evidenceScore >= 3 ? s.notes.good : s.notes.thinEvidence },
    { label: s.rubric.presence, score: presence, note: presence >= 4 ? s.notes.confident : s.notes.vague },
  ];

  const strengths: string[] = [];
  if (specificity >= 3) strengths.push(s.notes.good);
  if (reflectionScore >= 3) strengths.push(locale === 'vi' ? 'Có bước ngoặt chiêm nghiệm rõ.' : 'There is a clear reflective turn.');
  if (clarity >= 4) strengths.push(s.notes.confident);

  const weak: string[] = [];
  if (words > 400) weak.push(s.notes.tooLong);
  if (evidenceScore < 3) weak.push(s.notes.thinEvidence);
  if (reflectionScore < 3) weak.push(s.notes.thinReflection);
  if (generic.length > 0) weak.push(s.notes.vague);

  const betterKey =
    category === 'Critical' || category === 'Personal'
      ? 'reflectionCategory'
      : category === 'Academic'
      ? 'academicCategory'
      : category === 'Vision'
      ? 'visionCategory'
      : category === 'Fit'
      ? 'fitCategory'
      : 'personalCategory';

  return {
    rubric,
    strengths,
    weak,
    vague: generic,
    better: s.better[betterKey as keyof Strings['better']],
    followUp: (s.followUp as Record<string, string>)[category] ?? s.followUp.default,
    generatedAt: Date.now(),
  };
}
