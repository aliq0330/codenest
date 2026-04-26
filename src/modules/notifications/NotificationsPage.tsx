import { useState } from "react";
import { Heart, MessageCircle, UserPlus, Repeat2, AtSign, Quote, Reply, Check } from "lucide-react";
import { Avatar, Tabs, TabList, Tab, TabPanel } from "@/components/ui";
import { formatRelativeTime } from "@/lib/utils";
import type { NotificationType } from "@/types";

interface MockNotification {
  id: string;
  type: NotificationType;
  actor: { username: string; display_name: string; avatar_url: null };
  text: string;
  post_preview: string | null;
  is_read: boolean;
  created_at: string;
}

const MOCK: MockNotification[] = [
  { id: "n1", type: "like", actor: { username: "alexchen", display_name: "Alex Chen", avatar_url: null }, text: "liked your post", post_preview: "CSS scroll-driven animations — no JavaScript!", is_read: false, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: "n2", type: "follow", actor: { username: "saradev", display_name: "Sara Kaya", avatar_url: null }, text: "started following you", post_preview: null, is_read: false, created_at: new Date(Date.now() - 600000).toISOString() },
  { id: "n3", type: "comment", actor: { username: "ryo_codes", display_name: "Ryo Nakamura", avatar_url: null }, text: "commented on your post", post_preview: "\"Great technique! I've been using something similar...\"", is_read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "n4", type: "repost", actor: { username: "mia_ts", display_name: "Mia Tanaka", avatar_url: null }, text: "reposted your snippet", post_preview: "useDebounce hook — production-ready with cleanup", is_read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "n5", type: "mention", actor: { username: "dev_max", display_name: "Max Hoffmann", avatar_url: null }, text: "mentioned you in a post", post_preview: "Huge thanks to @me for this awesome technique!", is_read: true, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "n6", type: "reply", actor: { username: "alexchen", display_name: "Alex Chen", avatar_url: null }, text: "replied to your comment", post_preview: "\"Exactly, that's the key insight here!\"", is_read: true, created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: "n7", type: "like", actor: { username: "saradev", display_name: "Sara Kaya", avatar_url: null }, text: "liked your comment", post_preview: null, is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "n8", type: "quote", actor: { username: "ryo_codes", display_name: "Ryo Nakamura", avatar_url: null }, text: "quoted your post", post_preview: "Vanilla JS drag & drop — 30 lines", is_read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "n9", type: "follow", actor: { username: "coder_ana", display_name: "Ana Lima", avatar_url: null }, text: "started following you", post_preview: null, is_read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: "n10", type: "comment", actor: { username: "dev_max", display_name: "Max Hoffmann", avatar_url: null }, text: "commented on your post", post_preview: "\"This saved me so much time, bookmarking!\"", is_read: true, created_at: new Date(Date.now() - 345600000).toISOString() },
];

const ICONS: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  like:    { icon: <Heart className="h-4 w-4" />, color: "text-red-400 bg-red-500/10" },
  comment: { icon: <MessageCircle className="h-4 w-4" />, color: "text-blue-400 bg-blue-500/10" },
  reply:   { icon: <Reply className="h-4 w-4" />, color: "text-blue-400 bg-blue-500/10" },
  follow:  { icon: <UserPlus className="h-4 w-4" />, color: "text-green-400 bg-green-500/10" },
  message: { icon: <MessageCircle className="h-4 w-4" />, color: "text-purple-400 bg-purple-500/10" },
  repost:  { icon: <Repeat2 className="h-4 w-4" />, color: "text-green-400 bg-green-500/10" },
  quote:   { icon: <Quote className="h-4 w-4" />, color: "text-yellow-400 bg-yellow-500/10" },
  mention: { icon: <AtSign className="h-4 w-4" />, color: "text-orange-400 bg-orange-500/10" },
};

const FILTER_TYPES: Record<string, NotificationType[]> = {
  all: ["like", "comment", "reply", "follow", "message", "repost", "quote", "mention"],
  likes: ["like"],
  comments: ["comment", "reply"],
  follows: ["follow"],
  mentions: ["mention", "quote"],
};

export function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK);
  const [activeTab, setActiveTab] = useState("all");

  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, is_read: true })));
  const markRead = (id: string) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, is_read: true } : n));

  const filtered = notifs.filter((n) => FILTER_TYPES[activeTab]?.includes(n.type));
  const unreadCount = notifs.filter((n) => !n.is_read).length;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#f5f5f5]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
            >
              <Check className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
        <Tabs defaultTab="all" onChange={setActiveTab}>
          <TabList className="px-2">
            <Tab value="all">All</Tab>
            <Tab value="likes">Likes</Tab>
            <Tab value="comments">Comments</Tab>
            <Tab value="follows">Follows</Tab>
            <Tab value="mentions">Mentions</Tab>
          </TabList>
        </Tabs>
      </div>

      {/* List */}
      <div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-[#6b6b6b]">
            <p className="text-sm">No notifications here.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const { icon, color } = ICONS[n.type];
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex cursor-pointer items-start gap-3 border-b border-[#2e2e2e] px-4 py-4 transition-colors hover:bg-[#0d0d0d] ${!n.is_read ? "bg-[#111111]" : ""}`}
              >
                {/* Unread dot */}
                <div className="flex w-2 shrink-0 justify-center pt-2">
                  {!n.is_read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                </div>

                {/* Type icon */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <Avatar src={n.actor.avatar_url} alt={n.actor.display_name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#f5f5f5]">
                        <span className="font-semibold">{n.actor.display_name}</span>{" "}
                        <span className="text-[#a3a3a3]">{n.text}</span>
                      </p>
                      {n.post_preview && (
                        <p className="mt-1 text-xs text-[#6b6b6b] line-clamp-1">{n.post_preview}</p>
                      )}
                      <p className="mt-1 text-xs text-[#3d3d3d]">{formatRelativeTime(n.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
