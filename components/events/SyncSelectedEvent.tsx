"use client";

import { useEffect } from 'react';
import { useEvent } from '@/components/events/EventContext';

export default function SyncSelectedEvent({ eventId }: { eventId?: string }) {
  const { selectedEventId, setSelectedEventId } = useEvent();
  useEffect(() => {
    if (eventId && selectedEventId !== eventId) {
      setSelectedEventId(eventId);
    }
  }, [eventId, selectedEventId, setSelectedEventId]);
  return null;
}
