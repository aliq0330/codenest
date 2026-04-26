import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

export const profilesService = {
  async getProfile(username: string): Promise<User> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();
    if (error) throw error;
    return data as unknown as User;
  },

  async getProfileById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as unknown as User;
  },

  async updateProfile(updates: Partial<{
    display_name: string;
    bio: string;
    location: string;
    website: string;
    github_url: string;
    twitter_url: string;
    linkedin_url: string;
    avatar_url: string;
    cover_url: string;
  }>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as unknown as User;
  },

  async follow(targetId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: user.id, following_id: targetId });
    if (error) throw error;
  },

  async unfollow(targetId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetId);
    if (error) throw error;
  },

  async isFollowing(targetId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", targetId)
      .single();
    return !!data;
  },

  async getFollowers(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from("follows")
      .select("follower:profiles!follower_id(*)")
      .eq("following_id", userId)
      .limit(limit);
    if (error) throw error;
    return ((data as unknown as { follower: unknown }[])?.map((d) => d.follower) ?? []) as unknown as User[];
  },

  async getFollowing(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from("follows")
      .select("following:profiles!following_id(*)")
      .eq("follower_id", userId)
      .limit(limit);
    if (error) throw error;
    return ((data as unknown as { following: unknown }[])?.map((d) => d.following) ?? []) as unknown as User[];
  },

  async searchUsers(query: string, limit = 20) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(limit);
    if (error) throw error;
    return data as unknown as User[];
  },

  async getSuggested(limit = 10) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("followers_count", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as unknown as User[];
  },

  async uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  },

  async uploadCover(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const ext = file.name.split(".").pop();
    const path = `${user.id}/cover.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("covers")
      .upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("covers").getPublicUrl(path);
    return data.publicUrl;
  },
};
