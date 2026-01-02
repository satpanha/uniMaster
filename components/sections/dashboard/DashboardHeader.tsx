/**
 * DashboardHeader Section
 * Page title + event selector
 */

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  eventSelector?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, eventSelector }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
      </div>
      {eventSelector && <div>{eventSelector}</div>}
    </div>
  );
}
