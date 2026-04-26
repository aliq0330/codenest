import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, GitFork, Users, Hash } from "lucide-react";
import { Avatar, Badge, TagPill } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

const LANG_TABS = ["All", "HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue"];

const PROJECTS = [
  { id: "pr1", title: "Dark Mode CSS Variables System", description: "A complete dark/light theme system using CSS custom properties. Zero JavaScript.", tags: ["css", "dark-mode"], author: { username: "alexchen", display_name: "Alex Chen", avatar_url: null }, stars: 2340, forks: 187, language: "CSS" },
  { id: "pr2", title: "React Hook Form Builder", description: "Dynamic form builder with validation using React Hook Form + Zod.", tags: ["react", "forms", "typescript"], author: { username: "saradev", display_name: "Sara Kaya", avatar_url: null }, stars: 1890, forks: 234, language: "TypeScript" },
  { id: "pr3", title: "Vanilla JS Infinite Scroll", description: "Performant infinite scroll with Intersection Observer API. No dependencies.", tags: ["javascript", "performance"], author: { username: "ryo_codes", display_name: "Ryo Nakamura", avatar_url: null }, stars: 1250, forks: 98, language: "JavaScript" },
  { id: "pr4", title: "CSS Grid Layout Templates", description: "20+ responsive grid layout templates ready to copy-paste.", tags: ["css", "grid", "layout"], author: { username: "mia_ts", display_name: "Mia Tanaka", avatar_url: null }, stars: 980, forks: 312, language: "CSS" },
  { id: "pr5", title: "Vue 3 Composables Collection", description: "50+ battle-tested Vue 3 composables for common use cases.", tags: ["vue", "composables"], author: { username: "dev_max", display_name: "Max Hoffmann", avatar_url: null }, stars: 876, forks: 143, language: "Vue" },
  { id: "pr6", title: "TypeScript Utility Types", description: "Advanced TypeScript utility types for complex type manipulations.", tags: ["typescript", "types"], author: { username: "alexchen", display_name: "Alex Chen", avatar_url: null }, stars: 743, forks: 89, language: "TypeScript" },
];

const USERS = [
  { username: "alexchen", display_name: "Alex Chen", avatar_url: null, followers_count: 12400, bio: "CSS wizard" },
  { username: "saradev", display_name: "Sara Kaya", avatar_url: null, followers_count: 8900, bio: "React dev" },
  { username: "ryo_codes", display_name: "Ryo Nakamura", avatar_url: null, followers_count: 6200, bio: "JS enthusiast" },
  { username: "mia_ts", display_name: "Mia Tanaka", avatar_url: null, followers_count: 4300, bio: "TypeScript lover" },
  { username: "dev_max", display_name: "Max Hoffmann", avatar_url: null, followers_count: 3100, bio: "Vue & Vite" },
  { username: "coder_ana", display_name: "Ana Lima", avatar_url: null, followers_count: 2800, bio: "Full-stack" },
];

const LANG_COLORS: Record<string, string> = {
  CSS: "bg-sky-500/10 text-sky-400",
  JavaScript: "bg-yellow-500/10 text-yellow-400",
  TypeScript: "bg-blue-500/10 text-blue-400",
  Vue: "bg-green-500/10 text-green-400",
  React: "bg-cyan-500/10 text-cyan-400",
  HTML: "bg-orange-500/10 text-orange-400",
};

export function ExplorePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const filtered = activeTab === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.language === activeTab || p.tags.includes(activeTab.toLowerCase()));

  const toggleFollow = (username: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      next.has(username) ? next.delete(username) : next.add(username);
      return next;
    });
  };

  return (
    <div className="py-2">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-[#f5f5f5]">Explore</h1>
        {/* Language tabs */}
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {LANG_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                activeTab === t
                  ? "border-[#f5f5f5] bg-[#f5f5f5] text-[#0a0a0a]"
                  : "border-[#2e2e2e] text-[#a3a3a3] hover:border-[#6b6b6b]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Projects */}
      <section className="border-b border-[#2e2e2e] px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-[#6b6b6b]" />
          <h2 className="text-sm font-semibold text-[#f5f5f5]">Popular Projects</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="cursor-pointer rounded-xl border border-[#2e2e2e] bg-[#111111] p-4 transition-all hover:border-[#6b6b6b] hover:bg-[#1a1a1a]"
              onClick={() => navigate(`/editor/new`)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-[#f5f5f5] line-clamp-1">{proj.title}</h3>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${LANG_COLORS[proj.language] ?? "bg-[#1a1a1a] text-[#a3a3a3]"}`}>
                  {proj.language}
                </span>
              </div>
              <p className="mb-3 text-xs text-[#6b6b6b] line-clamp-2">{proj.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {proj.tags.map((t) => <TagPill key={t} label={t} />)}
              </div>
              <div className="flex items-center justify-between">
                <button onClick={(e) => { e.stopPropagation(); navigate(`/profile/${proj.author.username}`); }} className="flex items-center gap-1.5">
                  <Avatar src={proj.author.avatar_url} alt={proj.author.display_name} size="xs" />
                  <span className="text-xs text-[#6b6b6b]">{proj.author.display_name}</span>
                </button>
                <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" />{formatNumber(proj.stars)}</span>
                  <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{proj.forks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Users */}
      <section className="border-b border-[#2e2e2e] px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-[#6b6b6b]" />
          <h2 className="text-sm font-semibold text-[#f5f5f5]">Trending Developers</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {USERS.map((u) => (
            <div key={u.username} className="shrink-0 w-44 rounded-xl border border-[#2e2e2e] bg-[#111111] p-4 text-center">
              <button onClick={() => navigate(`/profile/${u.username}`)}>
                <Avatar src={u.avatar_url} alt={u.display_name} size="lg" className="mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#f5f5f5] truncate">{u.display_name}</p>
                <p className="text-xs text-[#6b6b6b] mb-1">@{u.username}</p>
                <p className="text-xs text-[#6b6b6b] mb-3">{u.bio}</p>
                <p className="text-xs font-medium text-[#a3a3a3]">{formatNumber(u.followers_count)} followers</p>
              </button>
              <button
                onClick={() => toggleFollow(u.username)}
                className={`mt-3 w-full rounded-full border py-1.5 text-xs font-medium transition-all ${
                  following.has(u.username)
                    ? "border-[#6b6b6b] text-[#a3a3a3]"
                    : "border-[#f5f5f5] bg-[#f5f5f5] text-[#0a0a0a] hover:opacity-90"
                }`}
              >
                {following.has(u.username) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tags */}
      <section className="px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Hash className="h-4 w-4 text-[#6b6b6b]" />
          <h2 className="text-sm font-semibold text-[#f5f5f5]">Popular Tags</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { tag: "react", posts: 8920 }, { tag: "typescript", posts: 7340 }, { tag: "css", posts: 6210 },
            { tag: "javascript", posts: 12400 }, { tag: "nextjs", posts: 4320 }, { tag: "vue", posts: 3210 },
            { tag: "animation", posts: 2890 }, { tag: "algorithms", posts: 2340 }, { tag: "accessibility", posts: 1980 },
            { tag: "dark-mode", posts: 1560 }, { tag: "performance", posts: 2100 }, { tag: "grid", posts: 1890 },
          ].map(({ tag, posts }) => (
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
