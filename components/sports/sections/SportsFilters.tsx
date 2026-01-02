import { Card, CardContent } from '@/components/ui';
import { FilterPanel } from '@/components/shared/FilterPanel';

interface FilterState {
  search: string;
  status?: string;
  category?: string;
}

interface SportsFiltersProps {
  filterState: FilterState;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  categories: string[];
}

export function SportsFilters({
  filterState,
  onSearchChange,
  onFilterChange,
  categories
}: SportsFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <FilterPanel
          filters={[
            {
              type: 'search',
              label: 'Search',
              value: filterState.search,
              onChange: onSearchChange,
              placeholder: 'Search sports...',
            },
            {
              type: 'select',
              label: 'Status',
              value: filterState.status || 'all',
              onChange: (value: string) => onFilterChange('status', value),
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'completed', label: 'Completed' },
              ],
            },
            {
              type: 'select',
              label: 'Category',
              value: filterState.category || 'all',
              onChange: (value: string) => onFilterChange('category', value),
              options: [
                { value: 'all', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat, label: cat })),
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
