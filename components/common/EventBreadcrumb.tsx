"use client";

import Link from "next/link";

export function EventBreadcrumb({ id, name }: { id: string; name: string }) {
  return (
    <div className="ml-2">
      <Link
        href={`/dashboard/events/${id}`}
        className="event-pill text-sm"
        aria-label={`Open ${name} dashboard`}
      >
        {name}
      </Link>
    </div>
  );
}
