"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  colorClass?: string; // e.g., 'text-blue-600'
}

export function ArrowLink({ href, children, className, colorClass = 'text-blue-600' }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn('font-medium flex items-center gap-1 hover:gap-2 transition-all', colorClass, className)}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
