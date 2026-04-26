import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  Heart,
  Bookmark,
  Globe,
  Lock,
  GitFork,
  Loader2,
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
import { useAuthStore } from "@/store/auth.store";
import { profilesService } from "@/services/profiles.service";
import { postsService } from "@/services/posts.service";
import { useT } from "@/lib/i18n";
import type { User, Post } from "@/types";

export function ProfilePage({ username: usernameProp }: { username?: string }) {
  const navigate = useNavigate();
  const { username: usernameParam } = useParams<{ username: string }>();
  const username = usernameProp ?? usernameParam;

  const { profile: currentUser } = useAuthStore();
  const isOwnProfile =
    username === "me" || (!!currentUser && currentUser.username === username);
  const t = useT();

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        let p: User;
        if (username === "me" || !username) {
          if (!currentUser) return;
          p = currentUser;
        } else {
          p = await profilesService.getProfile(username);
        }
        if (cancelled) return;
        setProfile(p);

        const [userPosts, following] = await Promise.all([
          postsService.getUserPosts(p.id),
          !isOwnProfile && currentUser
            ? profilesService.isFollowing(p.id)
            : Promise.resolve(false),
        ]);
        if (cancelled) return;
        setPosts(userPosts);
        setIsFollowing(following);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [username, currentUser, isOwnProfile]);

  async function handleFollow() {
    if (!profile || followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await profilesService.unfollow(profile.id);
        setIsFollowing(false);
        setProfile((p) => p ? { ...p, followers_count: p.followers_count - 1 } : p);
      } else {
        await profilesService.follow(profile.id);
        setIsFollowing(true);
        setProfile((p) => p ? { ...p, followers_count: p.followers_count + 1 } : p);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-6 w-6 animate-spin text-[#6b6b6b]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0a0a0a]">
        <p className="text-sm text-[#6b6b6b]">{t.profile.notFound}</p>
      </div>
    );
  }

  const snippetPosts = posts.filter((p) => p.type !== "article");
  const articlePosts = posts.filter((p) => p.type === "article");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Cover */}
      <div
        className="h-32 w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] relative"
        style={profile.cover_url ? { backgroundImage: `url(${profile.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />

      {/* Profile header */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="relative flex items-end justify-between -mt-8 mb-4">
          <Avatar
            src={profile.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
            alt={profile.display_name}
            size="xl"
            className="ring-4 ring-[#0a0a0a] bg-[#111111]"
          />
          <div className="flex items-center gap-2 pb-1">
            {isOwnProfile ? (
              <button
                onClick={() => navigate("/settings")}
                className="rounded-lg border border-[#2e2e2e] bg-[#111111] px-4 py-1.5 text-sm font-medium text-[#f5f5f5] transition-colors hover:border-[#6b6b6b]"
              >
                {t.profile.editProfile}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  isFollowing
                    ? "border border-[#2e2e2e] bg-transparent text-[#a3a3a3] hover:border-red-500/50 hover:text-red-400"
                    : "bg-[#f5f5f5] text-[#0a0a0a] hover:bg-white"
                )}
              >
                {isFollowing ? t.profile.following : t.profile.follow}
              </button>
            )}
          </div>
        </div>

        {/* Name + meta */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#f5f5f5]">{profile.display_name}</h1>
            {profile.is_verified && (
              <CheckCircle2 className="h-4 w-4 text-blue-400 fill-blue-400/20" />
            )}
          </div>
          <p className="text-sm text-[#6b6b6b]">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="mb-3 text-sm text-[#a3a3a3] leading-relaxed">{profile.bio}</p>
        )}

        {/* Meta links */}
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#6b6b6b]">
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </span>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[#f5f5f5] transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[#f5f5f5] transition-colors"
            >
              <GitFork className="h-3.5 w-3.5" />
              {profile.github_url.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
            </a>
          )}
        </div>

        {/* Follower counts */}
        <div className="mb-6 flex gap-5 text-sm">
          <button
            onClick={() => {}}
            className="flex items-baseline gap-1 text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
          >
            <span className="font-semibold text-[#f5f5f5]">
              {formatNumber(profile.followers_count)}
            </span>
            <span>{t.profile.followers}</span>
          </button>
          <button
            onClick={() => {}}
            className="flex items-baseline gap-1 text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
          >
            <span className="font-semibold text-[#f5f5f5]">
              {formatNumber(profile.following_count)}
            </span>
            <span>{t.profile.following}</span>
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultTab="posts">
          <TabList>
            <Tab value="posts" count={snippetPosts.length}>
              {t.profile.posts}
            </Tab>
            <Tab value="collections">{t.profile.collections}</Tab>
            <Tab value="likes">{t.profile.likes}</Tab>
            <Tab value="articles" count={articlePosts.length}>
              {t.profile.articles}
            </Tab>
          </TabList>

          {/* Posts tab */}
          <TabPanel value="posts" className="py-4 space-y-1">
            {snippetPosts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-sm text-[#6b6b6b]">{t.profile.noPosts}</p>
              </div>
            ) : (
              snippetPosts.map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-[#2e2e2e] hover:bg-[#111111]"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#f5f5f5] truncate group-hover:text-white transition-colors">
                        {post.title ?? post.content.slice(0, 60)}
                      </p>
                      {post.content && (
                        <p className="mt-0.5 text-sm text-[#6b6b6b] line-clamp-1">
                          {post.content}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {post.tags.map((t) => (
                            <TagPill key={t} label={t} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-[#6b6b6b] text-sm">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{formatNumber(post.likes_count)}</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-[#3d3d3d]">
                    {formatRelativeTime(post.created_at)}
                  </p>
                </div>
              ))
            )}
          </TabPanel>

          {/* Collections tab */}
          <TabPanel value="collections" className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111111]">
                <Lock className="h-6 w-6 text-[#3d3d3d]" />
              </div>
              <p className="text-sm text-[#6b6b6b]">{t.profile.collectionsComingSoon}</p>
              <Badge variant="warning">{t.profile.comingSoon}</Badge>
            </div>
          </TabPanel>

          {/* Likes tab */}
          <TabPanel value="likes" className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111111]">
                <Heart className="h-6 w-6 text-[#3d3d3d]" />
              </div>
              <p className="text-sm text-[#6b6b6b]">{t.profile.likesComingSoon}</p>
              <Badge variant="warning">{t.profile.comingSoon}</Badge>
            </div>
          </TabPanel>

          {/* Articles tab */}
          <TabPanel value="articles" className="py-4 space-y-3">
            {articlePosts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-sm text-[#6b6b6b]">{t.profile.noArticles}</p>
              </div>
            ) : (
              articlePosts.map((post) => (
                <div
                  key={post.id}
                  className="cursor-pointer rounded-xl border border-[#2e2e2e] bg-[#111111] p-4 transition-colors hover:border-[#6b6b6b]"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#f5f5f5] leading-snug">
                        {post.title}
                      </p>
                      {post.content && (
                        <p className="mt-1 text-sm text-[#6b6b6b] line-clamp-2">
                          {post.content}
                        </p>
                      )}
                    </div>
                    <Bookmark className="h-4 w-4 shrink-0 text-[#3d3d3d]" />
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-[#3d3d3d]">
                    <span>{formatRelativeTime(post.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
