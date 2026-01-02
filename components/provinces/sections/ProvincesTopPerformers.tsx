import { Award } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { MedalDisplay } from '@/components/shared';

interface Province {
  id: string;
  name: string;
  khmerName?: string;
  athleteCount: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  };
  rank: number;
}

interface ProvincesTopPerformersProps {
  topProvinces: Province[];
  getMedalColor: (rank: number | undefined) => string;
}

export function ProvincesTopPerformers({
  topProvinces,
  getMedalColor
}: ProvincesTopPerformersProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-600" />
        Top Performing Provinces
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topProvinces.map((province) => (
          <Card key={province.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${getMedalColor(province.rank)}`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-foreground">{province.name}</h4>
                  {province.khmerName && (
                    <p className="text-sm text-muted-foreground">{province.khmerName}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getMedalColor(province.rank)} text-white font-bold text-xl`}>
                  #{province.rank}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Athletes</span>
                  <span className="font-semibold text-foreground">{province.athleteCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Medals</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">{province.medals.total}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <MedalDisplay 
                    medals={province.medals}
                    size="md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
