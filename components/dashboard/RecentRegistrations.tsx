/**
 * RecentRegistrations Section
 * Shows latest athlete registrations
 */

import { Badge, Card, CardHeader, CardContent } from '@/components/ui';

interface Registration {
  id: string;
  athleteName: string;
  sport: string;
  province: string;
  status: 'approved' | 'pending' | 'rejected';
  registeredAt: string;
}

interface RecentRegistrationsProps {
  registrations: Registration[];
}

export function RecentRegistrations({ registrations }: RecentRegistrationsProps) {
  const statusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        Recent Registrations
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Athlete</th>
                <th>Sport</th>
                <th>Province</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted text-center py-8">
                    No recent registrations
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="table-row-hover">
                    <td className="font-medium">{reg.athleteName}</td>
                    <td>{reg.sport}</td>
                    <td>{reg.province}</td>
                    <td>
                      <Badge variant={statusVariant(reg.status)}>{reg.status}</Badge>
                    </td>
                    <td className="text-muted">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
