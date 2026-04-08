"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function ProgressBar({ value, size = "sm", showLabel = true }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor =
    clamped >= 80 ? "bg-green-500" : clamped >= 50 ? "bg-blue-500" : clamped >= 25 ? "bg-yellow-500" : "bg-gray-400";

  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex-1 rounded-full bg-gray-200", size === "sm" ? "h-2" : "h-3")}>
        <div
          className={cn("rounded-full transition-all duration-500", barColor, size === "sm" ? "h-2" : "h-3")}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-gray-600 w-8 text-right">{clamped}%</span>}
    </div>
  );
}
