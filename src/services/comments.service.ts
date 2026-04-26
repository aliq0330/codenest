import { supabase } from "@/lib/supabase";
import type { Comment, CodeSnippet } from "@/types";

const COMMENT_QUERY = `
  *,
  author:profiles!author_id(*),
  replies:comments!parent_id(*, author:profiles!author_id(*))
`;

export const commentsService = {
  async getComments(postId: string, limit = 30): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select(COMMENT_QUERY)
      .eq("post_id", postId)
      .is("parent_id", null)
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data as unknown as Comment[];
  },

  async createComment(postId: string, content: string, snippets: CodeSnippet[] = [], parentId?: string): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        content,
        snippets: snippets as unknown as import("@/types/supabase").Json,
        parent_id: parentId ?? null,
      })
      .select(COMMENT_QUERY)
      .single();
    if (error) throw error;
    return data as unknown as Comment;
  },

  async deleteComment(id: string) {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) throw error;
  },

  async likeComment(commentId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: user.id, comment_id: commentId });
    if (error) throw error;
  },

  async unlikeComment(commentId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("comment_id", commentId);
    if (error) throw error;
  },
};
