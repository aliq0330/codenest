import { Link } from "react-router-dom";
import { ArrowLeft, Share2, Eye, Save, Play, Code2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorLayoutProps {
  children: React.ReactNode;
  title?: string;
  onSave?: () => void;
  onPreview?: () => void;
  onShare?: () => void;
  onRun?: () => void;
  onSettings?: () => void;
  isDirty?: boolean;
  isSaving?: boolean;
  backTo?: string;
}

export function EditorLayout({
  children, title = "Untitled Project", onSave, onPreview, onShare,
  onRun, onSettings, isDirty, isSaving, backTo = "/feed",
}: EditorLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Topbar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#2e2e2e] bg-[#111111] px-4">
        <Link
          to={backTo}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="h-6 w-px bg-[#2e2e2e]" />
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#f5f5f5]">
          <Code2 className="h-3.5 w-3.5 text-[#0a0a0a]" />
        </div>
        <div className="flex flex-1 min-w-0 items-center gap-2">
          <h1 className="truncate text-sm font-semibold text-[#f5f5f5]">{title}</h1>
          {isDirty && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" title="Unsaved" />}
          {isSaving && <span className="text-xs text-[#6b6b6b]">Saving…</span>}
        </div>
        <div className="flex items-center gap-1">
          {onRun && (
            <button onClick={onRun} className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors">
              <Play className="h-3.5 w-3.5" />Run
            </button>
          )}
          {onPreview && (
            <button onClick={onPreview} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]">
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                isDirty ? "bg-[#f5f5f5] text-[#0a0a0a] hover:opacity-90" : "bg-[#1a1a1a] text-[#6b6b6b] cursor-default"
              )}
            >
              <Save className="h-3.5 w-3.5" />Save
            </button>
          )}
          {onShare && (
            <button onClick={onShare} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]">
              <Share2 className="h-4 w-4" />
            </button>
          )}
          {onSettings && (
            <button onClick={onSettings} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]">
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
