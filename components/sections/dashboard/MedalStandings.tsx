/**
 * MedalStandings Section
 * Province rankings by medal count
 */

interface MedalCount {
  province: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  rank: number;
}

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface MedalStandingsProps {
  standings: MedalCount[];
}

export function MedalStandings({ standings }: MedalStandingsProps) {
  return (
    <Card>
      <CardHeader>Medal Standings by Province</CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <tr>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Province</TableHead>
              <TableHead className="text-right">🥇 Gold</TableHead>
              <TableHead className="text-right">🥈 Silver</TableHead>
              <TableHead className="text-right">🥉 Bronze</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </tr>
          </TableHeader>

          <TableBody>
            {standings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted">
                  No medal data available
                </TableCell>
              </TableRow>
            ) : (
              standings.map((standing) => (
                <TableRow key={standing.province} className="table-row-hover">
                  <TableCell className="font-semibold text-muted">#{standing.rank}</TableCell>
                  <TableCell className="font-medium min-w-0"><span className="truncate block" title={standing.province}>{standing.province}</span></TableCell>
                  <TableCell className="text-right">{standing.gold}</TableCell>
                  <TableCell className="text-right">{standing.silver}</TableCell>
                  <TableCell className="text-right">{standing.bronze}</TableCell>
                  <TableCell className="text-right font-semibold">{standing.total}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
