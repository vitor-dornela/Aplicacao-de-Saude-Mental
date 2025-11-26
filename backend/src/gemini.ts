import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuestionnaireInput, AnalysisResult } from './types.js';
import { 
  SYSTEM_PROMPT_PT, 
  SYSTEM_PROMPT_EN, 
  JSON_SCHEMA,
  containsCrisisKeywords 
} from './prompts.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Fallback response for when API fails
function getFallbackResponse(language: 'pt' | 'en', isUrgent: boolean): AnalysisResult {
  if (language === 'pt') {
    return {
      riskLevel: isUrgent ? 'urgent' : 'moderate',
      urgentHelp: isUrgent,
      summary: isUrgent 
        ? 'Não foi possível processar sua avaliação, mas identificamos sinais importantes. Por favor, busque ajuda profissional.'
        : 'Não foi possível processar sua avaliação completamente. Recomendamos buscar orientação profissional.',
      mainConcerns: [],
      positiveAspects: ['Você deu um passo importante ao buscar autoconhecimento'],
      suggestedTopics: ['Saúde Mental', 'Bem-estar emocional'],
      psychoEducation: {
        title: 'Busque Apoio Profissional',
        content: 'Profissionais de saúde mental podem oferecer avaliação e suporte adequados às suas necessidades.',
        suggestedReading: [
          { title: 'Como encontrar um psicólogo' },
          { title: 'Serviços de saúde mental no SUS' }
        ]
      },
      recommendations: [
        { priority: 'short-term', action: 'Procure um psicólogo ou psiquiatra para uma avaliação profissional' },
        { priority: 'immediate', action: isUrgent ? 'Ligue para o CVV: 188 (24h, gratuito)' : 'Converse com alguém de confiança sobre como você está se sentindo' }
      ],
      crisisResources: {
        show: isUrgent,
        message: isUrgent ? '📞 CVV: 188 (24h, gratuito)\n📱 Chat: cvv.org.br\n🏥 CAPS ou UPA mais próximos' : ''
      }
    };
  } else {
    return {
      riskLevel: isUrgent ? 'urgent' : 'moderate',
      urgentHelp: isUrgent,
      summary: isUrgent
        ? 'We could not fully process your assessment, but we identified important signs. Please seek professional help.'
        : 'We could not fully process your assessment. We recommend seeking professional guidance.',
      mainConcerns: [],
      positiveAspects: ['You took an important step by seeking self-knowledge'],
      suggestedTopics: ['Mental Health', 'Emotional well-being'],
      psychoEducation: {
        title: 'Seek Professional Support',
        content: 'Mental health professionals can provide proper assessment and support tailored to your needs.',
        suggestedReading: [
          { title: 'How to find a therapist' },
          { title: 'Mental health services and resources' }
        ]
      },
      recommendations: [
        { priority: 'short-term', action: 'Seek a psychologist or psychiatrist for a professional assessment' },
        { priority: 'immediate', action: isUrgent ? 'Call 988 Suicide & Crisis Lifeline (24/7, free)' : 'Talk to someone you trust about how you are feeling' }
      ],
      crisisResources: {
        show: isUrgent,
        message: isUrgent ? '📞 988 Suicide & Crisis Lifeline (24/7)\n📱 Text HOME to 741741\n🏥 Nearest emergency room' : ''
      }
    };
  }
}

export async function analyzeQuestionnaire(input: QuestionnaireInput): Promise<AnalysisResult> {
  const language = input.language || 'pt';
  
  // Check for crisis keywords in open response
  const hasCrisisKeywords = input.openResponse 
    ? containsCrisisKeywords(input.openResponse, language) 
    : false;
  
  // Force urgent if very-dark hopelessness or crisis keywords detected
  const forceUrgent = input.hopelessness === 'very-dark' || hasCrisisKeywords;

  try {
    console.log('Creating Gemini model...');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    const systemPrompt = language === 'pt' ? SYSTEM_PROMPT_PT : SYSTEM_PROMPT_EN;
    
    const userMessage = language === 'pt' 
      ? `Analise as seguintes respostas do questionário de bem-estar mental e gere um relatório personalizado:

${JSON.stringify(input, null, 2)}

Gere o relatório em JSON seguindo este schema:
${JSON_SCHEMA}`
      : `Analyze the following mental wellness questionnaire responses and generate a personalized report:

${JSON.stringify(input, null, 2)}

Generate the report in JSON following this schema:
${JSON_SCHEMA}`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage }
    ]);

    const response = result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present
    text = text.replace(/^```json\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    
    // Parse JSON response
    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(text);
    } catch {
      console.error('Failed to parse Gemini response:', text);
      return getFallbackResponse(language, forceUrgent);
    }

    // Safety override: ensure urgent cases are properly flagged
    if (forceUrgent) {
      analysis.riskLevel = 'urgent';
      analysis.urgentHelp = true;
      
      // Ensure crisis resources are shown
      if (!analysis.crisisResources.show) {
        analysis.crisisResources.show = true;
        analysis.crisisResources.message = language === 'pt'
          ? '📞 CVV: 188 (24h, gratuito)\n📱 Chat: cvv.org.br\n🏥 CAPS ou UPA mais próximos\n\nVocê importa. Sua vida tem valor.'
          : '📞 988 Suicide & Crisis Lifeline (24/7)\n📱 Text HOME to 741741\n🏥 Nearest emergency room\n\nYou matter. Your life has value.';
      }
    }

    return analysis;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Gemini API error:', errorMessage);
    
    // Log more details if available
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      if ('status' in errorObj) console.error('Status:', errorObj.status);
      if ('statusText' in errorObj) console.error('Status Text:', errorObj.statusText);
    }
    
    return getFallbackResponse(language, forceUrgent);
  }
}
