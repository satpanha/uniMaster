import { Card, CardHeader, CardContent } from '@/components/ui';

/**
 * MedalDistributionChart Section
 * Simple bar chart showing medal distribution by province
 */

interface ChartData {
  province: string;
  gold: number;
  silver: number;
  bronze: number;
}

interface MedalDistributionChartProps {
  data: ChartData[];
}

export function MedalDistributionChart({ data }: MedalDistributionChartProps) {
  const maxTotal = Math.max(...data.map(d => d.gold + d.silver + d.bronze), 1);
  
  return (
    <Card>
      <CardHeader>Medal Distribution</CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-muted text-center py-8">No medal data available</div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.map((item) => {
              const total = item.gold + item.silver + item.bronze;
              const percentage = (total / maxTotal) * 100;
              
              return (
                <div key={item.province}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.province}</span>
                    <span className="text-muted text-sm">
                      {item.gold}🥇 {item.silver}🥈 {item.bronze}🥉
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
                    <div className="progress-fill" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
