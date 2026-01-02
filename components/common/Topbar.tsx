"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopbarTitle } from "@/components/common/TopbarTitle";
import { EventSelect } from "@/components/common/EventSelect";
import { SearchInput } from "@/components/common/SearchInput";
import { TopbarActions } from "@/components/common/UserMenu";

export function Topbar() {
  const router = useRouter();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <TopbarTitle />
        <EventSelect />
      </div>

      <div className="flex items-center gap-4">
        <SearchInput />
        <TopbarActions />
      </div>
    </header>
  );
}
