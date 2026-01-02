'use client';

/**
 * Medals Page (Event-scoped)
 * Fetches medals from API and provides create/edit/delete UI
 */

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard';
import { MedalsTable } from '@/components/medals';
import { Card, Button, Input, Select, Modal, ModalContent, ModalFooter } from '@/components/ui';
import type { Medal } from '@/types';
import { useSelectedEvent } from '@/src/hooks/useSelectedEvent';

type MedalFormState = Partial<Medal> & { eventId?: string };

const medalOptions = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
];

export default function MedalsPage({ params }: { params: { eventId: string } }) {
  const eventId = params?.eventId ?? '';
  const { event: selectedEvent, loading: eventLoading } = useSelectedEvent(eventId);
  const [medals, setMedals] = useState<Medal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState<MedalFormState>({ medalType: 'gold', eventId });
  const [selected, setSelected] = useState<Medal | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
const res = await fetch(`/api/medals?eventId=${eventId}`);
    const data = await res.json();
    setMedals(data.medals ?? []);
  } catch (err) {
    console.error('Failed to load medals', err);
  } finally {
    setLoading(false);
  }
};
load();
}, [eventId]);

  const filtered = useMemo(() => {
    return medals.filter((md) => {
      const matchesSearch = !search || (md.athleteName ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || md.medalType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [medals, search, typeFilter]);

  const resetForm = () => setForm({ medalType: 'gold', eventId });

  const handleCreate = async () => {
    setSaving(true);
    try {
      const payload = { ...form, eventId };
      const res = await fetch('/api/medals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMedals((prev) => [data.medal, ...prev]);
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create medal', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch('/api/medals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selected, ...form }),
      });
      const data = await res.json();
      setMedals((prev) => prev.map((md) => (md.id === data.medal.id ? data.medal : md)));
      setIsEditOpen(false);
      setSelected(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update medal', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await fetch('/api/medals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setMedals((prev) => prev.filter((md) => md.id !== id));
    } catch (err) {
      console.error('Failed to delete medal', err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const openEdit = (medal: Medal) => {
    setSelected(medal);
    setForm(medal);
    setIsEditOpen(true);
  };

  const isDeleting = (id: string) => deletingIds.has(id);

  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader 
        title="Medals"
        subtitle={selectedEvent ? `Medals · ${selectedEvent.name}` : 'Medal awards for this event'}
      />
      {selectedEvent && !eventLoading && (
        <div className="event-breadcrumb px-1">
          <span className="event-pill">{selectedEvent.name}</span>
        </div>
      )}

      <Card className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search athlete name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[{ value: 'all', label: 'All Medals' }, ...medalOptions]}
            />
          </div>
          <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>Record Medal</Button>
        </div>
      </Card>

      {loading ? (
        <p className="text-muted">Loading medals...</p>
      ) : (
        <MedalsTable 
          medals={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
          loading={loading}
          isDeleting={isDeleting}
        />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); resetForm(); }}
        title="Record Medal"
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <Input
            label="Athlete Name"
            value={form.athleteName ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, athleteName: e.target.value }))}
            required
          />
          <Input
            label="Athlete ID"
            value={form.athleteId ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, athleteId: e.target.value }))}
            required
          />
          <Input
            label="Sport"
            value={form.sportName ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, sportName: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Input
              label="Province"
              value={form.province ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
            />
          </div>
          <Select
            label="Medal Type"
            value={form.medalType ?? 'gold'}
            onChange={(e) => setForm((prev) => ({ ...prev, medalType: e.target.value as Medal['medalType'] }))}
            options={medalOptions}
          />
          <Input
            label="Awarded Date"
            type="date"
            value={form.awardedDate ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, awardedDate: e.target.value }))}
          />
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setIsCreateOpen(false); resetForm(); }}>Cancel</Button>
          <Button onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Medal"
        subtitle={selected?.athleteName}
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <Input
            label="Athlete Name"
            value={form.athleteName ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, athleteName: e.target.value }))}
          />
          <Input
            label="Athlete ID"
            value={form.athleteId ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, athleteId: e.target.value }))}
          />
          <Input
            label="Sport"
            value={form.sportName ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, sportName: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Input
              label="Province"
              value={form.province ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
            />
          </div>
          <Select
            label="Medal Type"
            value={form.medalType ?? 'gold'}
            onChange={(e) => setForm((prev) => ({ ...prev, medalType: e.target.value as Medal['medalType'] }))}
            options={medalOptions}
          />
          <Input
            label="Awarded Date"
            type="date"
            value={form.awardedDate ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, awardedDate: e.target.value }))}
          />
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} disabled={saving}>{saving ? 'Updating...' : 'Update'}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
