/**
 * DashboardHeader Section
 * Page title + event selector
 */

'use client';

import { Card, Badge } from '@/components/ui';
import RelativeTime from '@/components/common/RelativeTime';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  status?: 'Active' | 'Upcoming' | 'Ended' | string;
  lastUpdated?: string;
  eventSelector?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, status, lastUpdated, eventSelector }: DashboardHeaderProps) {
  const updated = lastUpdated ? new Date(lastUpdated).toLocaleString() : new Date().toLocaleString();

  return (
    <Card padding="md" className="flex flex-col md:flex-row md:items-center justify-between gap-4 to-transparent">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && <div className="text-sm text-muted">{subtitle}</div>}
        </div>
        {status && (
          <Badge variant={status === 'Active' ? 'success' : status === 'Upcoming' ? 'warning' : 'default'} size="sm">
            {status}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        {eventSelector}
        <div className="text-sm text-muted">Updated: {updated} <span className="mx-2">·</span> <span className="text-sm text-muted"><RelativeTime iso={lastUpdated ?? updated} /></span></div>
      </div>
    </Card>
  );
}
