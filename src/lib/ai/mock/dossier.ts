import type { Locale } from '../../i18n';
import type { DossierAnalysis, DossierInputs, IntakeData } from '../../storage/schemas';
import { evidenceDensity, hasContent, summarizeIntake, wordCount } from './util';

interface Strings {
  snapshot(args: { summary: string; totalWords: number; coverage: string[] }): string;
  gpaTooLow: string;
  noTranscript: string;
  noCv: string;
  noActivities: string;
  noHonors: string;
  noEssay: string;
  strong: {
    strongCoverage: string;
    quantifiedCv: string;
    activityDepth: string;
    strongGpa: string;
    clearMajor: string;
    curriculumRigor: string;
    intlHonor: string;
  };
  weak: {
    thinCv: string;
    unquantifiedCv: string;
    fewActivities: string;
    noHonors: string;
    noMajor: string;
    shortEssay: string;
    thinEssay: string;
    noTranscript: string;
  };
  coherence: {
    majorVsActivities: string;
    cvVsActivities: string;
    essayVsMajor: string;
  };
  risks: {
    genericEssay: string;
    overloaded: string;
    singleTheme: string;
    lowGpa: string;
    missingTests: string;
  };
  priorities: {
    quantify: string;
    deepen: string;
    narrative: string;
    verify: string;
  };
  actions: {
    drafts: string;
    verifyHonors: string;
    activityHours: string;
    refineMajor: string;
    rigorNotes: string;
  };
}

const en: Strings = {
  snapshot: ({ summary, totalWords, coverage }) =>
    `Based on ${totalWords.toLocaleString()} words across ${coverage.length} dossier sections${coverage.length ? ` (${coverage.join(', ')})` : ''}, the profile reads as follows. ${summary || 'Intake was not completed, so context is inferred from submitted materials only.'} The immediate question is whether the activities and writing match the academic signal.`,
  gpaTooLow: 'GPA is low relative to most selective targets. Plan compensation via rigor, testing, or narrative specificity.',
  noTranscript: 'Transcript not provided — the academic picture is incomplete.',
  noCv: 'No CV submitted — role, scope, and outcomes are unclear.',
  noActivities: 'Activity list is empty or unreadable.',
  noHonors: 'No honors submitted.',
  noEssay: 'No essay draft submitted.',
  strong: {
    strongCoverage: 'Dossier coverage is broad — transcript, activities, and writing are all present for review.',
    quantifiedCv: 'CV shows measurable outcomes (numbers, hours, scope) rather than only titles.',
    activityDepth: 'Activity list shows sustained time commitment, not just membership.',
    strongGpa: 'GPA is strong for the stated curriculum.',
    clearMajor: 'Target fields are named specifically rather than as a broad category.',
    curriculumRigor: 'Curriculum rigor is documented (advanced courses, load).',
    intlHonor: 'At least one honor is at regional/national/international level.',
  },
  weak: {
    thinCv: 'CV is short enough that a reader will infer the student did not do much.',
    unquantifiedCv: 'CV reads as a list of titles. Without hours, cohort size, or outcomes, impact is unreadable.',
    fewActivities: 'Activity count is low — consider whether sustained work is being undersold.',
    noHonors: 'No honors to ground the academic signal externally.',
    noMajor: 'Target fields are missing, so the dossier cannot be read against intent.',
    shortEssay: 'Essay is short. A reader cannot assess voice or reflection at this length.',
    thinEssay: 'Essay reads as assertion rather than scene. Concrete moments are missing.',
    noTranscript: 'No transcript — readiness cannot be evaluated.',
  },
  coherence: {
    majorVsActivities: 'Stated field of interest does not obviously match the activity list.',
    cvVsActivities: 'CV and activity list describe different people at a glance — reconcile role titles.',
    essayVsMajor: 'Essay topic and stated major point in different directions without a bridge.',
  },
  risks: {
    genericEssay: 'Essay uses phrasing admissions readers have seen many times. Voice is not yet distinct.',
    overloaded: 'Activity list is wide but shallow — risk of appearing resume-padded.',
    singleTheme: 'Profile reads as one-note. A reader will ask what else is there.',
    lowGpa: 'GPA will be a gating concern at reach schools without a clear counterweight.',
    missingTests: 'Standardized test line is blank — confirm test-optional strategy before relying on it.',
  },
  priorities: {
    quantify: 'Quantify the top three activities (hours, scope, result) before doing anything else.',
    deepen: 'Pick two activities to deepen. Cut one that adds only a line.',
    narrative: 'Draft a one-paragraph thesis of who this student is. Test every artifact against it.',
    verify: 'Verify that every honor listed can be corroborated.',
  },
  actions: {
    drafts: 'Open Essay Lab and run a structural review on the current draft.',
    verifyHonors: 'In the Dossier tab for Honors, add level and year for each award.',
    activityHours: 'In the Activities tab, add hours/week and weeks/year for each line.',
    refineMajor: 'In Intake, tighten target majors to two or three fields you can defend.',
    rigorNotes: 'In Intake, add a short rigor note: number of APs/HLs, dual enrollment, research.',
  },
};

