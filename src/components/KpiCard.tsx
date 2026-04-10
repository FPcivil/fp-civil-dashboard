"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  icon?: React.ReactNode;
  className?: string;
  color?: "blue" | "green" | "red" | "yellow" | "slate";
}

const colorStyles = {
  blue: "bg-blue-50 border-blue-200",
  green: "bg-green-50 border-green-200",
  red: "bg-red-50 border-red-200",
  yellow: "bg-yellow-50 border-yellow-200",
  slate: "bg-slate-50 border-slate-200",
};

const textColorStyles = {
  blue: "text-blue-700",
  green: "text-green-700",
  red: "text-red-700",
  yellow: "text-yellow-700",
  slate: "text-slate-700",
};

export default function KpiCard({
  title,
  value,
  unit = "",
  trend,
  icon,
  className,
  color = "blue",
}: KpiCardProps) {
  const isTrendPositive = trend !== undefined && trend > 0;
  const isTrendNegative = trend !== undefined && trend < 0;

  return (
    <div
      className={cn(
        "border rounded-lg p-6",
        colorStyles[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <p className={cn("text-2xl font-bold", textColorStyles[color])}>
              {value}
            </p>
            {unit && (
              <p className="text-sm text-slate-600">{unit}</p>
            )}
          </div>
          {trend !== undefined && (
            <div className="mt-3 flex items-center gap-1">
              {isTrendPositive ? (
                <>
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{trend}%
                  </span>
                </>
              ) : isTrendNegative ? (
                <>
                  <TrendingDown size={16} className="text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    {trend}%
                  </span>
                </>
              ) : null}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("p-2 rounded-lg", colorStyles[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
