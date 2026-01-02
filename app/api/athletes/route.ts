import { NextRequest, NextResponse } from 'next/server';
import type { Athlete } from '@/types';

const seedAthletes: Athlete[] = [
  {
    id: 'athlete-1',
    eventId: 'event-1',
    sportId: 'football',
    name: 'Sok Pisey',
    firstName: 'Sok',
    lastName: 'Pisey',
    email: 'pisey@example.com',
    phone: '012345678',
    province: 'Phnom Penh',
    sports: ['Football'],
    status: 'approved',
    registeredAt: new Date().toISOString(),
    dateOfBirth: '1990-01-01',
    gender: 'male',
    registrationDate: new Date().toISOString(),
  },
  {
    id: 'athlete-2',
    eventId: 'event-1',
    sportId: 'football',
    name: 'Chan Dara',
    firstName: 'Chan',
    lastName: 'Dara',
    email: 'dara@example.com',
    phone: '099888777',
    province: 'Siem Reap',
    sports: ['Football'],
    status: 'pending',
    registeredAt: new Date().toISOString(),
    dateOfBirth: '1992-02-02',
    gender: 'female',
    registrationDate: new Date().toISOString(),
  },
  {
    id: 'athlete-3',
    eventId: 'event-1',
    sportId: 'basketball',
    name: 'Meas Sokha',
    firstName: 'Meas',
    lastName: 'Sokha',
    email: 'sokha@example.com',
    phone: '088777666',
    province: 'Battambang',
    sports: ['Basketball'],
    status: 'approved',
    registeredAt: new Date().toISOString(),
    dateOfBirth: '1995-03-03',
    gender: 'male',
    registrationDate: new Date().toISOString(),
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const sportId = searchParams.get('sportId');

  const filtered = seedAthletes.filter((athlete) => {
    const matchEvent = eventId ? athlete.eventId === eventId : true;
    const matchSport = sportId ? athlete.sportId === sportId : true;
    return matchEvent && matchSport;
  });

  return NextResponse.json({ athletes: filtered });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const athlete: Athlete = {
    id: body.id ?? `athlete-${Date.now()}`,
    name: body.name ?? `${body.firstName ?? ''} ${body.lastName ?? ''}`.trim(),
    ...body,
  };
  return NextResponse.json({ athlete }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }
  const athlete: Athlete = { ...body };
  return NextResponse.json({ athlete });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