const vi: Strings = {
  snapshot: ({ summary, totalWords, coverage }) =>
    `Dựa trên ${totalWords.toLocaleString()} từ trong ${coverage.length} phần của hồ sơ${coverage.length ? ` (${coverage.join(', ')})` : ''}, hồ sơ hiện ra như sau. ${summary || 'Khai báo chưa hoàn tất, nên bối cảnh được suy luận từ tài liệu đã nộp.'} Câu hỏi tức thì là liệu hoạt động và bài viết có khớp với tín hiệu học lực hay không.`,
  gpaTooLow: 'GPA còn thấp so với phần lớn trường chọn lọc. Cần bù đắp bằng độ khó chương trình, điểm thi hoặc tính cụ thể trong tường thuật.',
  noTranscript: 'Chưa có bảng điểm — bức tranh học lực chưa đầy đủ.',
  noCv: 'Chưa nộp CV — vai trò, quy mô và kết quả chưa rõ.',
  noActivities: 'Danh sách hoạt động trống hoặc không đọc được.',
  noHonors: 'Chưa có giải thưởng nào được nộp.',
  noEssay: 'Chưa nộp bài luận nháp.',
  strong: {
    strongCoverage: 'Hồ sơ bao phủ rộng — bảng điểm, hoạt động, và bài viết đều có để đọc.',
    quantifiedCv: 'CV cho thấy kết quả đo lường được (số, giờ, quy mô), không chỉ có chức danh.',
    activityDepth: 'Danh sách hoạt động thể hiện cam kết thời gian bền bỉ, không chỉ là thành viên.',
    strongGpa: 'GPA mạnh so với chương trình hiện tại.',
    clearMajor: 'Các lĩnh vực đích được nêu cụ thể, không chỉ là một chủ đề rộng.',
    curriculumRigor: 'Độ khó chương trình được ghi rõ (môn nâng cao, khối lượng).',
    intlHonor: 'Có ít nhất một giải ở cấp khu vực/quốc gia/quốc tế.',
  },
  weak: {
    thinCv: 'CV quá ngắn đến mức người đọc sẽ suy luận rằng học sinh chưa làm nhiều.',
    unquantifiedCv: 'CV chỉ là danh sách chức danh. Không có số giờ, quy mô, hay kết quả, tác động không đọc được.',
    fewActivities: 'Số lượng hoạt động thấp — hãy xem liệu công việc bền bỉ đang bị kể ngắn không.',
    noHonors: 'Không có giải để neo tín hiệu học lực ra bên ngoài.',
    noMajor: 'Thiếu lĩnh vực đích, nên hồ sơ không thể đọc theo ý định.',
    shortEssay: 'Bài luận ngắn. Người đọc không đánh giá được giọng hay chiêm nghiệm ở độ dài này.',
    thinEssay: 'Bài luận mang tính khẳng định hơn là mô tả cảnh. Thiếu các khoảnh khắc cụ thể.',
    noTranscript: 'Chưa có bảng điểm — chưa thể đánh giá mức sẵn sàng.',
  },
  coherence: {
    majorVsActivities: 'Lĩnh vực quan tâm không khớp rõ với danh sách hoạt động.',
    cvVsActivities: 'CV và danh sách hoạt động mô tả hai người khác nhau khi đọc lướt — hãy thống nhất chức danh.',
    essayVsMajor: 'Chủ đề bài luận và ngành đích chỉ về hai hướng khác nhau mà không có cầu nối.',
  },
  risks: {
    genericEssay: 'Bài luận dùng cách diễn đạt mà người đọc tuyển sinh đã gặp nhiều lần. Giọng chưa nổi bật.',
    overloaded: 'Danh sách hoạt động rộng nhưng nông — có thể bị xem là nhồi CV.',
    singleTheme: 'Hồ sơ nghe đơn điệu. Người đọc sẽ hỏi còn gì khác không.',
    lowGpa: 'GPA sẽ là rào cản tại các trường mơ ước nếu không có đối trọng rõ ràng.',
    missingTests: 'Dòng điểm thi chuẩn hóa trống — hãy xác nhận chiến lược test-optional trước khi dựa vào.',
  },
  priorities: {
    quantify: 'Trước tiên, định lượng ba hoạt động hàng đầu (giờ, quy mô, kết quả).',
    deepen: 'Chọn hai hoạt động để đào sâu. Cắt bỏ một hoạt động chỉ thêm một dòng.',
    narrative: 'Viết một đoạn định vị về bạn là ai. Kiểm tra mọi tài liệu đối chiếu với nó.',
    verify: 'Xác minh rằng mọi giải thưởng có thể được chứng thực.',
  },
  actions: {
    drafts: 'Mở Phòng luận và chạy nhận xét cấu trúc trên bản nháp hiện tại.',
    verifyHonors: 'Trong tab Giải thưởng, thêm cấp độ và năm cho từng giải.',
    activityHours: 'Trong tab Hoạt động, thêm giờ/tuần và tuần/năm cho từng dòng.',
    refineMajor: 'Trong Khai báo, thu hẹp lĩnh vực đích còn hai hoặc ba ngành bạn có thể bảo vệ.',
    rigorNotes: 'Trong Khai báo, thêm ghi chú độ khó ngắn: số AP/HL, tín chỉ sớm, nghiên cứu.',
  },
};

