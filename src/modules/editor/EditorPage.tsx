"use client";

import { useState, useCallback } from "react";
import { EditorLayout } from "@/layouts/EditorLayout";
import { FileTree } from "./FileTree";
import { EditorTabs } from "./EditorTabs";
import { CodeEditor } from "./CodeEditor";
import { PreviewPane } from "./PreviewPane";
import { ThemeSelector } from "./ThemeSelector";
import { cn } from "@/lib/utils";
import type { EditorSettings, EditorTab, ProjectFile, ProjectFolder } from "@/types";
import type { EditorThemeName } from "./themes";
import { Settings, Eye, EyeOff, PanelLeft, PanelLeftClose } from "lucide-react";

const DEFAULT_SETTINGS: EditorSettings = {
  theme: "codenest-dark",
  fontSize: 14,
  tabSize: 2,
  lineNumbers: true,
  wordWrap: false,
  minimap: false,
  autoComplete: true,
  bracketMatching: true,
  autoSave: true,
  autoSaveDelay: 2000,
};

const SAMPLE_FILES: ProjectFile[] = [
  { id: "f1", name: "index.html", path: "/index.html", language: "html", content: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <title>My Project</title>\n  <link rel=\"stylesheet\" href=\"style.css\" />\n</head>\n<body>\n  <h1>Hello, CodeNest!</h1>\n  <script src=\"script.js\"></script>\n</body>\n</html>" },
  { id: "f2", name: "style.css", path: "/style.css", language: "css", content: "* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: system-ui, sans-serif;\n  background: #0a0a0a;\n  color: #f5f5f5;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3rem;\n  font-weight: 700;\n  letter-spacing: -0.05em;\n}" },
  { id: "f3", name: "script.js", path: "/script.js", language: "javascript", content: "// CodeNest Editor\nconsole.log('Hello from CodeNest!');\n\ndocument.querySelector('h1').addEventListener('click', () => {\n  document.body.style.background = '#' + Math.floor(Math.random() * 0xffffff).toString(16);\n});" },
];

interface EditorPageProps {
  projectId?: string;
}

