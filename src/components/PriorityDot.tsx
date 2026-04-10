"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PriorityDotProps {
  priority: string;
  className?: string;
}

const priorityColors = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-blue-500",
};

export function PriorityDot({ priority, className }: PriorityDotProps) {
  const color = priorityColors[priority as keyof typeof priorityColors] || "bg-slate-400";

  return (
    <div
      className={cn(
        "w-3 h-3 rounded-full",
        color,
        className
      )}
      title={priority}
    />
  );
}

export default PriorityDot;