function pick(locale: Locale): Strings {
  return locale === 'vi' ? vi : en;
}

export function runDossierMockAnalysis(
  inputs: DossierInputs,
  intake: IntakeData | null | undefined,
  locale: Locale,
): DossierAnalysis {
  const s = pick(locale);

  const coverage: string[] = [];
  if (hasContent(inputs.transcript, 20)) coverage.push(locale === 'vi' ? 'bảng điểm' : 'transcript');
  if (hasContent(inputs.cv, 30)) coverage.push('cv');
  if (hasContent(inputs.activities, 20)) coverage.push(locale === 'vi' ? 'hoạt động' : 'activities');
  if (hasContent(inputs.honors, 10)) coverage.push(locale === 'vi' ? 'giải thưởng' : 'honors');
  if (hasContent(inputs.essay, 80)) coverage.push(locale === 'vi' ? 'bài luận' : 'essay');

  const totalWords =
    wordCount(inputs.transcript) +
    wordCount(inputs.cv) +
    wordCount(inputs.activities) +
    wordCount(inputs.honors) +
    wordCount(inputs.essay);

  const cvEvidence = evidenceDensity(inputs.cv);
  const essayEvidence = evidenceDensity(inputs.essay);
  const essayWords = wordCount(inputs.essay);

  const gpaNum = intake?.gpa ? parseFloat(intake.gpa.replace(',', '.')) : NaN;
  const gpaScaleNum = intake?.gpaScale ? parseFloat(intake.gpaScale.replace(',', '.')) : 4.0;
  const gpaLow = !isNaN(gpaNum) && !isNaN(gpaScaleNum) && gpaNum / gpaScaleNum < 0.8;
  const gpaStrong = !isNaN(gpaNum) && !isNaN(gpaScaleNum) && gpaNum / gpaScaleNum >= 0.9;

  const activities = intake?.activities ?? [];
  const sustained = activities.filter((a) => a.hoursPerWeek >= 3 && a.weeksPerYear >= 20).length;
  const hasIntlHonor = (intake?.honors ?? []).some((h) => h.level === 'International' || h.level === 'National');

  const summary = summarizeIntake(intake, locale);

  const strengths: Array<{ title: string; evidence: string }> = [];
  if (coverage.length >= 3) strengths.push({ title: s.strong.strongCoverage, evidence: coverage.join(', ') });
  if (cvEvidence >= 0.3) strengths.push({ title: s.strong.quantifiedCv, evidence: locale === 'vi' ? 'Mật độ bằng chứng trong CV khá' : 'CV evidence density is healthy' });
  if (sustained >= 2) strengths.push({ title: s.strong.activityDepth, evidence: `${sustained}× ≥ 3h/w · 20w/y` });
  if (gpaStrong) strengths.push({ title: s.strong.strongGpa, evidence: `GPA ${intake!.gpa}/${intake!.gpaScale || '?'}` });
  if (intake?.majors && intake.majors.split(/[;,/]/).length <= 3 && intake.majors.trim().length > 0) {
    strengths.push({ title: s.strong.clearMajor, evidence: intake.majors });
  }
  if (intake?.rigor && intake.rigor.length > 10) strengths.push({ title: s.strong.curriculumRigor, evidence: intake.rigor.slice(0, 120) });
  if (hasIntlHonor) strengths.push({ title: s.strong.intlHonor, evidence: locale === 'vi' ? 'Có giải cấp quốc gia/quốc tế' : 'One or more national/international honors' });

  const weak: string[] = [];
  if (!hasContent(inputs.transcript, 20)) weak.push(s.weak.noTranscript);
  if (hasContent(inputs.cv, 10) && wordCount(inputs.cv) < 80) weak.push(s.weak.thinCv);
  if (hasContent(inputs.cv, 30) && cvEvidence < 0.15) weak.push(s.weak.unquantifiedCv);
  if (activities.length > 0 && activities.length < 4) weak.push(s.weak.fewActivities);
  if ((intake?.honors?.length ?? 0) === 0 && !hasContent(inputs.honors, 10)) weak.push(s.weak.noHonors);
  if (!intake?.majors) weak.push(s.weak.noMajor);
  if (hasContent(inputs.essay, 20) && essayWords < 300) weak.push(s.weak.shortEssay);
  if (hasContent(inputs.essay, 200) && essayEvidence < 0.15) weak.push(s.weak.thinEssay);

  const coherence: string[] = [];
  const majorHints = (intake?.majors ?? '').toLowerCase();
  const actText = (inputs.activities + ' ' + activities.map((a) => `${a.name} ${a.description}`).join(' ')).toLowerCase();
  if (majorHints && actText && !majorHints.split(/[,;/ ]+/).some((tok) => tok.length > 3 && actText.includes(tok))) {
    coherence.push(s.coherence.majorVsActivities);
  }
  if (hasContent(inputs.cv, 40) && activities.length > 0) {
    const cvLower = inputs.cv.toLowerCase();
    const activityNames = activities.map((a) => a.name.toLowerCase()).filter(Boolean);
    const matched = activityNames.filter((n) => n.length > 3 && cvLower.includes(n));
    if (activityNames.length >= 3 && matched.length <= 1) coherence.push(s.coherence.cvVsActivities);
  }
  if (hasContent(inputs.essay, 200) && intake?.majors) {
    const essayLower = inputs.essay.toLowerCase();
    const tokens = intake.majors.toLowerCase().split(/[,;/ ]+/).filter((t) => t.length > 3);
    if (tokens.length && !tokens.some((t) => essayLower.includes(t))) coherence.push(s.coherence.essayVsMajor);
  }

  const risks: string[] = [];
  if (hasContent(inputs.essay, 100)) {
    const lower = inputs.essay.toLowerCase();
    const genericHits = ['passion', 'journey', 'change the world', 'make a difference', 'đam mê', 'thay đổi'].filter((p) => lower.includes(p)).length;
    if (genericHits >= 2) risks.push(s.risks.genericEssay);
  }
  if (activities.length > 8 && sustained < 3) risks.push(s.risks.overloaded);
  if (activities.length > 0 && sustained === activities.length && activities.length <= 3) risks.push(s.risks.singleTheme);
  if (gpaLow) risks.push(s.risks.lowGpa);
  if (!intake?.testScores) risks.push(s.risks.missingTests);

  const priorities: string[] = [];
  if (cvEvidence < 0.2 || activities.some((a) => !a.hoursPerWeek)) priorities.push(s.priorities.quantify);
  if (activities.length > 5 && sustained < 3) priorities.push(s.priorities.deepen);
  priorities.push(s.priorities.narrative);
  if (!hasIntlHonor && (intake?.honors?.length ?? 0) > 0) priorities.push(s.priorities.verify);

  const actions: string[] = [];
  if (hasContent(inputs.essay, 40)) actions.push(s.actions.drafts);
  if ((intake?.honors?.length ?? 0) > 0) actions.push(s.actions.verifyHonors);
  if (activities.some((a) => !a.hoursPerWeek || !a.weeksPerYear)) actions.push(s.actions.activityHours);
  if (!intake?.majors || intake.majors.split(/[;,]/).length > 3) actions.push(s.actions.refineMajor);
  if (!intake?.rigor) actions.push(s.actions.rigorNotes);

  return {
    snapshot: s.snapshot({ summary, totalWords, coverage }),
    strengths: strengths.length
      ? strengths
      : [
          {
            title: locale === 'vi' ? 'Chưa đủ bằng chứng để nêu điểm mạnh' : 'Not enough evidence to name strengths yet',
            evidence: locale === 'vi' ? 'Dán thêm nội dung vào các tab' : 'Paste more material into the tabs',
          },
        ],
    weak,
    coherence,
    risks,
    priorities,
    actions,
    generatedAt: Date.now(),
  };
}
