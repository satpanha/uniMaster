/**
 * AthletesTable Section  
 * Displays athletes with filtering support
 */

import { Card, CardHeader, CardContent } from '@/components/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import type { Athlete } from '@/types';

interface AthletesTableProps {
  athletes: Athlete[];
  onEdit?: (athlete: Athlete) => void;
  onDelete?: (athleteId: string) => void;
}

function computeAge(dob?: string) {
  if (!dob) return '-';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365)).toString();
}

export function AthletesTable({ athletes, onEdit, onDelete }: AthletesTableProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Athletes ({athletes.length})</h3>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Age</TableHead>
              {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
            </tr>
          </TableHeader>

          <TableBody>
            {athletes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted">No athletes found</TableCell>
              </TableRow>
            ) : (
              athletes.map((athlete) => {
                const displayName = athlete.firstName || athlete.lastName
                  ? `${athlete.firstName ?? ''} ${athlete.lastName ?? ''}`.trim()
                  : (athlete.email?.split('@')[0] ?? 'Unknown');

                return (
                  <TableRow key={athlete.id}>
                    <TableCell className="font-medium">{displayName}</TableCell>
                    <TableCell>{athlete.sportId || '-'}</TableCell>
                    <TableCell>{athlete.province ?? '-'}</TableCell>
                    <TableCell>{computeAge(athlete.dateOfBirth)}</TableCell>
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button variant="outline" size="sm" onClick={() => onEdit(athlete)}>Edit</Button>
                          )}
                          {onDelete && (
                            <Button variant="danger" size="sm" onClick={() => onDelete(athlete.id)}>Delete</Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
