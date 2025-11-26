import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionnaireForm } from './components/QuestionnaireForm';
import { ReportView } from './components/ReportView';
import { Language } from './types/api';

export type QuestionnaireData = {
  mood: string;
  sleep: string;
  energy: string;
  concentration: string;
  socialInteraction: string;
  appetite: string;
  hopelessness: string;
  anxiety: string;
  physicalSymptoms: string;
  dailyActivities: string;
  openResponse: string;
};

export type AppScreen = 'welcome' | 'questionnaire' | 'report';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [responses, setResponses] = useState<QuestionnaireData | null>(null);
  const [language, setLanguage] = useState<Language>('pt');

  const handleStartQuestionnaire = () => {
    setCurrentScreen('questionnaire');
  };

  const handleQuestionnaireSubmit = (data: QuestionnaireData) => {
    setResponses(data);
    setCurrentScreen('report');
  };

  const handleRestart = () => {
    setResponses(null);
    setCurrentScreen('welcome');
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors text-sm font-medium text-gray-700"
        >
          <span className="text-lg">{language === 'pt' ? '🇧🇷' : '🇺🇸'}</span>
          {language === 'pt' ? 'PT' : 'EN'}
        </button>
      </div>

      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStartQuestionnaire} language={language} />
      )}
      {currentScreen === 'questionnaire' && (
        <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} language={language} />
      )}
      {currentScreen === 'report' && responses && (
        <ReportView responses={responses} onRestart={handleRestart} language={language} />
      )}
    </div>
  );
}
