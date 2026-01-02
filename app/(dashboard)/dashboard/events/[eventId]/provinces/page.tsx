'use client';

/**
 * Provinces Page (Event-scoped)
 * Fetches fixed province list and allows filtering by search
 */

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard';
import { ProvincesTable } from '@/components/provinces';
import { Input, Card, CardHeader, CardContent } from '@/components/ui';
import type { Province } from '@/types';
import { useSelectedEvent } from '@/src/hooks/useSelectedEvent';

interface ProvinceStats extends Province {
  totalAthletes?: number;
  totalMedals?: number;
  goldMedals?: number;
  silverMedals?: number;
  bronzeMedals?: number;
  rank?: number;
}

export default function ProvincesPage() {
  const params = useParams();
  const rawEventId = params?.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : (rawEventId ?? '');
  const { event: selectedEvent, loading: eventLoading } = useSelectedEvent(eventId || undefined);
  const [provinces, setProvinces] = useState<ProvinceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/provinces');
        const data = await res.json();
        setProvinces(data.provinces ?? []);
      } catch (err) {
        console.error('Failed to load provinces', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return provinces.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [provinces, search]);

  const rankedProvinces = useMemo(() => {
    return filtered.map((province, index) => ({ ...province, rank: index + 1 }));
  }, [filtered]);

  return (
    <div className="dashboard-content flex flex-col gap-4">
      <DashboardHeader 
        title="Provinces"
        subtitle={selectedEvent ? `Provinces · ${selectedEvent.name}` : 'Province rankings and statistics'}
      />
      {selectedEvent && !eventLoading && (
        <div className="event-breadcrumb px-1">
          <span className="event-pill">{selectedEvent.name}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div>
            <h3 className="text-lg font-semibold">Filters</h3>
            <p className="text-muted text-sm">Dataset fixed to Cambodia&apos;s 25 provinces.</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="min-w-60 flex-1">
              <Input
                placeholder="Search provinces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent>
            <p className="text-muted">Loading provinces...</p>
          </CardContent>
        </Card>
      ) : (
        <ProvincesTable provinces={rankedProvinces} />
      )}
    </div>
  );
}
