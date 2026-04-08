"use client";

import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  low: "bg-gray-400",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

export default function PriorityDot({ priority }: { priority: string }) {
  return (
    <span className={cn("inline-block w-2 h-2 rounded-full", colors[priority] || "bg-gray-400")} title={priority} />
  );
}
