/**
 * Sport Medals Page
 * Shows medals for a specific sport
 */

import { DashboardHeader } from '@/components/dashboard';
import { MedalsTable } from '@/components/medals';
import type { Medal } from '@/types';

export default function SportMedalsPage({ 
  params 
}: { 
  params: { eventId: string; sportId: string } 
}) {
  // Mock data - replace with actual fetch
  const mockMedals: Medal[] = [];

  return (
    <div className="dashboard-content">
      <DashboardHeader 
        title="Sport Medals"
        subtitle={`Medals for sport ${params.sportId}`}
      />
      
      <MedalsTable medals={mockMedals} />
    </div>
  );
}
