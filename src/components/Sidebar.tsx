"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  HelpCircle,
  AlertTriangle,
  ClipboardList,
  Users,
  Menu,
  X,
  HardHat,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/variations", label: "Variations", icon: FileText },
  { href: "/rfis", label: "RFIs", icon: HelpCircle },
  { href: "/issues", label: "Issues", icon: AlertTriangle },
  { href: "/daily-updates", label: "Daily Updates", icon: ClipboardList },
  { href: "/team", label: "Team", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200">
        <div className="p-1.5 bg-amber-500 rounded-lg">
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">F&P Civil</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Project Hub</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-amber-50 text-amber-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  
  
("{cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive(item.href)
              ? "bg-amber-50 text-amber-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 z-30">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-40">
        <button onClick={() => setMobileOpen(true)} className="p-1.5 -ml-1.5 text-gray-600">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="p-1 bg-amber-500 rounded">
            <HardHat className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">F&P Civil</span>
        </div>
      </header>

      {/* Mobile Overlay */}
      { mobileOpen && (
        <div className="lg:hidden fixed inset-0 zt-50">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  
  
("{
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 z-30">
        <NavContent />
      </aside>

