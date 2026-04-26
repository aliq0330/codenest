import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types";

const NOTIFICATION_QUERY = `
  *,
  actor:profiles!actor_id(*),
  post:posts!post_id(*,author:profiles!author_id(*))
`;

export const notificationsService = {
  async getNotifications(limit = 30): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("notifications")
      .select(NOTIFICATION_QUERY)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as unknown as Notification[];
  },

  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    return count ?? 0;
  },

  async markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  },

  async markAsRead(id: string) {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  },

  subscribeToNotifications(userId: string, callback: (n: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => callback(payload.new as unknown as Notification)
      )
      .subscribe();
  },
};
