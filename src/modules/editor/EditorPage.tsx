import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Eye, Save, Share2, Settings2, Plus, X, ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, rectangularSelection } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { indentOnInput, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor.store";
import { THEME_LABELS, EDITOR_THEMES, type EditorThemeName } from "@/modules/editor/themes";

// ─── language detection ────────────────────────────────────────────────
function getLangExtension(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["js", "jsx", "mjs", "cjs"].includes(ext)) return javascript({ jsx: true });
  if (["ts", "tsx"].includes(ext)) return javascript({ typescript: true, jsx: ext === "tsx" });
  if (ext === "html") return html();
  if (ext === "css") return css();
  return javascript();
}

// ─── mock file tree ────────────────────────────────────────────────────
interface FsNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FsNode[];
  language?: string;
}

const DEFAULT_FILES: FsNode[] = [
  {
    id: "f-root",
    name: "project",
    type: "folder",
    children: [
      { id: "f-index", name: "index.html", type: "file" },
      { id: "f-style", name: "style.css", type: "file" },
      {
        id: "f-src",
        name: "src",
        type: "folder",
        children: [
          { id: "f-main", name: "main.js", type: "file" },
          { id: "f-utils", name: "utils.js", type: "file" },
        ],
      },
    ],
  },
];

const DEFAULT_CONTENTS: Record<string, string> = {
  "f-index": `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>My Project</title>\n  <link rel="stylesheet" href="style.css" />\n</head>\n<body>\n  <div id="app">\n    <h1>Hello, World!</h1>\n  </div>\n  <script src="src/main.js"></script>\n</body>\n</html>`,
  "f-style": `/* ── Reset ─────────────────────────────── */\n*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: system-ui, sans-serif;\n  background: #0a0a0a;\n  color: #f5f5f5;\n  min-height: 100vh;\n}\n\n#app {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n\nh1 {\n  font-size: 2rem;\n  font-weight: 700;\n}`,
  "f-main": `// main.js\nimport { greet } from "./utils.js";\n\nconst app = document.getElementById("app");\nconst message = greet("World");\nconsole.log(message);\n`,
  "f-utils": `// utils.js\nexport function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nexport function formatDate(date) {\n  return new Intl.DateTimeFormat("en-US").format(date);\n}\n`,
};

