import { Card, CardHeader, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { MedalDisplay } from '@/components/shared';

interface ProvinceRow {
  id?: string;
  name: string;
  khmerName?: string;
  code?: string;
  athleteCount?: number;
  medals?: {
    gold?: number;
    silver?: number;
    bronze?: number;
    total?: number;
  };
  rank?: number;
}

interface ProvincesTableProps {
  provinces: ProvinceRow[];
  getMedalColor?: (rank: number | undefined) => string;
}

export function ProvincesTable({ provinces, getMedalColor }: ProvincesTableProps) {
  const colorForRank = (rank?: number) => {
    if (getMedalColor) return getMedalColor(rank);
    if (rank === 1) return 'bg-yellow-500';
    if (rank === 2) return 'bg-slate-400';
    if (rank === 3) return 'bg-amber-700';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Complete Rankings ({provinces.length} provinces)</h3>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Province</TableHead>
              <TableHead className="text-right">Athletes</TableHead>
              <TableHead className="text-right">🥇 Gold</TableHead>
              <TableHead className="text-right">🥈 Silver</TableHead>
              <TableHead className="text-right">🥉 Bronze</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {provinces.map((province) => (
              <TableRow key={province.id ?? province.name}>
                <TableCell>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${colorForRank(province.rank)}`}>
                    {province.rank ?? '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{province.name}</div>
                    {province.khmerName && (
                      <div className="text-sm text-muted-foreground truncate">{province.khmerName}</div>
                    )}
                  </div>
                </TableCell>
                {/* code column removed */}
                <TableCell className="text-right font-medium">{province.athleteCount ?? 0}</TableCell>
                <TableCell colSpan={4}>
                  <div className="flex justify-end">
                    <MedalDisplay 
                      medals={{
                        gold: province.medals?.gold ?? 0,
                        silver: province.medals?.silver ?? 0,
                        bronze: province.medals?.bronze ?? 0,
                      }}
                      showTotal
                      size="sm"
                      totalMedals={province.medals?.total}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
