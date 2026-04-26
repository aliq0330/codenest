// Supabase veritabanı tip tanımları
// Bu dosya `npx supabase gen types typescript` komutu ile otomatik güncellenebilir.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          cover_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          github_url: string | null;
          twitter_url: string | null;
          linkedin_url: string | null;
          followers_count: number;
          following_count: number;
          posts_count: number;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          cover_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
        };
        Update: {
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          cover_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          type: "snippet" | "project" | "article" | "repost" | "quote";
          title: string | null;
          content: string;
          tags: string[];
          language: string | null;
          snippets: Json;
          media: Json;
          likes_count: number;
          comments_count: number;
          reposts_count: number;
          saves_count: number;
          views_count: number;
          reposted_post_id: string | null;
          quoted_post_id: string | null;
          article_id: string | null;
          project_id: string | null;
          is_draft: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          type: "snippet" | "project" | "article" | "repost" | "quote";
          content: string;
          title?: string | null;
          tags?: string[];
          language?: string | null;
          snippets?: Json;
          media?: Json;
          reposted_post_id?: string | null;
          quoted_post_id?: string | null;
          article_id?: string | null;
          project_id?: string | null;
          is_draft?: boolean;
          published_at?: string | null;
        };
        Update: {
          title?: string | null;
          content?: string;
          tags?: string[];
          is_draft?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          snippets: Json;
          likes_count: number;
          replies_count: number;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          post_id: string;
          author_id: string;
          content: string;
          snippets?: Json;
          parent_id?: string | null;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          comment_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id?: string | null;
          comment_id?: string | null;
        };
        Update: never;
        Relationships: [];
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: never;
        Relationships: [];
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          collection_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          collection_id?: string | null;
        };
        Update: {
          collection_id?: string | null;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          cover_image: string | null;
          is_public: boolean;
          posts_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          owner_id: string;
          name: string;
          description?: string | null;
          cover_image?: string | null;
          is_public?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          cover_image?: string | null;
          is_public?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          actor_id: string;
          type: "like" | "comment" | "reply" | "follow" | "message" | "repost" | "quote" | "mention";
          post_id: string | null;
          comment_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          actor_id: string;
          type: "like" | "comment" | "reply" | "follow" | "message" | "repost" | "quote" | "mention";
          post_id?: string | null;
          comment_id?: string | null;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: {
          updated_at?: string;
        };
        Relationships: [];
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
        };
        Update: never;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          sender_id: string;
          content: string;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          post_id: string;
          title: string;
          subtitle: string | null;
          cover_image: string | null;
          content_json: Json;
          reading_time: number;
          word_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          post_id: string;
          title: string;
          subtitle?: string | null;
          cover_image?: string | null;
          content_json?: Json;
          reading_time?: number;
          word_count?: number;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          cover_image?: string | null;
          content_json?: Json;
          reading_time?: number;
          word_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
