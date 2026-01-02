import { Card, CardContent, Input } from '@/components/ui';

interface ProvincesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ProvincesSearch({ searchTerm, onSearchChange }: ProvincesSearchProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Input
          label="Search Provinces"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by English or Khmer name..."
        />
      </CardContent>
    </Card>
  );
}
