"use client";
import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel, FeedSkeleton } from "@/components/ui";
import { PostCard } from "@/modules/post/PostCard";
import type { Post, FeedTab } from "@/types";

const FILTERS = ["All", "React", "TypeScript", "CSS", "Algorithms", "HTML", "Vue"];

function mockUser(n: number) {
  const users = [
    { username: "alexchen", display_name: "Alex Chen", followers_count: 12400 },
    { username: "saradev", display_name: "Sara Kaya", followers_count: 8900 },
    { username: "ryo_codes", display_name: "Ryo Nakamura", followers_count: 6200 },
    { username: "mia_ts", display_name: "Mia Tanaka", followers_count: 4300 },
    { username: "dev_max", display_name: "Max Hoffmann", followers_count: 3100 },
  ];
  const u = users[n % users.length];
  return {
    id: `u${n}`,
    ...u,
    email: `${u.username}@example.com`,
    avatar_url: null,
    cover_url: null,
    bio: "Frontend developer",
    location: null,
    website: null,
    github_url: null,
    twitter_url: null,
    linkedin_url: null,
    following_count: 200,
    posts_count: 150 + n * 10,
    is_verified: n < 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

const MOCK_POSTS: Post[] = [
  {
    id: "p1", type: "snippet", author: mockUser(0),
    title: "CSS scroll-driven animations — no JavaScript!",
    content: "The new @scroll-timeline API lets you create scroll-driven animations purely in CSS. Here's a reading progress bar with just 10 lines of CSS:",
    tags: ["css", "animation", "no-js"],
    language: "css",
    snippets: [{
      id: "s1", filename: "progress.css", language: "css",
      code: `@keyframes grow-progress {\n  from { transform: scaleX(0); }\n  to { transform: scaleX(1); }\n}\n\n.progress-bar {\n  position: fixed;\n  top: 0; left: 0;\n  width: 100%; height: 4px;\n  background: #f5f5f5;\n  transform-origin: left;\n  animation: grow-progress auto linear;\n  animation-timeline: scroll();\n}`
    }],
    media: [], likes_count: 2140, comments_count: 67, reposts_count: 423, saves_count: 318,
    views_count: 18900, is_liked: false, is_saved: false, is_reposted: false,
    reposted_post: null, quoted_post: null, article: null, project: null,
    is_draft: false, published_at: new Date(Date.now() - 7200000).toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "p2", type: "snippet", author: mockUser(1),
    title: null,
    content: "Hot take: the best accessibility improvement you can make today is just using semantic HTML correctly. `<button>` not `<div onClick>`. `<nav>` not `<div class='nav'>`. Most ARIA is a band-aid for broken HTML.",
    tags: ["accessibility", "html", "opinion"],
    language: null, snippets: [], media: [],
    likes_count: 4830, comments_count: 203, reposts_count: 891, saves_count: 412,
    views_count: 42000, is_liked: true, is_saved: false, is_reposted: false,
    reposted_post: null, quoted_post: null, article: null, project: null,
    is_draft: false, published_at: new Date(Date.now() - 14400000).toISOString(),
    created_at: new Date(Date.now() - 14400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "p3", type: "snippet", author: mockUser(2),
    title: "useDebounce hook — production-ready with cleanup",
    content: "A proper useDebounce that cleans up after itself. Avoids stale state updates after unmount.",
    tags: ["react", "hooks", "typescript"],
    language: "typescript",
    snippets: [{
      id: "s2", filename: "useDebounce.ts", language: "typescript",
      code: `import { useState, useEffect } from "react";\n\nexport function useDebounce<T>(value: T, delay = 300): T {\n  const [debounced, setDebounced] = useState<T>(value);\n\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n\n  return debounced;\n}`
    }],
    media: [], likes_count: 1290, comments_count: 44, reposts_count: 267, saves_count: 198,
    views_count: 11200, is_liked: false, is_saved: true, is_reposted: false,
    reposted_post: null, quoted_post: null, article: null, project: null,
    is_draft: false, published_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "p4", type: "snippet", author: mockUser(3),
    title: "Vanilla JS drag & drop — 30 lines",
    content: "No libraries needed. Here's a fully functional drag & drop in pure JavaScript using the HTML5 Drag and Drop API.",
    tags: ["javascript", "drag-drop", "vanilla"],
    language: "javascript",
    snippets: [{
      id: "s3", filename: "dragdrop.js", language: "javascript",
      code: `const items = document.querySelectorAll('.draggable');\nlet dragged;\n\nitems.forEach(el => {\n  el.draggable = true;\n  el.addEventListener('dragstart', e => {\n    dragged = e.target;\n    e.target.style.opacity = '0.4';\n  });\n  el.addEventListener('dragend', e => {\n    e.target.style.opacity = '';\n  });\n  el.addEventListener('dragover', e => e.preventDefault());\n  el.addEventListener('drop', e => {\n    e.preventDefault();\n    if (dragged !== e.target) {\n      const parent = e.target.parentNode;\n      parent.insertBefore(dragged, e.target.nextSibling);\n    }\n  });\n});`
    }],
    media: [], likes_count: 876, comments_count: 31, reposts_count: 144, saves_count: 267,
    views_count: 7800, is_liked: false, is_saved: false, is_reposted: false,
    reposted_post: null, quoted_post: null, article: null, project: null,
    is_draft: false, published_at: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "p5", type: "snippet", author: mockUser(4),
    title: null,
    content: "If your React component re-renders too often, before reaching for useMemo/useCallback — check if you're creating new object/array references in the render. That's usually the culprit. 95% of performance issues fixed.",
    tags: ["react", "performance", "tips"],
    language: null, snippets: [], media: [],
    likes_count: 3210, comments_count: 87, reposts_count: 634, saves_count: 521,
    views_count: 29000, is_liked: false, is_saved: false, is_reposted: false,
    reposted_post: null, quoted_post: null, article: null, project: null,
    is_draft: false, published_at: new Date(Date.now() - 259200000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date().toISOString(),
  },
];

export function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [feedTab, setFeedTab] = useState<FeedTab>("following");

  const filtered = activeFilter === "All"
    ? MOCK_POSTS
    : MOCK_POSTS.filter((p) => p.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase()));

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="px-4 pt-3 pb-0">
          <h1 className="text-lg font-bold text-[#f5f5f5]">Home</h1>
        </div>
        <Tabs defaultTab="following" onChange={(t) => setFeedTab(t as FeedTab)}>
          <TabList className="px-2">
            <Tab value="following">Following</Tab>
            <Tab value="suggested">Suggested</Tab>
            <Tab value="trending">Trending</Tab>
          </TabList>
        </Tabs>
        {/* Tag filters */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                activeFilter === f
                  ? "border-[#f5f5f5] bg-[#f5f5f5] text-[#0a0a0a]"
                  : "border-[#2e2e2e] text-[#a3a3a3] hover:border-[#6b6b6b]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-[#6b6b6b]">
            <p className="text-sm">No posts found for this filter.</p>
          </div>
        ) : (
          filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={(id) => console.log("like", id)}
              onRepost={(id) => console.log("repost", id)}
              onSave={(id) => console.log("save", id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
