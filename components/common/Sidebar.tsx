import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy } from "lucide-react";
import { Button } from "../ui/Button";

const navGroups = [
  {
    title: 'Management',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <Trophy size={18} /> },
      { label: 'Events', href: '/dashboard/events', icon: <Trophy size={18} /> },
      { label: 'Sports', href: '/dashboard/events', icon: <span className="i-sports" /> },
      { label: 'Athletes', href: '/dashboard/athletes', icon: <span className="i-athlete" /> },
    ],
  },
  {
    title: 'Results',
    items: [
      { label: 'Medals', href: '/dashboard/medals', icon: <span className="i-medal" /> },
      { label: 'Provinces', href: '/dashboard/provinces', icon: <span className="i-province" /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar">
      <div>
        <div className="sidebar-brand">
          <Trophy className="text-primary" size={28} aria-hidden />
          <div>
            <div className="text-base font-semibold">MOEYS Sport</div>
            <div className="text-xs text-muted">Management System</div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-2 text-xs font-semibold text-muted tracking-wide">NAVIGATION</div>

        <nav aria-label="Main Navigation" className="sidebar-nav px-2">
          {navGroups.map((g) => (
            <div key={g.title} className="mb-3">
              <div className="px-3 text-xs font-semibold text-muted mb-1">{g.title}</div>
              <div className="flex flex-col">
                {g.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link key={item.label} href={item.href} className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}>
                      <span className="text-lg mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4">
        <Link href="/dashboard/register" aria-label="Register Athlete" className="btn btn-primary w-full inline-flex items-center justify-center">Register Athlete</Link>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <Image src="/avatars/user.svg" alt="User Avatar" width={40} height={40} className="w-10 h-10 rounded-full border border-border" />
          <div className="flex-1">
            <div className="font-semibold text-sm">Sokha Chan</div>
            <div className="text-xs text-muted">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
