'use client';

/**
 * Events List Page
 * Fetches events from API and provides create/edit/delete UI
 */

import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardHeader, CardContent, Button, Input, Select, Modal, ModalContent, ModalFooter, Badge } from '@/components/ui';
import { ArrowLink } from '@/components/ui/ArrowLink';
import type { Event } from '@/types';

type EventFormState = Partial<Event>;
type EventFormStateExtended = EventFormState & { sports?: string[] };

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState<EventFormStateExtended>({ status: 'upcoming', sports: [] });
  const [allSports, setAllSports] = useState<{ id: string; name: string; category?: string }[]>([]);
  const [sportCategory, setSportCategory] = useState<string | null>(null);
  const [newSportName, setNewSportName] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data.events ?? []);
        // load sports for picker
        const sres = await fetch('/api/sports');
        const sdata = await sres.json();
        setAllSports(sdata.sports ?? []);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch = !search || evt.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (evt.status ?? 'upcoming') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const resetForm = () => setForm({ status: 'upcoming' });

  const sportCategories = Array.from(new Set(allSports.map((s) => s.category).filter(Boolean))).sort();
  const sportsInCategory = allSports.filter((s) => (sportCategory ? s.category === sportCategory : true));

  const toggleAddSport = (sportName: string) => {
    setForm((prev) => ({ ...(prev ?? {}), sports: Array.from(new Set([...(prev?.sports ?? []), sportName])) } as EventFormStateExtended));
  };

  const removeSport = (sportName: string) => {
    setForm((prev) => ({ ...(prev ?? {}), sports: (prev?.sports ?? []).filter((s) => s !== sportName) } as EventFormStateExtended));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      const createdEvent = data.event;
      // create selected sports for this event
      if (form.sports && form.sports.length) {
        await Promise.all(form.sports.map((sname) => fetch('/api/sports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: sname, eventId: createdEvent.id }) })));
      }
      setEvents((prev) => [createdEvent, ...prev]);
      setIsCreateOpen(false);
      resetForm();
      setForm((prev) => ({ ...(prev ?? {}), sports: [] } as EventFormStateExtended));
    } catch (err) {
      console.error('Failed to create event', err);
    } finally {
      setSaving(false);
    }
  };

  // (function moved earlier to include sport creation)

  const handleEdit = async () => {
    if (!selectedEvent) return;
    setSaving(true);
    try {
      const payload = { ...selectedEvent, ...form };
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setEvents((prev) => prev.map((evt) => (evt.id === data.event.id ? data.event : evt)));
      setIsEditOpen(false);
      setSelectedEvent(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update event', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
    } catch (err) {
      console.error('Failed to delete event', err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const openEdit = (evt: Event) => {
    setSelectedEvent(evt);
    setForm(evt);
    setIsEditOpen(true);
  };

  return (
    <div className="dashboard-content space-y-4">
      <DashboardHeader 
        title="Events"
        subtitle="All sport competition events"
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">Showing <strong>{events.length}</strong> events</div>
        <div className="text-sm text-muted">Tip: click "Create Event" to add a new event and assign sports</div>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: 'all', label: 'All Status' }, ...statusOptions]}
            />
          </div>
          <Button onClick={() => { resetForm(); setIsCreateOpen(true); }}>Create Event</Button>
        </div>
      </Card>

      {loading ? (
        <p className="text-muted">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((event) => (
            <Card key={event.id} padding="md">
              <CardHeader
                action={
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(event)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)} disabled={deletingIds.has(event.id)}>
                      {deletingIds.has(event.id) ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                }
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-base font-semibold mb-0">{event.name}</h3>
                    <div className="mt-1">
                      <Badge variant={event.status === 'active' ? 'success' : event.status === 'upcoming' ? 'warning' : 'info'}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-muted text-sm mb-3">
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </div>

                <ArrowLink href={`/dashboard/events/${event.id}`} className="text-primary">
                  Open dashboard
                </ArrowLink>
              </CardContent>
            </Card>
          ))} 
          {filtered.length === 0 && (
            <Card className="text-muted-foreground text-center p-6">No events found</Card>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); resetForm(); }}
        title="Create Event"
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <Input
            label="Event Name"
            value={form.name ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
          <Select
            label="Status"
            value={form.status ?? 'upcoming'}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
          />
          {/* Sports picker */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Sports</label>
            <div className="flex gap-2 items-center">
              <Select
                value={sportCategory ?? ''}
                onChange={(e) => setSportCategory(e.target.value || null)}
                options={[{ value: '', label: 'All Categories' }, ...sportCategories.map((c) => ({ value: c as string, label: c as string }))]}
              />
              <input className="form-input w-56" placeholder="Add new sport name" value={newSportName} onChange={(e) => setNewSportName(e.target.value)} />
              <Button onClick={() => { if (newSportName.trim()) { toggleAddSport(newSportName.trim()); setNewSportName(''); } }}>Add</Button>
            </div>

            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {sportsInCategory.map((s) => (
                <button key={s.id} type="button" className={`p-2 rounded-lg border ${form.sports?.includes(s.name) ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-card'}`} onClick={() => toggleAddSport(s.name)}>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted">{s.category}</div>
                </button>
              ))}
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              {(form.sports ?? []).map((s) => (
                <span key={s} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm">
                  {s}
                  <button className="ml-1 text-muted" onClick={() => removeSport(s)} type="button">×</button>
                </span>
              ))}
            </div>
          </div>
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
        title="Edit Event"
        subtitle={selectedEvent?.name}
        maxWidth="lg"
      >
        <ModalContent className="space-y-4">
          <Input
            label="Event Name"
            value={form.name ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <Select
            label="Status"
            value={form.status ?? 'upcoming'}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
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
