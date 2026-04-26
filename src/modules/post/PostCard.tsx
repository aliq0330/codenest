import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Link2,
  Quote,
  Trash2,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime, formatNumber } from "@/lib/utils";
import { Avatar, TagPill, Dropdown } from "@/components/ui";
import { SnippetEmbed } from "./SnippetEmbed";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
  onRepost?: (id: string) => void;
  onSave?: (id: string) => void;
  onQuote?: (id: string) => void;
  onDelete?: (id: string) => void;
  showConnector?: boolean;
}

function QuotedPostBox({ post }: { post: Post }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#2e2e2e] bg-[#111111]">
      <div className="flex items-center gap-2 px-3 pt-3">
        <Avatar src={post.author.avatar_url} alt={post.author.display_name} size="xs" />
        <span className="text-sm font-medium text-[#f5f5f5]">{post.author.display_name}</span>
        <span className="text-xs text-[#6b6b6b]">@{post.author.username}</span>
        <span className="text-xs text-[#6b6b6b]">·</span>
        <span className="text-xs text-[#6b6b6b]">{formatRelativeTime(post.created_at)}</span>
      </div>
      <div className="px-3 pb-3 pt-1.5">
        {post.title && (
          <p className="mb-1 text-sm font-semibold text-[#f5f5f5]">{post.title}</p>
        )}
        {post.content && (
          <p className="line-clamp-3 text-sm text-[#a3a3a3]">{post.content}</p>
        )}
        {post.snippets.length > 0 && (
          <div className="mt-2">
            <SnippetEmbed snippet={post.snippets[0]} maxLines={6} />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  activeIcon,
  count,
  active,
  activeClass,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  count?: number;
  active?: boolean;
  activeClass?: string;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group flex items-center gap-1.5 text-xs transition-colors",
        active ? activeClass : "text-[#6b6b6b] hover:text-[#a3a3a3]"
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full transition-colors group-hover:bg-[#1a1a1a]">
        {active && activeIcon ? activeIcon : icon}
      </span>
      {count !== undefined && count > 0 && (
        <span>{formatNumber(count)}</span>
      )}
    </button>
  );
}

export function PostCard({
  post,
  onLike,
  onRepost,
  onSave,
  onQuote,
  onDelete,
  showConnector = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.likes_count);
  const [reposted, setReposted] = useState(post.is_reposted);
  const [repostCount, setRepostCount] = useState(post.reposts_count);
  const [saved, setSaved] = useState(post.is_saved);
  const [saveCount, setSaveCount] = useState(post.saves_count);

  function handleLike() {
    setLiked((p) => !p);
    setLikeCount((p) => (liked ? p - 1 : p + 1));
    onLike?.(post.id);
  }

  function handleRepost() {
    setReposted((p) => !p);
    setRepostCount((p) => (reposted ? p - 1 : p + 1));
    onRepost?.(post.id);
  }

  function handleSave() {
    setSaved((p) => !p);
    setSaveCount((p) => (saved ? p - 1 : p + 1));
    onSave?.(post.id);
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/#/post/${post.id}`;
    navigator.clipboard.writeText(url);
  }

  const dropdownItems = [
    {
      label: "Copy link",
      icon: <Link2 size={14} />,
      onClick: handleCopyLink,
    },
    {
      label: "Quote post",
      icon: <Quote size={14} />,
      onClick: () => onQuote?.(post.id),
    },
    ...(onDelete
      ? [
          {
            label: "Delete",
            icon: <Trash2 size={14} />,
            onClick: () => onDelete(post.id),
            variant: "danger" as const,
            divider: true,
          },
        ]
      : []),
  ];

  // Repost type: show "X reposted" header, then render the original post
  if (post.type === "repost" && post.reposted_post) {
    return (
      <article className="border-b border-[#2e2e2e]">
        <div className="flex items-center gap-2 px-4 pt-3 pb-1 text-xs text-[#6b6b6b]">
          <Repeat2 size={12} />
          <span>
            <span className="font-medium text-[#a3a3a3]">{post.author.display_name}</span>
            {" "}reposted
          </span>
        </div>
        <PostCard post={post.reposted_post} onLike={onLike} onRepost={onRepost} onSave={onSave} onQuote={onQuote} />
      </article>
    );
  }

  return (
    <article className="border-b border-[#2e2e2e] px-4 py-4 transition-colors hover:bg-[#0d0d0d]">
      <div className="flex gap-3">
        {/* Avatar column */}
        <div className="flex flex-col items-center">
          <Link to={`/profile/${post.author.username}`}>
            <Avatar
              src={post.author.avatar_url}
              alt={post.author.display_name}
              size="md"
              className="transition-opacity hover:opacity-80"
            />
          </Link>
          {showConnector && (
            <div className="mt-1 w-0.5 flex-1 bg-[#2e2e2e]" />
          )}
        </div>

        {/* Content column */}
        <div className="min-w-0 flex-1">
          {/* Author row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              to={`/profile/${post.author.username}`}
              className="text-sm font-semibold text-[#f5f5f5] hover:underline"
            >
              {post.author.display_name}
            </Link>
            {post.author.is_verified && (
              <span className="text-blue-400" title="Verified">✓</span>
            )}
            <span className="text-xs text-[#6b6b6b]">@{post.author.username}</span>
            <span className="text-xs text-[#6b6b6b]">·</span>
            <span className="text-xs text-[#6b6b6b]" title={new Date(post.created_at).toLocaleString()}>
              {formatRelativeTime(post.created_at)}
            </span>

            {/* Dropdown */}
            <div className="ml-auto">
              <Dropdown
                trigger={
                  <button className="flex h-7 w-7 items-center justify-center rounded-full text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#a3a3a3]">
                    <MoreHorizontal size={15} />
                  </button>
                }
                items={dropdownItems}
              />
            </div>
          </div>

          {/* Title */}
          {post.title && (
            <h2 className="mt-1 text-sm font-semibold text-[#f5f5f5]">{post.title}</h2>
          )}

          {/* Content */}
          {post.content && (
            <p className="mt-1 text-sm leading-relaxed text-[#a3a3a3] line-clamp-3">{post.content}</p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagPill key={tag} label={tag} href={`#/search?tag=${tag}`} />
              ))}
            </div>
          )}

          {/* First snippet */}
          {post.snippets.length > 0 && (
            <div className="mt-3">
              <SnippetEmbed snippet={post.snippets[0]} maxLines={12} />
            </div>
          )}

          {/* Quoted post */}
          {post.type === "quote" && post.quoted_post && (
            <QuotedPostBox post={post.quoted_post} />
          )}

          {/* Action bar */}
          <div className="mt-3 flex items-center gap-1">
            {/* Comments */}
            <Link
              to={`/post/${post.id}`}
              className="group flex items-center gap-1.5 text-xs text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
              aria-label="View comments"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full transition-colors group-hover:bg-[#1a1a1a]">
                <MessageCircle size={15} />
              </span>
              {post.comments_count > 0 && (
                <span>{formatNumber(post.comments_count)}</span>
              )}
            </Link>

            {/* Repost */}
            <ActionButton
              icon={<Repeat2 size={15} />}
              count={repostCount}
              active={reposted}
              activeClass="text-green-400"
              onClick={handleRepost}
              label="Repost"
            />

            {/* Like */}
            <ActionButton
              icon={<Heart size={15} />}
              activeIcon={<Heart size={15} fill="currentColor" />}
              count={likeCount}
              active={liked}
              activeClass="text-red-400"
              onClick={handleLike}
              label="Like"
            />

            {/* Save */}
            <ActionButton
              icon={<Bookmark size={15} />}
              activeIcon={<BookmarkCheck size={15} />}
              count={saveCount > 0 ? saveCount : undefined}
              active={saved}
              activeClass="text-yellow-400"
              onClick={handleSave}
              label="Save"
            />

            {/* Views — read only */}
            {post.views_count > 0 && (
              <span className="ml-auto flex items-center gap-1 text-xs text-[#3d3d3d]">
                <Repeat size={12} className="opacity-0" aria-hidden />
                {formatNumber(post.views_count)} views
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
