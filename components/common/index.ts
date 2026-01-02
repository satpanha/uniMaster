/**
 * Common UI Components
 * Form inputs and basic elements for the registration flow
 * 
 * Note: For dashboard pages, prefer using components from '@/components/ui'
 * Reusable components shared across all dashboard pages
 */

// Generic Dashboard Components
export { PageHeader } from './PageHeader';
export { StatsGrid } from './StatsGrid';
export { DataTable } from './DataTable';
export { ActionButtons } from './ActionButtons';
export { FilterCard } from './FilterCard';

// Form Components
export { FormInput } from './formInput';
export { FormSelect } from './formSelect';
export { FormSection } from './FormSection';

// Filter Components
export { FilterPanel, FilterGroup } from './FilterPanel';
export { TableActions, QuickActions } from './TableActions';

// Re-export SectionHeader from ui for backward compatibility
export { SectionHeader } from '../ui/SectionHeader';
