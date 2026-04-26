import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  notificationCount: number;
  messageCount: number;

  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  setNotificationCount: (n: number) => void;
  setMessageCount: (n: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  notificationCount: 0,
  messageCount: 0,

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setNotificationCount: (notificationCount) => set({ notificationCount }),
  setMessageCount: (messageCount) => set({ messageCount }),
}));
