import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Compass, Star, Bell, MessageSquare, User,
  Bookmark, Settings, Code2, PenSquare, X, Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { Avatar } from "@/components/ui/Avatar";

const NAV = [
  { icon: Home,          label: "Home",          to: "/feed" },
  { icon: Compass,       label: "Explore",       to: "/explore" },
  { icon: Star,          label: "Featured",      to: "/featured" },
  { icon: Hash,          label: "Tags",          to: "/tags" },
  { icon: Bell,          label: "Notifications", to: "/notifications" },
  { icon: MessageSquare, label: "Messages",      to: "/messages" },
  { icon: Bookmark,      label: "Collections",   to: "/collections" },
  { icon: User,          label: "Profile",       to: "/profile" },
  { icon: Settings,      label: "Settings",      to: "/settings" },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { profile } = useAuthStore();
  const location = useLocation();

  // Sayfa değişince menüyü kapat
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  // ESC tuşuyla kapat
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-[#2e2e2e] bg-[#111111]",
          "transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#2e2e2e] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5]">
              <Code2 className="h-4 w-4 text-[#0a0a0a]" />
            </div>
            <span className="text-base font-bold tracking-tight text-[#f5f5f5]">CodeNest</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {NAV.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 select-none",
                  isActive
                    ? "bg-[#1a1a1a] text-[#f5f5f5]"
                    : "text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
                )
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Compose */}
        <div className="border-t border-[#2e2e2e] p-2">
          <NavLink
            to="/compose"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f5f5f5] px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            <PenSquare className="h-4 w-4 shrink-0" />
            New Post
          </NavLink>
        </div>

        {/* User mini-profile */}
        {profile && (
          <div className="border-t border-[#2e2e2e] p-3">
            <NavLink to="/profile" className="flex items-center gap-2.5">
              <Avatar src={profile.avatar_url} alt={profile.display_name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#f5f5f5]">{profile.display_name}</p>
                <p className="truncate text-xs text-[#6b6b6b]">@{profile.username}</p>
              </div>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
}
