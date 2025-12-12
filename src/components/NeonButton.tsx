import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'cyan' | 'purple' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const variantStyles = {
  cyan: 'bg-primary/20 text-primary border-primary hover:bg-primary hover:text-primary-foreground neon-border-cyan',
  purple: 'bg-secondary/20 text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground neon-border-purple',
  green: 'bg-accent/20 text-accent border-accent hover:bg-accent hover:text-accent-foreground neon-border-green',
  orange: 'bg-warning/20 text-warning border-warning hover:bg-warning hover:text-warning-foreground neon-border-orange',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const NeonButton = ({
  children,
  variant = 'cyan',
  size = 'md',
  pulse = false,
  className,
  ...props
}: NeonButtonProps) => {
  return (
    <button
      className={cn(
        "font-orbitron font-semibold rounded-lg border-2 transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variantStyles[variant],
        sizeStyles[size],
        pulse && "animate-pulse-glow",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
