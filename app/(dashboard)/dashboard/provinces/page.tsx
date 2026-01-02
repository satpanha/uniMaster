"use client";

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard';
import { ProvincesTable } from '@/components/provinces';
import { Card, Input, Button, Modal, ModalContent, ModalFooter } from '@/components/ui';
import type { Province } from '@/types';

export default function ProvincesIndexPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
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

  const filtered = useMemo(() => provinces.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [provinces, search]);

  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader title="Provinces" subtitle="All provinces" />

      <Card>
        <div className="p-4">
          <Input placeholder="Search provinces..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      <Card>
        <div className="p-4 text-sm text-muted">
          The provinces list is a fixed set of administrative regions (25 provinces). Editing or adding provinces is not supported in this demo.
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="p-6 text-muted">Loading provinces...</div>
        </Card>
      ) : (
        <ProvincesTable provinces={filtered.map((p, i) => ({ ...p, rank: i + 1 }))} />
      )}

    </div>
  );
}
