import { supabase } from "@/lib/supabase";
import type { Post } from "@/types";

const POST_QUERY = `
  *,
  author:profiles!author_id(*),
  reposted_post:posts!reposted_post_id(*, author:profiles!author_id(*)),
  quoted_post:posts!quoted_post_id(*, author:profiles!author_id(*))
`;

export const postsService = {
  async getFeed(tab: "following" | "suggested" | "trending", cursor?: string, limit = 20) {
    let query = supabase
      .from("posts")
      .select(POST_QUERY)
      .eq("is_draft", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (cursor) query = query.lt("created_at", cursor);

    if (tab === "following") {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: follows } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);
        const ids = follows?.map((f) => f.following_id) ?? [];
        if (ids.length > 0) query = query.in("author_id", ids);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Post[];
  },

  async getPost(id: string) {
    const { data, error } = await supabase
      .from("posts")
      .select(POST_QUERY)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as unknown as Post;
  },

  async getUserPosts(userId: string, cursor?: string, limit = 20) {
    let query = supabase
      .from("posts")
      .select(POST_QUERY)
      .eq("author_id", userId)
      .eq("is_draft", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (cursor) query = query.lt("created_at", cursor);

    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Post[];
  },

  async createPost(payload: {
    type: Post["type"];
    title?: string;
    content: string;
    tags: string[];
    language?: string;
    snippets?: Post["snippets"];
    media?: Post["media"];
    is_draft?: boolean;
    reposted_post_id?: string;
    quoted_post_id?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        type: payload.type,
        title: payload.title ?? null,
        content: payload.content,
        tags: payload.tags,
        language: payload.language ?? null,
        snippets: (payload.snippets as unknown as import("@/types/supabase").Json) ?? [],
        media: (payload.media as unknown as import("@/types/supabase").Json) ?? [],
        is_draft: payload.is_draft ?? false,
        published_at: payload.is_draft ? null : new Date().toISOString(),
        reposted_post_id: payload.reposted_post_id ?? null,
        quoted_post_id: payload.quoted_post_id ?? null,
      })
      .select(POST_QUERY)
      .single();

    if (error) throw error;
    return data as unknown as Post;
  },

  async updatePost(id: string, updates: Partial<{ title: string; content: string; tags: string[]; is_draft: boolean }>) {
    const { data, error } = await supabase
      .from("posts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(POST_QUERY)
      .single();
    if (error) throw error;
    return data as unknown as Post;
  },

  async deletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
  },

  async likePost(postId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("likes").insert({ user_id: user.id, post_id: postId });
    if (error) throw error;
  },

  async unlikePost(postId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);
    if (error) throw error;
  },

  async savePost(postId: string, collectionId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase.from("saves").insert({
      user_id: user.id,
      post_id: postId,
      collection_id: collectionId ?? null,
    });
    if (error) throw error;
  },

  async unsavePost(postId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);
    if (error) throw error;
  },

  async repost(postId: string) {
    return this.createPost({ type: "repost", content: "", tags: [], reposted_post_id: postId });
  },

  async incrementView(postId: string) {
    await (supabase as unknown as { rpc: (fn: string, args: object) => Promise<void> }).rpc("increment_view", { post_id: postId });
  },

  async searchPosts(query: string, language?: string, limit = 20) {
    let q = supabase
      .from("posts")
      .select(POST_QUERY)
      .eq("is_draft", false)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(limit);

    if (language) q = q.eq("language", language);

    const { data, error } = await q;
    if (error) throw error;
    return data as unknown as Post[];
  },

  async getByTag(tag: string, cursor?: string, limit = 20) {
    let query = supabase
      .from("posts")
      .select(POST_QUERY)
      .eq("is_draft", false)
      .contains("tags", [tag])
      .order("created_at", { ascending: false })
      .limit(limit);

    if (cursor) query = query.lt("created_at", cursor);

    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Post[];
  },

  async getTrending(limit = 20) {
    const { data, error } = await supabase
      .from("posts")
      .select(POST_QUERY)
      .eq("is_draft", false)
      .order("likes_count", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as unknown as Post[];
  },
};
