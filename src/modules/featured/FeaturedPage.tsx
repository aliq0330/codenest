import { useNavigate } from "react-router-dom";
import { Star, Award, TrendingUp, Hash } from "lucide-react";
import { Avatar, Badge, TagPill } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

const EDITOR_PICK = {
  id: "ep1",
  title: "Building a Design System from Scratch with CSS Custom Properties",
  content: "A comprehensive guide on creating a scalable design system using CSS custom properties, semantic tokens, and component-driven architecture. This approach makes theming trivial and keeps your codebase consistent.",
  author: { username: "alexchen", display_name: "Alex Chen", avatar_url: null },
  tags: ["css", "design-system", "architecture"],
  likes_count: 4230,
  reading_time: 12,
};

const TOP_POSTS = [
  { rank: 1, title: "10 CSS tricks you didn't know existed", author: "Sara Kaya", likes: 8920, tags: ["css", "tips"] },
  { rank: 2, title: "React 19 new hooks deep dive", author: "Alex Chen", likes: 7340, tags: ["react", "hooks"] },
  { rank: 3, title: "TypeScript type gymnastics that save lives", author: "Ryo Nakamura", likes: 6210, tags: ["typescript"] },
];

const TOP_DEVS = [
  { rank: 1, username: "alexchen", display_name: "Alex Chen", avatar_url: null, posts: 892, followers: 12400, likes: 48200 },
  { rank: 2, username: "saradev", display_name: "Sara Kaya", avatar_url: null, posts: 634, followers: 8900, likes: 34100 },
  { rank: 3, username: "ryo_codes", display_name: "Ryo Nakamura", avatar_url: null, posts: 421, followers: 6200, likes: 23800 },
  { rank: 4, username: "mia_ts", display_name: "Mia Tanaka", avatar_url: null, posts: 315, followers: 4300, likes: 18900 },
  { rank: 5, username: "dev_max", display_name: "Max Hoffmann", avatar_url: null, posts: 287, followers: 3100, likes: 14200 },
];

const POPULAR_TAGS = [
  { tag: "css", posts: 12400 }, { tag: "react", posts: 10800 }, { tag: "typescript", posts: 9200 },
  { tag: "javascript", posts: 8900 }, { tag: "animation", posts: 4200 }, { tag: "algorithms", posts: 3800 },
  { tag: "accessibility", posts: 3400 }, { tag: "performance", posts: 3100 }, { tag: "dark-mode", posts: 2900 },
  { tag: "nextjs", posts: 2700 }, { tag: "vue", posts: 2400 }, { tag: "grid", posts: 2200 },
];

const RANK_COLORS = ["text-yellow-400", "text-[#a3a3a3]", "text-orange-400", "text-[#6b6b6b]", "text-[#6b6b6b]"];

export function FeaturedPage() {
  const navigate = useNavigate();

  return (
    <div className="py-2">
      <div className="sticky top-0 z-10 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-[#f5f5f5]">Featured</h1>
        <p className="text-xs text-[#6b6b6b]">Editor's picks and community favorites</p>
      </div>

      {/* Editor's Pick */}
      <section className="border-b border-[#2e2e2e] px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-yellow-400" />
          <h2 className="text-sm font-semibold text-[#f5f5f5]">Editor's Pick</h2>
          <Badge variant="warning">This Week</Badge>
        </div>
        <div
          className="cursor-pointer rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-[#111111] to-[#1a1a1a] p-6 transition-all hover:border-yellow-500/40"
          onClick={() => navigate("/post/ep1")}
        >
          <div className="mb-3 flex items-center gap-2">
            <Avatar src={EDITOR_PICK.author.avatar_url} alt={EDITOR_PICK.author.display_name} size="sm" />
            <span className="text-sm font-medium text-[#f5f5f5]">{EDITOR_PICK.author.display_name}</span>
            <span className="text-xs text-[#6b6b6b]">@{EDITOR_PICK.author.username}</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-[#f5f5f5]">{EDITOR_PICK.title}</h3>
          <p className="mb-4 text-sm text-[#a3a3a3] leading-relaxed line-clamp-3">{EDITOR_PICK.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {EDITOR_PICK.tags.map((t) => <TagPill key={t} label={t} />)}
            </div>
            <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
              <span>{EDITOR_PICK.reading_time} min read</span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {formatNumber(EDITOR_PICK.likes_count)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* This Week's Best */}
      <section className="border-b border-[#2e2e2e] px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#6b6b6b]" />
          <h2 className="text-sm font-semibold text-[#f5f5f5]">This Week's Best</h2>
        </div>
        <div className="flex flex-col gap-3">
          {TOP_POSTS.map((p) => (
            <div
              key={p.rank}
              className="flex items-start gap-4 cursor-pointer rounded-xl border border-[#2e2e2e] bg-[#111111] p-4 transition-all hover:bg-[#1a1a1a]"
              onClick={() => navigate("/feed")}
            >
              <span className={`w-6 shrink-0 text-2xl font-black ${RANK_COLORS[p.rank - 1]}`}>
                #{p.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#f5f5f5] line-clamp-2">{p.title}</p>
                <p className="mt-0.5 text-xs text-[#6b6b6b]">by {p.author}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => <TagPill key={t} label={t} />)}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-sm font-semibold text-[#a3a3a3]">
                <Star className="h-4 w-4 text-yellow-400" />
                {formatNumber(p.likes)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Developers */}
      <section className="border-b border-[#2e2e2e] px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-[#6b6b6b]" />
          <h2 className="text-sm font-semibold text-[#f5f5f5]">Most Loved Developers</h2>
        </div>
        <div className="flex flex-col gap-2">
          {TOP_DEVS.map((dev) => (
            <div
              key={dev.username}
              className="flex items-center gap-3 cursor-pointer rounded-xl border border-[#2e2e2e] bg-[#111111] p-3 transition-all hover:bg-[#1a1a1a]"
              onClick={() => navigate(`/profile/${dev.username}`)}
            >
              <span className={`w-6 shrink-0 text-base font-black ${RANK_COLORS[dev.rank - 1]}`}>
                #{dev.rank}
              </span>
              <Avatar src={dev.avatar_url} alt={dev.display_name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#f5f5f5]">{dev.display_name}</p>
                <p className="text-xs text-[#6b6b6b]">@{dev.username}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-[#6b6b6b]">
                <span><span className="font-semibold text-[#a3a3a3]">{dev.posts}</span> posts</span>
                <span><span className="font-semibold text-[#a3a3a3]">{formatNumber(dev.followers)}</span> followers</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400" />
                  {formatNumber(dev.likes)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tags */}
      <section className="px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Hash className="h-4 w-4 text-[#6b6b6b]" />
          <h2 className="text-sm font-semibold text-[#f5f5f5]">Popular Tags This Week</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map(({ tag, posts }) => (
            <button
              key={tag}
              onClick={() => navigate(`/tags/${tag}`)}
              className="flex items-center gap-2 rounded-full border border-[#2e2e2e] bg-[#1a1a1a] px-3 py-1.5 text-xs transition-all hover:border-[#6b6b6b]"
            >
              <span className="text-[#6b6b6b]">#</span>
              <span className="font-medium text-[#a3a3a3]">{tag}</span>
              <span className="text-[#3d3d3d]">{formatNumber(posts)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
