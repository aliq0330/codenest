import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";

// ─── Theme factory ───────────────────────────────────────────────────────────

function makeTheme(spec: {
  bg: string;
  bgSecondary: string;
  gutterBg: string;
  gutterFg: string;
  cursor: string;
  selection: string;
  lineHighlight: string;
  fg: string;
  border: string;
}): Extension {
  return EditorView.theme(
    {
      "&": { backgroundColor: spec.bg, color: spec.fg },
      ".cm-content": { caretColor: spec.cursor },
      ".cm-cursor": { borderLeftColor: spec.cursor },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
        backgroundColor: spec.selection,
      },
      ".cm-gutters": {
        backgroundColor: spec.gutterBg,
        color: spec.gutterFg,
        border: "none",
        borderRight: `1px solid ${spec.border}`,
      },
      ".cm-lineNumbers .cm-gutterElement": { minWidth: "40px", padding: "0 8px" },
      ".cm-activeLine": { backgroundColor: spec.lineHighlight },
      ".cm-activeLineGutter": { backgroundColor: spec.lineHighlight },
      ".cm-panels": { backgroundColor: spec.bgSecondary },
      ".cm-tooltip": {
        backgroundColor: spec.bgSecondary,
        border: `1px solid ${spec.border}`,
        borderRadius: "8px",
      },
      ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
        backgroundColor: spec.lineHighlight,
        color: spec.fg,
      },
    },
    { dark: spec.bg.startsWith("#0") || spec.bg.startsWith("#1") }
  );
}

// ─── Syntax highlight styles ──────────────────────────────────────────────────

const darkHighlight = HighlightStyle.define([
  { tag: t.keyword, color: "#c792ea", fontWeight: "600" },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: "#eeffff" },
  { tag: [t.propertyName], color: "#82aaff" },
  { tag: [t.variableName, t.labelName], color: "#eeffff" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#f78c6c" },
  { tag: [t.definition(t.name), t.separator], color: "#eeffff" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: "#ffcb6b" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.special(t.string)], color: "#89ddff" },
  { tag: [t.meta, t.comment], color: "#546e7a", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "#546e7a", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#82aaff" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#f78c6c" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#c3e88d" },
  { tag: t.invalid, color: "#ef4444" },
]);

