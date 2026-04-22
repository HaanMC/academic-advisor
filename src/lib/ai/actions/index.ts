import { getAIProvider } from '../provider';
import type {
  InterviewFeedbackInput,
  ProfileSummaryInput,
  ReviewDossierInput,
  ReviewEssayInput,
  SchoolFitInput,
  TranslateInput,
} from '../types';

export function reviewDossier(input: ReviewDossierInput) {
  return getAIProvider().reviewDossier(input);
}

export function reviewEssay(input: ReviewEssayInput) {
  return getAIProvider().reviewEssay(input);
}

export function reasonSchoolFit(input: SchoolFitInput) {
  return getAIProvider().reasonSchoolFit(input);
}

export function evaluateInterview(input: InterviewFeedbackInput) {
  return getAIProvider().evaluateInterview(input);
}

export function summarizeProfile(input: ProfileSummaryInput) {
  return getAIProvider().summarizeProfile(input);
}

export function translate(input: TranslateInput) {
  return getAIProvider().translate(input);
}

export function aiStatus() {
  return getAIProvider().status;
}
