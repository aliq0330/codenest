"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Star,
  Bell,
  MessageSquare,
  User,
  Bookmark,
  Settings,
  Code2,
  PenSquare,
  ChevronLeft,
  ChevronRight,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/feed" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: Star, label: "Featured", href: "/featured" },
  { icon: Hash, label: "Tags", href: "/tags" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Bookmark, label: "Collections", href: "/collections" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex h-full shrink-0 flex-col border-r border-surface-border bg-canvas-secondary transition-all duration-200",
        collapsed ? "w-16" : "w-sidebar"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-header items-center border-b border-surface-border px-4",
          collapsed ? "justify-center" : "gap-2"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-primary">
          <Code2 className="h-4 w-4 text-canvas" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-ink-primary">CodeNest</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "nav-item",
                isActive && "active",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Compose button */}
      <div className={cn("border-t border-surface-border p-2", collapsed && "flex justify-center")}>
        <Link
          href="/compose"
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg bg-ink-primary px-4 py-2.5 text-sm font-semibold text-canvas transition-opacity hover:opacity-90",
            collapsed ? "h-10 w-10 p-0" : "w-full"
          )}
        >
          <PenSquare className="h-4 w-4 shrink-0" />
          {!collapsed && "New Post"}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-surface-border bg-canvas-secondary text-ink-tertiary hover:text-ink-primary"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
