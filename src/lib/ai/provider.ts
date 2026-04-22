import { runDossierMockAnalysis } from './mock/dossier';
import { runEssayMockReview } from './mock/essay';
import { runInterviewMock } from './mock/interview';
import { runProfileSummaryMock } from './mock/profile';
import { runSchoolFitMock } from './mock/schoolFit';
import { runTranslateMock } from './mock/translate';
import { simulateLatency } from './mock/util';
import type {
  AIProvider,
  AIProviderStatus,
  InterviewFeedbackInput,
  ProfileSummaryInput,
  ReviewDossierInput,
  ReviewEssayInput,
  SchoolFitInput,
  TranslateInput,
} from './types';

/**
 * Read AI provider env at build time.
 * When a server runtime is wired later, set VITE_AI_PROVIDER=server and
 * VITE_AI_ENDPOINT to the server route. On GitHub Pages (static), these are
 * blank, so the provider stays in mock mode.
 */
function resolveStatus(): AIProviderStatus {
  const mode = (import.meta.env.VITE_AI_PROVIDER as string | undefined)?.toLowerCase();
  const hasServer = mode === 'server' && Boolean(import.meta.env.VITE_AI_ENDPOINT);
  if (hasServer) {
    return {
      mode: 'server',
      hasServer: true,
      label: 'server',
      detail: 'Connected to a server runtime',
    };
  }
  return { mode: 'mock', hasServer: false, label: 'mock', detail: 'Browser-local analysis' };
}

class MockProvider implements AIProvider {
  public readonly status = resolveStatus();

  async reviewDossier(input: ReviewDossierInput) {
    await simulateLatency();
    return runDossierMockAnalysis(input.inputs, input.intake ?? null, input.locale);
  }

  async reviewEssay(input: ReviewEssayInput) {
    await simulateLatency();
    return runEssayMockReview(input.content, input.prompt, input.outline, input.locale);
  }

  async reasonSchoolFit(input: SchoolFitInput) {
    await simulateLatency();
    return runSchoolFitMock(input);
  }

  async evaluateInterview(input: InterviewFeedbackInput) {
    await simulateLatency();
    return runInterviewMock(input);
  }

  async summarizeProfile(input: ProfileSummaryInput) {
    await simulateLatency(200);
    return runProfileSummaryMock(input.intake, input.locale);
  }

  async translate(input: TranslateInput) {
    await simulateLatency(150);
    return runTranslateMock(input.text, input.from, input.to);
  }
}

/**
 * A future ServerProvider would POST { action, payload } to VITE_AI_ENDPOINT
 * and parse the JSON response. Left as a stub for the swap.
 *
 * class ServerProvider implements AIProvider {
 *   async reviewDossier(input) { return post('reviewDossier', input); }
 *   ...
 * }
 */

let _instance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!_instance) _instance = new MockProvider();
  return _instance;
}
