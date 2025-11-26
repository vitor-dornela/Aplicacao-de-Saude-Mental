import { QuestionnaireData } from '../App';
import { AnalysisResult, ApiResponse, Language } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function analyzeQuestionnaire(
  data: QuestionnaireData,
  language: Language = 'pt'
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result: ApiResponse<AnalysisResult> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Unknown error occurred');
  }

  return result.data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
