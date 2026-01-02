"use client";

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard';
import { MedalsTable } from '@/components/medals';
import { Card, Button, Input, Select, Modal, ModalContent, ModalFooter } from '@/components/ui';
import type { Medal } from '@/types';
import { createMedal, updateMedal, deleteMedal } from '@/src/lib/api/medal.api';
import { validateMedal } from '@/src/lib/validation/medal.validators';

const medalOptions = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
];

export default function MedalsIndexPage() {
  const [medals, setMedals] = useState<Medal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/medals');
        const data = await res.json();
        setMedals(data.medals ?? []);
      } catch (err) {
        console.error('Failed to load medals', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return medals.filter((m) => {
      const matchesSearch = !search || (m.athleteName ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || m.medalType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [medals, search, typeFilter]);

  const [modalErrors, setModalErrors] = useState<string[]>([]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMedal(id);
      setMedals((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const [saving, setSaving] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selected, setSelected] = useState<Partial<Medal> | null>(null);

  const handleCreate = async (payload: Partial<Medal>) => {
    setModalErrors([]);
    const errors = validateMedal(payload as Medal);
    if (errors.length > 0) {
      setModalErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const data = await createMedal(payload as Medal) as any;
      // API returns { medal }
      const created = data.medal ?? data;
      setMedals((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      setModalErrors(['Failed to save medal. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (payload: Partial<Medal>) => {
    if (!selected) return;
    setModalErrors([]);
    const merged = { ...(selected as Medal), ...(payload as Partial<Medal>) } as Medal;
    const errors = validateMedal(merged as Medal);
    if (errors.length > 0) {
      setModalErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const data = await updateMedal((selected as Medal).id, merged as Partial<Medal>) as any;
      const updated = data.medal ?? data;
      setMedals((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setSelected(null);
    } catch (err) {
      console.error(err);
      setModalErrors(['Failed to update medal. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader title="Medals" subtitle="All medal awards" />

      <Card className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
          <div className="flex flex-wrap gap-3">
            <Input placeholder="Search athlete name..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={[{ value: 'all', label: 'All Medals' }, ...medalOptions]} />
          </div>
          <Button onClick={() => { setSelected({}); setIsCreateModalOpen(true); }}>Record Medal</Button>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="p-6 text-muted">Loading medals...</div>
        </Card>
      ) : (
        <MedalsTable medals={filtered} onEdit={(m) => setSelected(m)} onDelete={handleDelete} />
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setSelected(null); setModalErrors([]); }} title="Record Medal">
        <ModalContent className="space-y-4">
          {modalErrors.length > 0 && (
            <div className="text-sm text-red-600 space-y-1">
              {modalErrors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          )}
          <Input label="Athlete Name" value={selected?.athleteName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), athleteName: e.target.value }))} />
          <Input label="Athlete ID" value={selected?.athleteId ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), athleteId: e.target.value }))} />
          <Input label="Sport" value={selected?.sportName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), sportName: e.target.value }))} />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Input label="Province" value={selected?.province ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), province: e.target.value }))} />
          </div>
          <Select label="Medal Type" value={selected?.medalType ?? 'gold'} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), medalType: e.target.value as Medal['medalType'] }))} options={medalOptions} />
          <Input label="Awarded Date" type="date" value={selected?.awardedDate ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), awardedDate: e.target.value }))} />
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setSelected(null); setIsCreateModalOpen(false); setModalErrors([]); }}>Cancel</Button>
          <Button onClick={() => handleCreate(selected ?? {})} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </ModalFooter>
      </Modal>

      {selected && (
        <Modal isOpen={!!selected && !!selected.id} onClose={() => { setSelected(null); setModalErrors([]); }} title="Edit Medal">
          <ModalContent className="space-y-4">
            {modalErrors.length > 0 && (
              <div className="text-sm text-red-600 space-y-1">
                {modalErrors.map((err, i) => <div key={i}>• {err}</div>)}
              </div>
            )}
            <Input label="Athlete Name" value={selected?.athleteName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), athleteName: e.target.value }))} />
            <Input label="Athlete ID" value={selected?.athleteId ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), athleteId: e.target.value }))} />
            <Input label="Sport" value={selected?.sportName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), sportName: e.target.value }))} />
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Input label="Province" value={selected?.province ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), province: e.target.value }))} />
            </div>
            <Select label="Medal Type" value={selected?.medalType ?? 'gold'} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), medalType: e.target.value as Medal['medalType'] }))} options={medalOptions} />
            <Input label="Awarded Date" type="date" value={selected?.awardedDate ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), awardedDate: e.target.value }))} />
          </ModalContent>
          <ModalFooter>
            <Button variant="ghost" onClick={() => { setSelected(null); setModalErrors([]); }}>Cancel</Button>
            <Button onClick={() => handleEditSave(selected ?? {})} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </ModalFooter>
        </Modal>
      )}

    </div>
  );
}
