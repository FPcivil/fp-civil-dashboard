import { format, formatDistanceToNow, isPast, isToday, addDays } from "date-fns";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | null): string {
  if (!date) return "—";
  return format(new Date(date), "d MMM yyyy");
}

export function formatDateShort(date: string | null): string {
  if (!date) return "—";
  return format(new Date(date), "d MMM");
}

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(date: string | null): boolean {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
}

export function isDueSoon(date: string | null, days: number = 3): boolean {
  if (!date) return false;
  const d = new Date(date);
  return !isPast(d) && d <= addDays(new Date(), days);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
