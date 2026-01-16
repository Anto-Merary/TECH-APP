import { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'personality' | 'logical' | 'result';
}

export function QuizCard({ children, className, variant = 'default' }: QuizCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
      );
    }
  }, []);

  const variantStyles = {
    default: 'bg-card border-border',
    personality: 'bg-card border-lavender/20',
    logical: 'bg-card border-secondary/20',
    result: 'bg-card border-primary/20'
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'rounded-3xl border-2 p-8 shadow-card backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
