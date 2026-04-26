import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  Heart,
  Bookmark,
  Globe,
  Lock,
  GitFork,
} from "lucide-react";
import {
  Avatar,
  Badge,
  TagPill,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@/components/ui";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";

interface MockPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  createdAt: string;
}

interface MockCollection {
  id: string;
  name: string;
  postCount: number;
  isPublic: boolean;
  gradient: string;
}

interface MockArticle {
  id: string;
  title: string;
  subtitle: string;
  readingTime: number;
  createdAt: string;
}

function buildMockData(username: string) {
  const displayName =
    username.charAt(0).toUpperCase() + username.slice(1).replace(/[_-]/g, " ");

  const posts: MockPost[] = [
    {
      id: "1",
      title: "Debounce vs Throttle — practical examples",
      content:
        "Two patterns that look similar but solve different problems. Here's when to use each one with real code.",
      tags: ["javascript", "performance", "patterns"],
      likes: 412,
      createdAt: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    },
    {
      id: "2",
      title: "CSS Grid auto-fill vs auto-fit explained",
      content:
        "These two keywords behave identically until you have fewer items than columns. Here's the difference.",
      tags: ["css", "layout", "grid"],
      likes: 289,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "3",
      title: "useEffect cleanup: why it matters",
      content:
        "Memory leaks in React components usually come from missing cleanup functions. Here's the pattern.",
      tags: ["react", "hooks", "typescript"],
      likes: 731,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    },
    {
      id: "4",
      title: "Zod schema inference for API responses",
      content:
        "Stop writing duplicate TypeScript interfaces. Let Zod generate your types from runtime validators.",
      tags: ["typescript", "zod", "api"],
      likes: 553,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];

  const collections: MockCollection[] = [
    {
      id: "c1",
      name: "React Patterns",
      postCount: 18,
      isPublic: true,
      gradient: "from-blue-900/60 to-indigo-900/60",
    },
    {
      id: "c2",
      name: "CSS Tricks",
      postCount: 11,
      isPublic: true,
      gradient: "from-purple-900/60 to-pink-900/60",
    },
    {
      id: "c3",
      name: "Private Notes",
      postCount: 7,
      isPublic: false,
      gradient: "from-zinc-800/80 to-zinc-900/80",
    },
    {
      id: "c4",
      name: "Performance Tips",
      postCount: 24,
      isPublic: true,
      gradient: "from-emerald-900/60 to-teal-900/60",
    },
  ];

  const articles: MockArticle[] = [
    {
      id: "a1",
      title: "Building a design system from scratch",
      subtitle:
        "A step-by-step guide to creating a cohesive component library that scales with your team and product.",
      readingTime: 8,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "a2",
      title: "The case for server components in 2025",
      subtitle:
        "React Server Components aren't just an optimization — they change how you think about data fetching entirely.",
      readingTime: 6,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    },
  ];

  return { displayName, posts, collections, articles };
}

export function ProfilePage({ username }: { username?: string }) {
  const navigate = useNavigate();
  const isOwnProfile = username === "me" || username === "alexchen";
  const [isFollowing, setIsFollowing] = useState(false);

  const { displayName, posts, collections, articles } = buildMockData(username ?? "me");

  const followerCount = 3_847;
  const followingCount = 214;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Cover */}
      <div className="h-32 w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] relative" />

      {/* Profile header */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="relative flex items-end justify-between -mt-8 mb-4">
          <Avatar
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            alt={displayName}
            size="xl"
            className="ring-4 ring-[#0a0a0a] bg-[#111111]"
          />
          <div className="flex items-center gap-2 pb-1">
            {isOwnProfile ? (
              <button
                onClick={() => navigate("/settings")}
                className="rounded-lg border border-[#2e2e2e] bg-[#111111] px-4 py-1.5 text-sm font-medium text-[#f5f5f5] transition-colors hover:border-[#6b6b6b]"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsFollowing((p) => !p)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                  isFollowing
                    ? "border border-[#2e2e2e] bg-transparent text-[#a3a3a3] hover:border-red-500/50 hover:text-red-400"
                    : "bg-[#f5f5f5] text-[#0a0a0a] hover:bg-white"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Name + meta */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#f5f5f5]">{displayName}</h1>
            <CheckCircle2 className="h-4 w-4 text-blue-400 fill-blue-400/20" />
            <Badge variant="info">Pro</Badge>
          </div>
          <p className="text-sm text-[#6b6b6b]">@{username}</p>
        </div>

        <p className="mb-3 text-sm text-[#a3a3a3] leading-relaxed">
          Frontend engineer obsessed with developer tooling and clean abstractions.
          Building things at the intersection of design and code.
        </p>

        {/* Meta links */}
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#6b6b6b]">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            San Francisco, CA
          </span>
          <a
            href="https://example.dev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[#f5f5f5] transition-colors"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            example.dev
          </a>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[#f5f5f5] transition-colors"
          >
            <GitFork className="h-3.5 w-3.5" />
            {username}
          </a>
        </div>

        {/* Follower counts */}
        <div className="mb-6 flex gap-5 text-sm">
          <button
            onClick={() => {}}
            className="flex items-baseline gap-1 text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
          >
            <span className="font-semibold text-[#f5f5f5]">
              {formatNumber(followerCount)}
            </span>
            <span>Followers</span>
          </button>
          <button
            onClick={() => {}}
            className="flex items-baseline gap-1 text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
          >
            <span className="font-semibold text-[#f5f5f5]">
              {formatNumber(followingCount)}
            </span>
            <span>Following</span>
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultTab="posts">
          <TabList>
            <Tab value="posts" count={posts.length}>
              Posts
            </Tab>
            <Tab value="collections" count={collections.length}>
              Collections
            </Tab>
            <Tab value="likes">Likes</Tab>
            <Tab value="articles" count={articles.length}>
              Articles
            </Tab>
          </TabList>

          {/* Posts tab */}
          <TabPanel value="posts" className="py-4 space-y-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group cursor-pointer rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-[#2e2e2e] hover:bg-[#111111]"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#f5f5f5] truncate group-hover:text-white transition-colors">
                      {post.title}
                    </p>
                    <p className="mt-0.5 text-sm text-[#6b6b6b] line-clamp-1">
                      {post.content}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {post.tags.map((t) => (
                        <TagPill key={t} label={t} />
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-[#6b6b6b] text-sm">
                    <Heart className="h-3.5 w-3.5" />
                    <span>{formatNumber(post.likes)}</span>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-[#3d3d3d]">
                  {formatRelativeTime(post.createdAt)}
                </p>
              </div>
            ))}
          </TabPanel>

          {/* Collections tab */}
          <TabPanel value="collections" className="py-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-[#2e2e2e] bg-[#111111] transition-colors hover:border-[#6b6b6b]"
                  onClick={() => navigate(`/collections/${col.id}`)}
                >
                  <div
                    className={cn(
                      "h-20 bg-gradient-to-br",
                      col.gradient
                    )}
                  />
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[#f5f5f5] text-sm leading-tight">
                        {col.name}
                      </p>
                      {col.isPublic ? (
                        <Globe className="h-3.5 w-3.5 shrink-0 text-[#6b6b6b]" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 shrink-0 text-[#6b6b6b]" />
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs text-[#6b6b6b]">
                        {col.postCount} posts
                      </span>
                      <Badge variant={col.isPublic ? "default" : "warning"}>
                        {col.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Likes tab */}
          <TabPanel value="likes" className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111111]">
                <Heart className="h-6 w-6 text-[#3d3d3d]" />
              </div>
              <p className="text-sm text-[#6b6b6b]">
                Liked posts will appear here
              </p>
              <Badge variant="warning">Coming soon</Badge>
            </div>
          </TabPanel>

          {/* Articles tab */}
          <TabPanel value="articles" className="py-4 space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="cursor-pointer rounded-xl border border-[#2e2e2e] bg-[#111111] p-4 transition-colors hover:border-[#6b6b6b]"
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#f5f5f5] leading-snug">
                      {article.title}
                    </p>
                    <p className="mt-1 text-sm text-[#6b6b6b] line-clamp-2">
                      {article.subtitle}
                    </p>
                  </div>
                  <Bookmark className="h-4 w-4 shrink-0 text-[#3d3d3d]" />
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-[#3d3d3d]">
                  <span>{article.readingTime} min read</span>
                  <span>·</span>
                  <span>{formatRelativeTime(article.createdAt)}</span>
                </div>
              </div>
            ))}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
