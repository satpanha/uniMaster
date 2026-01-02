import { Users, Plus } from 'lucide-react';
import { SectionHeader, Button } from '@/components/ui';

interface AthletesHeaderProps {
  onRegisterClick: () => void;
}

export function AthletesHeader({ onRegisterClick }: AthletesHeaderProps) {
  return (
    <SectionHeader
      icon={Users}
      title="Athletes Management"
      subtitle="Manage athlete registrations and profiles"
      action={
        <Button onClick={onRegisterClick}>
          <Plus className="w-4 h-4" />
          Register Athlete
        </Button>
      }
    />
  );
}
