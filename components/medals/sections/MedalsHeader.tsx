import { Trophy, Plus, Download } from 'lucide-react';
import { SectionHeader, Button } from '@/components/ui';

interface MedalsHeaderProps {
  onAddMedal: () => void;
  onExport: () => void;
}

export function MedalsHeader({ onAddMedal, onExport }: MedalsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <SectionHeader
        icon={Trophy}
        title="Medal Management"
        subtitle="Track and manage medal awards"
      />
      <div className="flex gap-3">
        <Button variant="outline" onClick={onExport}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        <Button onClick={onAddMedal}>
          <Plus className="w-4 h-4" />
          Assign Medal
        </Button>
      </div>
    </div>
  );
}
