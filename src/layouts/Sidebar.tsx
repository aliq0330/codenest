import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Compass, Star, Bell, MessageSquare, User,
  Bookmark, Settings, Code2, PenSquare, X, Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { useT } from "@/lib/i18n";
import { Avatar } from "@/components/ui/Avatar";

<<<<<<< HEAD
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
=======
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
>>>>>>> origin/main
  const { profile } = useAuthStore();
  const location = useLocation();
  const t = useT();

<<<<<<< HEAD
  const NAV = [
    { icon: Home,          label: t.nav.home,          to: "/feed" },
    { icon: Compass,       label: t.nav.explore,       to: "/explore" },
    { icon: Star,          label: t.nav.featured,      to: "/featured" },
    { icon: Hash,          label: t.nav.tags,          to: "/tags" },
    { icon: Bell,          label: t.nav.notifications, to: "/notifications" },
    { icon: MessageSquare, label: t.nav.messages,      to: "/messages" },
    { icon: Bookmark,      label: t.nav.collections,   to: "/collections" },
    { icon: User,          label: t.nav.profile,       to: "/profile" },
    { icon: Settings,      label: t.nav.settings,      to: "/settings" },
  ];

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

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
=======
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
>>>>>>> origin/main
        )}
        onClick={() => setSidebarOpen(false)}
      />

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
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
            {t.nav.newPost}
          </NavLink>
        </div>

<<<<<<< HEAD
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
=======
      {/* Collapse toggle — sadece desktop */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 hidden sm:flex h-6 w-6 items-center justify-center rounded-full border border-[#2e2e2e] bg-[#111111] text-[#6b6b6b] hover:text-[#f5f5f5] transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
>>>>>>> origin/main
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
