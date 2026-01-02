/**
 * Sport Details Page
 * Shows details for a specific sport
 */

import { DashboardHeader } from '@/components/dashboard';
import { Card } from '@/components/ui/Card';

export default function SportDetailPage({ 
  params 
}: { 
  params: { eventId: string; sportId: string } 
}) {
  return (
    <div className="dashboard-content">
      <DashboardHeader 
        title="Sport Details"
        subtitle={`Sport ID: ${params.sportId}`}
      />
      
      <Card>
        <p>Sport detail page content will be added here.</p>
      </Card>
    </div>
  );
}
