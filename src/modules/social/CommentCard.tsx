import { useState } from "react";
import { Heart, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar } from "@/components/ui";
import { cn, formatRelativeTime, formatNumber } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: string, authorUsername: string) => void;
  onLike?: (commentId: string) => void;
  depth?: number;
}

export function CommentCard({
  comment,
  onReply,
  onLike,
  depth = 0,
}: CommentCardProps) {
  const [liked, setLiked] = useState(comment.is_liked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [repliesOpen, setRepliesOpen] = useState(true);

  function handleLike() {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.(comment.id);
  }

  const hasReplies = comment.replies.length > 0 && depth < 2;

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-4 border-l border-[#2e2e2e] pl-4")}>
      {/* Avatar */}
      <Avatar
        src={comment.author.avatar_url}
        alt={comment.author.display_name}
        size={depth === 0 ? "sm" : "xs"}
        className="mt-0.5 shrink-0"
      />

      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#f5f5f5] hover:underline cursor-pointer">
            {comment.author.display_name}
          </span>
          <span className="text-xs text-[#6b6b6b]">@{comment.author.username}</span>
          <span className="text-xs text-[#6b6b6b]">·</span>
          <span className="text-xs text-[#6b6b6b]">
            {formatRelativeTime(comment.created_at)}
          </span>
        </div>

        {/* Content */}
        <p className="mt-1 text-sm leading-relaxed text-[#a3a3a3]">{comment.content}</p>

        {/* Code snippet */}
        {comment.snippets.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-lg border border-[#2e2e2e]">
            {comment.snippets.map((snippet) => (
              <div key={snippet.id}>
                {snippet.filename && (
                  <div className="flex items-center gap-2 border-b border-[#2e2e2e] bg-[#111111] px-3 py-1.5">
                    <span className="font-mono text-xs text-[#6b6b6b]">{snippet.filename}</span>
                    {snippet.language && (
                      <span className="rounded bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[10px] text-[#6b6b6b]">
                        {snippet.language}
                      </span>
                    )}
                  </div>
                )}
                <pre className="overflow-x-auto bg-[#0a0a0a] p-3 font-mono text-xs leading-relaxed text-[#a3a3a3]">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              liked
                ? "text-rose-400 hover:text-rose-300"
                : "text-[#6b6b6b] hover:text-[#a3a3a3]"
            )}
          >
            <Heart
              className={cn("h-3.5 w-3.5", liked && "fill-rose-400")}
            />
            {likesCount > 0 && <span>{formatNumber(likesCount)}</span>}
          </button>

          {onReply && (
            <button
              onClick={() => onReply(comment.id, comment.author.username)}
              className="flex items-center gap-1 text-xs text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>
          )}

          {hasReplies && (
            <button
              onClick={() => setRepliesOpen((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
            >
              {repliesOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              <span>
                {repliesOpen
                  ? "Hide replies"
                  : `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
              </span>
            </button>
          )}
        </div>

        {/* Nested replies */}
        {hasReplies && repliesOpen && (
          <div className="mt-3 flex flex-col gap-3">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
