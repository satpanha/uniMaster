/**
 * EventOverview
 * Shows key event metadata using the legacy dashboard styling
 */

import type { Event } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface EventOverviewProps {
  event: Event;
}

export function EventOverview({ event }: EventOverviewProps) {
  return (
    <Card>
      <CardHeader>Event Details</CardHeader>

      <CardContent>
        <div className="grid gap-4">
          <div>
            <label className="text-muted text-sm">Event Name</label>
            <p className="mt-1 font-medium">{event.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-muted text-sm">Start Date</label>
              <p className="mt-1">{new Date(event.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-muted text-sm">End Date</label>
              <p className="mt-1">{new Date(event.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          {event.status && (
            <div>
              <label className="text-muted text-sm">Status</label>
              <div className="mt-1">
                <Badge variant={event.status === 'active' ? 'success' : event.status === 'upcoming' ? 'warning' : 'info'}>
                  {event.status}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
