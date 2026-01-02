/**
 * EventSelector Section
 * Dropdown to switch between events
 */

'use client';

import type { Event } from '@/types';

interface EventSelectorProps {
  events: Event[];
  currentEventId?: string | null;
  onEventChange: (eventId: string | null) => void;
}

export function EventSelector({ events, currentEventId, onEventChange }: EventSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="sr-only" htmlFor="section-event-select">Select event</label>
      <select
        id="section-event-select"
        value={currentEventId ?? ""}
        onChange={(e) => onEventChange(e.target.value || null)}
        className="form-select rounded border border-border bg-card px-3 py-1 text-sm"
        aria-label="Select event"
      >
        <option value="">All events</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>
    </div>
  );
}
