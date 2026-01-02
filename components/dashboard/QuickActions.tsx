/**
 * QuickActions Section
 * Quick access buttons for common tasks
 */

import { Button, Card, CardHeader, CardContent } from '@/components/ui';

interface QuickActionsProps {
  onRegisterAthlete?: () => void;
  onAddSport?: () => void;
  onExportData?: () => void;
}

export function QuickActions({ onRegisterAthlete, onAddSport, onExportData }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>Quick Actions</CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          {onRegisterAthlete && (
            <Button variant="secondary" size="md" fullWidth onClick={onRegisterAthlete} className="text-left">
              <div className="font-medium mb-1">👨‍🎓 Register Athlete</div>
              <small className="text-muted">Add new athlete to event</small>
            </Button>
          )}

          {onAddSport && (
            <Button variant="secondary" size="md" fullWidth onClick={onAddSport} className="text-left">
              <div className="font-medium mb-1">⚽ Add Sport</div>
              <small className="text-muted">Create new sport category</small>
            </Button>
          )}

          {onExportData && (
            <Button variant="secondary" size="md" fullWidth onClick={onExportData} className="text-left">
              <div className="font-medium mb-1">📊 Export Data</div>
              <small className="text-muted">Download reports (CSV)</small>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
