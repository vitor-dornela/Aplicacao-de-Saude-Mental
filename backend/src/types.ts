import { z } from 'zod';

// Questionnaire input validation schema
export const QuestionnaireSchema = z.object({
  mood: z.enum(['very-good', 'good', 'neutral', 'bad', 'very-bad']),
  sleep: z.enum(['excellent', 'good', 'irregular', 'poor', 'very-poor']),
  energy: z.enum(['high', 'normal', 'low', 'very-low', 'exhausted']),
  concentration: z.enum(['excellent', 'good', 'moderate', 'poor', 'very-poor']),
  socialInteraction: z.enum(['enjoy', 'normal', 'reduced', 'avoiding', 'isolated']),
  appetite: z.enum(['normal', 'slight-change', 'increased', 'decreased', 'very-changed']),
  hopelessness: z.enum(['optimistic', 'neutral', 'some-worry', 'hopeless', 'very-dark']),
  anxiety: z.enum(['none', 'occasional', 'frequent', 'constant', 'overwhelming']),
  physicalSymptoms: z.enum(['none', 'minimal', 'moderate', 'frequent', 'severe']),
  dailyActivities: z.enum(['normal', 'slight-difficulty', 'moderate-difficulty', 'major-difficulty', 'unable']),
  openResponse: z.string().max(2000).optional().default(''),
  language: z.enum(['pt', 'en']).optional().default('pt'),
});

export type QuestionnaireInput = z.infer<typeof QuestionnaireSchema>;

// Analysis result types
export interface MainConcern {
  area: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Recommendation {
  priority: 'immediate' | 'short-term' | 'ongoing';
  action: string;
}

export interface PsychoEducation {
  title: string;
  content: string;
  suggestedReading: string[];
}

export interface CrisisResources {
  show: boolean;
  message: string;
}

export interface AnalysisResult {
  riskLevel: 'low' | 'moderate' | 'high' | 'urgent';
  urgentHelp: boolean;
  summary: string;
  mainConcerns: MainConcern[];
  positiveAspects: string[];
  suggestedTopics: string[];
  psychoEducation: PsychoEducation;
  recommendations: Recommendation[];
  crisisResources: CrisisResources;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
