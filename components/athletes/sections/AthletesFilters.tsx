import { Card, CardContent } from '@/components/ui';
import { FilterPanel } from '@/components/shared/FilterPanel';
import type { Province } from '@/types';

interface FilterState {
  search: string;
  status?: string;
  province?: string;
}

interface AthletesFiltersProps {
  filterState: FilterState;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  provinces: Province[];
}

export function AthletesFilters({
  filterState,
  onSearchChange,
  onFilterChange,
  provinces
}: AthletesFiltersProps) {
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
              placeholder: 'Search by name or email...',
            },
            {
              type: 'select',
              label: 'Status',
              value: filterState.status || 'all',
              onChange: (value: string) => onFilterChange('status', value),
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'approved', label: 'Approved' },
                { value: 'pending', label: 'Pending' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              type: 'select',
              label: 'Province',
              value: filterState.province || 'all',
              onChange: (value: string) => onFilterChange('province', value),
              options: [
                { value: 'all', label: 'All Provinces' },
                ...provinces.map(p => ({ value: p.name, label: p.name })),
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
