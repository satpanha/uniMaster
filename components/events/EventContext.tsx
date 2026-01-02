"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface EventContextState {
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
}

const EventContext = createContext<EventContextState | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem('selectedEventId') : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (selectedEventId === null) {
        localStorage.removeItem('selectedEventId');
      } else {
        localStorage.setItem('selectedEventId', selectedEventId);
      }
    } catch (e) {
      /* ignore localStorage errors */
    }
  }, [selectedEventId]);

  return (
    <EventContext.Provider value={{ selectedEventId, setSelectedEventId }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const ctx = useContext(EventContext);
  if (!ctx) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return ctx;
}
