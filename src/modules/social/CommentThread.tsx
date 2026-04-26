import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { CommentCard } from "./CommentCard";
import { CommentComposer } from "./CommentComposer";
import { commentsService } from "@/services/comments.service";
import { useAuthStore } from "@/store/auth.store";
import type { Comment } from "@/types";

interface CommentThreadProps {
  postId: string;
}

export function CommentThread({ postId }: CommentThreadProps) {
  const { profile: currentUser } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTarget, setReplyTarget] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    commentsService
      .getComments(postId)
      .then((data) => { if (!cancelled) setComments(data); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [postId]);

  function handleReply(commentId: string, username: string) {
    setReplyTarget({ id: commentId, username });
  }

  function handleLike(commentId: string) {
    console.log("like comment", commentId);
  }

  async function handleCommentSubmit(content: string, snippet?: string) {
    if (!currentUser || submitting) return;
    setSubmitting(true);
    try {
      const snippets = snippet
        ? [{ id: `s${Date.now()}`, filename: "", language: "plaintext", code: snippet }]
        : [];
      const parentId = replyTarget?.id;
      const newComment = await commentsService.createComment(postId, content, snippets, parentId);

      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies ?? []), newComment], replies_count: c.replies_count + 1 }
              : c
          )
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }
      setReplyTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {/* Composer */}
      <CommentComposer
        postId={postId}
        replyTo={replyTarget?.username}
        onSubmit={handleCommentSubmit}
        externalSubmitting={submitting}
      />

      {/* Divider */}
      <div className="border-t border-[#2e2e2e]" />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[#6b6b6b]" />
        </div>
      ) : (
        <>
          {/* Comment count */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#f5f5f5]">
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </span>
            {replyTarget && (
              <button
                onClick={() => setReplyTarget(null)}
                className="text-xs text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
              >
                Cancel reply
              </button>
            )}
          </div>

          {/* Comments list */}
          {comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#6b6b6b]">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onLike={handleLike}
                  depth={0}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
