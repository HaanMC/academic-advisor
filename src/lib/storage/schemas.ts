export interface IntakeActivity {
  id: string;
  name: string;
  role: string;
  hoursPerWeek: number;
  weeksPerYear: number;
  description: string;
}

export interface IntakeHonor {
  id: string;
  name: string;
  level: 'School' | 'Regional' | 'National' | 'International';
  year: string;
  description: string;
}

export interface IntakeData {
  fullName: string;
  grade: string;
  school: string;
  country: string;
  gpa: string;
  gpaScale: string;
  curriculum: string;
  rigor: string;
  testScores: string;
  strengths: string;
  weaknesses: string;
  majors: string;
  ambition: string;
  targetCountries: string[];
  essayStatus: string;
  budget: string;
  deadlines: string;
  family: string;
  activities: IntakeActivity[];
  honors: IntakeHonor[];
  updatedAt: number;
  completedSteps: string[];
}

export const emptyIntake: IntakeData = {
  fullName: '',
  grade: '',
  school: '',
  country: '',
  gpa: '',
  gpaScale: '4.0',
  curriculum: '',
  rigor: '',
  testScores: '',
  strengths: '',
  weaknesses: '',
  majors: '',
  ambition: '',
  targetCountries: [],
  essayStatus: '',
  budget: '',
  deadlines: '',
  family: '',
  activities: [],
  honors: [],
  updatedAt: 0,
  completedSteps: [],
};

export interface SchoolEntry {
  id: string;
  name: string;
  location: string;
  admitRate?: string;
  category: 'fit' | 'stretch' | 'safer' | 'unassigned';
  notes?: string;
  reasoning?: SchoolReasoning;
  addedAt: number;
}

export interface SchoolReasoning {
  whyFits: string[];
  whyStretch: string[];
  uncertain: string[];
  verifyNext: string[];
  generatedAt: number;
}

export interface EssayDraft {
  id: string;
  title: string;
  prompt: string;
  outline: string;
  content: string;
  wordCount: number;
  updatedAt: number;
  review?: EssayReviewResult;
}

export interface EssayReviewResult {
  works: string[];
  generic: string[];
  reflection: string[];
  voice: string[];
  revision: string[];
  phrasing: string[];
  genericPhrasesDetected: string[];
  generatedAt: number;
}

export interface StoryEntry {
  id: string;
  title: string;
  beats: string;
  mood: string;
  createdAt: number;
}

export interface DossierInputs {
  transcript: string;
  cv: string;
  activities: string;
  honors: string;
  essay: string;
}

export interface DossierAnalysis {
  snapshot: string;
  strengths: Array<{ title: string; evidence: string }>;
  weak: string[];
  coherence: string[];
  risks: string[];
  priorities: string[];
  actions: string[];
  generatedAt: number;
}

export interface InterviewAnswer {
  id: string;
  questionId: string;
  questionText: string;
  category: string;
  answer: string;
  feedback?: InterviewFeedback;
  createdAt: number;
}

export interface InterviewFeedback {
  rubric: Array<{ label: string; score: number; note: string }>;
  strengths: string[];
  weak: string[];
  vague: string[];
  better: string;
  followUp: string;
  generatedAt: number;
}

export interface DashboardSnapshot {
  readiness: number;
  dimensions: Array<{ key: string; score: number }>;
  strengths: string[];
  risks: string[];
  missing: string[];
  nextActions: string[];
  gpaTrend: Array<{ term: string; gpa: number }>;
  subjectStrength: Array<{ subject: string; score: number }>;
  activityBalance: Array<{ category: string; hours: number }>;
  timeline: Array<{ title: string; date: string; state: 'done' | 'now' | 'soon' }>;
  generatedAt: number;
}
