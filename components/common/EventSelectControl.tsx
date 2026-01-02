"use client";

import React, { forwardRef } from "react";
import { EventItem } from "@/src/hooks/useEvents";

type Props = {
  events: EventItem[];
  value: string | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loading?: boolean;
};

export const EventSelectControl = forwardRef<HTMLSelectElement, Props>(function EventSelectControl(
  { events, value, onChange, loading },
  ref
) {
  return (
    <div className="flex items-center gap-3">
      <select
        id="topbar-event-select"
        ref={ref}
        className="form-select rounded border border-border bg-card px-3 py-1 text-sm"
        value={value ?? ""}
        onChange={onChange}
        aria-describedby="event-selection-help"
      >
        <option value="">All events</option>
        {events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.name}
          </option>
        ))}
      </select>
      {loading ? (
        <span className="text-xs text-muted">Loading…</span>
      ) : (
        <span id="event-selection-help" className="text-xs text-muted">Press Alt+E to focus</span>
      )}
    </div>
  );
});
