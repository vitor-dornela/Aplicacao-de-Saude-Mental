import { useState } from 'react';
import { QuestionnaireData } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Language } from '../types/api';

interface QuestionnaireFormProps {
  onSubmit: (data: QuestionnaireData) => void;
  language?: Language;
}

const questionsPt = [
  {
    id: 'mood',
    title: 'Como você descreveria seu humor nas últimas duas semanas?',
    options: [
      { value: 'very-good', label: 'Muito bom, me sinto feliz e animado(a)' },
      { value: 'good', label: 'Bom, estável na maior parte do tempo' },
      { value: 'neutral', label: 'Neutro, nem bom nem ruim' },
      { value: 'bad', label: 'Ruim, me sinto triste ou desanimado(a) frequentemente' },
      { value: 'very-bad', label: 'Muito ruim, me sinto deprimido(a) a maior parte do tempo' },
    ],
  },
  {
    id: 'sleep',
    title: 'Como está a qualidade do seu sono?',
    options: [
      { value: 'excellent', label: 'Excelente, durmo bem todas as noites' },
      { value: 'good', label: 'Boa, com algumas noites irregulares' },
      { value: 'irregular', label: 'Irregular, tenho dificuldade para dormir algumas vezes' },
      { value: 'poor', label: 'Ruim, frequentemente tenho insônia ou durmo demais' },
      { value: 'very-poor', label: 'Muito ruim, raramente consigo ter uma noite de sono reparador' },
    ],
  },
  {
    id: 'energy',
    title: 'Como está seu nível de energia durante o dia?',
    options: [
      { value: 'high', label: 'Alto, me sinto disposto(a) e produtivo(a)' },
      { value: 'normal', label: 'Normal, consigo realizar minhas atividades' },
      { value: 'low', label: 'Baixo, me sinto cansado(a) com frequência' },
      { value: 'very-low', label: 'Muito baixo, sinto fadiga constante' },
      { value: 'exhausted', label: 'Exausto(a), mal consigo sair da cama' },
    ],
  },
  {
    id: 'concentration',
    title: 'Como está sua capacidade de concentração e tomada de decisões?',
    options: [
      { value: 'excellent', label: 'Excelente, consigo me concentrar bem' },
      { value: 'good', label: 'Boa, com algumas distrações ocasionais' },
      { value: 'moderate', label: 'Moderada, tenho dificuldade para focar em tarefas' },
      { value: 'poor', label: 'Ruim, frequentemente me sinto confuso(a) ou indeciso(a)' },
      { value: 'very-poor', label: 'Muito ruim, não consigo me concentrar ou decidir nada' },
    ],
  },
  {
    id: 'socialInteraction',
    title: 'Como você se sente em relação às interações sociais?',
    options: [
      { value: 'enjoy', label: 'Aproveito e busco contato com amigos e família' },
      { value: 'normal', label: 'Normal, mantenho minhas relações habituais' },
      { value: 'reduced', label: 'Reduzido, prefiro ficar sozinho(a) às vezes' },
      { value: 'avoiding', label: 'Evitando, me isolo com frequência' },
      { value: 'isolated', label: 'Completamente isolado(a), evito todo contato social' },
    ],
  },
  {
    id: 'appetite',
    title: 'Como está seu apetite e alimentação?',
    options: [
      { value: 'normal', label: 'Normal, me alimento regularmente' },
      { value: 'slight-change', label: 'Pequena mudança, como um pouco mais ou menos que o normal' },
      { value: 'increased', label: 'Aumentado, como muito mais que o habitual' },
      { value: 'decreased', label: 'Diminuído, perdi o interesse em comida' },
      { value: 'very-changed', label: 'Muito alterado, mudanças significativas de peso' },
    ],
  },
  {
    id: 'hopelessness',
    title: 'Você tem sentimentos de desesperança ou pensamentos sobre o futuro?',
    options: [
      { value: 'optimistic', label: 'Otimista, tenho esperança no futuro' },
      { value: 'neutral', label: 'Neutro, não penso muito sobre isso' },
      { value: 'some-worry', label: 'Algumas preocupações sobre o futuro' },
      { value: 'hopeless', label: 'Desesperançoso(a), sinto que as coisas não vão melhorar' },
      { value: 'very-dark', label: 'Muito sombrio, tenho pensamentos de que a vida não vale a pena' },
    ],
  },
  {
    id: 'anxiety',
    title: 'Você tem experimentado ansiedade ou preocupação excessiva?',
    options: [
      { value: 'none', label: 'Não, me sinto calmo(a)' },
      { value: 'occasional', label: 'Ocasional, preocupações normais do dia a dia' },
      { value: 'frequent', label: 'Frequente, me preocupo muito com várias coisas' },
      { value: 'constant', label: 'Constante, ansiedade afeta meu dia a dia' },
      { value: 'overwhelming', label: 'Avassaladora, ataques de pânico ou ansiedade intensa' },
    ],
  },
  {
    id: 'physicalSymptoms',
    title: 'Você tem experimentado sintomas físicos sem causa aparente?',
    options: [
      { value: 'none', label: 'Não, me sinto bem fisicamente' },
      { value: 'minimal', label: 'Mínimos, sintomas leves ocasionais' },
      { value: 'moderate', label: 'Moderados, dores de cabeça, tensão muscular' },
      { value: 'frequent', label: 'Frequentes, vários sintomas físicos regulares' },
      { value: 'severe', label: 'Severos, sintomas físicos intensos e persistentes' },
    ],
  },
  {
    id: 'dailyActivities',
    title: 'Como você tem conseguido realizar suas atividades diárias?',
    options: [
      { value: 'normal', label: 'Normalmente, realizo tudo sem dificuldade' },
      { value: 'slight-difficulty', label: 'Pequena dificuldade, mas consigo fazer tudo' },
      { value: 'some-difficulty', label: 'Alguma dificuldade, deixo algumas coisas para depois' },
      { value: 'major-difficulty', label: 'Muita dificuldade, só faço o essencial' },
      { value: 'unable', label: 'Incapaz, não consigo realizar minhas tarefas básicas' },
    ],
  },
];

