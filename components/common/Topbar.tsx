import Image from 'next/image';
import { Search, Bell, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-white sticky top-0 z-10">
      <div>
        <div className="font-bold text-xl text-foreground">Sport Competition Management</div>
        <div className="text-xs text-muted">Ministry of Education, Youth and Sport</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full pl-10 pr-4 py-2 bg-muted text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary transition w-48"
            aria-label="Search"
          />
          <Search className="absolute left-3 top-2.5 text-muted" size={18} />
        </div>
        <button className="p-2 rounded-full hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Notifications">
          <Bell className="text-muted" size={20} />
        </button>
        <div className="relative">
          <button className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="User menu">
            <Image src="/avatars/user.svg" alt="User Avatar" width={32} height={32} className="w-8 h-8 rounded-full border border-border" />
            <ChevronDown className="text-muted" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
