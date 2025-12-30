import { Card, CardHeader, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { LoadingSpinner, EmptyTableRow, MedalTypeBadge } from '@/components/shared';
import { TableActions } from '@/components/shared/TableActions';
import type { Medal } from '@/types';

interface MedalsTableProps {
  medals: Medal[];
  loading?: boolean;
  onEdit?: (medal: Medal) => void;
  onDelete?: (id: string, info: string) => void;
  isDeleting?: (id: string) => boolean;
}

export function MedalsTable({
  medals,
  loading = false,
  onEdit,
  onDelete,
  isDeleting
}: MedalsTableProps) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Medal Awards ({medals.length})</h3>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medal</TableHead>
                <TableHead>Athlete</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead className="hide-mobile">Event</TableHead>
                <TableHead className="hide-mobile">Date</TableHead>
                {hasActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {medals.map((medal) => (
                <TableRow key={medal.id}>
                  <TableCell>
                    <MedalTypeBadge medalType={medal.medalType} />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="min-w-0">
                      <span className="truncate block">{medal.athleteName}</span>
                      {medal.athleteNameKh && (
                        <span className="block text-sm text-gray-500 dark:text-gray-400 truncate">{medal.athleteNameKh}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell><span className="truncate block">{medal.province}</span></TableCell>
                  <TableCell><span className="truncate block">{medal.sportName}</span></TableCell>
                  <TableCell className="hide-mobile"><span className="truncate block">{medal.event}</span></TableCell>
                  <TableCell className="hide-mobile">
                    {medal.awardedDate ? new Date(medal.awardedDate).toLocaleDateString() : '-'}
                  </TableCell>
                  {hasActions && (
                    <TableCell>
                      <TableActions
                        onEdit={onEdit ? () => onEdit(medal) : undefined}
                        onDelete={onDelete ? () => onDelete(medal.id, `${medal.medalType} medal for ${medal.athleteName}`) : undefined}
                        deleteLoading={isDeleting ? isDeleting(medal.id) : false}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {medals.length === 0 && (
                <EmptyTableRow colSpan={hasActions ? 7 : 6} message="No medals found" />
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
