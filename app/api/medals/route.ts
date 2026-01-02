import { NextRequest, NextResponse } from 'next/server';
import type { Medal } from '@/types';

let medals: Medal[] = [
  {
    id: 'medal-1',
    event: 'event-1',
    athleteId: 'athlete-1',
    sportId: 'football',
    province: 'Phnom Penh',
    medalType: 'gold',
    athleteName: 'Sok Pisey',
    sportName: 'Football',
    awardedDate: '2025-01-20',
  },
  {
    id: 'medal-2',
    event: 'event-1',
    athleteId: 'athlete-2',
    sportId: 'football',
    province: 'Siem Reap',
    medalType: 'silver',
    athleteName: 'Chan Dara',
    sportName: 'Football',
    awardedDate: '2025-01-20',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const athleteId = searchParams.get('athleteId');

  const payload = medals.filter((medal) => {
    const matchEvent = eventId ? medal.event === eventId : true;
    const matchAthlete = athleteId ? medal.athleteId === athleteId : true;
    return matchEvent && matchAthlete;
  });

  return NextResponse.json({ medals: payload });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const medal: Medal = {
    id: body.id ?? `medal-${Date.now()}`,
    event: body.eventId ?? body.event,
    athleteId: body.athleteId,
    sportId: body.sportId,
    medalType: body.medalType,
    province: body.province,
    athleteName: body.athleteName,
    athleteNameKh: body.athleteNameKh,
    sportName: body.sportName,
    awardedDate: body.awardedDate,
  };
  medals = [medal, ...medals];
  return NextResponse.json({ medal }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  let updated: Medal | undefined;
  medals = medals.map((md) => {
    if (md.id === body.id) {
      updated = { ...md, ...body } as Medal;
      return updated;
    }
    return md;
  });

  if (!updated) {
    return NextResponse.json({ error: 'medal not found' }, { status: 404 });
  }

  return NextResponse.json({ medal: updated });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const before = medals.length;
  medals = medals.filter((md) => md.id !== body.id);

  if (before === medals.length) {
    return NextResponse.json({ error: 'medal not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
