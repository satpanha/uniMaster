"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useEvent } from "@/components/events/EventContext";
import { useEvents } from "@/src/hooks/useEvents";
import { useAltFocus } from "@/src/hooks/useAltFocus";
import { EventSelectControl } from "@/components/common/EventSelectControl";
import { EventBreadcrumb } from "@/components/common/EventBreadcrumb";

export function EventSelector() {
  const { events, loading } = useEvents();
  const router = useRouter();
  const { selectedEventId, setSelectedEventId } = useEvent();
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useAltFocus(selectRef, "e");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value || null;
    setSelectedEventId(id);
    if (id) router.push(`/dashboard/events/${id}`);
    else router.push(`/dashboard`);
  };

  const selected = events.find((ev) => ev.id === selectedEventId);

  return (
    <div className="flex items-center gap-3">
      <EventSelectControl ref={selectRef} events={events} value={selectedEventId} onChange={handleChange} loading={loading} />
      {selected ? <EventBreadcrumb id={selected.id} name={selected.name} /> : null}
    </div>
  );
}
