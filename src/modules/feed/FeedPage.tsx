"use client";

import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/Tabs";
import { PostCard } from "@/modules/post/PostCard";
import { FeedSkeleton } from "@/components/ui/Skeleton";
import { TagPill } from "@/components/ui/Badge";
import type { FeedTab, Post } from "@/types";

const FILTER_TAGS = ["All", "React", "TypeScript", "CSS", "Algorithms", "UI/UX"];

// Minimal mock posts for skeleton/demo
function makeMockPost(id: string, overrides: Partial<Post> = {}): Post {
  const base: Post = {
    id,
    type: "snippet",
    author: {
      id: `u-${id}`,
      username: `dev_${id}`,
      displayName: `Developer ${id}`,
      email: `dev${id}@example.com`,
      avatar: null,
      coverImage: null,
      bio: null,
      location: null,
      website: null,
      links: {},
      followersCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 500),
      postsCount: Math.floor(Math.random() * 300),
      isVerified: Math.random() > 0.7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    title: undefined,
    content: "This is a sample post showing the feed layout with proper component structure.",
    tags: ["javascript", "react"],
    snippets: [],
    media: [],
    links: [],
    likesCount: Math.floor(Math.random() * 1000),
    commentsCount: Math.floor(Math.random() * 100),
    repostsCount: Math.floor(Math.random() * 200),
    savesCount: Math.floor(Math.random() * 150),
    viewsCount: Math.floor(Math.random() * 5000),
    isLiked: false,
    isSaved: false,
    isReposted: false,
    isDraft: false,
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return { ...base, ...overrides };
}

const MOCK_POSTS: Post[] = [
  makeMockPost("1", {
    title: "CSS Grid masonry layout — pure CSS, no JS",
    content: "Finally got masonry working with just CSS Grid! The `grid-template-rows: masonry` property is game-changing once it lands.",
    tags: ["css", "grid", "layout"],
    snippets: [{ id: "s1", filename: "masonry.css", language: "css", code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));\n  grid-template-rows: masonry;\n  gap: 1.5rem;\n}` }],
    likesCount: 1240,
    commentsCount: 67,
    repostsCount: 324,
  }),
  makeMockPost("2", {
    content: "Hot take: the best accessibility improvement you can make today is just using semantic HTML elements correctly. No ARIA needed in 90% of cases.",
    tags: ["accessibility", "html"],
    likesCount: 3450,
    commentsCount: 189,
  }),
  makeMockPost("3", {
    title: "Custom React hook: useDebounce with cleanup",
    content: "Here's a production-ready useDebounce hook with proper cleanup to prevent memory leaks.",
    tags: ["react", "hooks", "typescript"],
    snippets: [{ id: "s2", filename: "useDebounce.ts", language: "javascript", code: `import { useState, useEffect } from "react";\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debounced;\n}` }],
    likesCount: 892,
    commentsCount: 34,
    repostsCount: 201,
  }),
];

export function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("following");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-surface-border">
        <div className="px-4 pt-3">
          <h1 className="text-lg font-bold text-ink-primary">Home</h1>
        </div>

        <Tabs defaultTab="following" onChange={(t) => setActiveTab(t as FeedTab)}>
          <TabList className="px-2">
            <Tab value="following">Following</Tab>
            <Tab value="suggested">Suggested</Tab>
            <Tab value="trending">Trending</Tab>
          </TabList>
        </Tabs>

        {/* Tag filters */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                activeFilter === tag
                  ? "border-ink-primary bg-ink-primary text-canvas"
                  : "border-surface-border text-ink-secondary hover:border-ink-tertiary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <FeedSkeleton />
      ) : (
        <div>
          {MOCK_POSTS.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={(id) => console.log("Like", id)}
              onSave={(id) => console.log("Save", id)}
              onRepost={(id) => console.log("Repost", id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
