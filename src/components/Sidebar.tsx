"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  GitBranch,
  HelpCircle,
  AlertCircle,
  Calendar,
  Users,
  Settings,
  LogOut,
  Clock,
  DollarSign,
  Calculator,
  HardHat,
  TrendingUp,
  Target,
} from "lucide-react";

const menuSections = [
  {
    title: null,
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/pipeline", icon: Target, label: "$10M Pipeline" },
    ],
  },
  {
    title: "Projects",
    items: [
      { href: "/projects", icon: FolderOpen, label: "Projects" },
      { href: "/tasks", icon: CheckSquare, label: "Tasks" },
      { href: "/variations", icon: GitBranch, label: "Variations" },
      { href: "/rfis", icon: HelpCircle, label: "RFIs" },
      { href: "/issues", icon: AlertCircle, label: "Issues" },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/daily-updates", icon: Calendar, label: "Daily Updates" },
      { href: "/site-operations", icon: HardHat, label: "Site Operations" },
      { href: "/timesheets", icon: Clock, label: "Timesheets" },
      { href: "/expenses", icon: DollarSign, label: "Expenses" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/estimating", icon: Calculator, label: "Estimating" },
      { href: "/cost-intelligence", icon: TrendingUp, label: "Cost Intelligence" },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/team", icon: Users, label: "Team" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-400">F&P Civil</h1>
        <p className="text-sm text-slate-400 mt-1">Operations Dashboard</p>
      </div>

      <nav className="px-3 py-2">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-2">
            {section.title && (
              <p className="px-4 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 transition-colors text-sm",
                    isActive
                      ? "bg-red-700 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 mt-2">
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm">
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
