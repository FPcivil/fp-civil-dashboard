"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
    "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <span className={cn(
      "inline-block px-3 py-1 rounded-full text-sm font-medium border",
      colorClass,
      className
    )}>
      {status}
    </span>
  );
}
