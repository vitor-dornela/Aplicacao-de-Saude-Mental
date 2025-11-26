import { useEffect, useState } from 'react';
import { QuestionnaireData } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Heart,
  Lightbulb,
  Phone,
  RefreshCw,
  Sparkles,
  User,
  Globe,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { Progress } from './ui/progress';
import { analyzeQuestionnaire } from '../services/api';
import { AnalysisResult, Language } from '../types/api';

interface ReportViewProps {
  responses: QuestionnaireData;
  onRestart: () => void;
  language?: Language;
}

export function ReportView({ responses, onRestart, language = 'pt' }: ReportViewProps) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const t = language === 'pt' ? translations.pt : translations.en;

  useEffect(() => {
    // Animate progress bar while loading
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    // Call the backend API
    analyzeQuestionnaire(responses, language)
      .then((result) => {
        setProgress(100);
        setTimeout(() => {
          setAnalysis(result);
          setLoading(false);
        }, 300);
      })
      .catch((err) => {
        console.error('Analysis error:', err);
        setError(err.message || t.errorMessage);
        setLoading(false);
      })
      .finally(() => {
        clearInterval(progressInterval);
      });

    return () => clearInterval(progressInterval);
  }, [responses, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full animate-pulse">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h2>{t.analyzing}</h2>
              <p className="text-gray-600">{t.processingMessage}</p>
              <Progress value={progress} className="max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-red-200">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-red-800">{t.errorTitle}</h2>
              <p className="text-gray-600">{error}</p>
              <Button onClick={onRestart} variant="outline" size="lg">
                <RefreshCw className="mr-2 w-5 h-5" />
                {t.tryAgain}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) return null;

  const riskColors = {
    low: 'text-green-600',
    moderate: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  };

  const riskBadges = {
    low: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const severityColors = {
    mild: 'bg-yellow-100 text-yellow-800',
    moderate: 'bg-orange-100 text-orange-800',
    severe: 'bg-red-100 text-red-800',
  };

  const priorityLabels = language === 'pt' 
    ? { immediate: 'Imediato', 'short-term': 'Curto prazo', ongoing: 'Contínuo' }
    : { immediate: 'Immediate', 'short-term': 'Short-term', ongoing: 'Ongoing' };

  const severityLabels = language === 'pt'
    ? { mild: 'Leve', moderate: 'Moderado', severe: 'Grave' }
    : { mild: 'Mild', moderate: 'Moderate', severe: 'Severe' };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="mb-2">{t.reportTitle}</h1>
        <p className="text-gray-600">
          {t.generatedOn} {new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')} {t.at} {new Date().toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {analysis.urgentHelp && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-900">{t.seekHelpImmediately}</AlertTitle>
          <AlertDescription className="text-red-800">
            {language === 'pt' ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>📞 <strong>CVV: 188</strong> (24h)</span>
                <span>💬 <a href="https://www.cvv.org.br" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-red-900">cvv.org.br</a></span>
                <span>🏥 CAPS ou UPA</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>📞 <strong>988</strong> (24/7)</span>
                <span>💬 Text <strong>741741</strong></span>
                <span>🏥 Emergency room</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Card */}
      <Card className="mb-6">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle>{t.riskLevelTitle}</CardTitle>
            <Badge className={riskBadges[analysis.riskLevel]}>
              {t.riskLabels[analysis.riskLevel]}
            </Badge>
          </div>
          <CardDescription className="mt-2 text-base">{analysis.summary}</CardDescription>
        </CardHeader>
      </Card>

      {/* Main Concerns - Collapsible */}
      {analysis.mainConcerns.length > 0 && (
        <Collapsible defaultOpen={false} className="mb-6">
          <Card>
            <CollapsibleTrigger className="w-full text-left">
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${riskColors[analysis.riskLevel]}`} />
                    <CardTitle>{t.mainConcernsTitle}</CardTitle>
                    <Badge variant="outline" className="ml-2">{analysis.mainConcerns.length}</Badge>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <ul className="space-y-4">
                  {analysis.mainConcerns.map((concern, index) => (
                    <li key={index} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{concern.area}</span>
                        <Badge className={severityColors[concern.severity]}>
                          {severityLabels[concern.severity]}
                        </Badge>
                      </div>
                      <span className="text-gray-600 text-sm">{concern.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Positive Aspects */}
      {analysis.positiveAspects.length > 0 && (
        <Card className="mb-6 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <CardTitle>{t.positiveAspectsTitle}</CardTitle>
            </div>
            <CardDescription>{t.positiveAspectsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.positiveAspects.map((aspect, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">{aspect}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggested Topics for Professional Discussion */}
      {analysis.suggestedTopics && analysis.suggestedTopics.length > 0 && (
        <Card className="mb-6 border-indigo-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              <CardTitle>{t.suggestedTopicsTitle}</CardTitle>
            </div>
            <CardDescription>{t.suggestedTopicsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.suggestedTopics.map((topic, index) => (
                <li key={index} className="flex gap-3 items-center">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{topic}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Psychoeducation */}
      <Card className="mb-6 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle>{analysis.psychoEducation.title || t.psychoEducationTitle}</CardTitle>
          </div>
          <CardDescription>{t.psychoEducationDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{analysis.psychoEducation.content}</p>
          {analysis.psychoEducation.suggestedReading && analysis.psychoEducation.suggestedReading.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">{t.suggestedReading}</span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {analysis.psychoEducation.suggestedReading.map((reading, index) => (
                  <li key={index}>
                    {typeof reading === 'string' ? (
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(reading)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {reading}
                      </a>
                    ) : (
                      <a 
                        href={reading.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {reading.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mb-6 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <CardTitle>{t.recommendationsTitle}</CardTitle>
          </div>
          <CardDescription>{t.recommendationsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {priorityLabels[recommendation.priority]}
                    </Badge>
                  </div>
                  <span className="text-gray-700">{recommendation.action}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Alert className="mb-6 border-purple-300 bg-purple-50">
        <Phone className="h-5 w-5 text-purple-600" />
        <AlertTitle className="text-purple-900">{t.seekProfessionalHelp}</AlertTitle>
        <AlertDescription className="text-purple-800 space-y-2">
          <p>
            <strong>{t.disclaimerBold}</strong> {t.disclaimerText}
          </p>
          <Separator className="my-3 bg-purple-200" />
          <div className="space-y-2 text-sm">
            {language === 'pt' ? (
              <>
                <p><strong>Psicólogos e Psiquiatras:</strong> Profissionais capacitados para avaliar e tratar questões de saúde mental</p>
                <p><strong>CVV - 188:</strong> Centro de Valorização da Vida (apoio emocional 24h, gratuito)</p>
                <p><strong>CAPS:</strong> Centros de Atenção Psicossocial (atendimento público e gratuito)</p>
                <p><strong>UBS:</strong> Unidades Básicas de Saúde (podem encaminhar para atendimento especializado)</p>
              </>
            ) : (
              <>
                <p><strong>Psychologists and Psychiatrists:</strong> Qualified professionals to evaluate and treat mental health issues</p>
                <p><strong>National Suicide Prevention Lifeline:</strong> 988 (24/7 free support)</p>
                <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                <p><strong>SAMHSA National Helpline:</strong> 1-800-662-4357 (treatment referrals)</p>
              </>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <Alert className="mb-8 border-gray-300 bg-gray-50">
        <AlertDescription className="text-gray-700">
          <strong>{t.confidentialityTitle}:</strong> {t.confidentialityText}
        </AlertDescription>
      </Alert>

      <div className="flex justify-center gap-4">
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
        >
          <RefreshCw className="mr-2 w-5 h-5" />
          {t.newAssessment}
        </Button>
        <Button
          onClick={() => window.print()}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {t.printSave}
        </Button>
      </div>
    </div>
  );
}

// Translations
const translations = {
  pt: {
    analyzing: 'Analisando suas respostas...',
    processingMessage: 'Estamos processando suas informações para gerar um relatório personalizado',
    errorTitle: 'Ops! Algo deu errado',
    errorMessage: 'Não foi possível processar suas respostas. Por favor, tente novamente.',
    tryAgain: 'Tentar Novamente',
    reportTitle: 'Seu Relatório de Bem-Estar',
    generatedOn: 'Relatório gerado em',
    at: 'às',
    seekHelpImmediately: 'Busque Ajuda Imediatamente',
    crisisMessage: 'Com base nas suas respostas, recomendamos fortemente que você busque ajuda profissional o quanto antes. Se você está em crise ou tendo pensamentos de autolesão, ligue para 188 (CVV - Centro de Valorização da Vida) agora.',
    riskLevelTitle: 'Nível de Atenção Identificado',
    riskLabels: {
      low: 'Baixo Risco',
      moderate: 'Atenção Moderada',
      high: 'Atenção Necessária',
      urgent: 'Atenção Urgente',
    },
    mainConcernsTitle: 'Principais Pontos de Atenção',
    mainConcernsDesc: 'Identificamos os seguintes aspectos que merecem cuidado especial',
    positiveAspectsTitle: 'Aspectos Positivos',
    positiveAspectsDesc: 'Reconhecemos também os pontos fortes no seu bem-estar atual',
    suggestedTopicsTitle: 'Tópicos Sugeridos para Discussão',
    suggestedTopicsDesc: 'Temas que podem ser abordados com um profissional de saúde mental',
    psychoEducationTitle: 'Informação Psicoeducativa',
    psychoEducationDesc: 'Entenda melhor os sintomas que você relatou',
    suggestedReading: 'Leituras Sugeridas',
    recommendationsTitle: 'Recomendações e Próximos Passos',
    recommendationsDesc: 'Sugestões práticas para melhorar seu bem-estar',
    seekProfessionalHelp: 'Busque Ajuda Profissional',
    disclaimerBold: 'Este relatório não substitui uma avaliação médica ou psicológica profissional.',
    disclaimerText: 'Recomendamos fortemente que você busque orientação de profissionais qualificados:',
    confidentialityTitle: 'Confidencialidade',
    confidentialityText: 'Este relatório foi gerado e não foi armazenado em nenhum servidor. Você pode salvar esta página ou fazer capturas de tela se desejar guardar essas informações.',
    newAssessment: 'Nova Avaliação',
    printSave: 'Imprimir/Salvar Relatório',
  },
  en: {
    analyzing: 'Analyzing your responses...',
    processingMessage: 'We are processing your information to generate a personalized report',
    errorTitle: 'Oops! Something went wrong',
    errorMessage: 'Unable to process your responses. Please try again.',
    tryAgain: 'Try Again',
    reportTitle: 'Your Well-Being Report',
    generatedOn: 'Report generated on',
    at: 'at',
    seekHelpImmediately: 'Seek Help Immediately',
    crisisMessage: 'Based on your responses, we strongly recommend that you seek professional help as soon as possible. If you are in crisis or having thoughts of self-harm, call 988 (Suicide & Crisis Lifeline) now.',
    riskLevelTitle: 'Identified Attention Level',
    riskLabels: {
      low: 'Low Risk',
      moderate: 'Moderate Attention',
      high: 'High Attention Needed',
      urgent: 'Urgent Attention',
    },
    mainConcernsTitle: 'Main Areas of Concern',
    mainConcernsDesc: 'We identified the following aspects that deserve special attention',
    positiveAspectsTitle: 'Positive Aspects',
    positiveAspectsDesc: 'We also recognize the strengths in your current well-being',
    suggestedTopicsTitle: 'Suggested Discussion Topics',
    suggestedTopicsDesc: 'Topics that can be addressed with a mental health professional',
    psychoEducationTitle: 'Psychoeducational Information',
    psychoEducationDesc: 'Better understand the symptoms you reported',
    suggestedReading: 'Suggested Reading',
    recommendationsTitle: 'Recommendations and Next Steps',
    recommendationsDesc: 'Practical suggestions to improve your well-being',
    seekProfessionalHelp: 'Seek Professional Help',
    disclaimerBold: 'This report does not replace a professional medical or psychological evaluation.',
    disclaimerText: 'We strongly recommend that you seek guidance from qualified professionals:',
    confidentialityTitle: 'Confidentiality',
    confidentialityText: 'This report was generated and was not stored on any server. You can save this page or take screenshots if you wish to keep this information.',
    newAssessment: 'New Assessment',
    printSave: 'Print/Save Report',
  },
};