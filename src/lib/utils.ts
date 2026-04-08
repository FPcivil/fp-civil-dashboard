import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isOverdue(dueDate: string | Date | null | undefined): boolean {
  if (!dueDate) return false;
  const d = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  return d < new Date();
}

export function daysUntilDue(dueDate: string | Date | null | undefined): number | null {
  if (!dueDate) return null;
  const d = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = d.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calcProgress(
  completed: number | null | undefined,
  total: number | null | undefined
): number {
  if (!completed || !total || total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Structural: "bg-red-100 text-red-800",
    Electrical: "bg-yellow-100 text-yellow-800",
    Plumbing: "bg-blue-100 text-blue-800",
    HVAC: "bg-purple-100 text-purple-800",
    General: "bg-slate-100 text-slate-800",
    Safety: "bg-orange-100 text-orange-800",
    Compliance: "bg-green-100 text-green-800",
  };
  return colors[category] || "bg-slate-100 text-slate-800";
}

export function getPriorityOrder(priority: string): number {
  const order: Record<string, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };
  return order[priority] ?? 999;
}
