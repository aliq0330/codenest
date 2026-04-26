import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PostCard } from "./PostCard";
import { CommentThread } from "@/modules/social/CommentThread";
import { postsService } from "@/services/posts.service";
import type { Post } from "@/types";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);

    postsService
      .getPost(id)
      .then((data) => {
        setPost(data);
        postsService.incrementView(id).catch(() => {});
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      {/* Back nav */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <Link
          to="/feed"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-base font-bold text-[#f5f5f5]">Post</h1>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#6b6b6b]" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#6b6b6b]">Post not found.</p>
        </div>
      )}

      {post && (
        <>
          <PostCard post={post} showConnector />
          <CommentThread postId={post.id} />
        </>
      )}
    </div>
  );
}
