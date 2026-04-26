import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Supabase proje URL ve anon key — .env.local'dan okunur
// VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerini
// Supabase dashboard > Project Settings > API bölümünden alınız.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || "placeholder-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

export type SupabaseClient = typeof supabase;
