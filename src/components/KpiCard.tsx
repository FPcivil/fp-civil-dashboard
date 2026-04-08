"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
  alert?: boolean;
}

export default function KpiCard({ title, value, icon: Icon, color = "text-blue-600", subtitle, alert }: KpiCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-4 sm:p-5 flex items-start gap-4 transition-shadow hover:shadow-md",
        alert && "border-red-300 bg-red-50"
      )}
    >
      <div className={cn("p-2.5 rounded-lg bg-opacity-10", color === "text-red-600" ? "bg-red-100" : color === "text-yellow-600" ? "bg-yellow-100" : color === "text-green-600" ? "bg-green-100" : "bg-blue-100")}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className={cn("text-2xl font-bold mt-0.5", alert ? "text-red-600" : "text-gray-900")}>
          {value}
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  
  
