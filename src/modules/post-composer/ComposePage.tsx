import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Image, Code2, FileText, ChevronDown, Hash, AtSign } from "lucide-react";
import { Button, Input, Textarea, TagPill } from "@/components/ui";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type PostType = "snippet" | "project" | "article" | "thought";

const LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go", "java", "cpp", "css",
  "html", "sql", "bash", "json", "yaml", "markdown", "swift", "kotlin",
];

interface CodeBlock {
  id: string;
  filename: string;
  language: string;
  code: string;
}

export function ComposePage() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<PostType>("snippet");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([
    { id: "cb1", filename: "index.js", language: "javascript", code: "" },
  ]);
  const [showLangPicker, setShowLangPicker] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((p) => [...p, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags((p) => p.filter((x) => x !== t));

  const addCodeBlock = () => {
    setCodeBlocks((p) => [
      ...p,
      { id: `cb${Date.now()}`, filename: "untitled.js", language: "javascript", code: "" },
    ]);
  };

  const updateBlock = (id: string, field: keyof CodeBlock, value: string) => {
    setCodeBlocks((p) => p.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBlock = (id: string) => {
    if (codeBlocks.length > 1) setCodeBlocks((p) => p.filter((b) => b.id !== id));
  };

  const canSubmit = () => {
    if (postType === "snippet") return codeBlocks.some((b) => b.code.trim());
    if (postType === "thought") return content.trim().length > 0;
    return title.trim() && content.trim();
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;
    toast.success("Post published!");
    navigate("/feed");
  };

  const insertMention = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const newVal = content.slice(0, pos) + "@" + content.slice(pos);
    setContent(newVal);
    setTimeout(() => ta.setSelectionRange(pos + 1, pos + 1), 0);
    ta.focus();
  };

  const insertHashtag = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const newVal = content.slice(0, pos) + "#" + content.slice(pos);
    setContent(newVal);
    setTimeout(() => ta.setSelectionRange(pos + 1, pos + 1), 0);
    ta.focus();
  };

  const TYPE_TABS: { type: PostType; label: string; icon: React.ReactNode }[] = [
    { type: "snippet", label: "Snippet", icon: <Code2 className="h-3.5 w-3.5" /> },
    { type: "thought", label: "Thought", icon: <FileText className="h-3.5 w-3.5" /> },
    { type: "project", label: "Project", icon: <Image className="h-3.5 w-3.5" /> },
    { type: "article", label: "Article", icon: <FileText className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2e2e2e] px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-[#f5f5f5]">New Post</span>
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!canSubmit()}>
          Publish
        </Button>
      </div>

      {/* Type selector */}
      <div className="flex border-b border-[#2e2e2e] px-2">
        {TYPE_TABS.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => setPostType(type)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-medium transition-colors",
              postType === type
                ? "border-[#f5f5f5] text-[#f5f5f5]"
                : "border-transparent text-[#6b6b6b] hover:text-[#a3a3a3]"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Title — project / article */}
        {(postType === "project" || postType === "article") && (
          <Input
            label="Title"
            placeholder={postType === "article" ? "Article title..." : "Project name..."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3"
          />
        )}

        {/* Description / body text */}
        {postType !== "snippet" && (
          <div className="mb-3">
            <Textarea
              ref={textareaRef}
              label={postType === "article" ? "Content (Markdown)" : "Description"}
              placeholder={
                postType === "thought"
                  ? "What's on your mind? Use @mention or #hashtag..."
                  : postType === "article"
                  ? "Write your article in Markdown..."
                  : "Describe your project..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={postType === "article" ? 12 : 4}
            />
            {postType === "thought" && (
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={insertMention}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#a3a3a3] transition-colors"
                >
                  <AtSign className="h-3.5 w-3.5" />
                  Mention
                </button>
                <button
                  onClick={insertHashtag}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#a3a3a3] transition-colors"
                >
                  <Hash className="h-3.5 w-3.5" />
                  Hashtag
                </button>
                <span className={cn("ml-auto text-xs", content.length > 280 ? "text-red-400" : "text-[#3d3d3d]")}>
                  {content.length}/280
                </span>
              </div>
            )}
          </div>
        )}

        {/* Snippet description for snippet type */}
        {postType === "snippet" && (
          <Textarea
            label="Description (optional)"
            placeholder="What does this snippet do?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="mb-3"
          />
        )}

        {/* Code blocks */}
        {(postType === "snippet" || postType === "project") && (
          <div className="mb-3 flex flex-col gap-3">
            {codeBlocks.map((block) => (
              <div key={block.id} className="rounded-xl border border-[#2e2e2e] bg-[#111111] overflow-hidden">
                {/* Block header */}
                <div className="flex items-center gap-2 border-b border-[#2e2e2e] bg-[#161616] px-3 py-2">
                  <input
                    value={block.filename}
                    onChange={(e) => updateBlock(block.id, "filename", e.target.value)}
                    className="flex-1 bg-transparent text-xs text-[#a3a3a3] outline-none placeholder:text-[#3d3d3d]"
                    placeholder="filename.js"
                  />
                  {/* Language picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLangPicker(showLangPicker === block.id ? null : block.id)}
                      className="flex items-center gap-1 rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-1 text-xs text-[#6b6b6b] hover:border-[#6b6b6b] transition-colors"
                    >
                      {block.language}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {showLangPicker === block.id && (
                      <div className="absolute right-0 top-full z-20 mt-1 max-h-48 w-36 overflow-y-auto rounded-xl border border-[#2e2e2e] bg-[#111111] shadow-xl">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => { updateBlock(block.id, "language", lang); setShowLangPicker(null); }}
                            className={cn(
                              "w-full px-3 py-2 text-left text-xs transition-colors hover:bg-[#1a1a1a]",
                              block.language === lang ? "text-[#f5f5f5]" : "text-[#6b6b6b]"
                            )}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {codeBlocks.length > 1 && (
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="text-[#6b6b6b] hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Code textarea */}
                <textarea
                  value={block.code}
                  onChange={(e) => updateBlock(block.id, "code", e.target.value)}
                  placeholder="// Paste your code here..."
                  rows={10}
                  spellCheck={false}
                  className="w-full resize-none bg-transparent px-4 py-3 font-mono text-xs text-[#a3a3a3] placeholder:text-[#3d3d3d] outline-none leading-relaxed"
                />
              </div>
            ))}
            {postType === "snippet" && codeBlocks.length < 5 && (
              <button
                onClick={addCodeBlock}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#2e2e2e] py-3 text-xs text-[#6b6b6b] transition-all hover:border-[#6b6b6b] hover:text-[#a3a3a3]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add file
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-medium text-[#6b6b6b]">Tags <span className="text-[#3d3d3d]">(up to 5)</span></p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((t) => (
              <button key={t} onClick={() => removeTag(t)} className="group flex items-center gap-1">
                <TagPill label={t} />
              </button>
            ))}
          </div>
          {tags.length < 5 && (
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag..."
                className="flex-1 rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] px-3 py-2 text-xs text-[#f5f5f5] placeholder:text-[#3d3d3d] focus:border-[#6b6b6b] focus:outline-none"
              />
              <Button size="sm" variant="ghost" onClick={addTag}>Add</Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-[#2e2e2e] bg-[#0a0a0a] px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span>Publishing as @myusername</span>
        </div>
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!canSubmit()}>
          Publish
        </Button>
      </div>
    </div>
  );
}
