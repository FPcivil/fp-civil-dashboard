"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  statusMap: readonly { value: string; label: string; color: string }[];
  size?: "sm" | "md";
}

export default function StatusBadge({ status, statusMap, size = "sm" }: StatusBadgeProps) {
  const found = statusMap.find((s) => s.value === status);
  const label = found?.label || status;
  const color = found?.color || "bg-gray-100 text-gray-700";

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full whitespace-nowrap",
        color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {label}
    </span>
  );
}
