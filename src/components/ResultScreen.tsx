import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button';
import { CareerPrediction } from '@/data/quizData';
import { Star, RefreshCw, Share2, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ParentInfoForm } from './ParentInfoForm';

interface ResultScreenProps {
  prediction: CareerPrediction;
  onRestart: () => void;
  personalityAnswers?: Record<string, string>;
  logicalAnswers?: Record<string, string>;
  logicalScore?: number;
}

export function ResultScreen({ 
  prediction, 
  onRestart,
  personalityAnswers = {},
  logicalAnswers = {},
  logicalScore = 0
}: ResultScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#FF8C42', '#4ECDC4', '#FFD93D', '#6BCB77', '#FF6B6B'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // GSAP animations
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });
    
    tl.fromTo(starsRef.current?.children || [],
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.5, stagger: 0.1 }
    )
    .fromTo(emojiRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8 },
      '-=0.3'
    )
    .fromTo(cardRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      '-=0.4'
    );

    // Continuous animations
    gsap.to(emojiRef.current, {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-sunny/20 relative overflow-hidden"
    >
      {/* Floating stars background */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full text-center z-10">
        <div className="flex justify-center gap-2 mb-4">
          <Trophy className="w-8 h-8 text-sunny" />
          <Trophy className="w-10 h-10 text-primary" />
          <Trophy className="w-8 h-8 text-sunny" />
        </div>

        <div 
          ref={emojiRef}
          className="text-9xl mb-6 inline-block filter drop-shadow-lg"
        >
          {prediction.emoji}
        </div>

        <div 
          ref={cardRef}
          className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-primary/30 shadow-playful"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-hero text-primary-foreground font-nunito font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Your Amazing Future!
          </div>

          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gradient-hero mb-4">
            Future {prediction.title}!
          </h2>

          <p className="font-nunito text-xl text-muted-foreground mb-6 leading-relaxed">
            {prediction.description}
          </p>

          <div className="bg-gradient-to-r from-sunny/20 to-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Star className="w-6 h-6 text-sunny fill-sunny" />
              <span className="font-fredoka text-xl text-foreground">
                Just like <strong>{prediction.character}</strong>!
              </span>
              <Star className="w-6 h-6 text-sunny fill-sunny" />
            </div>
          </div>

          <p className="font-nunito text-muted-foreground mb-8">
            Remember: This is just for fun! You can become anything you dream of! 🌟
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => setShowForm(true)}>
              Save Results
            </Button>
            <Button variant="outline" size="lg" onClick={onRestart}>
              <RefreshCw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Future Career!',
                    text: `I'm going to be a ${prediction.title}! Take the Fun Thinking Challenge!`,
                  });
                }
              }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Result
            </Button>
          </div>
        </div>

        <p className="mt-6 font-nunito text-sm text-muted-foreground">
          🎉 Great job completing the challenge!
        </p>
      </div>

      {showForm && (
        <ParentInfoForm
          prediction={prediction}
          personalityAnswers={personalityAnswers}
          logicalAnswers={logicalAnswers}
          logicalScore={logicalScore}
          completionTime={0}
          onComplete={() => {
            setShowForm(false);
            onRestart();
          }}
        />
      )}
    </div>
  );
}
