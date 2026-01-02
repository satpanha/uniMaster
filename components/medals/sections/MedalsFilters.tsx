import { Card, CardContent } from '@/components/ui';
import { FilterPanel } from '@/components/shared/FilterPanel';
import type { Province } from '@/types';

interface FilterState {
  search: string;
  medalType?: string;
  province?: string;
}

interface MedalsFiltersProps {
  filterState: FilterState;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  provinces: Province[];
}

export function MedalsFilters({
  filterState,
  onSearchChange,
  onFilterChange,
  provinces
}: MedalsFiltersProps) {
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
              placeholder: 'Search athletes, sports, or events...',
            },
            {
              type: 'select',
              label: 'Medal Type',
              value: filterState.medalType || 'all',
              onChange: (value: string) => onFilterChange('medalType', value),
              options: [
                { value: 'all', label: 'All Medals' },
                { value: 'gold', label: 'Gold' },
                { value: 'silver', label: 'Silver' },
                { value: 'bronze', label: 'Bronze' },
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
