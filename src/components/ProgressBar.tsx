import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  variant?: 'personality' | 'logical';
}

export function ProgressBar({ current, total, variant = 'personality' }: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const percentage = (current / total) * 100;

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${percentage}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [percentage]);

  const gradientClass = variant === 'personality' ? 'gradient-lavender' : 'gradient-sky';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-nunito font-semibold text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-sm font-nunito font-bold text-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
        <div
          ref={progressRef}
          className={cn('h-full rounded-full transition-all', gradientClass)}
          style={{ width: '0%' }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
              i < current
                ? variant === 'personality' 
                  ? 'bg-lavender text-lavender-foreground scale-100'
                  : 'bg-secondary text-secondary-foreground scale-100'
                : i === current - 1
                ? 'bg-sunny text-sunny-foreground scale-110'
                : 'bg-muted text-muted-foreground scale-90'
            )}
          >
            {i < current ? '✓' : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
