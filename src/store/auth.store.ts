import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import type { User } from "@/types";

interface AuthStore {
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  profile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setSession: (session: Session | null) => void;
  setProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      supabaseUser: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setSession: (session) =>
        set({
          session,
          supabaseUser: session?.user ?? null,
          isAuthenticated: !!session,
          isLoading: false,
        }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      reset: () =>
        set({
          session: null,
          supabaseUser: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "codenest-auth",
      partialize: (state) => ({ session: state.session, profile: state.profile }),
    }
  )
);
