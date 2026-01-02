"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md";
  variant?: "primary" | "neutral";
}

export function SectionHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  action,
  className,
  size = "md",
  variant = "primary",
}: SectionHeaderProps) {
  const displayDescription = subtitle || description;
  const sizeBox = size === "sm" ? "w-10 h-10" : "w-12 h-12";
  const sizeIcon = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const titleSize = size === "sm" ? "text-lg" : "text-2xl";

  const variantMap: Record<
    string,
    {
      from: string;
      to: string;
      shadow: string;
      title: string;
      subtitle: string;
    }
  > = {
    primary: {
      from: "from-primary-600",
      to: "to-primary-700",
      shadow: "shadow-primary-600/20",
      title: "text-foreground",
      subtitle: "text-muted-foreground",
    },
    neutral: {
      from: "from-border",
      to: "to-border",
      shadow: "shadow-border/20",
      title: "text-foreground",
      subtitle: "text-muted-foreground",
    },
  };
  
  // Fallback to primary if variant not found (handles legacy variants: blue, purple, amber, etc.)
  const v = variantMap[variant] ?? variantMap.primary;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div
            className={cn(
              sizeBox,
              "rounded-xl flex items-center justify-center shadow-lg",
              v.from,
              v.to,
              v.shadow
            )}
          >
            <Icon className={cn(sizeIcon, "text-white")} />
          </div>
        )}
        <div>
          <h2 className={cn(titleSize, "font-bold", v.title)}>{title}</h2>
          {displayDescription && (
            <p className={cn("mt-1 text-sm", v.subtitle)}>
              {displayDescription}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
