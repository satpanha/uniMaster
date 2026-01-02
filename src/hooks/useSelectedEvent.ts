"use client";

import { useEffect, useState } from 'react';
import { useEvent } from '@/components/events/EventContext';

export function useSelectedEvent(routeEventId?: string) {
  const { selectedEventId, setSelectedEventId } = useEvent();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        const events = data.events ?? [];

        // Determine which id to prefer: context selection > route param > first event
        const preferredId = selectedEventId ?? routeEventId ?? (events.length ? events[0].id : null);

        // If there's a route event id and it differs from context, set context so topbar and pages are in sync
        if (routeEventId && selectedEventId !== routeEventId) {
          setSelectedEventId(routeEventId);
        }

        const found = events.find((e: any) => e.id === preferredId) ?? null;
        if (active) setEvent(found);
      } catch (err) {
        console.error('Failed to load selected event', err);
        if (active) setEvent(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => { active = false; };
  }, [selectedEventId, routeEventId, setSelectedEventId]);

  return { event, loading };
}
