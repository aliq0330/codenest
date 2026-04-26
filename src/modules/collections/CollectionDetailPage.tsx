import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Bookmark, Globe, Lock, Edit2 } from "lucide-react";
import { Avatar, Badge, TagPill, Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "@/lib/utils";
import type { Post } from "@/types";

const MOCK_POSTS: Post[] = [
  {
    id: "sp1", type: "snippet",
    author: { id: "u1", username: "alexchen", display_name: "Alex Chen", email: "", avatar_url: null, cover_url: null, bio: null, location: null, website: null, github_url: null, twitter_url: null, linkedin_url: null, followers_count: 12400, following_count: 340, posts_count: 892, is_verified: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    title: "CSS Grid masonry layout",
    content: "Pure CSS masonry with grid-template-rows: masonry",
    tags: ["css", "grid"], language: "css", snippets: [], media: [],
    likes_count: 847, comments_count: 42, reposts_count: 156, saves_count: 213, views_count: 9800,
    is_liked: true, is_saved: true, is_reposted: false,
    reposted_post: null, quoted_post: null, article: null, project: null,
    is_draft: false, published_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const COLLECTIONS: Record<string, { name: string; description: string; is_public: boolean; posts_count: number }> = {
    c1: { name: "React Components", description: "Reusable React component patterns I love", is_public: true, posts_count: 24 },
    c2: { name: "CSS Effects", description: "Stunning pure CSS visual effects", is_public: true, posts_count: 18 },
  };

  const col = COLLECTIONS[id ?? "c1"] ?? COLLECTIONS.c1;

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <Link to="/collections" className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex-1 text-base font-bold text-[#f5f5f5]">{col.name}</h1>
        <Button size="sm" variant="ghost" icon={<Edit2 className="h-3.5 w-3.5" />}>Edit</Button>
      </div>

      <div className="border-b border-[#2e2e2e] px-4 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Bookmark className="h-4 w-4 text-[#6b6b6b]" />
          {col.is_public
            ? <Badge variant="success"><Globe className="mr-1 h-3 w-3 inline" />Public</Badge>
            : <Badge><Lock className="mr-1 h-3 w-3 inline" />Private</Badge>}
          <span className="text-xs text-[#6b6b6b]">{col.posts_count} posts</span>
        </div>
        {col.description && <p className="text-sm text-[#a3a3a3]">{col.description}</p>}
      </div>

      {/* Saved posts */}
      <div className="divide-y divide-[#2e2e2e]">
        {MOCK_POSTS.map((p) => (
          <div
            key={p.id}
            className="cursor-pointer px-4 py-4 transition-colors hover:bg-[#0d0d0d]"
            onClick={() => navigate(`/post/${p.id}`)}
          >
            <div className="flex items-start gap-3">
              <Avatar src={p.author.avatar_url} alt={p.author.display_name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-medium text-[#f5f5f5]">{p.author.display_name}</span>
                  <span className="text-xs text-[#6b6b6b]">@{p.author.username}</span>
                </div>
                {p.title && <p className="text-sm font-semibold text-[#f5f5f5] mb-1">{p.title}</p>}
                <p className="text-sm text-[#a3a3a3] line-clamp-2">{p.content}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => <TagPill key={t} label={t} />)}
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-[#6b6b6b]">
                  <span>{formatNumber(p.likes_count)} likes</span>
                  <span>{p.comments_count} comments</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {MOCK_POSTS.length < col.posts_count && (
          <div className="px-4 py-3">
            <p className="text-xs text-center text-[#6b6b6b]">+{col.posts_count - MOCK_POSTS.length} more saved posts</p>
          </div>
        )}
      </div>
    </div>
  );
}
