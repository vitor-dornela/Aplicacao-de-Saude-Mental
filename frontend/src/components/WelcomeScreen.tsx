import { Heart, Shield, Brain, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Language } from '../types/api';

interface WelcomeScreenProps {
  onStart: () => void;
  language?: Language;
}

const translations = {
  pt: {
    title: 'Bem-Estar Mental',
    subtitle: 'Uma ferramenta de autoavaliação inteligente para ajudar você a entender melhor seu bem-estar emocional',
    confidential: 'Confidencial e anônimo.',
    disclaimer: 'Suas respostas são processadas de forma segura. Este não é um diagnóstico médico.',
    selfKnowledge: 'Autoconhecimento',
    selfKnowledgeDesc: 'Receba um feedback personalizado sobre seu estado emocional atual',
    education: 'Educação',
    educationDesc: 'Informações psicoeducativas sobre os sintomas que você relata',
    guidance: 'Orientação',
    guidanceDesc: 'Sugestões práticas e direcionamento para ajuda profissional qualificada',
    howItWorks: 'Como funciona',
    step1: 'Responda o questionário',
    step1Desc: 'sobre seu bem-estar e sintomas recentes',
    step2: 'Receba um relatório personalizado',
    step2Desc: 'com análise dos principais pontos de atenção',
    step3: 'Obtenha recomendações',
    step3Desc: 'baseadas em suas respostas e direcionamento para ajuda profissional',
    startButton: 'Começar Avaliação',
    aiPowered: 'Análise impulsionada por IA',
  },
  en: {
    title: 'Mental Well-Being',
    subtitle: 'An intelligent self-assessment tool to help you better understand your emotional well-being',
    confidential: 'Confidential and anonymous.',
    disclaimer: 'Your responses are processed securely. This is not a medical diagnosis.',
    selfKnowledge: 'Self-Knowledge',
    selfKnowledgeDesc: 'Receive personalized feedback about your current emotional state',
    education: 'Education',
    educationDesc: 'Psychoeducational information about the symptoms you report',
    guidance: 'Guidance',
    guidanceDesc: 'Practical suggestions and direction for qualified professional help',
    howItWorks: 'How it works',
    step1: 'Answer the questionnaire',
    step1Desc: 'about your well-being and recent symptoms',
    step2: 'Receive a personalized report',
    step2Desc: 'with analysis of key points of attention',
    step3: 'Get recommendations',
    step3Desc: 'based on your responses and direction for professional help',
    startButton: 'Start Assessment',
    aiPowered: 'AI-powered analysis',
  },
};

export function WelcomeScreen({ onStart, language = 'pt' }: WelcomeScreenProps) {
  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <Alert className="mb-8 border-purple-200 bg-purple-50">
        <Shield className="h-5 w-5 text-purple-600" />
        <AlertDescription className="text-purple-900">
          <strong>{t.confidential}</strong> {t.disclaimer}
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="border-purple-100">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>{t.selfKnowledge}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {t.selfKnowledgeDesc}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>{t.education}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {t.educationDesc}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardHeader>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-pink-600" />
            </div>
            <CardTitle>{t.guidance}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {t.guidanceDesc}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t.howItWorks}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              1
            </div>
            <div>
              <p className="text-gray-700">
                <strong>{t.step1}</strong> {t.step1Desc}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              2
            </div>
            <div>
              <p className="text-gray-700">
                <strong>{t.step2}</strong> {t.step2Desc}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              3
            </div>
            <div>
              <p className="text-gray-700">
                <strong>{t.step3}</strong> {t.step3Desc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="mb-8 border-amber-200 bg-amber-50">
        <AlertDescription className="text-amber-900">
          {language === 'pt' ? (
            <>
              <strong>Importante:</strong> Este relatório não substitui uma avaliação médica ou psicológica profissional.
              Se você está em crise ou pensando em se machucar, procure ajuda imediatamente ligando para 188 (CVV - Centro de Valorização da Vida).
            </>
          ) : (
            <>
              <strong>Important:</strong> This report does not replace a professional medical or psychological evaluation.
              If you are in crisis or thinking about harming yourself, seek help immediately by calling 988 (Suicide & Crisis Lifeline).
            </>
          )}
        </AlertDescription>
      </Alert>

      <div className="text-center space-y-2">
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {t.startButton}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-sm text-gray-500">{t.aiPowered}</p>
      </div>
    </div>
  );
}