export function EditorPage({ projectId }: EditorPageProps) {
  const [files] = useState<ProjectFile[]>(SAMPLE_FILES);
  const [folders] = useState<ProjectFolder[]>([]);
  const [tabs, setTabs] = useState<EditorTab[]>([
    { id: "t1", fileId: "f1", filename: "index.html", language: "html", isDirty: false },
    { id: "t2", fileId: "f2", filename: "style.css", language: "css", isDirty: false },
    { id: "t3", fileId: "f3", filename: "script.js", language: "javascript", isDirty: false },
  ]);
  const [activeTabId, setActiveTabId] = useState<string | null>("t1");
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [fileContents, setFileContents] = useState<Record<string, string>>(
    Object.fromEntries(files.map((f) => [f.id, f.content]))
  );
  const [showPreview, setShowPreview] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;
  const activeFile = activeTab ? files.find((f) => f.id === activeTab.fileId) ?? null : null;

  const handleFileSelect = (file: ProjectFile) => {
    const existing = tabs.find((t) => t.fileId === file.id);
    if (existing) {
      setActiveTabId(existing.id);
    } else {
      const newTab: EditorTab = {
        id: `t-${file.id}`,
        fileId: file.id,
        filename: file.name,
        language: file.language as EditorTab["language"],
        isDirty: false,
      };
      setTabs((p) => [...p, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  const handleTabClose = (tabId: string) => {
    setTabs((p) => {
      const next = p.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        setActiveTabId(next[next.length - 1]?.id ?? null);
      }
      return next;
    });
  };

  const handleChange = useCallback(
    (value: string) => {
      if (!activeTab) return;
      setFileContents((p) => ({ ...p, [activeTab.fileId]: value }));
      setIsDirty(true);
      setTabs((p) =>
        p.map((t) => (t.id === activeTab.id ? { ...t, isDirty: true } : t))
      );
    },
    [activeTab]
  );

  const handleSave = () => {
    setIsDirty(false);
    setTabs((p) => p.map((t) => ({ ...t, isDirty: false })));
  };

  const htmlContent = fileContents[files.find((f) => f.language === "html")?.id ?? ""] ?? "";
  const cssContent = fileContents[files.find((f) => f.language === "css")?.id ?? ""] ?? "";
  const jsContent = fileContents[files.find((f) => f.language === "javascript")?.id ?? ""] ?? "";

  return (
    <EditorLayout
      title={projectId ? `Project #${projectId}` : "Untitled Project"}
      isDirty={isDirty}
      onSave={handleSave}
      onPreview={() => setShowPreview((p) => !p)}
      onRun={() => setShowPreview(true)}
      rightSlot={
        <button
          onClick={() => setShowSettings((p) => !p)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface hover:text-ink-primary transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>
      }
    >
      {/* File tree sidebar */}
      <div
        className={cn(
          "flex shrink-0 flex-col border-r border-surface-border bg-canvas-secondary transition-all duration-200",
          showSidebar ? "w-56" : "w-0 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border">
          <span className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider">Files</span>
          <button onClick={() => setShowSidebar(false)} className="text-ink-disabled hover:text-ink-tertiary">
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FileTree
            files={files}
            folders={folders}
            activeFileId={activeFile?.id ?? null}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>

      {/* Toggle sidebar button */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="flex h-full w-6 shrink-0 items-center justify-center border-r border-surface-border bg-canvas-secondary text-ink-disabled hover:text-ink-tertiary transition-colors"
        >
          <PanelLeft className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Editor area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <EditorTabs
          tabs={tabs}
          activeTabId={activeTabId}
          onTabSelect={setActiveTabId}
          onTabClose={handleTabClose}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Code editor */}
          <div className={cn("flex flex-col overflow-hidden", showPreview ? "w-1/2" : "flex-1")}>
            {activeFile ? (
              <CodeEditor
                doc={fileContents[activeFile.id] ?? activeFile.content}
                language={activeFile.language as "javascript" | "typescript" | "html" | "css"}
                settings={settings}
                onChange={handleChange}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-ink-disabled">
                Open a file to start editing
              </div>
            )}
          </div>

          {/* Resizer */}
          {showPreview && (
            <div className="w-px bg-surface-border" />
          )}

          {/* Preview pane */}
          {showPreview && (
            <div className="flex-1 overflow-hidden">
              <PreviewPane html={htmlContent} css={cssContent} js={jsContent} />
            </div>
          )}
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="w-64 shrink-0 overflow-y-auto border-l border-surface-border bg-canvas-secondary p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Editor Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-ink-tertiary hover:text-ink-primary"
            >
              Close
            </button>
          </div>

          <ThemeSelector
            current={settings.theme as EditorThemeName}
            onChange={(theme) => setSettings((p) => ({ ...p, theme }))}
          />

          <div className="mt-6 flex flex-col gap-3">
            {/* Font size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-ink-tertiary">Font Size</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={11}
                  max={20}
                  value={settings.fontSize}
                  onChange={(e) => setSettings((p) => ({ ...p, fontSize: Number(e.target.value) }))}
                  className="flex-1 accent-ink-primary"
                />
                <span className="w-6 text-xs text-ink-secondary text-right">{settings.fontSize}</span>
              </div>
            </div>

            {/* Toggles */}
            {[
              { key: "lineNumbers", label: "Line Numbers" },
              { key: "wordWrap", label: "Word Wrap" },
              { key: "autoComplete", label: "Auto Complete" },
              { key: "bracketMatching", label: "Code Folding" },
              { key: "autoSave", label: "Auto Save" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-ink-secondary">{label}</span>
                <div
                  className={cn(
                    "relative h-4 w-7 rounded-full transition-colors",
                    settings[key as keyof EditorSettings] ? "bg-ink-primary" : "bg-surface-hover"
                  )}
                  onClick={() =>
                    setSettings((p) => ({
                      ...p,
                      [key]: !p[key as keyof EditorSettings],
                    }))
                  }
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
                      settings[key as keyof EditorSettings] ? "left-3.5" : "left-0.5"
                    )}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </EditorLayout>
  );
}
