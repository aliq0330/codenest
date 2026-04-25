"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="flex h-header shrink-0 items-center gap-4 border-b border-surface-border bg-canvas-secondary/80 px-4 backdrop-blur-sm">
      {/* Search bar */}
      <div
        className={cn(
          "relative flex flex-1 max-w-md items-center gap-2 rounded-lg border bg-surface px-3 py-2 transition-all duration-150",
          searchFocused ? "border-ink-tertiary" : "border-surface-border"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-ink-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search posts, users, tags..."
          className="flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
        />
        {query && (
          <kbd className="hidden text-xs text-ink-disabled sm:block">ESC</kbd>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface hover:text-ink-primary"
        >
          <Bell className="h-5 w-5" />
          {/* Unread badge */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-semantic-info" />
        </Link>

        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface hover:text-ink-primary"
        >
          <MessageSquare className="h-5 w-5" />
        </Link>

        {/* Avatar */}
        <Link href="/profile" className="ml-1">
          <div className="h-8 w-8 rounded-full bg-surface-hover ring-1 ring-surface-border" />
        </Link>
      </div>
    </header>
  );
}
