import { create } from "zustand";

interface UIStore {
  sidebarCollapsed: boolean;
  notificationCount: number;
  messageCount: number;

  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setNotificationCount: (n: number) => void;
  setMessageCount: (n: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  notificationCount: 0,
  messageCount: 0,

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setNotificationCount: (notificationCount) => set({ notificationCount }),
  setMessageCount: (messageCount) => set({ messageCount }),
}));
