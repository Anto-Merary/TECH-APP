import { useState, useCallback } from 'react';
import { 
  personalityQuestions, 
  logicalQuestions, 
  careerPredictions,
  CareerType,
  CareerPrediction
} from '@/data/quizData';

export type QuizPhase = 'welcome' | 'personality' | 'transition' | 'logical' | 'result';

interface QuizState {
  phase: QuizPhase;
  personalityIndex: number;
  logicalIndex: number;
  personalityAnswers: Record<string, string>;
  logicalAnswers: Record<string, string>;
  logicalScore: number;
  careerPrediction: CareerPrediction | null;
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    phase: 'welcome',
    personalityIndex: 0,
    logicalIndex: 0,
    personalityAnswers: {},
    logicalAnswers: {},
    logicalScore: 0,
    careerPrediction: null
  });

  const startQuiz = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'personality' }));
  }, []);

  const answerPersonality = useCallback((questionId: string, optionId: string) => {
    setState(prev => {
      const newAnswers = { ...prev.personalityAnswers, [questionId]: optionId };
      const newIndex = prev.personalityIndex + 1;
      
      if (newIndex >= personalityQuestions.length) {
        // Calculate career prediction
        const careerCounts: Record<CareerType, number> = {} as Record<CareerType, number>;
        
        Object.entries(newAnswers).forEach(([qId, optId]) => {
          const question = personalityQuestions.find(q => q.id === qId);
          const option = question?.options.find(o => o.id === optId);
          if (option) {
            careerCounts[option.careerType] = (careerCounts[option.careerType] || 0) + 1;
          }
        });

        const topCareer = Object.entries(careerCounts).reduce(
          (max, [career, count]) => count > max[1] ? [career, count] : max,
          ['scientist', 0] as [string, number]
        )[0] as CareerType;

        return {
          ...prev,
          personalityAnswers: newAnswers,
          personalityIndex: newIndex,
          phase: 'transition',
          careerPrediction: careerPredictions[topCareer]
        };
      }

      return {
        ...prev,
        personalityAnswers: newAnswers,
        personalityIndex: newIndex
      };
    });
  }, []);

  const startLogical = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'logical' }));
  }, []);

  const answerLogical = useCallback((questionId: string, optionId: string) => {
    setState(prev => {
      const question = logicalQuestions.find(q => q.id === questionId);
      const selectedOption = question?.options.find(o => o.id === optionId);
      const isCorrect = selectedOption?.isCorrect ?? false;
      
      const newAnswers = { ...prev.logicalAnswers, [questionId]: optionId };
      const newScore = prev.logicalScore + (isCorrect ? 10 : 0);
      const newIndex = prev.logicalIndex + 1;
      
      if (newIndex >= logicalQuestions.length) {
        return {
          ...prev,
          logicalAnswers: newAnswers,
          logicalScore: newScore,
          logicalIndex: newIndex,
          phase: 'result'
        };
      }

      return {
        ...prev,
        logicalAnswers: newAnswers,
        logicalScore: newScore,
        logicalIndex: newIndex
      };
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setState({
      phase: 'welcome',
      personalityIndex: 0,
      logicalIndex: 0,
      personalityAnswers: {},
      logicalAnswers: {},
      logicalScore: 0,
      careerPrediction: null
    });
  }, []);

  const currentPersonalityQuestion = personalityQuestions[state.personalityIndex];
  const currentLogicalQuestion = logicalQuestions[state.logicalIndex];

  return {
    ...state,
    currentPersonalityQuestion,
    currentLogicalQuestion,
    totalPersonalityQuestions: personalityQuestions.length,
    totalLogicalQuestions: logicalQuestions.length,
    startQuiz,
    answerPersonality,
    startLogical,
    answerLogical,
    resetQuiz
  };
}
