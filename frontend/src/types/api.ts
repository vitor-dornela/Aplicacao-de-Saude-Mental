// API Types - mirrors backend response structure

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type Language = 'pt' | 'en';
