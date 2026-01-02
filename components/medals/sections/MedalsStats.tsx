import { Trophy, Medal } from 'lucide-react';
import { StatCard } from '@/components/shared';

interface MedalBreakdown {
  total: number;
  gold: number;
  silver: number;
  bronze: number;
}

interface MedalsStatsProps {
  medalBreakdown: MedalBreakdown;
}

export function MedalsStats({ medalBreakdown }: MedalsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        variant="kpi"
        title="Total Medals"
        value={medalBreakdown.total}
        icon={Trophy}
        color="purple"
      />
      
      <StatCard
        title="Gold"
        value={medalBreakdown.gold}
        icon={Medal}
        color="gold"
      />
      
      <StatCard
        title="Silver"
        value={medalBreakdown.silver}
        icon={Medal}
        color="blue"
      />
      
      <StatCard
        title="Bronze"
        value={medalBreakdown.bronze}
        icon={Medal}
        color="orange"
      />
    </div>
  );
}
