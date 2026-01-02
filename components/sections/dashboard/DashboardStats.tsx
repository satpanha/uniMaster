/**
 * DashboardStats Section
 * Displays key metrics: Total Athletes, Sports, Provinces, Medals
 */

import { Card } from '@/components/ui';

interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  icon?: string;
}

function StatCard({ label, value, change, icon }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <Card className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-value">{value.toLocaleString()}</div>
        <div className="kpi-label">{label}</div>
      </div>

      <div className="flex flex-col items-end gap-1">
        {icon && (
          <div className="kpi-icon" aria-hidden>
            <span className="text-lg">{icon}</span>
          </div>
        )}
        {change !== undefined && (
          <div className={`kpi-trend ${isPositive ? 'kpi-up' : 'kpi-down'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </div>
        )}
      </div>
    </Card>
  );
}

interface DashboardStatsProps {
  totalAthletes: number;
  totalSports: number;
  totalProvinces: number;
  totalMedals: number;
  athleteChange?: number;
  sportsChange?: number;
  provincesChange?: number;
  medalsChange?: number;
}

export function DashboardStats({
  totalAthletes,
  totalSports,
  totalProvinces,
  totalMedals,
  athleteChange,
  sportsChange,
  provincesChange,
  medalsChange,
}: DashboardStatsProps) {
  return (
    <div className="kpi-grid">
      <div className="kpi-col-3"><StatCard label="Total Athletes" value={totalAthletes} change={athleteChange} icon="👨‍🎓" /></div>
      <div className="kpi-col-3"><StatCard label="Total Sports" value={totalSports} change={sportsChange} icon="⚽" /></div>
      <div className="kpi-col-3"><StatCard label="Total Provinces" value={totalProvinces} change={provincesChange} icon="🗺️" /></div>
      <div className="kpi-col-3"><StatCard label="Total Medals" value={totalMedals} change={medalsChange} icon="🏅" /></div>
    </div>
  );
}
