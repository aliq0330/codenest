"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditorTab } from "@/types";

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const LANG_COLORS: Record<string, string> = {
  javascript: "bg-yellow-500",
  typescript: "bg-blue-500",
  html: "bg-orange-500",
  css: "bg-purple-500",
  default: "bg-ink-tertiary",
};

export function EditorTabs({ tabs, activeTabId, onTabSelect, onTabClose }: EditorTabsProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center overflow-x-auto border-b border-surface-border bg-canvas-secondary no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const langColor = LANG_COLORS[tab.language] ?? LANG_COLORS.default;

        return (
          <div
            key={tab.id}
            className={cn(
              "group relative flex items-center gap-2 border-r border-surface-border px-4 py-2 text-xs transition-colors cursor-pointer select-none shrink-0",
              isActive
                ? "bg-canvas text-ink-primary"
                : "text-ink-tertiary hover:bg-canvas/50 hover:text-ink-secondary"
            )}
            onClick={() => onTabSelect(tab.id)}
          >
            {/* Language dot */}
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", langColor)} />

            {/* Filename */}
            <span className="font-mono max-w-[120px] truncate">{tab.filename}</span>

            {/* Dirty indicator / close button */}
            <span className="relative ml-1 flex h-4 w-4 shrink-0 items-center justify-center">
              {tab.isDirty && !isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-semantic-warning" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded text-ink-tertiary transition-all hover:text-ink-primary",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </span>

            {/* Active underline */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-ink-primary" />
            )}
          </div>
        );
      })}
    </div>
  );
}
