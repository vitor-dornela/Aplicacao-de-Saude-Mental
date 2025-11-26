import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// ============== TYPES ==============

const QuestionnaireSchema = z.object({
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

type QuestionnaireInput = z.infer<typeof QuestionnaireSchema>;

interface AnalysisResult {
  riskLevel: 'low' | 'moderate' | 'high' | 'urgent';
  urgentHelp: boolean;
  summary: string;
  mainConcerns: { area: string; description: string; severity: 'mild' | 'moderate' | 'severe' }[];
  positiveAspects: string[];
  suggestedTopics: string[];
  psychoEducation: {
    title: string;
    content: string;
    suggestedReading: { title: string; url?: string }[];
  };
  recommendations: { priority: 'immediate' | 'short-term' | 'ongoing'; action: string }[];
  crisisResources: { show: boolean; message: string };
}

// ============== PROMPTS ==============

const SYSTEM_PROMPT_PT = `Você é um assistente de bem-estar mental empático e profissional. Analise as respostas do questionário e gere um relatório JSON.

REGRAS:
1. NÃO DIAGNOSTIQUE - use "os sintomas podem indicar..."
2. Seja empático e acolhedor
3. Incentive ajuda profissional (CVV 188, CAPS, UBS)
4. Se hopelessness = "very-dark", marque urgentHelp = true
5. Seja específico baseado nas respostas
6. Para suggestedReading, forneça apenas títulos de temas (sem URLs)
7. Responda APENAS com JSON válido`;

const SYSTEM_PROMPT_EN = `You are an empathetic mental wellness assistant. Analyze questionnaire responses and generate a JSON report.

RULES:
1. DO NOT DIAGNOSE - use "symptoms may indicate..."
2. Be empathetic and supportive
3. Encourage professional help (988 Lifeline, Crisis Text Line)
4. If hopelessness = "very-dark", set urgentHelp = true
5. Be specific based on responses
6. For suggestedReading, provide only topic titles (no URLs)
7. Respond ONLY with valid JSON`;

const JSON_SCHEMA = `{
  "riskLevel": "low" | "moderate" | "high" | "urgent",
  "urgentHelp": boolean,
  "summary": "string",
  "mainConcerns": [{"area": "string", "description": "string", "severity": "mild"|"moderate"|"severe"}],
  "positiveAspects": ["string"],
  "suggestedTopics": ["string"],
  "psychoEducation": {"title": "string", "content": "string", "suggestedReading": [{"title": "string"}]},
  "recommendations": [{"priority": "immediate"|"short-term"|"ongoing", "action": "string"}],
  "crisisResources": {"show": boolean, "message": "string"}
}`;

const CRISIS_KEYWORDS_PT = ['suicídio', 'me matar', 'não quero mais viver', 'morrer', 'acabar com tudo'];
const CRISIS_KEYWORDS_EN = ['suicide', 'kill myself', "don't want to live", 'want to die', 'end it all'];

function containsCrisisKeywords(text: string, language: 'pt' | 'en'): boolean {
  const keywords = language === 'pt' ? CRISIS_KEYWORDS_PT : CRISIS_KEYWORDS_EN;
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
}

// ============== FALLBACK ==============

function getFallbackResponse(language: 'pt' | 'en', isUrgent: boolean): AnalysisResult {
  if (language === 'pt') {
    return {
      riskLevel: isUrgent ? 'urgent' : 'moderate',
      urgentHelp: isUrgent,
      summary: isUrgent 
        ? 'Identificamos sinais importantes. Por favor, busque ajuda profissional.'
        : 'Recomendamos buscar orientação profissional.',
      mainConcerns: [],
      positiveAspects: ['Você deu um passo importante ao buscar autoconhecimento'],
      suggestedTopics: ['Saúde Mental', 'Bem-estar emocional'],
      psychoEducation: {
        title: 'Busque Apoio Profissional',
        content: 'Profissionais de saúde mental podem oferecer avaliação e suporte adequados.',
        suggestedReading: [{ title: 'Como encontrar um psicólogo' }]
      },
      recommendations: [
        { priority: 'short-term', action: 'Procure um psicólogo ou psiquiatra' },
        { priority: 'immediate', action: isUrgent ? 'Ligue para o CVV: 188' : 'Converse com alguém de confiança' }
      ],
      crisisResources: {
        show: isUrgent,
        message: isUrgent ? '📞 CVV: 188 (24h, gratuito)\n🏥 CAPS ou UPA mais próximos' : ''
      }
    };
  }
  return {
    riskLevel: isUrgent ? 'urgent' : 'moderate',
    urgentHelp: isUrgent,
    summary: isUrgent 
      ? 'We identified important signs. Please seek professional help.'
      : 'We recommend seeking professional guidance.',
    mainConcerns: [],
    positiveAspects: ['You took an important step by seeking self-knowledge'],
    suggestedTopics: ['Mental Health', 'Emotional well-being'],
    psychoEducation: {
      title: 'Seek Professional Support',
      content: 'Mental health professionals can provide proper assessment and support.',
      suggestedReading: [{ title: 'How to find a therapist' }]
    },
    recommendations: [
      { priority: 'short-term', action: 'Seek a psychologist or psychiatrist' },
      { priority: 'immediate', action: isUrgent ? 'Call 988 Suicide & Crisis Lifeline' : 'Talk to someone you trust' }
    ],
    crisisResources: {
      show: isUrgent,
      message: isUrgent ? '📞 988 Suicide & Crisis Lifeline (24/7)\n🏥 Nearest emergency room' : ''
    }
  };
}

// ============== ANALYZE ==============

async function analyzeQuestionnaire(input: QuestionnaireInput): Promise<AnalysisResult> {
  const language = input.language || 'pt';
  const hasCrisisKeywords = input.openResponse ? containsCrisisKeywords(input.openResponse, language) : false;
  const forceUrgent = input.hopelessness === 'very-dark' || hasCrisisKeywords;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
    });

    const systemPrompt = language === 'pt' ? SYSTEM_PROMPT_PT : SYSTEM_PROMPT_EN;
    const userMessage = `Analyze: ${JSON.stringify(input)}\n\nJSON Schema: ${JSON_SCHEMA}`;

    const result = await model.generateContent([{ text: systemPrompt }, { text: userMessage }]);
    let text = result.response.text();
    text = text.replace(/^```json\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

    let analysis: AnalysisResult = JSON.parse(text);

    if (forceUrgent) {
      analysis.riskLevel = 'urgent';
      analysis.urgentHelp = true;
      if (!analysis.crisisResources.show) {
        analysis.crisisResources.show = true;
        analysis.crisisResources.message = language === 'pt'
          ? '📞 CVV: 188 (24h, gratuito)\n🏥 CAPS ou UPA mais próximos'
          : '📞 988 Suicide & Crisis Lifeline (24/7)\n🏥 Nearest emergency room';
      }
    }

    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse(language, forceUrgent);
  }
}

// ============== HANDLER ==============

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const validatedInput = QuestionnaireSchema.parse(req.body);
    const analysis = await analyzeQuestionnaire(validatedInput);
    return res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('Analysis error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
