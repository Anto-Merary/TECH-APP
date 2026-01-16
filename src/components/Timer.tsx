import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  formattedTime: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export function Timer({ formattedTime, variant = 'dark', className }: TimerProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-fredoka text-lg font-bold transition-all",
        variant === 'dark' 
          ? "bg-foreground text-background" 
          : "bg-card border-2 border-primary text-foreground",
        "animate-pulse-subtle",
        className
      )}
    >
      <Clock className="w-5 h-5" />
      <span className="tabular-nums">{formattedTime}</span>
    </div>
  );
}
