import { Trophy, Users, Medal, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Athletes",
    value: 1240,
    change: 4.2,
    icon: <Users className="text-primary" size={28} />,
    accent: "border-l-4 border-primary"
  },
  {
    label: "Total Sports",
    value: 18,
    change: 2.1,
    icon: <Trophy className="text-secondary" size={28} />,
    accent: "border-l-4 border-secondary"
  },
  {
    label: "Total Provinces",
    value: 25,
    change: 0.0,
    icon: <MapPin className="text-accent" size={28} />,
    accent: "border-l-4 border-accent"
  },
  {
    label: "Total Medals",
    value: 320,
    change: 6.7,
    icon: <Medal className="text-warning" size={28} />,
    accent: "border-l-4 border-warning"
  }
];

export function StatCardsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className={cn("flex items-center p-6 bg-white rounded-lg shadow-sm", stat.accent)}>
          <div className="flex-1">
            <div className="text-sm text-muted mb-1 font-medium">{stat.label}</div>
            <div className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {stat.change > 0 && <span className="text-success font-semibold">▲ {stat.change}%</span>}
              {stat.change < 0 && <span className="text-danger font-semibold">▼ {Math.abs(stat.change)}%</span>}
              {stat.change === 0 && <span className="text-muted font-semibold">0%</span>}
            </div>
          </div>
          <div className="ml-4 flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
            {stat.icon}
          </div>
        </Card>
      ))}
    </div>
  );
}
