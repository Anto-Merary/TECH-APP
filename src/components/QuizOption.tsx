import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface QuizOptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
  variant?: 'personality' | 'logical';
}

export function QuizOption({ id, text, isSelected, onSelect, index, variant = 'personality' }: QuizOptionProps) {
  const optionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (optionRef.current) {
      gsap.fromTo(
        optionRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, delay: index * 0.1, ease: 'back.out(1.7)' }
      );
    }
  }, [index]);

  const handleClick = () => {
    if (optionRef.current) {
      gsap.to(optionRef.current, {
        scale: 1.05,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
    }
    onSelect(id);
  };

  const variantStyles = {
    personality: {
      base: 'border-lavender/30 hover:border-lavender hover:bg-lavender/10',
      selected: 'border-lavender bg-lavender/20 shadow-lg'
    },
    logical: {
      base: 'border-secondary/30 hover:border-secondary hover:bg-secondary/10',
      selected: 'border-secondary bg-secondary/20 shadow-lg'
    }
  };

  const styles = variantStyles[variant];

  return (
    <button
      ref={optionRef}
      onClick={handleClick}
      className={cn(
        'w-full p-5 rounded-2xl border-2 text-left transition-all duration-200',
        'font-nunito text-lg font-medium',
        'flex items-center gap-4',
        'btn-bouncy',
        isSelected ? styles.selected : styles.base
      )}
    >
      <span className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-all',
        isSelected 
          ? variant === 'personality' 
            ? 'bg-lavender text-lavender-foreground' 
            : 'bg-secondary text-secondary-foreground'
          : 'bg-muted text-muted-foreground'
      )}>
        {String.fromCharCode(65 + index)}
      </span>
      <span className="text-foreground">{text}</span>
      {isSelected && (
        <span className="ml-auto text-2xl">✓</span>
      )}
    </button>
  );
}
