import { Users, UserCheck, Clock, XCircle } from 'lucide-react';
import { StatCard } from '@/components/shared';

interface StatusBreakdown {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface AthletesStatsProps {
  statusBreakdown: StatusBreakdown;
}

export function AthletesStats({ statusBreakdown }: AthletesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        variant="kpi"
        title="Total Athletes"
        value={statusBreakdown.total}
        icon={Users}
        color="blue"
      />
      
      <StatCard
        variant="kpi"
        title="Approved"
        value={statusBreakdown.approved}
        icon={UserCheck}
        color="green"
      />
      
      <StatCard
        variant="kpi"
        title="Pending"
        value={statusBreakdown.pending}
        icon={Clock}
        color="yellow"
      />
      
      <StatCard
        variant="kpi"
        title="Rejected"
        value={statusBreakdown.rejected}
        icon={XCircle}
        color="red"
      />
    </div>
  );
}
