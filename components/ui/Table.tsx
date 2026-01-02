'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="table-container w-full overflow-x-auto min-w-0">
      <table className={cn('table w-full border-collapse', className)}>{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('bg-muted border-b border-default', className)}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-default transition-colors',
        onClick && 'cursor-pointer hover:bg-muted',
        className
      )}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
}

export function TableHead({ children, className, sortable }: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider',
        sortable && 'cursor-pointer hover:text-primary',
        className
      )}
    >
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export function TableCell({ children, className, colSpan }: TableCellProps) {
  return (
    <td className={cn('px-6 py-4 text-sm text-foreground', className)} colSpan={colSpan}>
      {children}
    </td>
  );
}
