'use client';

/**
 * Athletes Page (Sport-scoped)
 * Connects to API, wires filters, CRUD modals, and CSV export
 */

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader, QuickActions } from '@/components/dashboard';
import { AthletesFilters, AthletesTable } from '@/components/athletes';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button, Card } from '@/components/ui';
import { exportAthletesToCsv } from '@/lib/export';
import type { Athlete, Province } from '@/types';

type FilterState = {
  search: string;
  status: string;
  province: string;
};

type AthleteFormState = Partial<Athlete> & { eventId?: string; sportId?: string };

const provinces: Province[] = [
  { id: 'pp',  name: 'Phnom Penh', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'sr', name: 'Siem Reap', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'btb', name: 'Battambang', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
  { id: 'kch', name: 'Kampong Cham', athleteCount: 0, medals: { gold: 0, silver: 0, bronze: 0, total: 0 } },
];

const statusOptions = [
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AthletesPage({
  params,
}: {
  params: { eventId: string; sportId: string };
}) {
  const eventId = params?.eventId ?? '';
  const sportId = params?.sportId ?? '';
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({ search: '', status: 'all', province: 'all' });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [form, setForm] = useState<AthleteFormState>({
    status: 'pending',
    sports: [sportId],
    eventId,
    sportId,
  });
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/athletes?eventId=${eventId}&sportId=${sportId}`);
        const data = await res.json();
        setAthletes(data.athletes ?? []);
      } catch (err) {
        console.error('Failed to load athletes', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId, sportId]);

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const searchTerm = filters.search.toLowerCase();
      const name = `${athlete.firstName ?? ''} ${athlete.lastName ?? ''}`.toLowerCase();
      const email = (athlete.email ?? '').toLowerCase();
      const matchesSearch = !searchTerm || name.includes(searchTerm) || email.includes(searchTerm);
      const matchesStatus = filters.status === 'all' || (athlete.status ?? 'pending') === filters.status;
      const provinceLabel = athlete.province ?? '';
      const matchesProvince = filters.province === 'all' || provinceLabel === filters.province;
      return matchesSearch && matchesStatus && matchesProvince;
    });
  }, [athletes, filters]);

  const resetForm = () => {
    setForm({
      status: 'pending',
      sports: [sportId],
      eventId,
      sportId,
    });
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        eventId,
        sportId,
        sports: form.sports ?? [sportId],
        name: (form.firstName || form.lastName) ? `${form.firstName ?? ''} ${form.lastName ?? ''}`.trim() : undefined,
      };
      const res = await fetch('/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setAthletes((prev) => [data.athlete, ...prev]);
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create athlete', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedAthlete) return;
    setSaving(true);
    try {
      const payload = { ...selectedAthlete, ...form };
      const res = await fetch('/api/athletes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setAthletes((prev) => prev.map((ath) => (ath.id === data.athlete.id ? data.athlete : ath)));
      setIsEditOpen(false);
      setSelectedAthlete(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update athlete', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await fetch('/api/athletes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setAthletes((prev) => prev.filter((ath) => ath.id !== id));
    } catch (err) {
      console.error('Failed to delete athlete', err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleExport = () => {
    const csv = exportAthletesToCsv(filteredAthletes);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `athletes-${eventId}-${sportId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isDeleting = (id: string) => deletingIds.has(id);

  const openEdit = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setForm({ ...athlete });
    setIsEditOpen(true);
  };

  const openView = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setIsViewOpen(true);
  };

  return (
    <div className="dashboard-content space-y-6">
      <DashboardHeader
        title="Athletes"
        subtitle="Registered athletes for this sport"
      />

      <Card>
        <div className="card-body space-y-4">
          <QuickActions
            onRegisterAthlete={() => { resetForm(); setIsCreateOpen(true); }}
            onExportData={handleExport}
          />

          <AthletesFilters
            filterState={filters}
            onSearchChange={(value) => handleFilterChange('search', value)}
            onFilterChange={(key, value) => handleFilterChange(key as keyof FilterState, value)}
            provinces={provinces}
          />
        </div>
      </Card>

      <AthletesTable
        athletes={filteredAthletes}
        loading={loading}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); resetForm(); }}
        title="Register Athlete"
        subtitle="Add a new athlete to this sport"
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              required
            />
            <Input
              label="Last Name"
              value={form.lastName ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              required
            />
            <Input
              label="Email"
              value={form.email ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              type="email"
            />
            <Input
              label="Phone"
              value={form.phone ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <Select
              label="Province"
              value={form.province ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
              options={provinces.map((p) => ({ value: p.name, label: p.name }))}
              required
            />
            <Select
              label="Status"
              value={form.status ?? 'pending'}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Athlete['status'] }))}
              options={statusOptions}
            />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Athlete"
        subtitle={selectedAthlete ? `${selectedAthlete.firstName ?? ''} ${selectedAthlete.lastName ?? ''}`.trim() : undefined}
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            />
            <Input
              label="Last Name"
              value={form.lastName ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            />
            <Input
              label="Email"
              value={form.email ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              type="email"
            />
            <Input
              label="Phone"
              value={form.phone ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <Select
              label="Province"
              value={form.province ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
              options={provinces.map((p) => ({ value: p.name, label: p.name }))}
            />
            <Select
              label="Status"
              value={form.status ?? 'pending'}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Athlete['status'] }))}
              options={statusOptions}
            />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEdit} disabled={saving}>
            {saving ? 'Updating...' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Athlete Details"
        subtitle={selectedAthlete ? `${selectedAthlete.firstName ?? ''} ${selectedAthlete.lastName ?? ''}`.trim() : undefined}
        maxWidth="md"
      >
        <ModalContent className="space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><strong>Name:</strong> {selectedAthlete?.firstName} {selectedAthlete?.lastName}</div>
            <div><strong>Email:</strong> {selectedAthlete?.email ?? 'N/A'}</div>
            <div><strong>Phone:</strong> {selectedAthlete?.phone ?? 'N/A'}</div>
            <div><strong>Province:</strong> {selectedAthlete?.province ?? 'N/A'}</div>
            <div><strong>Status:</strong> {selectedAthlete?.status ?? 'pending'}</div>
            <div><strong>Sports:</strong> {selectedAthlete?.sports?.join(', ') ?? 'N/A'}</div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button onClick={() => setIsViewOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
