import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'hero' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'gradient-hero text-primary-foreground shadow-playful hover:shadow-lg',
      secondary: 'gradient-sky text-secondary-foreground shadow-float hover:shadow-lg',
      accent: 'gradient-mint text-accent-foreground hover:shadow-lg',
      hero: 'gradient-hero text-primary-foreground shadow-playful pulse-glow hover:scale-105',
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
      ghost: 'bg-transparent text-foreground hover:bg-muted'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-2xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
      xl: 'px-10 py-5 text-xl rounded-3xl'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'font-fredoka font-semibold transition-all duration-200',
          'btn-bouncy disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
