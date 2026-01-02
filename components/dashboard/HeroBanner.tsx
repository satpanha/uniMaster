import { Calendar } from "lucide-react";

export function HeroBanner({ date }: { date: string }) {
  return (
    <div className="card bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md flex items-center justify-between p-8 mb-8">
      <div>
        <div className="text-2xl font-bold mb-2">Dashboard Overview</div>
        <div className="text-base opacity-90">Welcome to the MOEYS Sport Management System dashboard.</div>
      </div>
      <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <Calendar className="text-white opacity-80" size={18} />
        <span className="font-medium text-white text-sm">{date}</span>
      </div>
    </div>
  );
}
