"use client";

import Link from "next/link";
import { TrendingUp, Users, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder trending tags
const TRENDING_TAGS = [
  { tag: "react", count: 2340 },
  { tag: "typescript", count: 1890 },
  { tag: "css-art", count: 1250 },
  { tag: "algorithms", count: 980 },
  { tag: "nextjs", count: 876 },
];

// Placeholder suggested users
const SUGGESTED_USERS = [
  { username: "alexchen", displayName: "Alex Chen", avatar: null, followersCount: 12400 },
  { username: "saradev", displayName: "Sara Developer", avatar: null, followersCount: 8900 },
  { username: "ryo_codes", displayName: "Ryo Nakamura", avatar: null, followersCount: 6200 },
];

export function RightPanel() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Trending tags */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-ink-tertiary" />
          <h3 className="text-sm font-semibold text-ink-primary">Trending Tags</h3>
        </div>
        <div className="flex flex-col gap-1">
          {TRENDING_TAGS.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-surface"
            >
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-ink-tertiary" />
                <span className="text-sm font-medium text-ink-secondary">#{tag}</span>
              </div>
              <span className="text-xs text-ink-tertiary">{(count / 1000).toFixed(1)}K posts</span>
            </Link>
          ))}
        </div>
        <Link
          href="/tags"
          className="mt-2 block text-xs text-ink-tertiary transition-colors hover:text-ink-secondary"
        >
          Show all tags →
        </Link>
      </section>

      {/* Suggested users */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-ink-tertiary" />
          <h3 className="text-sm font-semibold text-ink-primary">Who to Follow</h3>
        </div>
        <div className="flex flex-col gap-3">
          {SUGGESTED_USERS.map((user) => (
            <div key={user.username} className="flex items-center justify-between">
              <Link href={`/@${user.username}`} className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-surface-hover ring-1 ring-surface-border" />
                <div>
                  <p className="text-sm font-medium text-ink-primary leading-none">{user.displayName}</p>
                  <p className="text-xs text-ink-tertiary mt-0.5">@{user.username}</p>
                </div>
              </Link>
              <button className="rounded-full border border-surface-border px-3 py-1 text-xs font-medium text-ink-secondary transition-all hover:border-ink-tertiary hover:text-ink-primary">
                Follow
              </button>
            </div>
          ))}
        </div>
        <Link
          href="/explore/users"
          className="mt-3 block text-xs text-ink-tertiary transition-colors hover:text-ink-secondary"
        >
          Discover more →
        </Link>
      </section>

      {/* Footer links */}
      <div className="mt-auto">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {["About", "Privacy", "Terms", "Help"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-xs text-ink-disabled hover:text-ink-tertiary"
            >
              {link}
            </Link>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-disabled">© 2026 CodeNest</p>
      </div>
    </div>
  );
}
