/**
 * StatusBadge Component
 * Reusable badge for displaying status
 */

import { memo } from 'react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'upcoming' | 'ongoing' | 'completed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  active: { label: 'Active' },
  inactive: { label: 'Inactive' },
  pending: { label: 'Pending' },
  approved: { label: 'Approved' },
  rejected: { label: 'Rejected' },
  upcoming: { label: 'Upcoming' },
  ongoing: { label: 'Ongoing' },
  completed: { label: 'Completed' },
};

const statusStyles: Record<StatusBadgeProps['status'], string> = {
  active: 'bg-linear-to-r from-emerald-500 to-green-600 text-white border-transparent shadow-sm shadow-emerald-500/30',
  approved: 'bg-linear-to-r from-emerald-500 to-green-600 text-white border-transparent shadow-sm shadow-emerald-500/30',
  pending: 'bg-linear-to-r from-amber-400 to-amber-500 text-amber-950 border-amber-300 shadow-sm shadow-amber-500/25',
  upcoming: 'bg-linear-to-r from-blue-500 to-indigo-600 text-white border-transparent shadow-sm shadow-indigo-500/30',
  ongoing: 'bg-linear-to-r from-sky-500 to-cyan-600 text-white border-transparent shadow-sm shadow-cyan-500/30',
  rejected: 'bg-linear-to-r from-red-500 to-rose-600 text-white border-transparent shadow-sm shadow-rose-500/30',
  inactive: 'bg-muted text-muted border-default',
  completed: 'bg-linear-to-br from-slate-200 via-slate-100 to-slate-300 text-slate-800 border-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
};

export const StatusBadge = memo<StatusBadgeProps>(({ status, size = 'md', className = '' }) => {
  const config = statusConfig[status];
  
  return (
    <Badge
      variant="outline"
      className={cn(size === 'sm' ? 'text-xs' : '', statusStyles[status], className)}
    >
      {config.label}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';
