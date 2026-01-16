import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button';
import { CareerPrediction } from '@/data/quizData';
import { Brain, Zap, Trophy } from 'lucide-react';

interface TransitionScreenProps {
  prediction: CareerPrediction;
  onContinue: () => void;
}

export function TransitionScreen({ prediction, onContinue }: TransitionScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });
    
    tl.fromTo(emojiRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8 }
    )
    .fromTo(cardRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      '-=0.3'
    );

    // Continuous emoji float animation
    gsap.to(emojiRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sunny/20 via-background to-coral/10"
    >
      <div className="max-w-2xl w-full text-center">
        <div 
          ref={emojiRef}
          className="text-8xl mb-6 inline-block"
        >
          {prediction.emoji}
        </div>

        <div 
          ref={cardRef}
          className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-sunny/30 shadow-card"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunny/20 text-sunny-foreground font-nunito font-semibold text-sm mb-4">
            <Zap className="w-4 h-4" />
            Your Future Awaits!
          </div>

          <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-foreground mb-4">
            You could become a {prediction.title}!
          </h2>

          <p className="font-nunito text-lg text-muted-foreground mb-6 leading-relaxed">
            {prediction.description}
          </p>

          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
            <span className="font-nunito">Just like</span>
            <span className="font-fredoka font-bold text-foreground">{prediction.character}</span>
            <span className="text-2xl">✨</span>
          </div>

          <div className="bg-secondary/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 gradient-sky rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="text-left">
                <h3 className="font-fredoka text-xl font-bold text-foreground">Ready for Part 2?</h3>
                <p className="font-nunito text-sm text-muted-foreground">Time to show your brain power!</p>
              </div>
            </div>
            <p className="font-nunito text-muted-foreground text-left">
              Now let's test your thinking skills with 9 fun puzzle questions! 🧩
            </p>
          </div>

          <Button variant="secondary" size="xl" onClick={onContinue}>
            <Trophy className="w-6 h-6 mr-2" />
            Start Brain Challenge!
          </Button>
        </div>

        <p className="mt-6 font-nunito text-sm text-muted-foreground">
          ⏱️ Take your time – think carefully!
        </p>
      </div>
    </div>
  );
}
