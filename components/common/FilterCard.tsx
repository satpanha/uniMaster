/**
 * Generic Filter Card Component
 * Displays filters in a card with consistent styling
 * Used across all dashboard list pages for data filtering
 */

import { Card } from '@/components/ui';
import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

interface FilterCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function FilterCard({ children, title, className = '' }: FilterCardProps) {
  return (
    <Card className={cn('mb-6 bg-muted/30 border-border', className)}>
      {title && (
        <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      )}
      <div className="flex flex-wrap gap-4">
        {children}
      </div>
    </Card>
  );
}
