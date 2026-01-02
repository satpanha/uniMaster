'use client';

import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function Card({ children, className, hover = false, padding = 'md', style }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl shadow-sm transition-shadow',
        hover && 'hover:shadow-md',
        paddingClasses[padding],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ children, icon, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pb-4 mb-6 border-b-2 border-primary/40',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <h3 className="font-semibold text-foreground text-base">{children}</h3>
      </div>
      {action}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('space-y-4 text-foreground', className)}>{children}</div>;
}
