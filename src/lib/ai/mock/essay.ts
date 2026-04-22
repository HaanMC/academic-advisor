import type { Locale } from '../../i18n';
import type { EssayReviewResult } from '../../storage/schemas';
import { detectGenericPhrases, evidenceDensity, reflectionDensity, sentenceCount, wordCount } from './util';

interface Strings {
  works: {
    concrete: string;
    structure: string;
    length: string;
    specific: string;
    quiet: string;
  };
  generic: {
    phrases: string;
    opening: string;
    closing: string;
    assertions: string;
  };
  reflection: {
    thin: string;
    missingTurn: string;
    telling: string;
  };
  voice: {
    overPolished: string;
    borrowed: string;
    earnest: string;
    drift: string;
  };
  revision: {
    cutOpening: string;
    quantify: string;
    scene: string;
    reflection: string;
    length: string;
  };
  phrasing: string[];
  noneDetected: string;
}

const en: Strings = {
  works: {
    concrete: 'There is at least one concrete moment a reader can see — hold onto it and build outward from there.',
    structure: 'The draft has an arc (opening → turn → landing) rather than floating paragraphs.',
    length: 'Length is within the useful range, which gives room for specificity without padding.',
    specific: 'Names, places, or numbers appear in the draft — that is the kind of specificity readers remember.',
    quiet: 'Tone is reasonably restrained rather than performative. Keep that.',
  },
  generic: {
    phrases: 'The draft contains phrases admissions readers have read thousands of times. Replace with specifics from your own life.',
    opening: 'The opening sentence could belong to many students. Make it unmistakably yours.',
    closing: 'The closing returns to abstractions ("future", "journey", "impact"). End on a concrete image instead.',
    assertions: 'Claims like "I am passionate" / "I am resilient" appear without scenes to back them up.',
  },
  reflection: {
    thin: 'Reflection is thin. You describe what happened but not what changed inside you.',
    missingTurn: 'The middle describes activity without a turn. A reader wants to see you notice something.',
    telling: 'You tell the reader the lesson. Show the moment you learned it instead.',
  },
  voice: {
    overPolished: 'Language is so polished the writer disappears. Let a couple of rougher, more honest sentences through.',
    borrowed: 'The voice sounds borrowed — like a common-app guidebook more than a person.',
    earnest: 'Tone is earnest to the point of uniformity. Small notes of humor or specificity would help.',
    drift: 'Voice drifts between paragraphs — the opening and closing sound like two different writers.',
  },
  revision: {
    cutOpening: 'Cut the first 2–3 sentences. Start inside the scene.',
    quantify: 'Anchor one paragraph with one real number (hours, people, dates, km).',
    scene: 'Add one scene — one minute of time, one place, one sensory detail.',
    reflection: 'After the scene, add two sentences naming what you noticed and how your thinking shifted.',
    length: 'Tighten to ~650 words. Cut phrases that could apply to anyone.',
  },
  phrasing: [
    '"changed how I think about X" → "changed what I look for when I X"',
    '"I am passionate about Y" → name the exact moment Y became interesting to you',
    '"made a difference" → say what happened that would not have happened without you',
    '"opened my eyes" → describe what specifically you now notice',
  ],
  noneDetected: 'No obvious generic phrasing detected. That is unusual — keep it.',
};

const vi: Strings = {
  works: {
    concrete: 'Có ít nhất một khoảnh khắc cụ thể người đọc thấy được — hãy giữ nó và mở rộng từ đó.',
    structure: 'Bản nháp có cấu trúc (mở → chuyển → đóng) thay vì các đoạn trôi dạt.',
    length: 'Độ dài nằm trong khoảng hữu ích, cho phép đi vào cụ thể mà không nhồi.',
    specific: 'Tên, địa điểm, hoặc con số có xuất hiện — đó là kiểu cụ thể người đọc nhớ.',
    quiet: 'Giọng điệu khá điềm tĩnh thay vì diễn — hãy giữ.',
  },
  generic: {
    phrases: 'Bản nháp có những cụm mà người đọc tuyển sinh đã gặp hàng ngàn lần. Thay bằng chi tiết riêng của bạn.',
    opening: 'Câu mở có thể thuộc về bất kỳ học sinh nào. Hãy khiến nó không thể nhầm được là của bạn.',
    closing: 'Đoạn đóng quay về trừu tượng ("tương lai", "hành trình", "tác động"). Hãy kết bằng một hình ảnh cụ thể.',
    assertions: 'Các khẳng định kiểu "tôi đam mê" / "tôi kiên trì" xuất hiện mà không có cảnh đỡ.',
  },
  reflection: {
    thin: 'Chiêm nghiệm còn mỏng. Bạn kể điều gì xảy ra nhưng không kể điều gì đã thay đổi trong bạn.',
    missingTurn: 'Phần giữa kể hoạt động mà không có bước ngoặt. Người đọc muốn thấy bạn nhận ra điều gì đó.',
    telling: 'Bạn nói thẳng bài học cho người đọc. Hãy cho thấy khoảnh khắc bạn học được thay vì.',
  },
  voice: {
    overPolished: 'Ngôn ngữ được đánh bóng đến mức người viết biến mất. Hãy để vài câu thô hơn, thật hơn đi qua.',
    borrowed: 'Giọng nghe như vay mượn — giống sách hướng dẫn hơn là một con người.',
    earnest: 'Giọng chân thành đến mức đơn điệu. Vài nốt hài hoặc cụ thể sẽ giúp.',
    drift: 'Giọng trôi giữa các đoạn — mở và đóng nghe như hai người viết khác nhau.',
  },
  revision: {
    cutOpening: 'Cắt 2–3 câu đầu. Bắt đầu ngay trong cảnh.',
    quantify: 'Neo một đoạn bằng một con số thật (giờ, người, ngày, km).',
    scene: 'Thêm một cảnh — một phút thời gian, một địa điểm, một chi tiết cảm giác.',
    reflection: 'Sau cảnh, thêm hai câu nêu điều bạn nhận ra và tư duy đã dịch chuyển như thế nào.',
    length: 'Thu gọn còn ~650 từ. Cắt các cụm có thể áp dụng cho bất kỳ ai.',
  },
  phrasing: [
    '"thay đổi cách tôi nghĩ về X" → "thay đổi điều tôi chú ý khi làm X"',
    '"tôi đam mê Y" → kể khoảnh khắc Y trở nên thú vị với bạn',
    '"tạo ra sự khác biệt" → nêu điều cụ thể sẽ không xảy ra nếu không có bạn',
    '"mở rộng tầm mắt" → kể cụ thể điều bạn giờ để ý',
  ],
  noneDetected: 'Chưa phát hiện cụm chung chung rõ rệt. Hiếm — hãy giữ.',
};

