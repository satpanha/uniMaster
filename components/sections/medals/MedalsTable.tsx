/**
 * MedalsTable Section
 * Displays medal awards with athlete and province info
 */

import type { Medal } from '@/types';

interface MedalsTableProps {
  medals: Medal[];
  onEdit?: (medal: Medal) => void;
  onDelete?: (medalId: string) => void;
}

import { Card, CardHeader, CardContent } from '@/components/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

export function MedalsTable({ medals, onEdit, onDelete }: MedalsTableProps) {
  const getMedalIcon = (type: string) => {
    switch (type) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🏅';
    }
  };

  return (
    <Card>
      <CardHeader>Medal Awards ({medals.length})</CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Medal</TableHead>
                <TableHead>Athlete</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>Date</TableHead>
                {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
              </tr>
            </TableHeader>

            <TableBody>
              {medals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted">No medals found</TableCell>
                </TableRow>
              ) : (
                medals.map((medal) => (
                  <TableRow key={medal.id}>
                    <TableCell>
                      <span className="text-lg mr-2">{getMedalIcon(medal.medalType)}</span>
                      {medal.medalType}
                    </TableCell>
                    <TableCell className="font-medium">{medal.athleteName || medal.athleteId}</TableCell>
                    <TableCell>{medal.sportName || '-'}</TableCell>
                    <TableCell>{medal.province ?? '-'}</TableCell>
                    <TableCell className="text-muted">
                      {medal.awardedDate ? new Date(medal.awardedDate).toLocaleDateString() : '-'}
                    </TableCell>
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button variant="outline" size="sm" onClick={() => onEdit(medal)}>Edit</Button>
                          )}
                          {onDelete && (
                            <Button variant="danger" size="sm" onClick={() => onDelete(medal.id)}>Delete</Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 
