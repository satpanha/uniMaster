/**
 * MedalTypeBadge Component
 * Displays medal type with appropriate emoji and styling
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui';

type MedalType = 'gold' | 'silver' | 'bronze';

interface MedalTypeBadgeProps {
  medalType: MedalType;
  className?: string;
}

const medalConfig = {
  gold: {
    emoji: '🥇',
    variant: 'outline' as const,
    className:
      'bg-linear-to-br from-amber-300 via-amber-200 to-amber-400 text-amber-900 border-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
  },
  silver: {
    emoji: '🥈',
    variant: 'outline' as const,
    className:
      'bg-linear-to-br from-slate-200 via-slate-100 to-slate-300 text-slate-800 border-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
  },
  bronze: {
    emoji: '🥉',
    variant: 'outline' as const,
    className:
      'bg-linear-to-br from-amber-400 via-orange-300 to-amber-500 text-amber-950 border-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
  },
};

export const MedalTypeBadge: React.FC<MedalTypeBadgeProps> = ({ medalType, className = '' }) => {
  const config = medalConfig[medalType];
  const label = medalType.charAt(0).toUpperCase() + medalType.slice(1);
  
  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      {config.emoji} {label}
    </Badge>
  );
};
