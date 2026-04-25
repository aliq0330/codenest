"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostCard } from "./PostCard";
import { CommentThread } from "@/modules/social/CommentThread";
import { CommentComposer } from "@/modules/social/CommentComposer";
import { FeedSkeleton } from "@/components/ui/Skeleton";
import type { Post } from "@/types";

// Placeholder data
const MOCK_POST: Post = {
  id: "p1",
  type: "snippet",
  author: {
    id: "u1",
    username: "alexchen",
    displayName: "Alex Chen",
    email: "alex@example.com",
    avatar: null,
    coverImage: null,
    bio: "Frontend Engineer",
    location: null,
    website: null,
    links: {},
    followersCount: 12400,
    followingCount: 340,
    postsCount: 892,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  title: "Smooth CSS scroll snap carousel",
  content: "Pure CSS carousel with scroll-snap, no JS needed. Works great on mobile too!",
  tags: ["css", "carousel", "no-js"],
  snippets: [
    {
      id: "s1",
      filename: "carousel.css",
      language: "css",
      code: `.carousel {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  gap: 1rem;\n  -webkit-overflow-scrolling: touch;\n}\n\n.slide {\n  flex: 0 0 100%;\n  scroll-snap-align: start;\n  border-radius: 12px;\n  overflow: hidden;\n}`,
    },
  ],
  media: [],
  links: [],
  likesCount: 847,
  commentsCount: 42,
  repostsCount: 156,
  savesCount: 213,
  viewsCount: 9800,
  isLiked: false,
  isSaved: false,
  isReposted: false,
  isDraft: false,
  publishedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  updatedAt: new Date().toISOString(),
};

interface PostDetailPageProps {
  postId: string;
}

export function PostDetailPage({ postId }: PostDetailPageProps) {
  return (
    <div className="min-h-full">
      {/* Back nav */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-surface-border bg-canvas/80 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/feed"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface hover:text-ink-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-base font-semibold text-ink-primary">Post</h1>
      </div>

      {/* Original post */}
      <PostCard post={MOCK_POST} showConnector />

      {/* Comment composer */}
      <div className="border-b border-surface-border px-4 py-4">
        <CommentComposer postId={postId} replyTo={MOCK_POST.author.username} />
      </div>

      {/* Comment thread */}
      <CommentThread postId={postId} />
    </div>
  );
}
