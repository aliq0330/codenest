import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EditorSettings, EditorTab, ProjectFile, ProjectFolder } from "@/types";

interface EditorStore {
  settings: EditorSettings;
  tabs: EditorTab[];
  activeTabId: string | null;
  files: ProjectFile[];
  folders: ProjectFolder[];
  fileContents: Record<string, string>;

  updateSettings: (settings: Partial<EditorSettings>) => void;
  openTab: (file: ProjectFile) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  markDirty: (tabId: string) => void;
  markClean: (tabId: string) => void;
  setFiles: (files: ProjectFile[]) => void;
  setFolders: (folders: ProjectFolder[]) => void;
  setFileContent: (fileId: string, content: string) => void;
  reset: () => void;
}

const DEFAULT_SETTINGS: EditorSettings = {
  theme: "codenest-dark",
  font_size: 14,
  tab_size: 2,
  line_numbers: true,
  word_wrap: false,
  auto_complete: true,
  bracket_matching: true,
  auto_save: true,
};

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      tabs: [],
      activeTabId: null,
      files: [],
      folders: [],
      fileContents: {},

      updateSettings: (settings) =>
        set((s) => ({ settings: { ...s.settings, ...settings } })),

      openTab: (file) => {
        const { tabs } = get();
        const existing = tabs.find((t) => t.file_id === file.id);
        if (existing) {
          set({ activeTabId: existing.id });
          return;
        }
        const newTab: EditorTab = {
          id: `tab-${file.id}`,
          file_id: file.id,
          filename: file.name,
          language: file.language,
          is_dirty: false,
        };
        set((s) => ({ tabs: [...s.tabs, newTab], activeTabId: newTab.id }));
      },

      closeTab: (tabId) => {
        set((s) => {
          const next = s.tabs.filter((t) => t.id !== tabId);
          const newActive =
            s.activeTabId === tabId ? (next[next.length - 1]?.id ?? null) : s.activeTabId;
          return { tabs: next, activeTabId: newActive };
        });
      },

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      markDirty: (tabId) =>
        set((s) => ({
          tabs: s.tabs.map((t) => (t.id === tabId ? { ...t, is_dirty: true } : t)),
        })),

      markClean: (tabId) =>
        set((s) => ({
          tabs: s.tabs.map((t) => (t.id === tabId ? { ...t, is_dirty: false } : t)),
        })),

      setFiles: (files) => set({ files }),
      setFolders: (folders) => set({ folders }),

      setFileContent: (fileId, content) =>
        set((s) => ({ fileContents: { ...s.fileContents, [fileId]: content } })),

      reset: () =>
        set({ tabs: [], activeTabId: null, files: [], folders: [], fileContents: {} }),
    }),
    {
      name: "codenest-editor",
      partialize: (s) => ({ settings: s.settings }),
    }
  )
);
