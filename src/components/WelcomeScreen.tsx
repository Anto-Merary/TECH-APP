import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from './Button';
import { FloatingShapes } from './FloatingShapes';
import { Sparkles, Brain, Rocket, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: -50, scale: 0.8 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8 }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    )
    .fromTo(cardsRef.current?.children || [],
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15 },
      '-=0.2'
    )
    .fromTo(buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5 },
      '-=0.2'
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingShapes />
      
      <div className="max-w-4xl w-full text-center z-10">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunny/20 text-sunny-foreground font-nunito font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            Fun Thinking Challenge
          </span>
        </div>
        
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl font-fredoka font-bold mb-6 text-gradient-hero"
        >
          Discover Your Future! 🚀
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl font-nunito text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Answer fun questions and find out which amazing career is waiting for you!
        </p>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-lavender/20 shadow-card card-float">
            <div className="w-16 h-16 gradient-lavender rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Star className="w-8 h-8 text-lavender-foreground" />
            </div>
            <h3 className="font-fredoka text-xl font-bold mb-2 text-foreground">Part 1: About You</h3>
            <p className="font-nunito text-muted-foreground">
              6 fun questions about what you love! No right or wrong answers – just be yourself! ✨
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-secondary/20 shadow-card card-float">
            <div className="w-16 h-16 gradient-sky rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="font-fredoka text-xl font-bold mb-2 text-foreground">Part 2: Brain Power</h3>
            <p className="font-nunito text-muted-foreground">
              9 puzzle questions to test your super thinking skills! Show what you've got! 🧠
            </p>
          </div>
        </div>

        <div ref={buttonRef}>
          <Button variant="hero" size="xl" onClick={onStart}>
            <Rocket className="w-6 h-6 mr-2" />
            Start Adventure!
          </Button>
        </div>
        
        <p className="mt-6 font-nunito text-sm text-muted-foreground">
          Takes about 5-10 minutes • Perfect for ages 6-14
        </p>
      </div>
    </div>
  );
}