export function runEssayMockReview(
  content: string,
  prompt: string,
  outline: string,
  locale: Locale,
): EssayReviewResult {
  const s = locale === 'vi' ? vi : en;

  const words = wordCount(content);
  const sentences = Math.max(1, sentenceCount(content));
  const reflection = reflectionDensity(content);
  const evidence = evidenceDensity(content);
  const genericPhrases = detectGenericPhrases(content, locale);

  const works: string[] = [];
  if (evidence > 0.2) works.push(s.works.concrete);
  if (sentences >= 10) works.push(s.works.structure);
  if (words >= 450 && words <= 750) works.push(s.works.length);
  if (/\d/.test(content) || /[A-ZÀ-Ỹ][a-zà-ỹ]+\s[A-ZÀ-Ỹ]/.test(content)) works.push(s.works.specific);
  if (!/!!|SO amazing|TRULY/i.test(content)) works.push(s.works.quiet);

  const generic: string[] = [];
  if (genericPhrases.length > 0) generic.push(s.generic.phrases);
  const firstSentence = content.split(/[.!?]/)[0]?.trim() ?? '';
  if (firstSentence.length > 0 && /(i have always|i always|ever since|from the time|tôi luôn|từ nhỏ)/i.test(firstSentence)) {
    generic.push(s.generic.opening);
  }
  if (/(future|journey|impact|hành trình|tương lai|tác động)\s*\.?\s*$/i.test(content.trim().slice(-80))) {
    generic.push(s.generic.closing);
  }
  if (/(i am passionate|i am resilient|tôi đam mê|tôi kiên cường)/i.test(content) && evidence < 0.2) {
    generic.push(s.generic.assertions);
  }

  const reflectionPoints: string[] = [];
  if (reflection < 0.08) reflectionPoints.push(s.reflection.thin);
  if (words >= 300 && !/i realized|i learned|tôi nhận ra|tôi học được/i.test(content)) reflectionPoints.push(s.reflection.missingTurn);
  if (/the lesson|moral of the story|what i learned from this is|bài học từ/i.test(content)) reflectionPoints.push(s.reflection.telling);

  const voice: string[] = [];
  const avgSentenceWords = sentences ? words / sentences : 0;
  if (avgSentenceWords > 28) voice.push(s.voice.overPolished);
  if (genericPhrases.length >= 3) voice.push(s.voice.borrowed);
  if (!/\?|—|;|\(/.test(content) && words > 400) voice.push(s.voice.earnest);

  const revision: string[] = [];
  if (generic.length > 0) revision.push(s.revision.cutOpening);
  if (evidence < 0.2 && words > 200) revision.push(s.revision.quantify);
  if (reflection < 0.1) revision.push(s.revision.scene);
  if (reflection < 0.1) revision.push(s.revision.reflection);
  if (words > 750) revision.push(s.revision.length);

  const phrasing = generic.length > 0 ? s.phrasing : [];

  if (!content.trim()) {
    return {
      works: [],
      generic: [],
      reflection: [],
      voice: [],
      revision: [locale === 'vi' ? 'Viết một bản nháp ngắn trước đã.' : 'Write a short draft first.'],
      phrasing: [],
      genericPhrasesDetected: [],
      generatedAt: Date.now(),
    };
  }

  // Gentle acknowledgement of prompt/outline when present
  if (prompt.trim().length > 0 && !content.toLowerCase().includes((prompt.toLowerCase().split(' ')[0] ?? '').slice(0, 5))) {
    revision.push(
      locale === 'vi'
        ? 'Bản nháp chưa neo rõ vào đề bài — thêm một dòng phản chiếu đề vào đoạn đầu.'
        : 'The draft does not obviously engage the prompt — echo one term from the prompt in the opening.',
    );
  }
  if (outline.trim().length > 0 && sentences < 8) {
    revision.push(
      locale === 'vi'
        ? 'Dàn ý có, nhưng bản nháp vẫn ngắn — tiếp tục viết từng nhịp từ dàn ý.'
        : 'Outline exists but the draft is short — keep expanding beat by beat.',
    );
  }

  return {
    works,
    generic,
    reflection: reflectionPoints,
    voice,
    revision,
    phrasing,
    genericPhrasesDetected: genericPhrases,
    generatedAt: Date.now(),
  };
}
