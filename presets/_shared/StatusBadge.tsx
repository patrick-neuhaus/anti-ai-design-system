import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatusVariant {
  label: string;
  bg: string; // tailwind class, e.g. "bg-status-success-bg"
  fg: string; // tailwind class, e.g. "text-status-success-fg"
}

interface StatusBadgeProps {
  variant: StatusVariant;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ variant, size = "md", showDot = true, className }: StatusBadgeProps) {
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        padding,
        variant.bg,
        variant.fg,
        className
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", variant.fg.replace("text-", "bg-"))} />}
      {variant.label}
    </span>
  );
}
