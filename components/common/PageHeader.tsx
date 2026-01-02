import { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { ReactNode } from 'react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

/**
 * Generic Page Header Component
 * Reusable across all dashboard pages
 */
export function PageHeader({ icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <SectionHeader
      icon={icon}
      title={title}
      subtitle={subtitle}
      action={actions}
    />
  );
}
