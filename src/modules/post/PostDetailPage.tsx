import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "./PostCard";
import { CommentThread } from "@/modules/social/CommentThread";
import type { Post } from "@/types";

const MOCK_POST: Post = {
  id: "p1", type: "snippet",
  author: {
    id: "u1", username: "alexchen", display_name: "Alex Chen", email: "alex@example.com",
    avatar_url: null, cover_url: null, bio: "Frontend engineer", location: "Berlin",
    website: null, github_url: null, twitter_url: null, linkedin_url: null,
    followers_count: 12400, following_count: 340, posts_count: 892,
    is_verified: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  title: "CSS scroll-driven animations — no JavaScript!",
  content: "The new @scroll-timeline API lets you create scroll-driven animations purely in CSS. Here's a reading progress bar with just 10 lines of CSS. Browser support is now good enough to use in production (with a fallback).",
  tags: ["css", "animation", "no-js"],
  language: "css",
  snippets: [{
    id: "s1", filename: "progress.css", language: "css",
    code: `@keyframes grow-progress {\n  from { transform: scaleX(0); }\n  to { transform: scaleX(1); }\n}\n\n.progress-bar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 4px;\n  background: #f5f5f5;\n  transform-origin: left;\n  animation: grow-progress auto linear;\n  animation-timeline: scroll();\n}`
  }],
  media: [], likes_count: 2140, comments_count: 67, reposts_count: 423, saves_count: 318,
  views_count: 18900, is_liked: false, is_saved: false, is_reposted: false,
  reposted_post: null, quoted_post: null, article: null, project: null,
  is_draft: false, published_at: new Date(Date.now() - 7200000).toISOString(),
  created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(),
};

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {/* Back nav */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <Link
          to="/feed"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-base font-bold text-[#f5f5f5]">Post</h1>
      </div>

      <PostCard post={MOCK_POST} showConnector />

      <CommentThread postId={id ?? "p1"} />
    </div>
  );
}
