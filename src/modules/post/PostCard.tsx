"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MoreHorizontal,
  Quote,
  ExternalLink,
  Code2,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { TagPill } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";
import type { Post } from "@/types";
import { SnippetEmbed } from "./SnippetEmbed";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onQuote?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  isThread?: boolean;
  showConnector?: boolean;
}

export function PostCard({
  post,
  onLike,
  onRepost,
  onSave,
  onQuote,
  onDelete,
  isThread = false,
  showConnector = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [saved, setSaved] = useState(post.isSaved);
  const [reposted, setReposted] = useState(post.isReposted);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount);

  const handleLike = () => {
    setLiked((p) => !p);
    setLikesCount((p) => (liked ? p - 1 : p + 1));
    onLike?.(post.id);
  };

  const handleRepost = () => {
    setReposted((p) => !p);
    setRepostsCount((p) => (reposted ? p - 1 : p + 1));
    onRepost?.(post.id);
  };

  const handleSave = () => {
    setSaved((p) => !p);
    onSave?.(post.id);
  };

  const menuItems = [
    { label: "Copy link", icon: <ExternalLink className="h-3.5 w-3.5" />, onClick: () => {} },
    { label: "Quote post", icon: <Quote className="h-3.5 w-3.5" />, onClick: () => onQuote?.(post) },
    { label: "Open in editor", icon: <Code2 className="h-3.5 w-3.5" />, onClick: () => {} },
    ...(onDelete
      ? [{ label: "Delete", icon: <></>, onClick: () => onDelete(post.id), variant: "danger" as const, divider: true }]
      : []),
  ];

  // Repost card — just shows the original with repost header
  if (post.type === "repost" && post.repostedPost) {
    return (
      <div className="border-b border-surface-border">
        <div className="flex items-center gap-2 px-4 pt-3 pb-1 text-xs text-ink-tertiary">
          <Repeat2 className="h-3.5 w-3.5" />
          <span>
            <Link href={`/@${post.author.username}`} className="font-medium text-ink-secondary hover:text-ink-primary">
              {post.author.displayName}
            </Link>{" "}
            reposted
          </span>
        </div>
        <PostCard post={post.repostedPost} onLike={onLike} onSave={onSave} onRepost={onRepost} onQuote={onQuote} />
      </div>
    );
  }

  return (
    <article className={cn("border-b border-surface-border px-4 py-4 transition-colors hover:bg-surface/30", isThread && "border-b-0")}>
      <div className="flex gap-3">
        {/* Avatar column */}
        <div className="flex flex-col items-center">
          <Link href={`/@${post.author.username}`}>
            <Avatar
              src={post.author.avatar}
              alt={post.author.displayName}
              size="md"
            />
          </Link>
          {showConnector && (
            <div className="mt-2 w-px flex-1 bg-surface-border" />
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Link
                href={`/@${post.author.username}`}
                className="text-sm font-semibold text-ink-primary hover:underline"
              >
                {post.author.displayName}
              </Link>
              <span className="text-xs text-ink-tertiary">@{post.author.username}</span>
              <span className="text-xs text-ink-disabled">·</span>
              <span className="text-xs text-ink-tertiary">{formatRelativeTime(post.createdAt)}</span>
            </div>

            <Dropdown
              trigger={
                <button className="flex h-7 w-7 items-center justify-center rounded-full text-ink-disabled transition-colors hover:bg-surface hover:text-ink-secondary">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
              items={menuItems}
              align="right"
            />
          </div>

          {/* Post type badge */}
          {post.type === "article" && (
            <span className="mb-2 inline-flex items-center gap-1 text-xs text-ink-tertiary">
              <span className="h-1 w-1 rounded-full bg-ink-tertiary" />
              Article · {post.article?.readingTime ?? 3} min read
            </span>
          )}

          {/* Title (articles / projects) */}
          {post.title && (
            <Link href={`/post/${post.id}`}>
              <h2 className="mt-0.5 text-base font-semibold text-ink-primary hover:underline line-clamp-2">
                {post.title}
              </h2>
            </Link>
          )}

          {/* Content */}
          {post.content && (
            <p className="mt-1 text-sm text-ink-secondary leading-relaxed whitespace-pre-wrap line-clamp-3">
              {post.content}
            </p>
          )}

          {/* Snippet embeds */}
          {post.snippets.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {post.snippets.slice(0, 1).map((snippet) => (
                <SnippetEmbed key={snippet.id} snippet={snippet} />
              ))}
              {post.snippets.length > 1 && (
                <Link href={`/post/${post.id}`} className="text-xs text-ink-tertiary hover:text-ink-secondary">
                  +{post.snippets.length - 1} more file{post.snippets.length > 2 ? "s" : ""}
                </Link>
              )}
            </div>
          )}

          {/* Quoted post embed */}
          {post.type === "quote" && post.quotedPost && (
            <div className="mt-3 rounded-xl border border-surface-border p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Avatar src={post.quotedPost.author.avatar} alt={post.quotedPost.author.displayName} size="xs" />
                <span className="text-xs font-medium text-ink-secondary">{post.quotedPost.author.displayName}</span>
                <span className="text-xs text-ink-tertiary">@{post.quotedPost.author.username}</span>
              </div>
              <p className="text-sm text-ink-tertiary line-clamp-2">{post.quotedPost.content}</p>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagPill key={tag} label={tag} href={`/tags/${tag}`} />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1 -ml-2">
            {/* Comment */}
            <Link href={`/post/${post.id}`} className="action-btn group">
              <MessageCircle className="h-4 w-4 transition-colors group-hover:text-semantic-info" />
              <span>{formatNumber(post.commentsCount)}</span>
            </Link>

            {/* Repost */}
            <button
              onClick={handleRepost}
              className={cn("action-btn group", reposted && "text-semantic-success")}
            >
              <Repeat2 className={cn("h-4 w-4 transition-colors", !reposted && "group-hover:text-semantic-success")} />
              <span>{formatNumber(repostsCount)}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={cn("action-btn group", liked && "text-semantic-error")}
            >
              <Heart
                className={cn("h-4 w-4 transition-colors", liked && "fill-current", !liked && "group-hover:text-semantic-error")}
              />
              <span>{formatNumber(likesCount)}</span>
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className={cn("action-btn group ml-auto", saved && "text-ink-primary")}
            >
              <Bookmark
                className={cn("h-4 w-4 transition-colors", saved && "fill-current", !saved && "group-hover:text-ink-primary")}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
