import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Hash } from "lucide-react";
import { PostCard } from "@/modules/post/PostCard";
import type { Post } from "@/types";
import { formatNumber } from "@/lib/utils";

function mockAuthor(n: number) {
  const list = [
    { username: "alexchen", display_name: "Alex Chen" },
    { username: "saradev", display_name: "Sara Kaya" },
    { username: "ryo_codes", display_name: "Ryo Nakamura" },
  ];
  const u = list[n % list.length];
  return {
    id: `u${n}`, ...u, email: "", avatar_url: null, cover_url: null, bio: null,
    location: null, website: null, github_url: null, twitter_url: null, linkedin_url: null,
    followers_count: 5000 + n * 1000, following_count: 200, posts_count: 100 + n * 20,
    is_verified: n === 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
}

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();

  const posts: Post[] = Array.from({ length: 6 }, (_, i) => ({
    id: `tag-p${i}`, type: "snippet" as const, author: mockAuthor(i),
    title: i % 2 === 0 ? `${tag} example #${i + 1}` : null,
    content: `Here's a practical example using #${tag}. This technique improved my workflow significantly.`,
    tags: [tag ?? "code", "example"],
    language: null, snippets: [], media: [],
    likes_count: Math.floor(Math.random() * 2000),
    comments_count: Math.floor(Math.random() * 100),
    reposts_count: Math.floor(Math.random() * 300),
    saves_count: Math.floor(Math.random() * 200),
    views_count: Math.floor(Math.random() * 10000),
    is_liked: false, is_saved: false, is_reposted: false,
    reposted_post: null, quoted_post: null, article: null, project: null,
    is_draft: false, published_at: new Date(Date.now() - i * 86400000).toISOString(),
    created_at: new Date(Date.now() - i * 86400000).toISOString(), updated_at: new Date().toISOString(),
  }));

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <Link to="/explore" className="mb-2 flex items-center gap-2 text-xs text-[#6b6b6b] hover:text-[#a3a3a3]">
          <ArrowLeft className="h-3 w-3" /> Back to Explore
        </Link>
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-[#6b6b6b]" />
          <h1 className="text-xl font-bold text-[#f5f5f5]">{tag}</h1>
          <span className="rounded-full bg-[#1a1a1a] px-2 py-0.5 text-xs text-[#6b6b6b]">
            {formatNumber(1240 + Math.floor(Math.random() * 5000))} posts
          </span>
        </div>
      </div>
      <div>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
