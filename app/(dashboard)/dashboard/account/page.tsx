import { DashboardHeader } from '@/components/dashboard';
import { Card, CardHeader, CardContent } from '@/components/ui';

export default function AccountPage() {
  return (
    <div className="dashboard-content">
      <DashboardHeader title="Account" subtitle="Profile & settings (placeholder)" />

      <Card>
        <CardHeader>Account</CardHeader>
        <CardContent>
          <p className="text-muted">This is a placeholder for account settings and authentication flows. No auth is implemented yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
