import { Trophy, Plus } from 'lucide-react';
import { SectionHeader, Button } from '@/components/ui';

interface SportsHeaderProps {
  onAddSport: () => void;
  loading?: boolean;
}

export function SportsHeader({ onAddSport, loading }: SportsHeaderProps) {
  return (
    <SectionHeader
      icon={Trophy}
      title="Sports Management"
      subtitle="Manage all sports and competitions"
      action={
        <Button onClick={onAddSport} disabled={loading}>
          <Plus className="w-4 h-4" />
          Add Sport
        </Button>
      }
    />
  );
}
