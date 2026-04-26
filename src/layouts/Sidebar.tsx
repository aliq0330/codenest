import { NavLink } from "react-router-dom";
import {
  Home, Compass, Star, Bell, MessageSquare, User,
  Bookmark, Settings, Code2, PenSquare, ChevronLeft, ChevronRight, Hash,
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

function SidebarContent({ collapsed, onNavClick }: { collapsed: boolean; onNavClick?: () => void }) {
  const { toggleSidebar } = useUIStore();
  const { profile } = useAuthStore();

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-[#2e2e2e] bg-[#111111] transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-14 items-center border-b border-[#2e2e2e] px-4", collapsed && "justify-center px-0")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5]">
          <Code2 className="h-4 w-4 text-[#0a0a0a]" />
        </div>
        {!collapsed && (
          <span className="ml-2 text-base font-bold tracking-tight text-[#f5f5f5]">CodeNest</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            onClick={onNavClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 select-none",
                isActive
                  ? "bg-[#1a1a1a] text-[#f5f5f5]"
                  : "text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Compose */}
      <div className={cn("border-t border-[#2e2e2e] p-2", collapsed && "flex justify-center")}>
        <NavLink
          to="/compose"
          onClick={onNavClick}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg bg-[#f5f5f5] py-2.5 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90",
            collapsed ? "h-10 w-10" : "w-full px-4"
          )}
        >
          <PenSquare className="h-4 w-4 shrink-0" />
          {!collapsed && "New Post"}
        </NavLink>
      </div>

      {/* User mini-profile */}
      {!collapsed && profile && (
        <div className="border-t border-[#2e2e2e] p-3">
          <NavLink to="/profile" onClick={onNavClick} className="flex items-center gap-2.5">
            <Avatar src={profile.avatar_url} alt={profile.display_name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#f5f5f5]">{profile.display_name}</p>
              <p className="truncate text-xs text-[#6b6b6b]">@{profile.username}</p>
            </div>
          </NavLink>
        </div>
      )}

      {/* Collapse toggle — sadece desktop */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 hidden sm:flex h-6 w-6 items-center justify-center rounded-full border border-[#2e2e2e] bg-[#111111] text-[#6b6b6b] hover:text-[#f5f5f5] transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden sm:flex h-full shrink-0">
        <SidebarContent collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 sm:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex sm:hidden transition-transform duration-300",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          collapsed={false}
          onNavClick={() => setMobileSidebarOpen(false)}
        />
      </div>
    </>
  );
}