const questionsEn = [
  {
    id: 'mood',
    title: 'How would you describe your mood in the last two weeks?',
    options: [
      { value: 'very-good', label: 'Very good, I feel happy and energized' },
      { value: 'good', label: 'Good, stable most of the time' },
      { value: 'neutral', label: 'Neutral, neither good nor bad' },
      { value: 'bad', label: 'Bad, I feel sad or discouraged frequently' },
      { value: 'very-bad', label: 'Very bad, I feel depressed most of the time' },
    ],
  },
  {
    id: 'sleep',
    title: 'How is your sleep quality?',
    options: [
      { value: 'excellent', label: 'Excellent, I sleep well every night' },
      { value: 'good', label: 'Good, with some irregular nights' },
      { value: 'irregular', label: 'Irregular, I have difficulty sleeping sometimes' },
      { value: 'poor', label: 'Poor, I often have insomnia or sleep too much' },
      { value: 'very-poor', label: 'Very poor, I rarely get a restful night\'s sleep' },
    ],
  },
  {
    id: 'energy',
    title: 'How is your energy level during the day?',
    options: [
      { value: 'high', label: 'High, I feel energetic and productive' },
      { value: 'normal', label: 'Normal, I can perform my activities' },
      { value: 'low', label: 'Low, I feel tired frequently' },
      { value: 'very-low', label: 'Very low, I feel constant fatigue' },
      { value: 'exhausted', label: 'Exhausted, I can barely get out of bed' },
    ],
  },
  {
    id: 'concentration',
    title: 'How is your ability to concentrate and make decisions?',
    options: [
      { value: 'excellent', label: 'Excellent, I can concentrate well' },
      { value: 'good', label: 'Good, with some occasional distractions' },
      { value: 'moderate', label: 'Moderate, I have difficulty focusing on tasks' },
      { value: 'poor', label: 'Poor, I often feel confused or indecisive' },
      { value: 'very-poor', label: 'Very poor, I cannot concentrate or decide anything' },
    ],
  },
  {
    id: 'socialInteraction',
    title: 'How do you feel about social interactions?',
    options: [
      { value: 'enjoy', label: 'I enjoy and seek contact with friends and family' },
      { value: 'normal', label: 'Normal, I maintain my usual relationships' },
      { value: 'reduced', label: 'Reduced, I prefer to be alone sometimes' },
      { value: 'avoiding', label: 'Avoiding, I isolate myself frequently' },
      { value: 'isolated', label: 'Completely isolated, I avoid all social contact' },
    ],
  },
  {
    id: 'appetite',
    title: 'How is your appetite and eating?',
    options: [
      { value: 'normal', label: 'Normal, I eat regularly' },
      { value: 'slight-change', label: 'Slight change, I eat a little more or less than normal' },
      { value: 'increased', label: 'Increased, I eat much more than usual' },
      { value: 'decreased', label: 'Decreased, I\'ve lost interest in food' },
      { value: 'very-changed', label: 'Very changed, significant weight changes' },
    ],
  },
  {
    id: 'hopelessness',
    title: 'Do you have feelings of hopelessness or thoughts about the future?',
    options: [
      { value: 'optimistic', label: 'Optimistic, I have hope for the future' },
      { value: 'neutral', label: 'Neutral, I don\'t think much about it' },
      { value: 'some-worry', label: 'Some worries about the future' },
      { value: 'hopeless', label: 'Hopeless, I feel things won\'t get better' },
      { value: 'very-dark', label: 'Very dark, I have thoughts that life isn\'t worth living' },
    ],
  },
  {
    id: 'anxiety',
    title: 'Have you been experiencing anxiety or excessive worry?',
    options: [
      { value: 'none', label: 'No, I feel calm' },
      { value: 'occasional', label: 'Occasional, normal day-to-day worries' },
      { value: 'frequent', label: 'Frequent, I worry a lot about many things' },
      { value: 'constant', label: 'Constant, anxiety affects my daily life' },
      { value: 'overwhelming', label: 'Overwhelming, panic attacks or intense anxiety' },
    ],
  },
  {
    id: 'physicalSymptoms',
    title: 'Have you been experiencing physical symptoms without apparent cause?',
    options: [
      { value: 'none', label: 'No, I feel physically well' },
      { value: 'minimal', label: 'Minimal, occasional mild symptoms' },
      { value: 'moderate', label: 'Moderate, headaches, muscle tension' },
      { value: 'frequent', label: 'Frequent, various regular physical symptoms' },
      { value: 'severe', label: 'Severe, intense and persistent physical symptoms' },
    ],
  },
  {
    id: 'dailyActivities',
    title: 'How have you been managing your daily activities?',
    options: [
      { value: 'normal', label: 'Normally, I do everything without difficulty' },
      { value: 'slight-difficulty', label: 'Slight difficulty, but I can do everything' },
      { value: 'some-difficulty', label: 'Some difficulty, I postpone some things' },
      { value: 'major-difficulty', label: 'Major difficulty, I only do the essentials' },
      { value: 'unable', label: 'Unable, I cannot perform my basic tasks' },
    ],
  },
];

