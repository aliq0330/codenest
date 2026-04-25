"use client";

import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_LABELS, EditorThemeName } from "./themes";

interface ThemeSelectorProps {
  current: EditorThemeName;
  onChange: (theme: EditorThemeName) => void;
}

const THEME_PREVIEWS: Record<EditorThemeName, { bg: string; fg: string }> = {
  "codenest-dark": { bg: "#0a0a0a", fg: "#f5f5f5" },
  "codenest-light": { bg: "#ffffff", fg: "#111827" },
  obsidian: { bg: "#1e1e1e", fg: "#d4d4d4" },
  "night-owl": { bg: "#011627", fg: "#d6deeb" },
  dracula: { bg: "#282a36", fg: "#f8f8f2" },
  "github-dark": { bg: "#0d1117", fg: "#c9d1d9" },
  "github-light": { bg: "#ffffff", fg: "#24292f" },
  monochrome: { bg: "#000000", fg: "#e5e5e5" },
};

export function ThemeSelector({ current, onChange }: ThemeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs text-ink-tertiary">
        <Palette className="h-3.5 w-3.5" />
        <span>Editor Theme</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(THEME_LABELS) as EditorThemeName[]).map((name) => {
          const preview = THEME_PREVIEWS[name];
          return (
            <button
              key={name}
              onClick={() => onChange(name)}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-2.5 text-xs transition-all text-left",
                current === name
                  ? "border-ink-secondary bg-surface"
                  : "border-surface-border hover:border-ink-tertiary"
              )}
            >
              <span
                className="h-5 w-5 shrink-0 rounded-md border border-surface-border flex items-center justify-center"
                style={{ backgroundColor: preview.bg }}
              >
                <span className="text-[8px] font-mono" style={{ color: preview.fg }}>
                  Aa
                </span>
              </span>
              <span className="truncate text-ink-secondary">{THEME_LABELS[name]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
