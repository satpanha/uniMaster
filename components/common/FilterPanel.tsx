/**
 * FilterPanel Component
 * Reusable component for displaying search and filter controls
 */

'use client';

import React from 'react';
import { FormInput } from './formInput';
import { FormSelect } from './formSelect';
import { cn } from '@/src/lib/utils';
import { Search, Filter, LucideIcon } from 'lucide-react';

export type FilterType = 'search' | 'select' | 'date';

export interface FilterConfig {
  type: FilterType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  icon?: LucideIcon;
  colSpan?: 1 | 2;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function FilterPanel({ filters, className, columns = 3 }: FilterPanelProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {filters.map((filter, index) => (
        <div key={index} className={filter.colSpan === 2 ? 'md:col-span-2' : ''}>
          {filter.type === 'search' && (
            <FormInput
              label={filter.label}
              value={filter.value}
              onChange={filter.onChange}
              placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
              icon={filter.icon || Search}
            />
          )}
          {filter.type === 'select' && (
            <FormSelect
              label={filter.label}
              value={filter.value}
              onChange={(value) => filter.onChange(value || '')}
              options={filter.options || []}
              placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`}
              icon={filter.icon || Filter}
            />
          )}
          {filter.type === 'date' && (
            <FormInput
              label={filter.label}
              value={filter.value}
              onChange={filter.onChange}
              type="date"
              placeholder={filter.placeholder}
              icon={filter.icon}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * FilterGroup Component
 * Group filters with a title
 */
interface FilterGroupProps {
  title?: string;
  filters: FilterConfig[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FilterGroup({ title, filters, columns = 3, className }: FilterGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
            <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>
      )}
      <FilterPanel filters={filters} columns={columns} />
    </div>
  );
}
