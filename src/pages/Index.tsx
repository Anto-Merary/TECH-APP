import { useQuiz } from '@/hooks/useQuiz';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { PersonalityQuiz } from '@/components/PersonalityQuiz';
import { TransitionScreen } from '@/components/TransitionScreen';
import { LogicalQuiz } from '@/components/LogicalQuiz';
import { ResultScreen } from '@/components/ResultScreen';

const Index = () => {
  const quiz = useQuiz();

  return (
    <div className="min-h-screen">
      {quiz.phase === 'welcome' && (
        <WelcomeScreen onStart={quiz.startQuiz} />
      )}

      {quiz.phase === 'personality' && quiz.currentPersonalityQuestion && (
        <PersonalityQuiz
          question={quiz.currentPersonalityQuestion}
          currentIndex={quiz.personalityIndex}
          totalQuestions={quiz.totalPersonalityQuestions}
          onAnswer={quiz.answerPersonality}
        />
      )}

      {quiz.phase === 'transition' && quiz.careerPrediction && (
        <TransitionScreen
          prediction={quiz.careerPrediction}
          onContinue={quiz.startLogical}
        />
      )}

      {quiz.phase === 'logical' && quiz.currentLogicalQuestion && (
        <LogicalQuiz
          question={quiz.currentLogicalQuestion}
          currentIndex={quiz.logicalIndex}
          totalQuestions={quiz.totalLogicalQuestions}
          onAnswer={quiz.answerLogical}
        />
      )}

      {quiz.phase === 'result' && quiz.careerPrediction && (
        <ResultScreen
          prediction={quiz.careerPrediction}
          onRestart={quiz.resetQuiz}
        />
      )}
    </div>
  );
};

export default Index;
