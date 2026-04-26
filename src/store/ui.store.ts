import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/i18n";

export type Theme = "dark" | "light";

interface UIStore {
  sidebarOpen: boolean;
  notificationCount: number;
  messageCount: number;
  theme: Theme;
  lang: Lang;

  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  setNotificationCount: (n: number) => void;
  setMessageCount: (n: number) => void;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      notificationCount: 0,
      messageCount: 0,
      theme: "dark",
      lang: "tr",

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setNotificationCount: (notificationCount) => set({ notificationCount }),
      setMessageCount: (messageCount) => set({ messageCount }),
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: "codenest-ui",
      partialize: (s) => ({ theme: s.theme, lang: s.lang }),
    }
  )
);
