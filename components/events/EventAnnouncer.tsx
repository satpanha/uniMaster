"use client";

import { useEffect, useState } from 'react';
import { useEvent } from '@/components/events/EventContext';

export default function EventAnnouncer() {
  const { selectedEventId } = useEvent();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let active = true;

    const announce = async () => {
      if (!selectedEventId) {
        if (active) setMessage('All events selected');
        return;
      }

      try {
        const res = await fetch(`/api/events?id=${selectedEventId}`);
        const data = await res.json();
        const evt = data.events && data.events[0];
        if (active) setMessage(evt ? `Selected event: ${evt.name}` : 'Selected event changed');
      } catch (err) {
        if (active) setMessage('Selected event changed');
      }
    };

    announce();

    return () => { active = false; };
  }, [selectedEventId]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
      {message}
    </div>
  );
}
