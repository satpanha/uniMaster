"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard';
import { AthletesTable } from '@/components/athletes';
import { Card, Button, Input, Modal, ModalContent, ModalFooter } from '@/components/ui';
import type { Athlete } from '@/types';
import { createAthlete, updateAthlete, deleteAthlete } from '@/src/lib/api/athlete.api';
import { validateAthlete } from '@/src/lib/validation/athlete.validators';
import { useSelectedEvent } from '@/src/hooks/useSelectedEvent';

export default function EventAthletesPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params?.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : (rawEventId ?? '');
  const { event: selectedEvent, loading: eventLoading } = useSelectedEvent(eventId || undefined);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<Partial<Athlete> | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [modalErrors, setModalErrors] = useState<string[]>([]);


  const isDeleting = (id: string) => deletingIds.has(id);

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await deleteAthlete(id);
      setAthletes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      // Optionally set a user-facing error state here
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/athletes?eventId=${eventId}`);
        const data = await res.json();
        setAthletes(data.athletes ?? []);
      } catch (err) {
        console.error('Failed to load athletes', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const handleEditSave = async (payload: Partial<Athlete>) => {
    if (!selected || !(selected as Athlete).id) return;
    setModalErrors([]);
    const merged = { ...(selected as Athlete), ...(payload ?? {}) } as Athlete;
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

  const handleCreate = async (payload: Partial<Athlete>) => {
    setModalErrors([]);
    const merged = { ...(payload ?? {}), eventId } as Athlete;
    const errors = validateAthlete(merged);
    if (errors.length > 0) {
      setModalErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const data = await createAthlete(merged as Athlete) as any;
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



  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader title="Athletes" subtitle={selectedEvent ? `Athletes · ${selectedEvent.name}` : 'Athletes for this event'} />
      {selectedEvent && !eventLoading && (
        <div className="event-breadcrumb px-1">
          <span className="event-pill">{selectedEvent.name}</span>
        </div>
      )}

      <Card>
        <div className="p-4 flex items-center justify-between">
          <Input placeholder="Search athletes..." />
          <Button onClick={() => { setSelected({}); setIsCreateOpen(true); }}>Register Athlete</Button>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="p-6 text-muted">Loading athletes...</div>
        </Card>
      ) : (
        <AthletesTable athletes={athletes} loading={loading} onView={(a) => { setSelected(a); setIsViewOpen(true); }} onEdit={(a) => { setSelected(a); setIsEditOpen(true); }} onDelete={(id) => handleDelete(id)} isDeleting={(id) => isDeleting(id)} />
      )}

      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setSelected(null); setModalErrors([]); }} title="Register Athlete">
        <ModalContent className="space-y-4">
          {modalErrors.length > 0 && (
            <div className="text-sm text-red-600 space-y-1">
              {modalErrors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="First Name" value={selected?.firstName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), firstName: e.target.value }))} />
            <Input label="Last Name" value={selected?.lastName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), lastName: e.target.value }))} />
            <Input label="Email" value={selected?.email ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), email: e.target.value }))} />
            <Input label="Phone" value={selected?.phone ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), phone: e.target.value }))} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="First Name" value={selected?.firstName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), firstName: e.target.value }))} />
            <Input label="Last Name" value={selected?.lastName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), lastName: e.target.value }))} />
            <Input label="Email" value={selected?.email ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), email: e.target.value }))} />
            <Input label="Phone" value={selected?.phone ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), phone: e.target.value }))} />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setSelected(null); setIsEditOpen(false); setModalErrors([]); }}>Cancel</Button>
          <Button onClick={() => handleEditSave(selected ?? {})} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={!!selected && isViewOpen} onClose={() => { setSelected(null); setIsViewOpen(false); }} title="Athlete Details">
        <ModalContent>
          <div className="space-y-2 text-sm">
            <div><strong>Name:</strong> {selected?.firstName} {selected?.lastName}</div>
            <div><strong>Email:</strong> {selected?.email ?? 'N/A'}</div>
            <div><strong>Phone:</strong> {selected?.phone ?? 'N/A'}</div>
            <div><strong>Province:</strong> {selected?.province ?? 'N/A'}</div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button onClick={() => { setSelected(null); setIsViewOpen(false); }}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
