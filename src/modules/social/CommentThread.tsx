import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CommentCard } from "./CommentCard";
import { CommentComposer } from "./CommentComposer";
import type { Comment } from "@/types";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    post_id: "p1",
    author: {
      id: "u1",
      username: "alexmorgan",
      display_name: "Alex Morgan",
      email: "alex@example.com",
      avatar_url: null,
      cover_url: null,
      bio: "Frontend engineer obsessed with animation and UX.",
      location: "San Francisco, CA",
      website: "https://alexmorgan.dev",
      github_url: null,
      twitter_url: null,
      linkedin_url: null,
      followers_count: 1842,
      following_count: 340,
      posts_count: 94,
      is_verified: true,
      created_at: "2023-06-15T10:00:00Z",
      updated_at: "2024-11-01T08:00:00Z",
    },
    content:
      "This is a really clean approach. I've been doing something similar with CSS custom properties for theming — you can drive the whole palette from a single data attribute on <html>. Makes light/dark switching near-instant.",
    snippets: [
      {
        id: "s1",
        filename: "theme.css",
        language: "css",
        code: `[data-theme="dark"] {
  --bg: #0a0a0a;
  --fg: #f5f5f5;
}
[data-theme="light"] {
  --bg: #ffffff;
  --fg: #111111;
}`,
      },
    ],
    likes_count: 47,
    is_liked: false,
    replies_count: 2,
    parent_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    replies: [
      {
        id: "c1r1",
        post_id: "p1",
        author: {
          id: "u2",
          username: "priyanka_codes",
          display_name: "Priyanka Nair",
          email: "priyanka@example.com",
          avatar_url: null,
          cover_url: null,
          bio: null,
          location: null,
          website: null,
          github_url: null,
          twitter_url: null,
          linkedin_url: null,
          followers_count: 622,
          following_count: 195,
          posts_count: 38,
          is_verified: false,
          created_at: "2024-01-10T12:00:00Z",
          updated_at: "2024-11-01T08:00:00Z",
        },
        content:
          "Exactly what I was going to suggest! One thing I'd add — make sure to prefers-color-scheme media query sets the default so users without JS still see a sensible theme.",
        snippets: [],
        likes_count: 18,
        is_liked: true,
        replies_count: 0,
        parent_id: "c1",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        replies: [],
      },
      {
        id: "c1r2",
        post_id: "p1",
        author: {
          id: "u1",
          username: "alexmorgan",
          display_name: "Alex Morgan",
          email: "alex@example.com",
          avatar_url: null,
          cover_url: null,
          bio: null,
          location: null,
          website: null,
          github_url: null,
          twitter_url: null,
          linkedin_url: null,
          followers_count: 1842,
          following_count: 340,
          posts_count: 94,
          is_verified: true,
          created_at: "2023-06-15T10:00:00Z",
          updated_at: "2024-11-01T08:00:00Z",
        },
        content:
          "@priyanka_codes Good point! I always add the media query as a fallback. The JS just syncs the attribute after reading localStorage.",
        snippets: [],
        likes_count: 9,
        is_liked: false,
        replies_count: 0,
        parent_id: "c1",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    post_id: "p1",
    author: {
      id: "u3",
      username: "tobias_dev",
      display_name: "Tobias Kraft",
      email: "tobias@example.com",
      avatar_url: null,
      cover_url: null,
      bio: "Systems programmer, Rust advocate.",
      location: "Berlin, DE",
      website: null,
      github_url: null,
      twitter_url: null,
      linkedin_url: null,
      followers_count: 3120,
      following_count: 87,
      posts_count: 211,
      is_verified: true,
      created_at: "2022-09-01T08:00:00Z",
      updated_at: "2024-10-28T10:00:00Z",
    },
    content:
      "Nice write-up. Have you benchmarked this against container queries? I switched our dashboard to container queries last quarter and the layout logic got dramatically simpler — no more breakpoint gymnastics.",
    snippets: [],
    likes_count: 31,
    is_liked: false,
    replies_count: 0,
    parent_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    replies: [],
  },
  {
    id: "c3",
    post_id: "p1",
    author: {
      id: "u4",
      username: "sophieliu",
      display_name: "Sophie Liu",
      email: "sophie@example.com",
      avatar_url: null,
      cover_url: null,
      bio: "Design engineer. Making things look and feel great.",
      location: "London, UK",
      website: "https://sophieliu.design",
      github_url: null,
      twitter_url: null,
      linkedin_url: null,
      followers_count: 5480,
      following_count: 213,
      posts_count: 147,
      is_verified: true,
      created_at: "2021-03-22T09:00:00Z",
      updated_at: "2024-11-02T07:00:00Z",
    },
    content:
      "Sharing this with my whole team. We've been wrestling with this exact problem for months and I can already see two places where this pattern would clean up a lot of ugly workarounds.",
    snippets: [],
    likes_count: 62,
    is_liked: true,
    replies_count: 0,
    parent_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    replies: [],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface CommentThreadProps {
  postId: string;
}

export function CommentThread({ postId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [replyTarget, setReplyTarget] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  function handleReply(commentId: string, username: string) {
    setReplyTarget({ id: commentId, username });
  }

  function handleLike(commentId: string) {
    // Toggle like in state (already handled locally in CommentCard; this is for server sync)
    console.log("like comment", commentId);
  }

  function handleCommentSubmit(content: string, snippet?: string) {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      post_id: postId,
      author: {
        id: "me",
        username: "you",
        display_name: "You",
        email: "you@example.com",
        avatar_url: null,
        cover_url: null,
        bio: null,
        location: null,
        website: null,
        github_url: null,
        twitter_url: null,
        linkedin_url: null,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      content,
      snippets: snippet
        ? [{ id: `s${Date.now()}`, filename: "", language: "plaintext", code: snippet }]
        : [],
      likes_count: 0,
      is_liked: false,
      replies_count: 0,
      parent_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    setReplyTarget(null);
  }

  async function handleLoadMore() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setAllLoaded(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Composer */}
      <CommentComposer
        postId={postId}
        replyTo={replyTarget?.username}
        onSubmit={handleCommentSubmit}
      />

      {/* Divider */}
      <div className="border-t border-[#2e2e2e]" />

      {/* Comment count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#f5f5f5]">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </span>
        {replyTarget && (
          <button
            onClick={() => setReplyTarget(null)}
            className="text-xs text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
          >
            Cancel reply
          </button>
        )}
      </div>

      {/* Comments list */}
      <div className="flex flex-col gap-5">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
            depth={0}
          />
        ))}
      </div>

      {/* Load more */}
      {!allLoaded && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2e2e2e] bg-[#111111] py-3 text-sm font-medium text-[#6b6b6b] transition-colors hover:border-[#6b6b6b] hover:text-[#a3a3a3] disabled:pointer-events-none disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </>
          ) : (
            "Load more comments"
          )}
        </button>
      )}

      {allLoaded && (
        <p className="text-center text-xs text-[#3d3d3d]">All comments loaded</p>
      )}
    </div>
  );
}
