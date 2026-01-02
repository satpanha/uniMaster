import { Trophy, Zap, Users, BarChart3 } from 'lucide-react';
import { StatCard } from '@/components/shared';

interface SportsStatsProps {
  totalSports: number;
  activeSports: number;
  totalParticipants: number;
  categoriesCount: number;
}

export function SportsStats({
  totalSports,
  activeSports,
  totalParticipants,
  categoriesCount
}: SportsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        variant="kpi"
        title="Total Sports"
        value={totalSports}
        icon={Trophy}
        color="blue"
      />
      
      <StatCard
        title="Active Sports"
        value={activeSports}
        icon={Zap}
        color="green"
      />
      
      <StatCard
        title="Total Participants"
        value={totalParticipants}
        icon={Users}
        color="orange"
      />
      
      <StatCard
        title="Categories"
        value={categoriesCount}
        icon={BarChart3}
        color="purple"
      />
    </div>
  );
}
