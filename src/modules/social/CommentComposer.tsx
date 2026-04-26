import { useState, useRef, useEffect } from "react";
import { Code2, Send, X } from "lucide-react";
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CommentComposerProps {
  postId: string;
  replyTo?: string;
  onSubmit?: (content: string, snippet?: string) => void;
  externalSubmitting?: boolean;
}

export function CommentComposer({ postId: _postId, replyTo, onSubmit, externalSubmitting }: CommentComposerProps) {
  const [content, setContent] = useState("");
  const [snippet, setSnippet] = useState("");
  const [showSnippet, setShowSnippet] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const snippetRef = useRef<HTMLTextAreaElement>(null);

  const placeholder = replyTo ? `Reply to @${replyTo}…` : "Add a comment…";
  const isEmpty = content.trim().length === 0;

  // Auto-grow main textarea
  function growTextarea(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  useEffect(() => {
    if (textareaRef.current) {
      growTextarea(textareaRef.current);
    }
  }, [content]);

  // Auto-grow snippet textarea
  useEffect(() => {
    if (snippetRef.current) {
      snippetRef.current.style.height = "auto";
      snippetRef.current.style.height = `${Math.min(snippetRef.current.scrollHeight, 200)}px`;
    }
  }, [snippet]);

  // Focus textarea when replyTo changes
  useEffect(() => {
    if (replyTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTo]);

  async function handleSubmit() {
    const isActive = externalSubmitting ?? submitting;
    if (isEmpty || isActive) return;
    if (!externalSubmitting) setSubmitting(true);
    await onSubmit?.(content.trim(), showSnippet && snippet.trim() ? snippet.trim() : undefined);
    setContent("");
    setSnippet("");
    setShowSnippet(false);
    if (!externalSubmitting) setSubmitting(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-3">
      {/* Placeholder avatar for the current user */}
      <Avatar src={null} alt="Me" size="sm" className="mt-0.5 shrink-0" />

      <div className="min-w-0 flex-1">
        {/* Main textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className={cn(
            "w-full resize-none overflow-hidden rounded-xl border border-[#2e2e2e] bg-[#111111]",
            "px-3 py-2.5 text-sm text-[#f5f5f5] placeholder:text-[#6b6b6b]",
            "transition-colors focus:border-[#6b6b6b] focus:outline-none",
            "leading-relaxed"
          )}
          style={{ minHeight: "40px", maxHeight: "200px" }}
        />

        {/* Snippet area */}
        {showSnippet && (
          <div className="mt-2 overflow-hidden rounded-xl border border-[#2e2e2e] bg-[#0a0a0a]">
            <div className="flex items-center justify-between border-b border-[#2e2e2e] bg-[#111111] px-3 py-1.5">
              <span className="font-mono text-xs text-[#6b6b6b]">Code snippet</span>
              <button
                type="button"
                onClick={() => {
                  setShowSnippet(false);
                  setSnippet("");
                }}
                className="text-[#6b6b6b] transition-colors hover:text-[#a3a3a3]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea
              ref={snippetRef}
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="Paste your code here…"
              rows={3}
              className={cn(
                "w-full resize-none overflow-hidden bg-transparent px-3 py-2.5",
                "font-mono text-xs text-[#a3a3a3] placeholder:text-[#3d3d3d]",
                "focus:outline-none"
              )}
              style={{ minHeight: "80px", maxHeight: "200px" }}
              spellCheck={false}
            />
          </div>
        )}

        {/* Action row */}
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setShowSnippet((prev) => !prev);
              if (!showSnippet) {
                setTimeout(() => snippetRef.current?.focus(), 50);
              }
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
              showSnippet
                ? "bg-[#1a1a1a] text-[#f5f5f5]"
                : "text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#a3a3a3]"
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            {showSnippet ? "Hide snippet" : "Add code snippet"}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#3d3d3d]">⌘↵</span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isEmpty || (externalSubmitting ?? submitting)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                "bg-[#f5f5f5] text-[#0a0a0a] hover:opacity-90",
                "disabled:pointer-events-none disabled:opacity-30"
              )}
            >
              {(externalSubmitting ?? submitting) ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0a0a0a] border-t-transparent" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {replyTo ? "Reply" : "Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
