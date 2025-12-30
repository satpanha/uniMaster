"use client";

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard';
import { AthletesTable } from '@/components/athletes';
import { Card, Button, Input, Modal, ModalContent, ModalFooter } from '@/components/ui';
import type { Athlete } from '@/types';

export default function EventAthletesPage({ params }: { params: { eventId: string } }) {
  const eventId = params?.eventId ?? '';
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Partial<Athlete> | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const isDeleting = (id: string) => deletingIds.has(id);

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await fetch('/api/athletes', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
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

  const handleCreate = async (payload: Partial<Athlete>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/athletes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, eventId: params.eventId }) });
      const data = await res.json();
      setAthletes((prev) => [data.athlete, ...prev]);
      setIsCreateOpen(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader title="Athletes" subtitle="Athletes for this event" />

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
        <AthletesTable athletes={athletes} loading={loading} onView={(a) => { setSelected(a); setIsViewOpen(true); }} onEdit={(a) => { setSelected(a); setIsCreateOpen(true); }} onDelete={(id) => handleDelete(id)} isDeleting={(id) => isDeleting(id)} />
      )}

      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); setSelected(null); }} title="Register Athlete">
        <ModalContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="First Name" value={selected?.firstName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), firstName: e.target.value }))} />
            <Input label="Last Name" value={selected?.lastName ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), lastName: e.target.value }))} />
            <Input label="Email" value={selected?.email ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), email: e.target.value }))} />
            <Input label="Phone" value={selected?.phone ?? ''} onChange={(e) => setSelected((s) => ({ ...(s ?? {}), phone: e.target.value }))} />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => { setSelected(null); setIsCreateOpen(false); }}>Cancel</Button>
          <Button onClick={() => handleCreate(selected ?? {})} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
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
