"use client";

import { useCodeMirror } from "./useCodeMirror";
import { cn } from "@/lib/utils";
import type { EditorSettings } from "@/types";

interface CodeEditorProps {
  doc: string;
  language?: "javascript" | "typescript" | "html" | "css";
  settings: EditorSettings;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function CodeEditor({
  doc,
  language = "javascript",
  settings,
  onChange,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const { containerRef } = useCodeMirror({ doc, language, settings, onChange, readOnly });

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full overflow-auto",
        "font-mono text-sm",
        "[&_.cm-editor]:h-full [&_.cm-scroller]:h-full",
        className
      )}
    />
  );
}
