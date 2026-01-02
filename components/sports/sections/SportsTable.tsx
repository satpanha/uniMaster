import { Card, CardHeader, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { StatusBadge } from '@/components/shared';
import { TableActions } from '@/components/shared/TableActions';
import type { Sport } from '@/types';

interface SportsTableProps {
  sports: Sport[];
  onEdit?: (sport: Sport) => void;
  onDelete?: (id: string, name: string) => void;
  isDeleting?: (id: string) => boolean;
}

export function SportsTable({
  sports,
  onEdit,
  onDelete,
  isDeleting
}: SportsTableProps) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Sports List ({sports.length})</h3>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sport Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Status</TableHead>
              {hasActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sports.map((sport) => (
              <TableRow key={sport.id}>
                <TableCell className="font-medium">{sport.name}</TableCell>
                <TableCell>{sport.category}</TableCell>
                <TableCell>
                  {sport.currentParticipants} / {sport.maxParticipants}
                </TableCell>
                <TableCell>
                  {(() => {
                    const status = (sport.status ?? 'inactive') as 'active' | 'inactive' | 'upcoming' | 'ongoing' | 'completed';
                    return <StatusBadge status={status} />;
                  })()}
                </TableCell>
                {hasActions && (
                  <TableCell>
                    <TableActions
                      onEdit={onEdit ? () => onEdit(sport) : undefined}
                      onDelete={onDelete ? () => onDelete(sport.id, sport.name) : undefined}
                      deleteLoading={isDeleting ? isDeleting(sport.id) : false}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
