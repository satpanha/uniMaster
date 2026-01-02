/**
 * SportsTable Section
 * Displays sports list with actions
 */

import type { Sport } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SportsTableProps {
  sports: Sport[];
  onEdit?: (sport: Sport) => void;
  onDelete?: (sportId: string) => void;
}

export function SportsTable({ sports, onEdit, onDelete }: SportsTableProps) {
  return (
    <Card>
      <CardHeader>Sports ({sports.length})</CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Sport Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Status</TableHead>
              {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
            </tr>
          </TableHeader>

          <TableBody>
            {sports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted">
                  No sports found
                </TableCell>
              </TableRow>
            ) : (
              sports.map((sport) => (
                <TableRow key={sport.id} className="table-row-hover">
                  <TableCell className="font-medium">{sport.name}</TableCell>
                  <TableCell>{sport.category || '-'}</TableCell>
                  <TableCell>{sport.currentParticipants ?? 0} / {sport.maxParticipants ?? '-'}</TableCell>
                  <TableCell>
                    <Badge variant={sport.status === 'active' ? 'success' : sport.status === 'upcoming' ? 'warning' : 'info'}>
                      {sport.status || 'active'}
                    </Badge>
                  </TableCell>
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button variant="ghost" size="sm" onClick={() => onEdit(sport)}>Edit</Button>
                        )}
                        {onDelete && (
                          <Button variant="ghost" size="sm" className="text-danger" onClick={() => onDelete(sport.id)}>Delete</Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
