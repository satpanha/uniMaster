'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { DashboardStats } from '@/src/types/dashboard';

type DashboardMeta = { title: string; subtitle?: string; status?: string; lastUpdated?: string };

type DashboardContextValue = {
  meta: DashboardMeta;
  stats: DashboardStats;
  setMeta: (m: Partial<DashboardMeta>) => void;
  setStats: (s: Partial<DashboardStats>) => void;
  refresh: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children, initialMeta, initialStats }: { children: React.ReactNode; initialMeta: DashboardMeta; initialStats: DashboardStats }) {
  const [meta, setMetaState] = useState<DashboardMeta>(initialMeta);
  const [stats, setStatsState] = useState<DashboardStats>(initialStats);

  const setMeta = useCallback((m: Partial<DashboardMeta>) => setMetaState((prev) => ({ ...prev, ...m })), []);
  const setStats = useCallback((s: Partial<DashboardStats>) => setStatsState((prev) => ({ ...prev, ...s })), []);

  const refresh = useCallback(async () => {
    try {
      const [metaRes, statsRes] = await Promise.all([
        fetch('/api/dashboard-meta').then((r) => r.json()).catch(() => null),
        fetch('/api/dashboard-stats').then((r) => r.json()).catch(() => null),
      ]);

      if (metaRes?.meta) {
        setMetaState((prev) => ({ ...prev, ...metaRes.meta, lastUpdated: new Date().toISOString() }));
      } else {
        setMetaState((prev) => ({ ...prev, lastUpdated: new Date().toISOString() }));
      }

      if (statsRes?.stats) setStatsState(statsRes.stats);
    } catch (e) {
      // swallow - offline/worker
      setMetaState((prev) => ({ ...prev, lastUpdated: new Date().toISOString() }));
    }
  }, []);

  useEffect(() => {
    // Attempt to fetch fresh data on mount
    refresh();

    // Optional: poll every 30s
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <DashboardContext.Provider value={{ meta, stats, setMeta, setStats, refresh }}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}

export default DashboardContext;
