import type { Locale } from '../../i18n';
import type { IntakeData, SchoolReasoning } from '../../storage/schemas';

export interface SchoolProfile {
  strengths: string[];
  culture: string[];
  admitBand: 'very-selective' | 'selective' | 'moderate' | 'accessible';
  internationalFriendly?: boolean;
}

const SCHOOLS: Record<string, SchoolProfile> = {
  'harvard university': { strengths: ['humanities', 'government', 'finance', 'bio'], culture: ['structured', 'prestige-driven', 'networked'], admitBand: 'very-selective', internationalFriendly: true },
  'stanford university': { strengths: ['cs', 'engineering', 'entrepreneurship', 'bio'], culture: ['collaborative', 'maker', 'innovation'], admitBand: 'very-selective', internationalFriendly: true },
  'mit': { strengths: ['cs', 'engineering', 'math', 'science'], culture: ['hands-on', 'technical', 'playful'], admitBand: 'very-selective', internationalFriendly: true },
  'princeton university': { strengths: ['humanities', 'math', 'public policy'], culture: ['classical', 'undergraduate-focused'], admitBand: 'very-selective', internationalFriendly: true },
  'yale university': { strengths: ['humanities', 'arts', 'social science'], culture: ['residential', 'discursive'], admitBand: 'very-selective', internationalFriendly: true },
  'university of chicago': { strengths: ['economics', 'philosophy', 'math', 'political science'], culture: ['intellectual', 'rigorous', 'unusual prompts'], admitBand: 'very-selective', internationalFriendly: true },
  'columbia university': { strengths: ['core curriculum', 'journalism', 'finance'], culture: ['urban', 'interdisciplinary'], admitBand: 'very-selective', internationalFriendly: true },
  'university of pennsylvania': { strengths: ['business', 'pre-professional', 'nursing'], culture: ['pre-professional', 'pragmatic'], admitBand: 'very-selective', internationalFriendly: true },
  'brown university': { strengths: ['open curriculum', 'writing', 'humanities'], culture: ['self-directed', 'curious'], admitBand: 'very-selective', internationalFriendly: true },
  'duke university': { strengths: ['public policy', 'engineering', 'bio'], culture: ['balanced', 'spirited'], admitBand: 'very-selective', internationalFriendly: true },
  'northwestern university': { strengths: ['journalism', 'theater', 'engineering'], culture: ['quarter system', 'media'], admitBand: 'very-selective', internationalFriendly: true },
  'cornell university': { strengths: ['engineering', 'hotel admin', 'labor'], culture: ['rigorous', 'wide-scope'], admitBand: 'very-selective', internationalFriendly: true },
  'dartmouth college': { strengths: ['undergraduate focus', 'outdoors'], culture: ['tight-knit', 'term-based'], admitBand: 'very-selective', internationalFriendly: true },
  'new york university': { strengths: ['film', 'business', 'urban studies'], culture: ['urban', 'global campuses'], admitBand: 'selective', internationalFriendly: true },
  'university of southern california': { strengths: ['film', 'business', 'engineering'], culture: ['industry ties', 'networked'], admitBand: 'selective', internationalFriendly: true },
  'university of california, berkeley': { strengths: ['cs', 'engineering', 'public policy'], culture: ['public research', 'intense'], admitBand: 'very-selective', internationalFriendly: true },
  'university of california, los angeles': { strengths: ['arts', 'bio', 'film'], culture: ['broad', 'public'], admitBand: 'very-selective', internationalFriendly: true },
  'university of michigan': { strengths: ['engineering', 'business', 'public policy'], culture: ['spirited', 'broad'], admitBand: 'selective', internationalFriendly: true },
  'georgetown university': { strengths: ['foreign service', 'government', 'policy'], culture: ['washington-oriented', 'jesuit'], admitBand: 'very-selective', internationalFriendly: true },
  'university of oxford': { strengths: ['humanities', 'ppe', 'math'], culture: ['tutorial', 'subject-focused'], admitBand: 'very-selective', internationalFriendly: true },
  'university of cambridge': { strengths: ['math', 'natural sciences', 'humanities'], culture: ['supervision system', 'collegiate'], admitBand: 'very-selective', internationalFriendly: true },
  'imperial college london': { strengths: ['stem', 'medicine', 'engineering'], culture: ['technical', 'london'], admitBand: 'very-selective', internationalFriendly: true },
  'london school of economics': { strengths: ['economics', 'politics', 'social science'], culture: ['specialized', 'international'], admitBand: 'very-selective', internationalFriendly: true },
  'university college london': { strengths: ['broad', 'medicine', 'architecture'], culture: ['london', 'research'], admitBand: 'selective', internationalFriendly: true },
  'university of toronto': { strengths: ['stem', 'broad research'], culture: ['large', 'urban'], admitBand: 'selective', internationalFriendly: true },
  'mcgill university': { strengths: ['life sciences', 'arts', 'engineering'], culture: ['montreal', 'european feel'], admitBand: 'selective', internationalFriendly: true },
  'national university of singapore': { strengths: ['engineering', 'business', 'cs'], culture: ['asian research hub'], admitBand: 'selective', internationalFriendly: true },
  'ntu singapore': { strengths: ['engineering', 'cs', 'business'], culture: ['technical', 'modern'], admitBand: 'selective', internationalFriendly: true },
  'hku': { strengths: ['business', 'law', 'medicine'], culture: ['asian hub', 'bilingual'], admitBand: 'selective', internationalFriendly: true },
  'fulbright university vietnam': { strengths: ['liberal arts', 'interdisciplinary'], culture: ['bilingual', 'new', 'discussion-driven'], admitBand: 'moderate', internationalFriendly: true },
  'vinuniversity': { strengths: ['business', 'engineering', 'health'], culture: ['hanoi', 'partnered curriculum'], admitBand: 'selective', internationalFriendly: true },
};

