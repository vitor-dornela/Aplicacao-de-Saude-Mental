import { QuestionnaireData } from '../App';
import { AnalysisResult, ApiResponse, Language } from '../types/api';

// In production (Vercel), API is on same domain. In dev, use localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

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
    if (response.status === 429) {
      throw new Error(language === 'pt' 
        ? 'Muitas requisições. Por favor, aguarde alguns minutos antes de tentar novamente.'
        : 'Too many requests. Please wait a few minutes before trying again.');
    }
    if (response.status === 500) {
      throw new Error(language === 'pt'
        ? 'Erro no servidor. Por favor, tente novamente mais tarde.'
        : 'Server error. Please try again later.');
    }
    throw new Error(language === 'pt'
      ? 'Erro ao conectar com o servidor. Verifique sua conexão.'
      : 'Error connecting to server. Check your connection.');
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
