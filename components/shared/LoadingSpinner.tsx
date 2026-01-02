/**
 * LoadingSpinner Component
 * Consistent loading indicator across the app
 */

'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom className */
  className?: string;
  /** Show loading text */
  text?: string;
  /** Make spinner fullscreen centered */
  fullscreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  fullscreen = false,
}) => {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 
        className={cn(
          'animate-spin text-primary-600 dark:text-primary-400',
          sizeClasses[size]
        )} 
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm text-muted animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/** Inline spinner for buttons */
export const InlineSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={cn('animate-spin w-4 h-4', className)} aria-label="Loading" />
);
