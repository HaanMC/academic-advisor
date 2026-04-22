import type { Locale } from '../i18n';
import type {
  DossierInputs,
  DossierAnalysis,
  EssayReviewResult,
  InterviewFeedback,
  IntakeData,
  SchoolReasoning,
} from '../storage/schemas';

export type AIMode = 'mock' | 'server';

export interface AIProviderStatus {
  mode: AIMode;
  hasServer: boolean;
  label: string;
  detail: string;
}

export interface ReviewDossierInput {
  intake?: IntakeData | null;
  inputs: DossierInputs;
  locale: Locale;
}

export interface ReviewEssayInput {
  prompt: string;
  outline: string;
  content: string;
  locale: Locale;
}

export interface SchoolFitInput {
  intake?: IntakeData | null;
  schoolName: string;
  location: string;
  admitRate?: string;
  locale: Locale;
}

export interface InterviewFeedbackInput {
  questionText: string;
  category: string;
  answer: string;
  locale: Locale;
}

export interface ProfileSummaryInput {
  intake: IntakeData;
  locale: Locale;
}

export interface ProfileSummary {
  headline: string;
  paragraphs: string[];
  generatedAt: number;
}

export interface TranslateInput {
  text: string;
  from: Locale;
  to: Locale;
}

export interface AIProvider {
  readonly status: AIProviderStatus;
  reviewDossier(input: ReviewDossierInput): Promise<DossierAnalysis>;
  reviewEssay(input: ReviewEssayInput): Promise<EssayReviewResult>;
  reasonSchoolFit(input: SchoolFitInput): Promise<SchoolReasoning>;
  evaluateInterview(input: InterviewFeedbackInput): Promise<InterviewFeedback>;
  summarizeProfile(input: ProfileSummaryInput): Promise<ProfileSummary>;
  translate(input: TranslateInput): Promise<string>;
}
