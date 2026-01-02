"use client";

import { Search } from "lucide-react";

export function SearchInput() {
  return (
    <div className="relative">
      <input
        type="search"
        inputMode="search"
        placeholder="Search..."
        className="rounded-full pl-10 pr-4 py-2 bg-muted text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary transition w-48"
        aria-label="Search"
      />
      <Search className="absolute left-3 top-2.5 text-muted" size={18} />
    </div>
  );
}
