/**
 * ProvincesTable Section
 * Displays province rankings and stats
 */

import type { Province } from '@/types';

interface ProvinceStats extends Province {
  totalAthletes?: number;
  totalMedals?: number;
  goldMedals?: number;
  silverMedals?: number;
  bronzeMedals?: number;
  rank?: number;
}

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface ProvincesTableProps {
  provinces: ProvinceStats[];
}

export function ProvincesTable({ provinces }: ProvincesTableProps) {
  return (
    <Card>
      <CardHeader>
        Province Rankings ({provinces.length})
      </CardHeader>

      <CardContent>
        {/* Desktop/table view */}
        <div className="hide-mobile">
          <Table>
            <TableHeader>
              <tr>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Province</TableHead>
                <TableHead className="text-right">Athletes</TableHead>
                <TableHead className="text-right">🥇 Gold</TableHead>
                <TableHead className="text-right">🥈 Silver</TableHead>
                <TableHead className="text-right">🥉 Bronze</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </tr>
            </TableHeader>

            <TableBody>
              {provinces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted">
                    No province data available
                  </TableCell>
                </TableRow>
              ) : (
                provinces.map((province) => (
                  <TableRow key={province.name} className="table-row-hover">
                    <TableCell className="font-semibold text-muted">#{province.rank || '-'}</TableCell>
                    <TableCell className="font-medium min-w-0"><span className="truncate block" title={province.name}>{province.name}</span></TableCell>
                    <TableCell className="text-right">{province.totalAthletes || 0}</TableCell>
                    <TableCell className="text-right">{province.goldMedals || 0}</TableCell>
                    <TableCell className="text-right">{province.silverMedals || 0}</TableCell>
                    <TableCell className="text-right">{province.bronzeMedals || 0}</TableCell>
                    <TableCell className="text-right font-semibold">{province.totalMedals || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="show-mobile space-y-3">
          {provinces.map((p) => (
            <div key={p.name} className="mobile-table-card">
              <div className="card-row">
                <div>
                  <div className="font-medium" title={p.name}>#{p.rank ?? '-'} {p.name}</div>
                  <div className="card-meta">Athletes: {p.totalAthletes ?? 0} · Total: {p.totalMedals ?? 0}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">🥇 {p.goldMedals ?? 0}</div>
                  <div className="text-sm">🥈 {p.silverMedals ?? 0}</div>
                  <div className="text-sm">🥉 {p.bronzeMedals ?? 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
