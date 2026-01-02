/**
 * MedalStandings Section
 * Province rankings by medal count
 */

import { Card, CardHeader, CardContent } from '@/components/ui';

interface MedalCount {
  province: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  rank: number;
}

interface MedalStandingsProps {
  standings: MedalCount[];
}

export function MedalStandings({ standings }: MedalStandingsProps) {
  return (
    <Card>
      <CardHeader>Medal Standings by Province</CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-16">Rank</th>
                <th>Province</th>
                <th className="text-right">🥇 Gold</th>
                <th className="text-right">🥈 Silver</th>
                <th className="text-right">🥉 Bronze</th>
                <th className="text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {standings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted text-center py-8">
                    No medal data available
                  </td>
                </tr>
              ) : (
                standings.map((standing) => {
                  const topClass = standing.rank === 1 ? 'table-row-top-1' : standing.rank === 2 ? 'table-row-top-2' : standing.rank === 3 ? 'table-row-top-3' : '';
                  return (
                    <tr key={standing.province} className={`${topClass} table-row-hover`}>
                      <td className="text-muted font-semibold">#{standing.rank}</td>
                      <td className="font-medium">{standing.province}</td>
                      <td className="text-right">{standing.gold}</td>
                      <td className="text-right">{standing.silver}</td>
                      <td className="text-right">{standing.bronze}</td>
                      <td className="text-right font-semibold">{standing.total}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
