import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeSnippet } from "@/types";

const LANG_BADGE: Record<string, string> = {
  javascript: "JS",
  typescript: "TS",
  html: "HTML",
  css: "CSS",
  scss: "CSS",
  json: "JSON",
  markdown: "MD",
  python: "PY",
  rust: "RS",
  go: "GO",
  java: "JAVA",
  cpp: "C++",
  c: "C",
  bash: "SH",
  shell: "SH",
  sql: "SQL",
  yaml: "YAML",
  toml: "TOML",
  xml: "XML",
  jsx: "JSX",
  tsx: "TSX",
  vue: "VUE",
  svelte: "SVL",
};

const LANG_COLORS: Record<string, string> = {
  javascript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  typescript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  html: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  css: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  scss: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  json: "bg-green-500/10 text-green-400 border-green-500/20",
  markdown: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  python: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  rust: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  go: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  sql: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  bash: "bg-neutral-500/10 text-neutral-300 border-neutral-500/20",
  shell: "bg-neutral-500/10 text-neutral-300 border-neutral-500/20",
  vue: "bg-green-500/10 text-green-400 border-green-500/20",
  jsx: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  tsx: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

function getLangBadge(lang: string): string {
  return LANG_BADGE[lang.toLowerCase()] ?? lang.toUpperCase().slice(0, 4);
}

function getLangColor(lang: string): string {
  return LANG_COLORS[lang.toLowerCase()] ?? "bg-[#1a1a1a] text-[#a3a3a3] border-[#2e2e2e]";
}

interface SnippetEmbedProps {
  snippet: CodeSnippet;
  maxLines?: number;
}

export function SnippetEmbed({ snippet, maxLines = 12 }: SnippetEmbedProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = snippet.code.split("\n");
  const isOverflow = lines.length > maxLines;
  const displayedCode = isOverflow && !expanded
    ? lines.slice(0, maxLines).join("\n")
    : snippet.code;

  function handleCopy() {
    navigator.clipboard.writeText(snippet.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const lang = snippet.language.toLowerCase();
  const badge = getLangBadge(lang);
  const badgeColor = getLangColor(lang);

  return (
    <div className="overflow-hidden rounded-xl border border-[#2e2e2e] bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2e2e2e] bg-[#111111] px-3 py-2">
        {/* Window dots */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          {snippet.filename && (
            <span className="text-xs text-[#6b6b6b]">{snippet.filename}</span>
          )}
        </div>

        {/* Right side: lang badge + copy */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              badgeColor
            )}
          >
            {badge}
          </span>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
              copied
                ? "text-green-400"
                : "text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#a3a3a3]"
            )}
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={12} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code block */}
      <div className="relative overflow-auto">
        <pre
          className={cn(
            "px-4 py-3 text-sm leading-relaxed text-[#f5f5f5]",
            isOverflow && !expanded && "relative"
          )}
          style={{ background: "#0a0a0a", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        >
          <code>{displayedCode}</code>
          {isOverflow && !expanded && (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-12"
              style={{
                background: "linear-gradient(to bottom, transparent, #0a0a0a)",
              }}
            />
          )}
        </pre>
      </div>

      {/* Expand / Collapse */}
      {isOverflow && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-[#2e2e2e] bg-[#111111] py-1.5 text-xs text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#a3a3a3]"
        >
          {expanded ? (
            <>
              <ChevronUp size={13} />
              Show less
            </>
          ) : (
            <>
              <ChevronDown size={13} />
              {lines.length - maxLines} more lines
            </>
          )}
        </button>
      )}
    </div>
  );
}