// ─── FileTree component ────────────────────────────────────────────────
function FileTreeNode({ node, depth, activeId, onSelect }: {
  node: FsNode;
  depth: number;
  activeId: string;
  onSelect: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(true);

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#a3a3a3] transition-colors"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          {open ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
          {open ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#6b6b6b]" /> : <Folder className="h-3.5 w-3.5 shrink-0 text-[#6b6b6b]" />}
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children?.map((child) => (
          <FileTreeNode key={child.id} node={child} depth={depth + 1} activeId={activeId} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.id, node.name)}
      className={cn(
        "flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors",
        activeId === node.id ? "bg-[#1a1a1a] text-[#f5f5f5]" : "text-[#6b6b6b] hover:bg-[#111111] hover:text-[#a3a3a3]"
      )}
      style={{ paddingLeft: `${8 + depth * 12}px` }}
    >
      <File className="h-3.5 w-3.5 shrink-0 text-[#3d3d3d]" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

// ─── Tab bar ────────────────────────────────────────────────────────────
interface EditorTab {
  id: string;
  filename: string;
  dirty: boolean;
}

// ─── Settings panel ─────────────────────────────────────────────────────
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useEditorStore();

  return (
    <div className="absolute right-0 top-full z-30 mt-1 w-72 rounded-xl border border-[#2e2e2e] bg-[#111111] shadow-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#f5f5f5]">Editor Settings</span>
        <button onClick={onClose} className="text-[#6b6b6b] hover:text-[#f5f5f5]">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Theme */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-[#6b6b6b]">Theme</p>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(THEME_LABELS) as EditorThemeName[]).map((name) => (
            <button
              key={name}
              onClick={() => updateSettings({ theme: name })}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-left text-xs transition-all",
                settings.theme === name ? "border-[#f5f5f5] text-[#f5f5f5]" : "border-[#2e2e2e] text-[#6b6b6b] hover:border-[#6b6b6b]"
              )}
            >
              {THEME_LABELS[name]}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-[#a3a3a3]">Font Size</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSettings({ font_size: Math.max(11, settings.font_size - 1) })}
            className="h-6 w-6 rounded border border-[#2e2e2e] text-[#6b6b6b] hover:text-[#f5f5f5] flex items-center justify-center text-sm"
          >-</button>
          <span className="w-8 text-center text-xs text-[#f5f5f5]">{settings.font_size}px</span>
          <button
            onClick={() => updateSettings({ font_size: Math.min(20, settings.font_size + 1) })}
            className="h-6 w-6 rounded border border-[#2e2e2e] text-[#6b6b6b] hover:text-[#f5f5f5] flex items-center justify-center text-sm"
          >+</button>
        </div>
      </div>

      {/* Tab size */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-[#a3a3a3]">Tab Size</span>
        <select
          value={settings.tab_size}
          onChange={(e) => updateSettings({ tab_size: Number(e.target.value) })}
          className="rounded border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-1 text-xs text-[#f5f5f5]"
        >
          <option value={2}>2</option>
          <option value={4}>4</option>
        </select>
      </div>

      {/* Toggles */}
      {([
        { key: "line_numbers", label: "Line Numbers" },
        { key: "word_wrap", label: "Word Wrap" },
        { key: "auto_complete", label: "Autocomplete" },
        { key: "bracket_matching", label: "Bracket Matching" },
      ] as { key: keyof typeof settings; label: string }[]).map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between py-1.5">
          <span className="text-xs text-[#a3a3a3]">{label}</span>
          <div
            onClick={() => updateSettings({ [key]: !settings[key] })}
            className={cn("relative h-4 w-7 cursor-pointer rounded-full transition-colors", settings[key] ? "bg-[#f5f5f5]" : "bg-[#2e2e2e]")}
          >
            <span className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-[#0a0a0a] transition-all", settings[key] ? "left-3.5" : "left-0.5")} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Preview pane ────────────────────────────────────────────────────────
function PreviewPane({ html: htmlContent, css: cssContent, js: jsContent }: { html: string; css: string; js: string }) {
  const src = `<!DOCTYPE html><html><head><style>${cssContent}</style></head><body>${htmlContent}<script>${jsContent}<\/script></body></html>`;
  return (
    <iframe
      srcDoc={src}
      title="Preview"
      sandbox="allow-scripts"
      className="h-full w-full border-0 bg-white"
    />
  );
}

// ─── Main EditorPage ─────────────────────────────────────────────────────
export function EditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { settings } = useEditorStore();

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Compartments for dynamic reconfiguration
  const themeCompartment = useRef(new Compartment());
  const lineNumCompartment = useRef(new Compartment());
  const wrapCompartment = useRef(new Compartment());
  const autocompleteCompartment = useRef(new Compartment());
  const bracketCompartment = useRef(new Compartment());
  const langCompartment = useRef(new Compartment());
  const fontCompartment = useRef(new Compartment());

  // Tabs state
  const [tabs, setTabs] = useState<EditorTab[]>([
    { id: "f-index", filename: "index.html", dirty: false },
    { id: "f-style", filename: "style.css", dirty: false },
    { id: "f-main", filename: "main.js", dirty: false },
  ]);
  const [activeTabId, setActiveTabId] = useState("f-main");

  // File contents (local state, seeded from defaults)
  const [contents, setContents] = useState<Record<string, string>>(DEFAULT_CONTENTS);

  // Preview
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectTitle, setProjectTitle] = useState(id ? `Project ${id}` : "Untitled Project");
  const [editingTitle, setEditingTitle] = useState(false);

  // Build CodeMirror extensions
  const buildExtensions = useCallback((filename: string) => {
    const s = settings;
    return [
      history(),
      drawSelection(),
      rectangularSelection(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      highlightSelectionMatches(),
      indentOnInput(),
      foldGutter(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        ...completionKeymap,
        ...closeBracketsKeymap,
        ...foldKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      themeCompartment.current.of(EDITOR_THEMES[s.theme]),
      lineNumCompartment.current.of(s.line_numbers ? lineNumbers() : []),
      wrapCompartment.current.of(s.word_wrap ? EditorView.lineWrapping : []),
      autocompleteCompartment.current.of(s.auto_complete ? autocompletion() : []),
      bracketCompartment.current.of(s.bracket_matching ? [bracketMatching(), closeBrackets()] : []),
      langCompartment.current.of(getLangExtension(filename)),
      fontCompartment.current.of(EditorView.theme({
        "&": { fontFamily: "'JetBrains Mono', monospace", fontSize: `${s.font_size}px` },
      })),
    ];
  }, [settings]);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: contents[activeTabId] ?? "",
        extensions: buildExtensions(activeTab.filename),
      }),
      parent: editorRef.current,
      dispatch(tr) {
        view.update([tr]);
        if (tr.docChanged) {
          setContents((prev) => ({ ...prev, [activeTabId]: view.state.doc.toString() }));
          setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, dirty: true } : t));
        }
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  // Reconfigure on settings change
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const s = settings;
    const activeTab = tabs.find((t) => t.id === activeTabId);
    view.dispatch({
      effects: [
        themeCompartment.current.reconfigure(EDITOR_THEMES[s.theme]),
        lineNumCompartment.current.reconfigure(s.line_numbers ? lineNumbers() : []),
        wrapCompartment.current.reconfigure(s.word_wrap ? EditorView.lineWrapping : []),
        autocompleteCompartment.current.reconfigure(s.auto_complete ? autocompletion() : []),
        bracketCompartment.current.reconfigure(s.bracket_matching ? [bracketMatching(), closeBrackets()] : []),
        fontCompartment.current.reconfigure(EditorView.theme({
          "&": { fontFamily: "'JetBrains Mono', monospace", fontSize: `${s.font_size}px` },
        })),
        ...(activeTab ? [langCompartment.current.reconfigure(getLangExtension(activeTab.filename))] : []),
      ],
    });
  }, [settings, activeTabId, tabs]);

  const switchTab = (id: string, filename: string) => {
    setActiveTabId(id);
    setTabs((prev) => prev.some((t) => t.id === id) ? prev : [...prev, { id, filename, dirty: false }]);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (activeTabId === id && next.length > 0) {
        const idx = Math.max(0, prev.findIndex((t) => t.id === id) - 1);
        setActiveTabId(next[idx]?.id ?? next[0].id);
      }
      return next;
    });
  };

  const handleSave = () => {
    setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, dirty: false } : t));
  };

  // Preview content
  const htmlContent = contents["f-index"] ?? "";
  const cssContent = contents["f-style"] ?? "";
  const jsContent = contents["f-main"] ?? "";

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0a] overflow-hidden">
      {/* ─── Top bar ─────────────────────────────────────────────── */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[#2e2e2e] bg-[#0a0a0a] px-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>

        {/* Title */}
        {editingTitle ? (
          <input
            autoFocus
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false); }}
            className="w-40 rounded border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-0.5 text-sm text-[#f5f5f5] outline-none focus:border-[#6b6b6b]"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-medium text-[#f5f5f5] hover:text-[#a3a3a3] transition-colors"
          >
            {projectTitle}
          </button>
        )}

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPreview((p) => !p)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
              showPreview
                ? "border-[#f5f5f5] bg-[#f5f5f5] text-[#0a0a0a]"
                : "border-[#2e2e2e] text-[#6b6b6b] hover:border-[#6b6b6b] hover:text-[#a3a3a3]"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#2e2e2e] px-2.5 py-1.5 text-xs font-medium text-[#6b6b6b] hover:border-[#6b6b6b] hover:text-[#a3a3a3] transition-all"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg border border-[#2e2e2e] px-2.5 py-1.5 text-xs font-medium text-[#6b6b6b] hover:border-[#6b6b6b] hover:text-[#a3a3a3] transition-all"
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg border border-[#2e2e2e] px-2.5 py-1.5 text-xs font-medium text-[#6b6b6b] hover:border-[#6b6b6b] hover:text-[#a3a3a3] transition-all"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSettings((p) => !p)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border transition-all",
                showSettings
                  ? "border-[#6b6b6b] bg-[#1a1a1a] text-[#f5f5f5]"
                  : "border-transparent text-[#6b6b6b] hover:border-[#2e2e2e] hover:text-[#a3a3a3]"
              )}
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
            {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
          </div>
        </div>
      </div>

      {/* ─── Main area ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* File tree sidebar */}
        {sidebarOpen && (
          <div className="w-48 shrink-0 overflow-y-auto border-r border-[#2e2e2e] bg-[#0a0a0a] py-2">
            <div className="mb-1 flex items-center justify-between px-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3d3d3d]">Explorer</span>
              <button
                onClick={() => {}}
                className="rounded p-0.5 text-[#3d3d3d] hover:text-[#6b6b6b] transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            {DEFAULT_FILES.map((node) => (
              <FileTreeNode
                key={node.id}
                node={node}
                depth={0}
                activeId={activeTabId}
                onSelect={switchTab}
              />
            ))}
          </div>
        )}

        {/* Editor + preview split */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex h-9 shrink-0 items-end overflow-x-auto border-b border-[#2e2e2e] bg-[#0a0a0a] px-1">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#3d3d3d] hover:bg-[#1a1a1a] hover:text-[#6b6b6b] transition-colors"
            >
              <FolderOpen className="h-3.5 w-3.5" />
            </button>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "group flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-t-lg border-t border-l border-r px-3 text-xs transition-colors",
                  activeTabId === tab.id
                    ? "border-[#2e2e2e] bg-[#111111] text-[#f5f5f5]"
                    : "border-transparent text-[#6b6b6b] hover:text-[#a3a3a3]"
                )}
              >
                <File className="h-3 w-3 shrink-0 text-[#3d3d3d]" />
                <span className="max-w-[120px] truncate">{tab.filename}</span>
                {tab.dirty && <span className="h-1.5 w-1.5 rounded-full bg-[#6b6b6b]" />}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => closeTab(tab.id, e)}
                    className="ml-0.5 rounded p-0.5 opacity-0 group-hover:opacity-100 text-[#6b6b6b] hover:text-[#f5f5f5] transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Editor + preview */}
          <div className="flex flex-1 overflow-hidden">
            {/* CodeMirror */}
            <div
              ref={editorRef}
              className={cn("overflow-hidden", showPreview ? "w-1/2" : "w-full")}
              style={{ height: "100%" }}
            />

            {/* Preview */}
            {showPreview && (
              <div className="flex w-1/2 flex-col border-l border-[#2e2e2e]">
                <div className="flex h-8 shrink-0 items-center border-b border-[#2e2e2e] bg-[#0d0d0d] px-3">
                  <span className="text-xs text-[#3d3d3d]">Preview</span>
                </div>
                <div className="flex-1 overflow-hidden bg-white">
                  <PreviewPane html={htmlContent} css={cssContent} js={jsContent} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Status bar ───────────────────────────────────────────── */}
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-[#2e2e2e] bg-[#0d0d0d] px-3">
        <div className="flex items-center gap-3 text-[10px] text-[#3d3d3d]">
          <span>{tabs.find((t) => t.id === activeTabId)?.filename ?? ""}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#3d3d3d]">
          <span>{THEME_LABELS[settings.theme]}</span>
          <span>{settings.font_size}px</span>
          <span>Tab: {settings.tab_size}</span>
        </div>
      </div>
    </div>
  );
}
