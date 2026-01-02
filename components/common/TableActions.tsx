/**
 * TableActions Component
 * Reusable component for table row action buttons
 */

'use client';

import React from 'react';
import { Button } from '../ui';
import { Eye, Edit2, Trash2, MoreVertical, Download, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionConfig {
  type: 'view' | 'edit' | 'delete' | 'download' | 'copy' | 'custom';
  label?: string;
  icon?: React.ComponentType<{ className?: string }>; // icon receives className prop
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
} 

interface TableActionsProps {
  actions: ActionConfig[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const defaultIcons = {
  view: Eye,
  edit: Edit2,
  delete: Trash2,
  download: Download,
  copy: Copy,
  custom: MoreVertical,
};

const defaultLabels = {
  view: 'View',
  edit: 'Edit',
  delete: 'Delete',
  download: 'Download',
  copy: 'Copy',
  custom: 'More',
};

export function TableActions({ 
  actions, 
  className, 
  size = 'sm',
  showLabels = false 
}: TableActionsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {actions.map((action, index) => {
        const Icon = action.icon || defaultIcons[action.type];
        const label = action.label || defaultLabels[action.type];
        const variant = action.variant || (action.type === 'delete' ? 'danger' : 'ghost');

        return (
          <Button
            key={index}
            variant={variant}
            size={size}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className={cn(
              'transition-all',
              action.type === 'delete' && 'text-destructive',
              action.loading && 'opacity-50 cursor-wait'
            )}
            title={label}
          >
            <Icon className={cn('h-4 w-4', action.loading && 'animate-spin')} />
            {showLabels && <span className="ml-1">{label}</span>}
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Quick Actions Component
 * Pre-configured common action sets
 */
interface QuickActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteLoading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function QuickActions({
  onView,
  onEdit,
  onDelete,
  deleteLoading = false,
  className,
  size = 'sm',
  showLabels = false,
}: QuickActionsProps) {
  const actions: ActionConfig[] = [];

  if (onView) {
    actions.push({
      type: 'view',
      onClick: onView,
    });
  }

  if (onEdit) {
    actions.push({
      type: 'edit',
      onClick: onEdit,
    });
  }

  if (onDelete) {
    actions.push({
      type: 'delete',
      onClick: onDelete,
      loading: deleteLoading,
    });
  }

  return <TableActions actions={actions} className={className} size={size} showLabels={showLabels} />;
}
