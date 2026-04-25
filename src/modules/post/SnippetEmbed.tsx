"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeSnippet } from "@/types";

interface SnippetEmbedProps {
  snippet: CodeSnippet;
  maxLines?: number;
  readOnly?: boolean;
  className?: string;
}

const LANG_LABELS: Record<string, string> = {
  javascript: "JS",
  typescript: "TS",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  python: "PY",
  rust: "RS",
  go: "GO",
  shell: "SH",
};

export function SnippetEmbed({ snippet, maxLines = 12, readOnly = true, className }: SnippetEmbedProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = snippet.code.split("\n");
  const isLong = lines.length > maxLines;
  const displayedCode = isLong && !expanded ? lines.slice(0, maxLines).join("\n") + "\n..." : snippet.code;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "code-block group",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-surface-border bg-canvas-secondary px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Window dots */}
          <span className="h-2.5 w-2.5 rounded-full bg-semantic-error/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-semantic-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-semantic-success/70" />
        </div>

        <span className="text-xs font-mono text-ink-tertiary">{snippet.filename}</span>

        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono font-semibold text-ink-disabled uppercase tracking-wider">
            {LANG_LABELS[snippet.language] ?? snippet.language.toUpperCase()}
          </span>
          <button
            onClick={handleCopy}
            className="flex h-6 w-6 items-center justify-center rounded text-ink-tertiary opacity-0 transition-all group-hover:opacity-100 hover:text-ink-primary"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-semantic-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="relative overflow-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="text-ink-primary">{displayedCode}</code>
        </pre>

        {isLong && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-surface-border py-2 text-xs text-ink-tertiary transition-colors hover:bg-surface hover:text-ink-secondary"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Show {lines.length - maxLines} more lines
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
