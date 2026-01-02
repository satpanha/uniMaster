/**
 * MedalDisplay Component
 * Reusable component for displaying medal counts
 */

import { memo } from 'react';

interface MedalDisplayProps {
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showTotal?: boolean;
  totalMedals?: number;
  className?: string;
}

export const MedalDisplay = memo<MedalDisplayProps>(({
  medals,
  size = 'md',
  showTotal = false,
  totalMedals,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs gap-2',
    md: 'text-sm gap-3',
    lg: 'text-base gap-4',
  };

  const medalItems = [
    { emoji: '🥇', count: medals.gold, label: 'Gold', color: 'text-yellow-600 dark:text-yellow-400' },
    { emoji: '🥈', count: medals.silver, label: 'Silver', color: 'text-muted' },
    { emoji: '🥉', count: medals.bronze, label: 'Bronze', color: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {medalItems.map(({ emoji, count, label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <span role="img" aria-label={label}>{emoji}</span>
            <span className={`font-semibold ${color}`}>{count}</span>
          </div>
        ))}
      </div>
      
      {showTotal && (
        <div className="text-sm border-t border-default pt-2">
          <span className="text-muted">Total: </span>
          <span className="font-bold text-primary">
            {totalMedals ?? (medals.gold + medals.silver + medals.bronze)}
          </span>
        </div>
      )}
    </div>
  );
});

MedalDisplay.displayName = 'MedalDisplay';
