import { supabase } from "@/lib/supabase";
import type { Conversation, Message } from "@/types";

export const messagesService = {
  async getConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("conversation_participants")
      .select(`
        conversation:conversations!conversation_id(
          *,
          participants:conversation_participants(user:profiles!user_id(*))
        )
      `)
      .eq("user_id", user.id);
    if (error) throw error;
    return ((data as unknown as { conversation: unknown }[])?.map((d) => d.conversation) ?? []) as unknown as Conversation[];
  },

  async getMessages(conversationId: string, limit = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*, sender:profiles!sender_id(*)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data as unknown as Message[];
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: user.id, content })
      .select("*, sender:profiles!sender_id(*)")
      .single();
    if (error) throw error;

    // Conversation updated_at güncelle
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return data as unknown as Message;
  },

  async getOrCreateConversation(otherUserId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Var olan conversation'ı bul
    const { data: existing } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (existing && existing.length > 0) {
      const myConvIds = existing.map((e) => e.conversation_id);
      const { data: shared } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", otherUserId)
        .in("conversation_id", myConvIds);

      if (shared && shared.length > 0) return shared[0].conversation_id;
    }

    // Yeni conversation oluştur
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({})
      .select("id")
      .single();
    if (error) throw error;

    await supabase.from("conversation_participants").insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: otherUserId },
    ]);

    return conv.id;
  },

  async markAsRead(conversationId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id);
  },

  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => callback(payload.new as unknown as Message)
      )
      .subscribe();
  },
};
