"use client";

import { useState } from 'react';
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import {
  StatusBadge,
  LoadingSpinner,
  EmptyTableRow,
  TableActions,
} from "@/components/shared";
import type { Athlete } from "@/types";

interface AthletesTableProps {
  athletes: Athlete[];
  loading: boolean;
  onView: (athlete: Athlete) => void;
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: string, name: string) => void;
  isDeleting: (id: string) => boolean;
}

export function AthletesTable({
  athletes,
  loading,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: AthletesTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">
          Athletes List ({athletes.length})
        </h3>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead className="hide-mobile">Sports</TableHead>
                    <TableHead className="hide-mobile">Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {athletes.map((athlete) => {
                    const hasPhoto =
                      athlete.photoUrl &&
                      athlete.photoUrl !== "/avatars/default.jpg";
                    const displayName =
                      athlete.firstName || athlete.lastName
                        ? `${athlete.firstName ?? ""} ${
                            athlete.lastName ?? ""
                          }`.trim()
                        : athlete.email?.split("@")[0] ?? "Unknown";
                    const khName = [athlete.lastNameKh, athlete.firstNameKh]
                      .filter(Boolean)
                      .join(" ");
                    const initials =
                      athlete.firstName?.[0] && athlete.lastName?.[0]
                        ? `${athlete.firstName[0]}${athlete.lastName[0]}`
                        : displayName.slice(0, 2).toUpperCase() || "NA";
                    const provinceLabel =
                      athlete.province ?? "-";
                    const status = athlete.status ?? "pending";

                    return (
                      <TableRow key={athlete.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {hasPhoto ? (
                              <Image
                                src={athlete.photoUrl as string}
                                alt={displayName}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-blue-200 dark:border-blue-800">
                                {initials}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 dark:text-white truncate" title={displayName}>
                                {displayName}
                              </div>
                              {khName && (
                                <div className="text-sm text-gray-600 dark:text-gray-300 truncate" title={khName}>
                                  {khName}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={athlete.email || "No email"}>
                                {athlete.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-0">
                          <span className="text-gray-700 dark:text-gray-300 truncate block" title={provinceLabel}>
                            {provinceLabel}
                          </span>
                        </TableCell>
                        <TableCell className="hide-mobile">
                          <div className="flex flex-wrap gap-1 max-w-[160px] min-w-0">
                            {athlete.sports
                              ?.slice(0, 2)
                              .map((sport: string, idx: number) => (
                                <Badge
                                  key={`${sport}-${idx}`}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {sport}
                                </Badge>
                              ))}
                            {athlete.sports && athlete.sports.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{athlete.sports.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-0 hide-mobile">
                          <span className="text-gray-600 dark:text-gray-400 truncate block" title={athlete.phone || '-'}>
                            {athlete.phone || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={status} />
                        </TableCell>
                        <TableCell>
                          <TableActions
                            onView={() => onView(athlete)}
                            onEdit={() => onEdit(athlete)}
                            onDelete={() => onDelete(athlete.id, displayName)}
                            deleteLoading={isDeleting(athlete.id)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {athletes.length === 0 && (
                    <EmptyTableRow colSpan={6} message="No athletes found" />
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile compact view */}
            <div className="show-mobile space-y-3">
              {athletes.map((ath) => {
                const name = `${ath.firstName ?? ''} ${ath.lastName ?? ''}`.trim() || (ath.email ?? '').split('@')[0] || 'Unknown';
                return (
                  <div className="mobile-table-card" key={ath.id}>
                    <div className="card-row">
                      <div>
                        <div className="font-medium" title={name}>{name}</div>
                        <div className="card-meta">{ath.province ?? '-'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-sm" onClick={() => onView(ath)}>View</button>
                        <button className="btn btn-sm btn-outline" onClick={() => onEdit(ath)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => onDelete(ath.id, name)} disabled={isDeleting(ath.id)}>{isDeleting(ath.id) ? '...' : 'Delete'}</button>
                        <button className="btn btn-sm btn-outline" onClick={() => toggle(ath.id)} aria-expanded={!!expanded[ath.id]} aria-controls={`details-${ath.id}`}>{expanded[ath.id] ? 'Hide' : 'Details'}</button>
                      </div>
                    </div>
                    {expanded[ath.id] && (
                      <div id={`details-${ath.id}`} className="card-details">
                        <div><strong>Sports:</strong> {(ath.sports?.join(', ') ?? '-')}</div>
                        <div><strong>Phone:</strong> {ath.phone ?? '-'}</div>
                        <div><strong>Email:</strong> {ath.email ?? '-'}</div>
                        <div><strong>Status:</strong> {ath.status ?? 'pending'}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
