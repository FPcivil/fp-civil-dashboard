"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4",
      className
    )}>
      <div className="mb-4 text-slate-400">
        {icon || <AlertCircle size={48} />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-slate-600 text-center mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