const lightHighlight = HighlightStyle.define([
  { tag: t.keyword, color: "#7c3aed", fontWeight: "600" },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: "#1e1e1e" },
  { tag: [t.propertyName], color: "#1d4ed8" },
  { tag: [t.variableName, t.labelName], color: "#1e1e1e" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#b45309" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier], color: "#92400e" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp], color: "#0369a1" },
  { tag: [t.meta, t.comment], color: "#6b7280", fontStyle: "italic" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#b45309" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#166534" },
  { tag: t.invalid, color: "#ef4444" },
]);

const monochromeHighlight = HighlightStyle.define([
  { tag: t.keyword, color: "#ffffff", fontWeight: "700" },
  { tag: [t.name, t.variableName, t.labelName], color: "#e5e5e5" },
  { tag: [t.propertyName], color: "#d4d4d4" },
  { tag: [t.typeName, t.className], color: "#a3a3a3" },
  { tag: [t.operator, t.operatorKeyword], color: "#ffffff" },
  { tag: [t.meta, t.comment], color: "#525252", fontStyle: "italic" },
  { tag: [t.atom, t.bool, t.number], color: "#d4d4d4" },
  { tag: [t.string, t.inserted], color: "#a3a3a3" },
  { tag: t.invalid, color: "#ef4444" },
]);

// ─── 8 Themes ─────────────────────────────────────────────────────────────────

export const themes = {
  "codenest-dark": [
    makeTheme({
      bg: "#0a0a0a",
      bgSecondary: "#111111",
      gutterBg: "#0a0a0a",
      gutterFg: "#3d3d3d",
      cursor: "#ffffff",
      selection: "rgba(255,255,255,0.07)",
      lineHighlight: "rgba(255,255,255,0.03)",
      fg: "#f5f5f5",
      border: "#2e2e2e",
    }),
    syntaxHighlighting(darkHighlight),
  ],

  "codenest-light": [
    makeTheme({
      bg: "#ffffff",
      bgSecondary: "#f9fafb",
      gutterBg: "#ffffff",
      gutterFg: "#9ca3af",
      cursor: "#111827",
      selection: "rgba(0,0,0,0.06)",
      lineHighlight: "rgba(0,0,0,0.03)",
      fg: "#111827",
      border: "#e5e7eb",
    }),
    syntaxHighlighting(lightHighlight),
  ],

  obsidian: [
    makeTheme({
      bg: "#1e1e1e",
      bgSecondary: "#252526",
      gutterBg: "#1e1e1e",
      gutterFg: "#4d4d4d",
      cursor: "#aeafad",
      selection: "rgba(255,255,255,0.1)",
      lineHighlight: "rgba(255,255,255,0.04)",
      fg: "#d4d4d4",
      border: "#3d3d3d",
    }),
    syntaxHighlighting(darkHighlight),
  ],

  "night-owl": [
    makeTheme({
      bg: "#011627",
      bgSecondary: "#01111d",
      gutterBg: "#011627",
      gutterFg: "#4b6479",
      cursor: "#80a4c2",
      selection: "rgba(128,164,194,0.15)",
      lineHighlight: "rgba(255,255,255,0.03)",
      fg: "#d6deeb",
      border: "#1b2b3a",
    }),
    syntaxHighlighting(darkHighlight),
  ],

  dracula: [
    makeTheme({
      bg: "#282a36",
      bgSecondary: "#21222c",
      gutterBg: "#282a36",
      gutterFg: "#6272a4",
      cursor: "#f8f8f2",
      selection: "rgba(68,71,90,0.8)",
      lineHighlight: "rgba(68,71,90,0.4)",
      fg: "#f8f8f2",
      border: "#44475a",
    }),
    syntaxHighlighting(darkHighlight),
  ],

  "github-dark": [
    makeTheme({
      bg: "#0d1117",
      bgSecondary: "#161b22",
      gutterBg: "#0d1117",
      gutterFg: "#3d444d",
      cursor: "#c9d1d9",
      selection: "rgba(56,139,253,0.15)",
      lineHighlight: "rgba(255,255,255,0.03)",
      fg: "#c9d1d9",
      border: "#21262d",
    }),
    syntaxHighlighting(darkHighlight),
  ],

  "github-light": [
    makeTheme({
      bg: "#ffffff",
      bgSecondary: "#f6f8fa",
      gutterBg: "#f6f8fa",
      gutterFg: "#8c959f",
      cursor: "#24292f",
      selection: "rgba(84,174,255,0.15)",
      lineHighlight: "rgba(0,0,0,0.03)",
      fg: "#24292f",
      border: "#d0d7de",
    }),
    syntaxHighlighting(lightHighlight),
  ],

  monochrome: [
    makeTheme({
      bg: "#000000",
      bgSecondary: "#0a0a0a",
      gutterBg: "#000000",
      gutterFg: "#404040",
      cursor: "#ffffff",
      selection: "rgba(255,255,255,0.1)",
      lineHighlight: "rgba(255,255,255,0.02)",
      fg: "#e5e5e5",
      border: "#1a1a1a",
    }),
    syntaxHighlighting(monochromeHighlight),
  ],
} as const;

export type EditorThemeName = keyof typeof themes;

export const THEME_LABELS: Record<EditorThemeName, string> = {
  "codenest-dark": "CodeNest Dark",
  "codenest-light": "CodeNest Light",
  obsidian: "Obsidian",
  "night-owl": "Night Owl",
  dracula: "Dracula",
  "github-dark": "GitHub Dark",
  "github-light": "GitHub Light",
  monochrome: "Monochrome",
};
