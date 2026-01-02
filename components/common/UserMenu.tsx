"use client";

import Image from "next/image";
import { ChevronDown, Bell } from "lucide-react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export function TopbarActions() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/register")}>Register Athlete</Button>
      <button
        className="p-2 rounded-full hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Notifications"
      >
        <Bell className="text-muted" size={20} />
      </button>
      <div className="relative">
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="User menu">
          <Image src="/avatars/user.svg" alt="User Avatar" width={32} height={32} className="w-8 h-8 rounded-full border border-border" />
          <ChevronDown className="text-muted" size={18} />
        </button>
      </div>
    </div>
  );
}
