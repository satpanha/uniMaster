import { MapPin, Users, Trophy, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/shared';

interface ProvincesStatsProps {
  totalProvinces: number;
  totalAthletes: number;
  totalMedals: number;
  avgMedalsPerProvince: string;
}

export function ProvincesStats({
  totalProvinces,
  totalAthletes,
  totalMedals,
  avgMedalsPerProvince
}: ProvincesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        variant="kpi"
        title="Total Provinces"
        value={totalProvinces}
        icon={MapPin}
        color="blue"
      />
      <StatCard
        title="Total Athletes"
        value={totalAthletes}
        icon={Users}
        color="green"
      />
      <StatCard
        title="Total Medals"
        value={totalMedals}
        icon={Trophy}
        color="orange"
      />
      <StatCard
        title="Avg per Province"
        value={avgMedalsPerProvince}
        icon={TrendingUp}
        color="purple"
      />
    </div>
  );
}
