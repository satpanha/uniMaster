/**
 * Dashboard Layout
 * Sidebar navigation + topbar + main content area
 */

'use client';

import { Sidebar } from '@/components/common/Sidebar';
import { EventProvider } from '@/components/events/EventContext';
import { Topbar } from '@/components/common/Topbar';
import EventAnnouncer from '@/components/events/EventAnnouncer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventProvider>
      <div className="dashboard-layout">
        {/* Sidebar */}
        <Sidebar />

        {/* Main + Topbar */}
        <div className="flex-1 min-h-screen bg-background">
          <Topbar />
          {/* Assistive announcement for event changes across the app */}
          <EventAnnouncer />
          <main>{children}</main>
        </div>
      </div>
    </EventProvider>
  );
}
