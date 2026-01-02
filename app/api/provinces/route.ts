import { NextRequest, NextResponse } from 'next/server';
import type { Province } from '@/types';

const provinces: Province[] = [
  { id: 'pp', name: 'Phnom Penh', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'bm', name: 'Banteay Meanchey', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'btb', name: 'Battambang', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kch', name: 'Kampong Cham', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kcg', name: 'Kampong Chhnang', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kps', name: 'Kampong Speu', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kpt', name: 'Kampong Thom', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kmt', name: 'Kampot', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kdl', name: 'Kandal', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kep', name: 'Kep', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kk', name: 'Koh Kong', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'krt', name: 'Kratie', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'mdk', name: 'Mondulkiri', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'omc', name: 'Oddar Meanchey', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'pl', name: 'Pailin', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'pvh', name: 'Preah Vihear', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'pvg', name: 'Prey Veng', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'pst', name: 'Pursat', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'rtk', name: 'Ratanakiri', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'sr', name: 'Siem Reap', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'shk', name: 'Preah Sihanouk', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'stg', name: 'Stung Treng', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'svg', name: 'Svay Rieng', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'tko', name: 'Takeo', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'tbk', name: 'Tbong Khmum', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
];

export async function GET() {
  return NextResponse.json({ provinces });
}

export async function POST() {
  return NextResponse.json({ error: 'Provinces list is fixed (25 provinces for Cambodia).' }, { status: 405 });
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }
  return NextResponse.json({ error: 'Provinces list is fixed (25 provinces for Cambodia).' }, { status: 405 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }
  return NextResponse.json({ error: 'Provinces list is fixed (25 provinces for Cambodia).' }, { status: 405 });
}
