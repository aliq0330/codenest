import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, MessageSquare, X } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";

export function Header() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { notificationCount, messageCount } = useUIStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[#2e2e2e] bg-[#111111]/80 px-4 backdrop-blur-sm">
      <form onSubmit={handleSearch} className="relative flex flex-1 max-w-md items-center">
        <Search className="absolute left-3 h-4 w-4 text-[#6b6b6b] pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search posts, users, tags..."
          className={cn(
            "w-full rounded-lg border bg-[#1a1a1a] py-2 pl-9 pr-8 text-sm text-[#f5f5f5]",
            "placeholder:text-[#3d3d3d] focus:outline-none transition-colors",
            focused ? "border-[#6b6b6b]" : "border-[#2e2e2e]"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 text-[#6b6b6b] hover:text-[#f5f5f5]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate("/notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/messages")}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
        >
          <MessageSquare className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
          )}
        </button>
      </div>
    </header>
  );
}
