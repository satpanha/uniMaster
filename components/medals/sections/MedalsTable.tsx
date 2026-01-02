"use client";

import { useState } from 'react';
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
          <>
            <div className="hide-mobile">
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
                          <span className="truncate block" title={medal.athleteName}>{medal.athleteName}</span>
                          {medal.athleteNameKh && (
                            <span className="block text-sm text-gray-500 dark:text-gray-400 truncate" title={medal.athleteNameKh}>{medal.athleteNameKh}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell><span className="truncate block" title={medal.province}>{medal.province}</span></TableCell>
                      <TableCell><span className="truncate block" title={medal.sportName}>{medal.sportName}</span></TableCell>
                      <TableCell className="hide-mobile"><span className="truncate block" title={medal.event}>{medal.event}</span></TableCell>
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
            </div>

            {/* Mobile cards */}
            <div className="show-mobile space-y-3">
              {medals.map((m) => (
                <MobileMedalCard key={m.id} medal={m} onEdit={onEdit} onDelete={onDelete} isDeleting={isDeleting} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MobileMedalCard({
  medal,
  onEdit,
  onDelete,
  isDeleting
}: {
  medal: Medal;
  onEdit?: (m: Medal) => void;
  onDelete?: (id: string, info: string) => void;
  isDeleting?: (id: string) => boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const name = medal.athleteName || 'Unknown';

  return (
    <div className="mobile-table-card">
      <div className="card-row">
        <div className="flex items-center gap-3">
          <MedalTypeBadge medalType={medal.medalType} />
          <div>
            <div className="font-medium" title={name}>{name}</div>
            <div className="card-meta">{medal.province ?? '-'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && <button className="btn btn-sm btn-outline" onClick={() => onEdit(medal)}>Edit</button>}
          {onDelete && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(medal.id, `${medal.medalType} medal for ${name}`)}
              disabled={isDeleting ? isDeleting(medal.id) : false}
            >
              {isDeleting && isDeleting(medal.id) ? '...' : 'Delete'}
            </button>
          )}
          <button className="btn btn-sm btn-outline" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={`medal-details-${medal.id}`}>{expanded ? 'Hide' : 'Details'}</button>
        </div>
      </div>

      {expanded && (
        <div id={`medal-details-${medal.id}`} className="card-details">
          <div><strong>Sport:</strong> {medal.sportName ?? '-'}</div>
          <div><strong>Event:</strong> {medal.event ?? '-'}</div>
          <div><strong>Date:</strong> {medal.awardedDate ? new Date(medal.awardedDate).toLocaleDateString() : '-'}</div>
        </div>
      )}
    </div>
  );
}
