'use client'

import React from 'react';
import { useDashboard } from './DashboardContext';
import { DashboardStats as DashboardStatsView } from './DashboardStats';

export default function DashboardStatsClient() {
  const { stats } = useDashboard();

  return (
    <DashboardStatsView
      totalAthletes={stats.totalAthletes}
      totalSports={stats.totalSports}
      totalProvinces={stats.totalProvinces}
      totalMedals={stats.totalMedals}
      athleteChange={0}
      sportsChange={0}
      provincesChange={0}
      medalsChange={0}
    />
  );
}
