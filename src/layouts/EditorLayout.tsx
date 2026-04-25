"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Eye, Save, Play, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorLayoutProps {
  children: React.ReactNode;
  title?: string;
  onSave?: () => void;
  onPreview?: () => void;
  onShare?: () => void;
  onRun?: () => void;
  isDirty?: boolean;
  isSaving?: boolean;
  backHref?: string;
  rightSlot?: React.ReactNode;
}

export function EditorLayout({
  children,
  title = "Untitled Project",
  onSave,
  onPreview,
  onShare,
  onRun,
  isDirty = false,
  isSaving = false,
  backHref = "/feed",
  rightSlot,
}: EditorLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-canvas">
      {/* Editor topbar */}
      <header className="flex h-header shrink-0 items-center gap-3 border-b border-surface-border bg-canvas-secondary px-4">
        {/* Back + logo */}
        <Link
          href={backHref}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-tertiary transition-colors hover:bg-surface hover:text-ink-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex h-6 w-px bg-surface-border" />

        <div className="flex h-7 w-7 items-center justify-center rounded bg-ink-primary">
          <Code2 className="h-3.5 w-3.5 text-canvas" />
        </div>

        {/* Title */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <h1 className="truncate text-sm font-semibold text-ink-primary">{title}</h1>
          {isDirty && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-semantic-warning" title="Unsaved changes" />
          )}
          {isSaving && (
            <span className="text-xs text-ink-tertiary">Saving...</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {onRun && (
            <button
              onClick={onRun}
              className="flex items-center gap-1.5 rounded-lg bg-semantic-success/10 px-3 py-1.5 text-xs font-medium text-semantic-success transition-colors hover:bg-semantic-success/20"
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </button>
          )}
          {onPreview && (
            <button
              onClick={onPreview}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface hover:text-ink-primary"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                isDirty
                  ? "bg-ink-primary text-canvas hover:opacity-90"
                  : "bg-surface text-ink-tertiary cursor-default"
              )}
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface hover:text-ink-primary"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          {rightSlot}
        </div>
      </header>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
