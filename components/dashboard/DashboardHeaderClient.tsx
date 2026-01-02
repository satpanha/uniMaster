'use client'

import React, { useState } from 'react';
import { useDashboard } from './DashboardContext';
import { DashboardHeader } from './DashboardHeader';
import { Button } from '@/components/ui';
import { RefreshCw } from 'lucide-react';

export default function DashboardHeaderClient({ eventSelector }: { eventSelector?: React.ReactNode }) {
  const { meta, refresh } = useDashboard();
  const [loading, setLoading] = useState(false);

  const onRefresh = async () => {
    setLoading(true);
    try {
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const combinedEventSelector = (
    <div className="flex items-center gap-2">
      {eventSelector}
      <Button variant="ghost" size="sm" onClick={onRefresh} aria-label="Refresh dashboard" loading={loading} icon={RefreshCw}>
        Refresh
      </Button>
    </div>
  );

  return (
    <DashboardHeader
      title={meta.title}
      subtitle={meta.subtitle}
      status={meta.status as any}
      lastUpdated={meta.lastUpdated}
      eventSelector={combinedEventSelector}
    />
  );
}
