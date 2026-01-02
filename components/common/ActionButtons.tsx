/**
 * Generic Action Buttons Component
 * Displays a group of action buttons (Add, Export, etc.)
 * Used across all dashboard pages for consistent action patterns
 */

import { Button } from '@/components/ui';
import { LucideIcon } from 'lucide-react';

export interface ActionButton {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost' | 'secondary' | 'outline' | 'danger';
}

interface ActionButtonsProps {
  actions: ActionButton[];
  className?: string;
}

export function ActionButtons({ actions, className = '' }: ActionButtonsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.onClick}
          variant={action.variant || 'primary'}
          className="flex items-center gap-2"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
