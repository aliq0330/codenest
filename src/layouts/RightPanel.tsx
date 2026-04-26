import { useNavigate } from "react-router-dom";
import { TrendingUp, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

const TRENDING = [
  { tag: "react", posts: 2340 },
  { tag: "typescript", posts: 1890 },
  { tag: "css-art", posts: 1250 },
  { tag: "algorithms", posts: 980 },
  { tag: "nextjs", posts: 876 },
];

const SUGGESTED = [
  { username: "alexchen", display_name: "Alex Chen", avatar_url: null, followers_count: 12400 },
  { username: "saradev", display_name: "Sara Kaya", avatar_url: null, followers_count: 8900 },
  { username: "ryo_codes", display_name: "Ryo Nakamura", avatar_url: null, followers_count: 6200 },
];

export function RightPanel() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Trending */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#6b6b6b]" />
          <h3 className="text-sm font-semibold text-[#f5f5f5]">Trending Tags</h3>
        </div>
        <div className="flex flex-col gap-0.5">
          {TRENDING.map(({ tag, posts }) => (
            <button
              key={tag}
              onClick={() => navigate(`/tags/${tag}`)}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[#1a1a1a]"
            >
              <span className="text-sm font-medium text-[#a3a3a3]">#{tag}</span>
              <span className="text-xs text-[#6b6b6b]">
                {posts >= 1000 ? `${(posts / 1000).toFixed(1)}K` : posts} posts
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate("/tags")}
          className="mt-1 block text-xs text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
        >
          Show all →
        </button>
      </section>

      {/* Suggested */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-[#6b6b6b]" />
          <h3 className="text-sm font-semibold text-[#f5f5f5]">Who to Follow</h3>
        </div>
        <div className="flex flex-col gap-3">
          {SUGGESTED.map((u) => (
            <div key={u.username} className="flex items-center justify-between">
              <button
                onClick={() => navigate(`/@${u.username}`)}
                className="flex items-center gap-2.5"
              >
                <Avatar src={u.avatar_url} alt={u.display_name} size="sm" />
                <div className="text-left">
                  <p className="text-sm font-medium leading-none text-[#f5f5f5]">{u.display_name}</p>
                  <p className="mt-0.5 text-xs text-[#6b6b6b]">@{u.username}</p>
                </div>
              </button>
              <button className="rounded-full border border-[#2e2e2e] px-3 py-1 text-xs font-medium text-[#a3a3a3] transition-all hover:border-[#6b6b6b] hover:text-[#f5f5f5]">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto pt-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {["About", "Privacy", "Terms", "Help"].map((l) => (
            <a key={l} href="#" className="text-xs text-[#3d3d3d] hover:text-[#6b6b6b]">{l}</a>
          ))}
        </div>
        <p className="mt-2 text-xs text-[#3d3d3d]">© 2026 CodeNest</p>
      </div>
    </div>
  );
}
