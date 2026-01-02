import { NextResponse } from 'next/server';
import { dashboardStats } from '@/lib/data/loaders/dataLoader';

export async function GET() {
  // Return computed dashboard stats (derived from other mock datasets)
  return NextResponse.json({ stats: dashboardStats });
}
