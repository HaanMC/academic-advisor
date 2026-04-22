import type { Locale } from '../../i18n';
import type { IntakeData } from '../../storage/schemas';
import type { ProfileSummary } from '../types';
import { summarizeIntake } from './util';

export function runProfileSummaryMock(intake: IntakeData, locale: Locale): ProfileSummary {
  const L = locale === 'vi';
  const totalActivities = intake.activities.length;
  const sustained = intake.activities.filter((a) => a.hoursPerWeek >= 3 && a.weeksPerYear >= 20).length;
  const honors = intake.honors.length;
  const topMajor = intake.majors.split(/[;,/]/)[0]?.trim() || (L ? 'lĩnh vực chưa xác định' : 'undecided field');

  const gpaNum = parseFloat((intake.gpa || '').replace(',', '.'));
  const gpaScale = parseFloat((intake.gpaScale || '').replace(',', '.'));
  const gpaRatio = !isNaN(gpaNum) && !isNaN(gpaScale) && gpaScale > 0 ? gpaNum / gpaScale : NaN;

  const headline = L
    ? `${intake.fullName || 'Học sinh'} — hướng về ${topMajor}${intake.targetCountries.length ? `, nộp tại ${intake.targetCountries.slice(0, 3).join(' / ')}` : ''}.`
    : `${intake.fullName || 'Student'} — oriented toward ${topMajor}${intake.targetCountries.length ? `, applying in ${intake.targetCountries.slice(0, 3).join(' / ')}` : ''}.`;

  const paragraphs: string[] = [];

  paragraphs.push(summarizeIntake(intake, locale));

  if (!isNaN(gpaRatio)) {
    paragraphs.push(
      L
        ? `Học lực hiện ở mức ${Math.round(gpaRatio * 100)}% thang ${intake.gpaScale || '4.0'}${
            intake.curriculum ? ` trên chương trình ${intake.curriculum}` : ''
          }.`
        : `Academic performance sits at ${Math.round(gpaRatio * 100)}% of the ${intake.gpaScale || '4.0'} scale${
            intake.curriculum ? ` on ${intake.curriculum}` : ''
          }.`,
    );
  }

  paragraphs.push(
    L
      ? `Có ${totalActivities} hoạt động được khai báo, trong đó ${sustained} có cam kết bền bỉ (≥3 giờ/tuần, ≥20 tuần/năm). ${honors} giải thưởng trong hồ sơ.`
      : `${totalActivities} activities logged, ${sustained} with sustained commitment (≥3 h/w, ≥20 w/y). ${honors} honors on file.`,
  );

  if (intake.strengths) paragraphs.push((L ? 'Điểm mạnh theo tự đánh giá: ' : 'Self-described strengths: ') + intake.strengths);
  if (intake.weaknesses) paragraphs.push((L ? 'Điểm yếu theo tự đánh giá: ' : 'Self-described weaknesses: ') + intake.weaknesses);

  return { headline, paragraphs, generatedAt: Date.now() };
}
