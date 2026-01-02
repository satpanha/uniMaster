import { MapPin, Download } from 'lucide-react';
import { SectionHeader } from '@/components/ui';

interface ProvincesHeaderProps {
  onExport: () => void;
}

export function ProvincesHeader({ onExport }: ProvincesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <SectionHeader
        icon={MapPin}
        title="Province Dashboard"
        subtitle="Performance statistics for all 25 provinces of Cambodia"
      />
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    </div>
  );
}
