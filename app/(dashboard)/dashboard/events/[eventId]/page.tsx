/**
 * Event Dashboard Page
 * Event-specific overview with stats and actions
 */

import Link from 'next/link';
import { DashboardHeader, DashboardStats, MedalStandings } from '@/components/dashboard';
import { EventOverview } from '@/components/events';
import { loadEventById } from '@/src/lib/data/loaders/event.loader';
import { athletes as allAthletes, medals as allMedals, sports as allSports } from '@/src/lib/data/loaders/dataLoader';
import type { Metadata } from 'next';
import SyncSelectedEvent from '@/components/events/SyncSelectedEvent';

export async function generateMetadata({ params }: { params: { eventId: string } }): Promise<Metadata> {
  const event = await loadEventById(params.eventId);
  return { title: event ? `${event.name} – Event Dashboard` : 'Event Dashboard' };
}

export default async function EventDashboardPage({ params }: { params: { eventId: string } }) {
  const eventId = params.eventId;
  const event = await loadEventById(eventId);

  // If event not found, render a friendly message
  if (!event) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Event not found" subtitle="Please select a valid event" />
        <div className="card p-6">Event with id <strong>{eventId}</strong> was not found.</div>
      </div>
    );
  }

  // Compute basic event-scoped stats from mock JSON
  const eventAthletes = allAthletes.filter((a: any) => a.eventId === eventId);
  const eventMedals = allMedals.filter((m: any) => (m.eventId === eventId) || (m.event === eventId));
  const eventSports = allSports.filter((s: any) => !s.eventId || s.eventId === eventId);

  const totalAthletes = eventAthletes.length;
  const totalMedals = eventMedals.length;
  const totalProvinces = Array.from(new Set(eventAthletes.map((a) => a.province))).length;
  const totalSports = new Set(eventAthletes.flatMap((a) => a.sports ?? [])).size || eventSports.length;

  // Build a simple standings by province
  const standingsMap: Record<string, { gold: number; silver: number; bronze: number; total: number }> = {};
  eventMedals.forEach((m) => {
    const prov = m.province || 'Unknown';
    standingsMap[prov] = standingsMap[prov] || { gold: 0, silver: 0, bronze: 0, total: 0 };
    standingsMap[prov][m.medalType] += 1;
    standingsMap[prov].total += 1;
  });

  const standings = Object.entries(standingsMap).map(([province, data], i) => ({ province, ...data, rank: i + 1 }));

  const stats = {
    totalAthletes,
    totalSports,
    totalProvinces,
    totalMedals,
    athleteChange: 0,
    sportsChange: 0,
  };

  return (
    <div className="dashboard-content">
      <DashboardHeader 
        title={event.name}
        subtitle="Event Dashboard"
      />

      {/* Sync server-rendered page with client EventContext */}
      <SyncSelectedEvent eventId={event.id} />

      {/* Event sub-navigation */}
      <nav className="flex gap-3 items-center py-3">
        <Link href={`/dashboard/events/${event.id}`} className="section-link">Overview</Link>
        <Link href={`/dashboard/events/${event.id}/athletes`} className="section-link">Athletes</Link>
        <Link href={`/dashboard/events/${event.id}/sports`} className="section-link">Sports</Link>
        <Link href={`/dashboard/events/${event.id}/provinces`} className="section-link">Provinces</Link>
        <Link href={`/dashboard/events/${event.id}/medals`} className="section-link">Medals</Link>
      </nav>
      
      <div className="two-col-layout">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          <DashboardStats {...stats} />
          <MedalStandings standings={standings} />
        </div>
        
        {/* Sidebar */}
        <div>
          <EventOverview event={event} />
        </div>
      </div>
    </div>
  );
}
