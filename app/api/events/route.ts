import { NextRequest, NextResponse } from 'next/server';
import type { Event } from '@/types';

let events: Event[] = [
  {
    id: 'event-1',
    name: 'National School Games 2025',
    startDate: '2025-01-15',
    endDate: '2025-01-25',
    status: 'active',
  },
  {
    id: 'event-2',
    name: 'Provincial Championship 2025',
    startDate: '2025-02-01',
    endDate: '2025-02-10',
    status: 'upcoming',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const payload = id ? events.filter((e) => e.id === id) : events;
  return NextResponse.json({ events: payload });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const event: Event = {
    id: body.id ?? `event-${Date.now()}`,
    name: body.name,
    startDate: body.startDate,
    endDate: body.endDate,
    status: body.status ?? 'upcoming',
  };

  events = [event, ...events];
  return NextResponse.json({ event }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  let updated: Event | undefined;
  events = events.map((evt) => {
    if (evt.id === body.id) {
      updated = { ...evt, ...body } as Event;
      return updated;
    }
    return evt;
  });

  if (!updated) {
    return NextResponse.json({ error: 'event not found' }, { status: 404 });
  }

  return NextResponse.json({ event: updated });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const before = events.length;
  events = events.filter((evt) => evt.id !== body.id);

  if (events.length === before) {
    return NextResponse.json({ error: 'event not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
