import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps {
  children: ReactNode;
  variant?: 'cyan' | 'purple' | 'green' | 'orange';
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

const variantStyles = {
  cyan: 'neon-border-cyan hover:neon-glow-cyan',
  purple: 'neon-border-purple hover:neon-glow-purple',
  green: 'neon-border-green hover:neon-glow-green',
  orange: 'neon-border-orange hover:neon-glow-orange',
};

export const NeonCard = ({ 
  children, 
  variant = 'cyan', 
  className,
  hover = true,
  style
}: NeonCardProps) => {
  return (
    <div
      className={cn(
        "futuristic-card border-2 transition-all duration-300",
        variantStyles[variant],
        hover && "hover:scale-[1.02] cursor-pointer",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};