function matchProfile(schoolName: string): SchoolProfile | undefined {
  const key = schoolName.trim().toLowerCase();
  if (SCHOOLS[key]) return SCHOOLS[key];
  for (const k of Object.keys(SCHOOLS)) {
    if (key.includes(k) || k.includes(key)) return SCHOOLS[k];
  }
  return undefined;
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-zàáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ0-9]+/).filter((t) => t.length > 2);
}

export function runSchoolFitMock(args: {
  intake?: IntakeData | null;
  schoolName: string;
  location: string;
  admitRate?: string;
  locale: Locale;
}): SchoolReasoning {
  const { intake, schoolName, location, admitRate, locale } = args;
  const profile = matchProfile(schoolName);
  const L = locale === 'vi';

  const whyFits: string[] = [];
  const whyStretch: string[] = [];
  const uncertain: string[] = [];
  const verifyNext: string[] = [];

  const majors = tokenize(intake?.majors ?? '');
  const strengthTokens = tokenize(intake?.strengths ?? '');
  const activityTokens = tokenize((intake?.activities ?? []).map((a) => `${a.name} ${a.description}`).join(' '));
  const allStudentTokens = new Set([...majors, ...strengthTokens, ...activityTokens]);

  if (profile) {
    const overlaps = profile.strengths.filter((s) => Array.from(allStudentTokens).some((t) => s.includes(t) || t.includes(s.split(' ')[0])));
    if (overlaps.length) {
      whyFits.push(
        L
          ? `Trường mạnh về ${overlaps.join(', ')} — trùng với điểm mạnh / lĩnh vực bạn nêu.`
          : `The school is strong in ${overlaps.join(', ')}, which matches strengths or target fields you named.`,
      );
    }
    whyFits.push(
      L
        ? `Văn hoá trường nghiêng về ${profile.culture.join(', ')}. Hãy kiểm tra xem bạn có làm việc tốt trong không khí này không.`
        : `Culture leans ${profile.culture.join(', ')}. Check whether you work well in that register.`,
    );

    if (profile.admitBand === 'very-selective') {
      whyStretch.push(
        L
          ? 'Tỉ lệ nhận rất thấp — cần mọi phần hồ sơ đều ở trên trung bình để cạnh tranh.'
          : 'Admission rates are in the single digits — every part of the dossier needs to be above average to be competitive.',
      );
    }

    // Numeric GPA check
    const gpaNum = intake?.gpa ? parseFloat(intake.gpa.replace(',', '.')) : NaN;
    const gpaScale = intake?.gpaScale ? parseFloat(intake.gpaScale.replace(',', '.')) : 4;
    if (!isNaN(gpaNum) && !isNaN(gpaScale)) {
      const ratio = gpaNum / gpaScale;
      if (profile.admitBand === 'very-selective' && ratio < 0.92) {
        whyStretch.push(
          L
            ? 'GPA hiện tại thấp hơn vùng phổ biến của trường — cần đối trọng rõ ràng.'
            : 'Current GPA is below the typical band for this school — a counterweight is needed.',
        );
      }
      if (profile.admitBand === 'accessible' && ratio >= 0.85) {
        whyFits.push(L ? 'GPA đủ để cạnh tranh thoải mái.' : 'GPA is comfortably in range.');
      }
    } else {
      uncertain.push(L ? 'Chưa rõ GPA — thêm vào Khai báo để có đọc chính xác hơn.' : 'GPA not in intake — add it for a sharper read.');
    }

    if (!intake?.testScores && profile.admitBand !== 'accessible') {
      uncertain.push(L ? 'Chưa có điểm thi chuẩn hóa — hãy xác nhận trường nhận test-optional hay không.' : 'No standardized scores yet — confirm whether this school is test-optional.');
    }

    if (profile.internationalFriendly === false) {
      whyStretch.push(L ? 'Trường này tuyển quốc tế ít thuận lợi.' : 'Admissions for international students here can be narrower.');
    }

    verifyNext.push(
      L
        ? `Đọc kỹ chương trình ${overlaps[0] ?? profile.strengths[0]} và xác nhận đó là điều bạn muốn học bốn năm tới.`
        : `Read the actual ${overlaps[0] ?? profile.strengths[0]} curriculum and confirm it is what you want to study for four years.`,
    );
    verifyNext.push(
      L
        ? 'Tìm hai giáo sư đang hoạt động trong lĩnh vực bạn quan tâm và đọc công bố gần nhất.'
        : 'Find two active faculty in your area of interest and read one recent paper.',
    );
    verifyNext.push(
      L
        ? 'Kiểm tra chi phí, hỗ trợ tài chính cho học sinh quốc tế, và yêu cầu visa.'
        : 'Check cost, financial aid availability for international students, and visa requirements.',
    );
  } else {
    // Unknown school — fall back to generic cautious reasoning
    whyFits.push(
      L
        ? 'Chưa có dữ liệu trong kho — đây là bản đọc dựa trên thông tin bạn cung cấp.'
        : 'School not in the local reference — this is a cautious reasoning based on what you provided.',
    );
    if (location) whyFits.push(L ? `Địa điểm (${location}) có thể phù hợp với mục tiêu địa lý của bạn.` : `Location (${location}) may match your geographic preferences.`);
    uncertain.push(L ? 'Độ mạnh ngành, văn hoá, và hỗ trợ quốc tế chưa được xác minh.' : 'Program strength, culture, and international support are not verified.');
    verifyNext.push(L ? 'Đọc một trang chương trình cụ thể, không chỉ trang quảng bá.' : 'Read one specific program page, not the marketing homepage.');
    verifyNext.push(L ? 'Tìm hai sinh viên đang học và đọc một bài viết hoặc trò chuyện.' : 'Find two current students and read or talk to them.');
  }

  // Admit-rate aware uncertainty
  if (admitRate && /\d/.test(admitRate)) {
    const pct = parseFloat(admitRate);
    if (!isNaN(pct) && pct < 10) {
      whyStretch.push(
        L
          ? `Với tỉ lệ nhận ≈${pct}%, ngay cả hồ sơ mạnh vẫn có phần may rủi — hãy đối xử đây là thử thách.`
          : `At an admit rate of ~${pct}%, even strong profiles carry chance — treat this as a stretch.`,
      );
    }
  }

  return { whyFits, whyStretch, uncertain, verifyNext, generatedAt: Date.now() };
}
