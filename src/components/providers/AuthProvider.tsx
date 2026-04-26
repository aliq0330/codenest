import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { profilesService } from "@/services/profiles.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    // İlk oturumu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        profilesService
          .getProfileById(session.user.id)
          .then(setProfile)
          .catch(() => setLoading(false));
      }
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          try {
            const profile = await profilesService.getProfileById(session.user.id);
            setProfile(profile);
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession, setProfile, setLoading]);

  return <>{children}</>;
}
