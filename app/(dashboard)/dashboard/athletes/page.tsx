"use client";

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard';
import { AthletesFilters, AthletesTable } from '@/components/athletes';
import { Card, Button, Input, Select, Modal, ModalContent, ModalFooter } from '@/components/ui';
import type { Athlete, Province } from '@/types';
import { createAthlete, updateAthlete, deleteAthlete } from '@/src/lib/api/athlete.api';
import { validateAthlete } from '@/src/lib/validation/athlete.validators';

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<Partial<Athlete> | null>(null);
  const [filters, setFilters] = useState({ search: '', status: 'all', province: 'all' });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const isDeleting = (id: string) => deletingIds.has(id);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [aRes, pRes] = await Promise.all([fetch('/api/athletes'), fetch('/api/provinces')]);
        const aData = await aRes.json();
        const pData = await pRes.json();
        setAthletes(aData.athletes ?? []);
        setProvinces(pData.provinces ?? []);
      } catch (err) {
        console.error('Failed to load athletes or provinces', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    const term = filters.search.toLowerCase();
    return athletes.filter((a) => {
      const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.toLowerCase();
      const matchesSearch = !term || name.includes(term) || (a.email ?? '').toLowerCase().includes(term);
      const matchesStatus = filters.status === 'all' || (a.status ?? 'pending') === filters.status;
      const matchesProvince = filters.province === 'all' || (a.province ?? '') === filters.province;
      return matchesSearch && matchesStatus && matchesProvince;
    });
  }, [athletes, filters]);

  // Detect duplicate athletes by email (simple heuristic)
  const duplicateGroups = useMemo(() => {
    const byEmail: Record<string, Athlete[]> = {};
    athletes.forEach((a) => {
      const key = (a.email ?? '').toLowerCase();
      if (!key) return;
      byEmail[key] = byEmail[key] || [];
      byEmail[key].push(a);
    });
    return Object.values(byEmail).filter((grp) => grp.length > 1);
  }, [athletes]);

  const [isDuplicatesOpen, setIsDuplicatesOpen] = useState(false);
  const [selectedDupGroup, setSelectedDupGroup] = useState<Athlete[] | null>(null);

  const [modalErrors, setModalErrors] = useState<string[]>([]);

  const handleMergeDuplicates = async (group: Athlete[]) => {
    if (group.length < 2) return;
    // keep first, delete rest
    const keep = group[0];
    const toDelete = group.slice(1);
    try {
      await Promise.all(toDelete.map((t) => deleteAthlete(t.id)));
      setAthletes((prev) => prev.filter((a) => !toDelete.some((t) => t.id === a.id)));
      setIsDuplicatesOpen(false);
      setSelectedDupGroup(null);
    } catch (err) {
      console.error('Failed to merge duplicates', err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await deleteAthlete(id);
      setAthletes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const [saving, setSaving] = useState(false);

  const handleCreate = async (payload: Partial<Athlete>) => {
    setModalErrors([]);
    const errors = validateAthlete(payload as Athlete);
    if (errors.length > 0) {
      setModalErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const data = await createAthlete(payload as Athlete) as any;
      const created = data.athlete ?? data;
      setAthletes((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      setSelected(null);
    } catch (err) {
      console.error('Failed to create athlete', err);
      setModalErrors(['Failed to create athlete. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (payload: Partial<Athlete>) => {
    if (!selected) return;
    setModalErrors([]);
    const merged = { ...(selected as Athlete), ...(payload as Partial<Athlete>) } as Athlete;
    const errors = validateAthlete(merged);
    if (errors.length > 0) {
      setModalErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const data = await updateAthlete((selected as Athlete).id, merged as Partial<Athlete>) as any;
      const updated = data.athlete ?? data;
      setAthletes((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setIsEditOpen(false);
      setSelected(null);
    } catch (err) {
      console.error('Failed to update athlete', err);
      setModalErrors(['Failed to update athlete. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader title="Athletes" subtitle="All athletes" />

      <AthletesFilters
        filterState={filters}
        onSearchChange={(value) => setFilters((s) => ({ ...s, search: value }))}
        onFilterChange={(key, value) => setFilters((s) => ({ ...s, [key]: value }))}
        provinces={provinces}
      />

      {duplicateGroups.length > 0 && (
        <Card>
          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold">Duplicate athletes detected</div>
              <div className="text-sm text-muted">{duplicateGroups.length} groups of potential duplicates found. Review and merge to clean data.</div>
            </div>
            <div>
              <Button onClick={() => { setSelectedDupGroup(duplicateGroups[0]); setIsDuplicatesOpen(true); }}>Review duplicates</Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex gap-3 items-center flex-1">
            <Input placeholder="Search athletes..." value={filters.search} onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))} />
          </div>
          <div>
            <Button onClick={() => { setSelected({} as Partial<Athlete>); setIsCreateOpen(true); }}>Register Athlete</Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="p-6 text-muted">Loading athletes...</div>
        </Card>
      ) : (
        <AthletesTable
          athletes={filtered}
          loading={loading}
          onView={(a) => { setSelected(a); setIsViewOpen(true); }}
          onEdit={(a) => { setSelected(a); setIsEditOpen(true); }}
          onDelete={(id) => handleDelete(id)}
          isDeleting={(id) => isDeleting(id)}
        />
      )}

      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setSelected(null); setModalErrors([]); }} title="Register Athlete">
        <ModalContent className="space-y-4">
          {modalErrors.length > 0 && (
            <div className="text-sm text-red-600 space-y-1">
              {modalErrors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" value={selected?.firstName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), firstName: e.target.value }))} />
            <Input label="Last Name" value={selected?.lastName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), lastName: e.target.value }))} />
            <Input label="Email" value={selected?.email ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), email: e.target.value }))} />
            <Input label="Phone" value={selected?.phone ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), phone: e.target.value }))} />
            <Select label="Province" value={selected?.province ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), province: e.target.value } as Partial<Athlete>))} options={[{ value: 'all', label: 'Select Province' }, ...provinces.map((p) => ({ value: p.name, label: p.name }))]} />
            <Select label="Status" value={selected?.status ?? 'pending'} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), status: e.target.value as Athlete['status'] } as Partial<Athlete>))} options={[{ value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]} />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setSelected(null); setIsCreateOpen(false); setModalErrors([]); }}>Cancel</Button>
          <Button onClick={() => handleCreate(selected ?? {})} disabled={saving}>{saving ? 'Saving...' : 'Create'}</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={!!selected && isEditOpen} onClose={() => { setSelected(null); setIsEditOpen(false); setModalErrors([]); }} title="Edit Athlete">
        <ModalContent className="space-y-4">
          {modalErrors.length > 0 && (
            <div className="text-sm text-red-600 space-y-1">
              {modalErrors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" value={selected?.firstName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), firstName: e.target.value }))} />
            <Input label="Last Name" value={selected?.lastName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), lastName: e.target.value }))} />
            <Input label="Email" value={selected?.email ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), email: e.target.value }))} />
            <Input label="Phone" value={selected?.phone ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), phone: e.target.value }))} />
            <Select label="Province" value={selected?.province ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), province: e.target.value } as Partial<Athlete>))} options={[{ value: 'all', label: 'Select Province' }, ...provinces.map((p) => ({ value: p.name, label: p.name }))]} />
            <Select label="Status" value={selected?.status ?? 'pending'} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), status: e.target.value as Athlete['status'] } as Partial<Athlete>))} options={[{ value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]} />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setSelected(null); setIsEditOpen(false); setModalErrors([]); }}>Cancel</Button>
          <Button onClick={() => handleEditSave(selected ?? {})} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={!!selected && isViewOpen} onClose={() => { setSelected(null); setIsViewOpen(false); }} title="Athlete Details">
        <ModalContent>
          <div className="space-y-2">
            <div><strong>Name:</strong> {selected?.firstName} {selected?.lastName}</div>
            <div><strong>Email:</strong> {selected?.email ?? 'N/A'}</div>
            <div><strong>Phone:</strong> {selected?.phone ?? 'N/A'}</div>
            <div><strong>Province:</strong> {selected?.province ?? 'N/A'}</div>
            <div><strong>Sports:</strong> {selected?.sports?.join(', ') ?? 'N/A'}</div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button onClick={() => { setSelected(null); setIsViewOpen(false); }}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Duplicate review modal */}
      <Modal isOpen={isDuplicatesOpen} onClose={() => { setIsDuplicatesOpen(false); setSelectedDupGroup(null); }} title="Review Duplicate Athletes">
        <ModalContent>
          <div className="space-y-4">
            {selectedDupGroup?.map((a) => (
              <div key={a.id} className="p-3 border rounded-md">
                <div className="font-medium">{a.firstName} {a.lastName}</div>
                <div className="text-sm text-muted">{a.email} · {a.phone}</div>
              </div>
            ))}
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setIsDuplicatesOpen(false); setSelectedDupGroup(null); }}>Close</Button>
          <Button onClick={() => selectedDupGroup && handleMergeDuplicates(selectedDupGroup)}>Merge (keep first)</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
