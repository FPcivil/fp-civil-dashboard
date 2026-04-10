"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({
  percentage,
  className,
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "flex-1 bg-slate-200 rounded-full overflow-hidden",
        sizeStyles[size],
        className
      )}>
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap w-12 text-right">
          {clampedPercentage}%
        </span>
      )}
    </div>
  );
}
