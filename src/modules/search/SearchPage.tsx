import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Tabs, TabList, Tab, TabPanel, Avatar, TagPill, Badge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

const MOCK_POSTS = [
  { id: "sp1", title: "CSS grid masonry layout", content: "Pure CSS masonry with grid-template-rows", tags: ["css", "grid"], author: "Alex Chen", likes: 847 },
  { id: "sp2", title: "useDebounce TypeScript hook", content: "Production-ready debounce with cleanup", tags: ["react", "typescript"], author: "Sara Kaya", likes: 1290 },
  { id: "sp3", title: "Vanilla drag & drop", content: "30 lines of pure JavaScript", tags: ["javascript"], author: "Ryo Nakamura", likes: 876 },
  { id: "sp4", title: "CSS scroll animations", content: "No JavaScript needed", tags: ["css", "animation"], author: "Mia Tanaka", likes: 2140 },
  { id: "sp5", title: "React 19 concurrent features", content: "Deep dive into the new concurrent rendering model", tags: ["react"], author: "Max Hoffmann", likes: 3200 },
];

const MOCK_USERS = [
  { username: "alexchen", display_name: "Alex Chen", avatar_url: null, followers_count: 12400, bio: "CSS wizard & frontend developer" },
  { username: "saradev", display_name: "Sara Kaya", avatar_url: null, followers_count: 8900, bio: "React & TypeScript specialist" },
  { username: "ryo_codes", display_name: "Ryo Nakamura", avatar_url: null, followers_count: 6200, bio: "JavaScript enthusiast" },
  { username: "mia_ts", display_name: "Mia Tanaka", avatar_url: null, followers_count: 4300, bio: "TypeScript & Vue developer" },
  { username: "dev_max", display_name: "Max Hoffmann", avatar_url: null, followers_count: 3100, bio: "Full-stack, Vue & Vite" },
];

const MOCK_TAGS = [
  { tag: "css", posts: 12400 }, { tag: "react", posts: 10800 }, { tag: "typescript", posts: 9200 },
  { tag: "javascript", posts: 8900 }, { tag: "animation", posts: 4200 }, { tag: "grid", posts: 3100 },
  { tag: "hooks", posts: 2900 }, { tag: "performance", posts: 2400 },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  const q = searchParams.get("q") ?? "";

  return (
    <div>
      {/* Search header */}
      <div className="sticky top-0 z-10 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <form onSubmit={handleSearch} className="relative flex items-center gap-2">
          <Search className="absolute left-3 h-4 w-4 text-[#6b6b6b] pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, users, tags..."
            autoFocus
            className="w-full rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] py-2.5 pl-9 pr-8 text-sm text-[#f5f5f5] placeholder:text-[#3d3d3d] focus:border-[#6b6b6b] focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute right-3 text-[#6b6b6b] hover:text-[#f5f5f5]">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
        {q && (
          <p className="mt-2 text-xs text-[#6b6b6b]">
            Results for <span className="font-semibold text-[#a3a3a3]">"{q}"</span>
          </p>
        )}
      </div>

      {!q ? (
        <div className="flex flex-col items-center py-20 text-[#6b6b6b]">
          <Search className="h-8 w-8 mb-3 opacity-30" />
          <p className="text-sm">Search for posts, users, or tags</p>
        </div>
      ) : (
        <Tabs defaultTab="posts">
          <TabList className="px-2 border-b border-[#2e2e2e]">
            <Tab value="posts">Posts</Tab>
            <Tab value="users">Users</Tab>
            <Tab value="tags">Tags</Tab>
          </TabList>

          <TabPanel value="posts">
            {MOCK_POSTS.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/post/${p.id}`)}
                className="cursor-pointer border-b border-[#2e2e2e] px-4 py-4 transition-colors hover:bg-[#0d0d0d]"
              >
                {p.title && <h3 className="text-sm font-semibold text-[#f5f5f5] mb-1">{p.title}</h3>}
                <p className="text-sm text-[#a3a3a3] line-clamp-2">{p.content}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => <TagPill key={t} label={t} />)}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#6b6b6b]">
                  <span>{p.author}</span>
                  <span>·</span>
                  <span>{formatNumber(p.likes)} likes</span>
                </div>
              </div>
            ))}
          </TabPanel>

          <TabPanel value="users">
            {MOCK_USERS.map((u) => (
              <div key={u.username} className="flex items-center justify-between border-b border-[#2e2e2e] px-4 py-4">
                <button
                  onClick={() => navigate(`/profile/${u.username}`)}
                  className="flex items-center gap-3"
                >
                  <Avatar src={u.avatar_url} alt={u.display_name} size="md" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#f5f5f5]">{u.display_name}</p>
                    <p className="text-xs text-[#6b6b6b]">@{u.username}</p>
                    <p className="text-xs text-[#6b6b6b] mt-0.5">{u.bio}</p>
                  </div>
                </button>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-[#6b6b6b]">{formatNumber(u.followers_count)} followers</span>
                  <button
                    onClick={() => setFollowing((prev) => { const n = new Set(prev); n.has(u.username) ? n.delete(u.username) : n.add(u.username); return n; })}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${following.has(u.username) ? "border-[#6b6b6b] text-[#a3a3a3]" : "border-[#f5f5f5] bg-[#f5f5f5] text-[#0a0a0a] hover:opacity-90"}`}
                  >
                    {following.has(u.username) ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </TabPanel>

          <TabPanel value="tags">
            <div className="flex flex-wrap gap-3 p-4">
              {MOCK_TAGS.map(({ tag, posts }) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/tags/${tag}`)}
                  className="flex items-center gap-2 rounded-full border border-[#2e2e2e] bg-[#1a1a1a] px-4 py-2 text-sm transition-all hover:border-[#6b6b6b]"
                >
                  <span className="text-[#6b6b6b]">#</span>
                  <span className="font-medium text-[#a3a3a3]">{tag}</span>
                  <span className="text-[#3d3d3d]">{formatNumber(posts)}</span>
                </button>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
}
