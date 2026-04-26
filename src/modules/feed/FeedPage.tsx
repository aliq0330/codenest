import { useState, useEffect, useCallback } from "react";
import { Tabs, TabList, Tab, FeedSkeleton } from "@/components/ui";
import { PostCard } from "@/modules/post/PostCard";
import { postsService } from "@/services/posts.service";
import type { Post, FeedTab } from "@/types";

const FILTERS = ["All", "React", "TypeScript", "CSS", "Algorithms", "HTML", "Vue"];

export function FeedPage() {
  const [feedTab, setFeedTab] = useState<FeedTab>("suggested");
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async (tab: FeedTab, reset = false) => {
    if (reset) {
      setLoading(true);
      setCursor(undefined);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const nextCursor = reset ? undefined : cursor;
      const data = await postsService.getFeed(tab, nextCursor, 20);
      if (reset) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
      if (data.length < 20) setHasMore(false);
      if (data.length > 0) setCursor(data[data.length - 1].created_at);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [cursor]);

  useEffect(() => {
    loadPosts(feedTab, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedTab]);

  const filtered =
    activeFilter === "All"
      ? posts
      : posts.filter((p) =>
          p.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase())
        );

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="px-4 pt-3 pb-0">
          <h1 className="text-lg font-bold text-[#f5f5f5]">Home</h1>
        </div>
        <Tabs defaultTab="suggested" onChange={(t) => setFeedTab(t as FeedTab)}>
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
        {loading ? (
          <FeedSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm text-[#6b6b6b]">
              {activeFilter !== "All"
                ? `No posts found for "${activeFilter}".`
                : feedTab === "following"
                ? "Follow some users to see their posts here."
                : "No posts yet. Be the first to share something!"}
            </p>
          </div>
        ) : (
          <>
            {filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={(id) => console.log("like", id)}
                onRepost={(id) => console.log("repost", id)}
                onSave={(id) => console.log("save", id)}
              />
            ))}
            {hasMore && activeFilter === "All" && (
              <div className="flex justify-center py-6">
                <button
                  onClick={() => loadPosts(feedTab)}
                  disabled={loadingMore}
                  className="rounded-lg border border-[#2e2e2e] bg-[#111111] px-4 py-2 text-sm text-[#6b6b6b] transition-colors hover:border-[#6b6b6b] hover:text-[#a3a3a3] disabled:opacity-40"
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
