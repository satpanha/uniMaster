'use client'

import React, { useEffect, useState } from 'react';
import { formatRelativeTime } from '@/lib/core/date';

export default function RelativeTime({ iso }: { iso: string | number | Date }) {
  const [label, setLabel] = useState(() => formatRelativeTime(iso));

  useEffect(() => {
    setLabel(formatRelativeTime(iso));
    const id = setInterval(() => setLabel(formatRelativeTime(iso)), 30_000);
    return () => clearInterval(id);
  }, [iso]);

  return <span className="text-sm text-muted">{label}</span>;
}
