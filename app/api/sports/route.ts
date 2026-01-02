import { NextRequest, NextResponse } from 'next/server';
import type { Sport } from '@/types';

let sports: Sport[] = [
  { id: 'sport-1', name: 'Football', eventId: 'event-1', category: 'team', description: '', startDate: '2025-01-01', endDate: '2025-01-07', venue: 'Main Stadium', status: 'active', currentParticipants: 120, maxParticipants: 200 },
  { id: 'sport-2', name: 'Basketball', eventId: 'event-1', category: 'team', description: '', startDate: '2025-01-01', endDate: '2025-01-07', venue: 'Secondary Stadium', status: 'active', currentParticipants: 60, maxParticipants: 120 },
  { id: 'sport-3', name: 'Volleyball', eventId: 'event-2', category: 'team', description: '', startDate: '2025-02-01', endDate: '2025-02-07', venue: 'Community Court', status: 'upcoming', currentParticipants: 30, maxParticipants: 90 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const payload = eventId ? sports.filter((sport) => sport.eventId === eventId) : sports;
  return NextResponse.json({ sports: payload });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const sport: Sport = {
    id: body.id ?? `sport-${Date.now()}`,
    name: body.name,
    eventId: body.eventId,
    category: body.category,    description: body.description ?? '',
    startDate: body.startDate ?? '',
    endDate: body.endDate ?? '',
    venue: body.venue ?? '',    currentParticipants: body.currentParticipants ?? 0,
    maxParticipants: body.maxParticipants,
    status: body.status ?? 'active',
  };
  sports = [sport, ...sports];
  return NextResponse.json({ sport }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  let updated: Sport | undefined;
  sports = sports.map((sp) => {
    if (sp.id === body.id) {
      updated = { ...sp, ...body } as Sport;
      return updated;
    }
    return sp;
  });

  if (!updated) {
    return NextResponse.json({ error: 'sport not found' }, { status: 404 });
  }

  return NextResponse.json({ sport: updated });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const before = sports.length;
  sports = sports.filter((sp) => sp.id !== body.id);

  if (before === sports.length) {
    return NextResponse.json({ error: 'sport not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
