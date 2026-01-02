import { NextResponse } from 'next/server';
import { dashboardMeta } from '@/lib/data/loaders/dataLoader';

export async function GET() {
  return NextResponse.json({ meta: dashboardMeta });
}
