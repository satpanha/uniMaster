import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

interface StatCardData {
  icon: LucideIcon;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
  valueColor?: string;
}

interface StatsGridProps {
  stats: StatCardData[];
  columns?: 2 | 3 | 4;
}

/**
 * Generic Stats Grid Component
 * Displays a grid of stat cards - reusable across all pages
 */
export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns];

  return (
    <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className={`text-2xl font-bold mt-1 ${stat.valueColor || 'text-foreground'}`}>
                  {stat.value}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
