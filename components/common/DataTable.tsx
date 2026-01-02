import { Card, CardHeader, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { LoadingSpinner, EmptyTableRow } from '@/components/shared';
import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

/**
 * Generic Data Table Component
 * Reusable table for displaying any type of data
 */
export function DataTable<T>({
  title,
  data,
  columns,
  loading = false,
  emptyMessage = 'No data found',
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{title} ({data.length})</h3>
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
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={keyExtractor(item)} className="hover:bg-muted/50">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.render
                        ? column.render(item)
                        : column.accessor
                        ? String(item[column.accessor])
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {data.length === 0 && (
                <EmptyTableRow colSpan={columns.length} message={emptyMessage} />
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
