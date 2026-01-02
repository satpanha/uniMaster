/**
 * Main Dashboard Page
 * Event-centric overview with stats, registrations, and medals
 */


import { EventSelector } from '@/components/events/EventSelector';
import { dashboardStats, dashboardMeta } from '@/lib/data/loaders/dataLoader';
import { DashboardProvider } from '@/components/dashboard/DashboardContext';
import DashboardHeaderClient from '@/components/dashboard/DashboardHeaderClient';
import DashboardStatsClient from '@/components/dashboard/DashboardStatsClient';
import { RecentRegistrations } from '@/components/dashboard/RecentRegistrations';
import { MedalDistributionChart } from '@/components/dashboard/MedalDistributionChart';
import { MedalStandings } from '@/components/dashboard/MedalStandings';
import { Card, CardHeader, Button } from '@/components/ui';

export default function DashboardPage() {
  type Registration = {
    id: string;
    athleteName: string;
    sport: string;
    province: string;
    registeredAt: string;
    status: 'approved' | 'pending' | 'rejected';
  };
  type MedalDistribution = { province: string; gold: number; silver: number; bronze: number };
  type MedalStanding = { province: string; gold: number; silver: number; bronze: number; total: number; rank: number };

  const registrations: Registration[] = [];
  const medalDistribution: MedalDistribution[] = [];
  const medalStandings: MedalStanding[] = [];

  return (
    <main className="layout-main min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <DashboardProvider initialMeta={dashboardMeta} initialStats={dashboardStats}>
          <DashboardHeaderClient eventSelector={<EventSelector />} />

          {/* Stats Row */}
          <DashboardStatsClient />
        </DashboardProvider>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <RecentRegistrations registrations={registrations} />

            <MedalDistributionChart data={medalDistribution} />
          </div>
          {/* Right column: 1/3 */}
          <div className="flex flex-col gap-8">
            <MedalStandings standings={medalStandings} />
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    </div>
                    <div>
                      <div className="font-semibold text-base">Export Data</div>
                      <div className="text-xs text-muted">Download reports in CSV format</div>
                    </div>
                  </div>
                  <Button variant="primary">Download</Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
