'use client';

/**
 * Sports Page (Event-scoped)
 * Fetches sports from API and provides create/edit/delete UI
 */

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard';
import { SportsTable } from '@/components/sports';
import { Card, Button, Input, Select, Modal, ModalContent, ModalFooter } from '@/components/ui';
import type { Sport } from '@/types';
import { useSelectedEvent } from '@/src/hooks/useSelectedEvent';

type SportFormState = Partial<Sport> & { eventId?: string };

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

export default function SportsPage({ params }: { params: { eventId: string } }) {
  const eventId = params?.eventId ?? '';
  const { event: selectedEvent, loading: eventLoading } = useSelectedEvent(eventId);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState<SportFormState>({ status: 'active', eventId });
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/sports?eventId=${eventId}`);
        const data = await res.json();
        setSports(data.sports ?? []);
      } catch (err) {
        console.error('Failed to load sports', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const filtered = useMemo(() => {
    return sports.filter((sp) => {
      const matchesSearch = !search || sp.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (sp.status ?? 'active') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sports, search, statusFilter]);

  const resetForm = () => setForm({ status: 'active', eventId });

  const handleCreate = async () => {
    setSaving(true);
    try {
      const payload = { ...form, eventId };
      const res = await fetch('/api/sports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSports((prev) => [data.sport, ...prev]);
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create sport', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedSport) return;
    setSaving(true);
    try {
      const res = await fetch('/api/sports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedSport, ...form }),
      });
      const data = await res.json();
      setSports((prev) => prev.map((sp) => (sp.id === data.sport.id ? data.sport : sp)));
      setIsEditOpen(false);
      setSelectedSport(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update sport', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await fetch('/api/sports', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setSports((prev) => prev.filter((sp) => sp.id !== id));
    } catch (err) {
      console.error('Failed to delete sport', err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const openEdit = (sport: Sport) => {
    setSelectedSport(sport);
    setForm(sport);
    setIsEditOpen(true);
  };

  const isDeleting = (id: string) => deletingIds.has(id);

  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader 
        title="Sports"
        subtitle={selectedEvent ? `Sports · ${selectedEvent.name}` : 'Manage sports for this event'}
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
              placeholder="Search sports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: 'all', label: 'All Status' }, ...statusOptions]}
            />
          </div>
          <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>Add Sport</Button>
        </div>
      </Card>

      {loading ? (
        <p className="text-muted">Loading sports...</p>
      ) : (
        <SportsTable 
          sports={filtered}
          onEdit={openEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); resetForm(); }}
        title="Add Sport"
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <Input
            label="Sport Name"
            value={form.name ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Category"
            value={form.category ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Participants"
              type="number"
              value={form.currentParticipants?.toString() ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, currentParticipants: Number(e.target.value) }))}
            />
            <Input
              label="Max Participants"
              type="number"
              value={form.maxParticipants?.toString() ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, maxParticipants: Number(e.target.value) }))}
            />
          </div>
          <Select
            label="Status"
            value={form.status ?? 'active'}
            // onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Sport['status']})) }
            options={statusOptions}
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
        title="Edit Sport"
        subtitle={selectedSport?.name}
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <Input
            label="Sport Name"
            value={form.name ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="Category"
            value={form.category ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Participants"
              type="number"
              value={form.currentParticipants?.toString() ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, currentParticipants: Number(e.target.value) }))}
            />
            <Input
              label="Max Participants"
              type="number"
              value={form.maxParticipants?.toString() ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, maxParticipants: Number(e.target.value) }))}
            />
          </div>
          <Select
            label="Status"
            value={form.status ?? 'active'}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Sport['status'] }))}
            options={statusOptions}
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
