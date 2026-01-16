import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { QuizCard } from './QuizCard';
import { QuizOption } from './QuizOption';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { LogicalQuestion } from '@/data/quizData';
import { Brain, ArrowRight, Lightbulb } from 'lucide-react';

interface LogicalQuizProps {
  question: LogicalQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (questionId: string, optionId: string) => void;
}

export function LogicalQuiz({ 
  question, 
  currentIndex, 
  totalQuestions, 
  onAnswer 
}: LogicalQuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOption(null);
    if (questionRef.current) {
      gsap.fromTo(
        questionRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [question.id]);

  const handleNext = () => {
    if (selectedOption) {
      onAnswer(question.id, selectedOption);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-secondary/10 via-background to-accent/10">
      <div className="max-w-2xl w-full">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 gradient-sky rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="font-fredoka text-2xl font-bold text-foreground">Brain Power</h2>
            <p className="font-nunito text-sm text-muted-foreground">Part 2 • Thinking Challenge</p>
          </div>
        </div>

        <ProgressBar 
          current={currentIndex + 1} 
          total={totalQuestions} 
          variant="logical" 
        />

        <QuizCard variant="logical" className="mt-6" key={question.id}>
          <div ref={questionRef}>
            <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-foreground mb-8">
              {question.question}
            </h3>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <QuizOption
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  isSelected={selectedOption === option.id}
                  onSelect={setSelectedOption}
                  index={index}
                  variant="logical"
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleNext}
                disabled={!selectedOption}
              >
                {currentIndex === totalQuestions - 1 ? 'Finish!' : 'Next'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </QuizCard>

        <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
          <Lightbulb className="w-4 h-4" />
          <p className="font-nunito text-sm">
            Think carefully before choosing your answer!
          </p>
        </div>
      </div>
    </div>
  );
}