const uiTranslations = {
  pt: {
    lastStep: 'Última etapa',
    questionOf: 'Pergunta',
    of: 'de',
    selectOption: 'Selecione a opção que melhor descreve sua situação atual',
    shareMore: 'Gostaria de compartilhar mais alguma coisa?',
    shareMoreDesc: 'Este espaço é opcional. Você pode descrever como está se sentindo ou qualquer outra informação que considere relevante.',
    placeholder: 'Digite aqui seus pensamentos e sentimentos (opcional)...',
    back: 'Voltar',
    next: 'Próxima',
    generateReport: 'Gerar Relatório',
  },
  en: {
    lastStep: 'Last step',
    questionOf: 'Question',
    of: 'of',
    selectOption: 'Select the option that best describes your current situation',
    shareMore: 'Would you like to share anything else?',
    shareMoreDesc: 'This space is optional. You can describe how you are feeling or any other information you consider relevant.',
    placeholder: 'Type your thoughts and feelings here (optional)...',
    back: 'Back',
    next: 'Next',
    generateReport: 'Generate Report',
  },
};

export function QuestionnaireForm({ onSubmit, language = 'pt' }: QuestionnaireFormProps) {
  const questions = language === 'pt' ? questionsPt : questionsEn;
  const t = uiTranslations[language];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [openResponse, setOpenResponse] = useState('');

  const progress = ((currentQuestion + 1) / (questions.length + 1)) * 100;
  const isLastQuestion = currentQuestion === questions.length;

  const handleAnswer = (value: string) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const data: QuestionnaireData = {
      mood: answers.mood || '',
      sleep: answers.sleep || '',
      energy: answers.energy || '',
      concentration: answers.concentration || '',
      socialInteraction: answers.socialInteraction || '',
      appetite: answers.appetite || '',
      hopelessness: answers.hopelessness || '',
      anxiety: answers.anxiety || '',
      physicalSymptoms: answers.physicalSymptoms || '',
      dailyActivities: answers.dailyActivities || '',
      openResponse,
    };
    onSubmit(data);
  };

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = currentQuestionData ? answers[currentQuestionData.id] : undefined;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {isLastQuestion ? t.lastStep : `${t.questionOf} ${currentQuestion + 1} ${t.of} ${questions.length}`}
          </span>
          <span className="text-sm text-purple-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {!isLastQuestion ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentQuestionData.title}
            </CardTitle>
            <CardDescription>
              {t.selectOption}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {currentQuestionData.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {t.shareMore}
            </CardTitle>
            <CardDescription>
              {t.shareMoreDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t.placeholder}
              value={openResponse}
              onChange={(e) => setOpenResponse(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          {t.back}
        </Button>

        {!isLastQuestion ? (
          <Button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t.next}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t.generateReport}
            <Send className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
