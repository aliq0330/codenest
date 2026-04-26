import { supabase } from "@/lib/supabase";
import type { Collection, Post } from "@/types";

const COLLECTION_QUERY = `*, owner:profiles!owner_id(*)`;

export const collectionsService = {
  async getMyCollections(): Promise<Collection[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("collections")
      .select(COLLECTION_QUERY)
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as unknown as Collection[];
  },

  async getUserCollections(userId: string): Promise<Collection[]> {
    const { data: { user } } = await supabase.auth.getUser();
    let query = supabase
      .from("collections")
      .select(COLLECTION_QUERY)
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (!user || user.id !== userId) {
      query = query.eq("is_public", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Collection[];
  },

  async getCollection(id: string): Promise<Collection> {
    const { data, error } = await supabase
      .from("collections")
      .select(COLLECTION_QUERY)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as unknown as Collection;
  },

  async getCollectionPosts(collectionId: string, limit = 20): Promise<Post[]> {
    const { data, error } = await supabase
      .from("saves")
      .select(`
        post:posts!post_id(
          *,
          author:profiles!author_id(*)
        )
      `)
      .eq("collection_id", collectionId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return ((data as unknown as { post: unknown }[])?.map((d) => d.post) ?? []) as unknown as Post[];
  },

  async createCollection(name: string, description: string, isPublic: boolean): Promise<Collection> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("collections")
      .insert({ owner_id: user.id, name, description, is_public: isPublic })
      .select(COLLECTION_QUERY)
      .single();
    if (error) throw error;
    return data as unknown as Collection;
  },

  async updateCollection(id: string, updates: Partial<{ name: string; description: string; is_public: boolean; cover_image: string }>): Promise<Collection> {
    const { data, error } = await supabase
      .from("collections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(COLLECTION_QUERY)
      .single();
    if (error) throw error;
    return data as unknown as Collection;
  },

  async deleteCollection(id: string) {
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) throw error;
  },
};
