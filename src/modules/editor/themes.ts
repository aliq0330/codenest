import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";

function theme(spec: {
  bg: string; bgAlt: string; fg: string; gutterFg: string;
  cursor: string; selection: string; lineHL: string; border: string;
}, dark = true): Extension {
  return EditorView.theme({
    "&": { backgroundColor: spec.bg, color: spec.fg },
    ".cm-content": { caretColor: spec.cursor },
    ".cm-cursor": { borderLeftColor: spec.cursor },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": { backgroundColor: spec.selection },
    ".cm-gutters": { backgroundColor: spec.bg, color: spec.gutterFg, border: "none", borderRight: `1px solid ${spec.border}` },
    ".cm-lineNumbers .cm-gutterElement": { minWidth: "40px", padding: "0 8px" },
    ".cm-activeLine": { backgroundColor: spec.lineHL },
    ".cm-activeLineGutter": { backgroundColor: spec.lineHL },
    ".cm-panels": { backgroundColor: spec.bgAlt },
    ".cm-tooltip": { backgroundColor: spec.bgAlt, border: `1px solid ${spec.border}`, borderRadius: "8px" },
    ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: spec.lineHL, color: spec.fg },
  }, { dark });
}

const darkSyntax = HighlightStyle.define([
  { tag: t.keyword, color: "#c792ea", fontWeight: "600" },
  { tag: [t.name, t.deleted, t.character, t.macroName], color: "#eeffff" },
  { tag: [t.propertyName], color: "#82aaff" },
  { tag: [t.variableName, t.labelName], color: "#eeffff" },
  { tag: [t.typeName, t.className, t.number, t.annotation, t.modifier], color: "#ffcb6b" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp], color: "#89ddff" },
  { tag: [t.meta, t.comment], color: "#546e7a", fontStyle: "italic" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#f78c6c" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#c3e88d" },
  { tag: t.invalid, color: "#ef4444" },
]);

const lightSyntax = HighlightStyle.define([
  { tag: t.keyword, color: "#7c3aed", fontWeight: "600" },
  { tag: [t.propertyName], color: "#1d4ed8" },
  { tag: [t.typeName, t.className, t.number, t.annotation], color: "#92400e" },
  { tag: [t.operator, t.operatorKeyword], color: "#0369a1" },
  { tag: [t.meta, t.comment], color: "#6b7280", fontStyle: "italic" },
  { tag: [t.atom, t.bool, t.number], color: "#b45309" },
  { tag: [t.string, t.inserted], color: "#166534" },
  { tag: t.invalid, color: "#ef4444" },
]);

const monochromeSyntax = HighlightStyle.define([
  { tag: t.keyword, color: "#ffffff", fontWeight: "700" },
  { tag: [t.name, t.variableName], color: "#e5e5e5" },
  { tag: [t.propertyName], color: "#d4d4d4" },
  { tag: [t.typeName, t.className], color: "#a3a3a3" },
  { tag: [t.meta, t.comment], color: "#525252", fontStyle: "italic" },
  { tag: [t.string, t.inserted], color: "#a3a3a3" },
  { tag: t.invalid, color: "#ef4444" },
]);

export const EDITOR_THEMES = {
  "codenest-dark": [
    theme({ bg: "#0a0a0a", bgAlt: "#111111", fg: "#f5f5f5", gutterFg: "#3d3d3d", cursor: "#fff", selection: "rgba(255,255,255,0.07)", lineHL: "rgba(255,255,255,0.03)", border: "#2e2e2e" }),
    syntaxHighlighting(darkSyntax),
  ],
  "codenest-light": [
    theme({ bg: "#ffffff", bgAlt: "#f9fafb", fg: "#111827", gutterFg: "#9ca3af", cursor: "#111827", selection: "rgba(0,0,0,0.06)", lineHL: "rgba(0,0,0,0.03)", border: "#e5e7eb" }, false),
    syntaxHighlighting(lightSyntax),
  ],
  "obsidian": [
    theme({ bg: "#1e1e1e", bgAlt: "#252526", fg: "#d4d4d4", gutterFg: "#4d4d4d", cursor: "#aeafad", selection: "rgba(255,255,255,0.1)", lineHL: "rgba(255,255,255,0.04)", border: "#3d3d3d" }),
    syntaxHighlighting(darkSyntax),
  ],
  "night-owl": [
    theme({ bg: "#011627", bgAlt: "#01111d", fg: "#d6deeb", gutterFg: "#4b6479", cursor: "#80a4c2", selection: "rgba(128,164,194,0.15)", lineHL: "rgba(255,255,255,0.03)", border: "#1b2b3a" }),
    syntaxHighlighting(darkSyntax),
  ],
  "dracula": [
    theme({ bg: "#282a36", bgAlt: "#21222c", fg: "#f8f8f2", gutterFg: "#6272a4", cursor: "#f8f8f2", selection: "rgba(68,71,90,0.8)", lineHL: "rgba(68,71,90,0.4)", border: "#44475a" }),
    syntaxHighlighting(darkSyntax),
  ],
  "github-dark": [
    theme({ bg: "#0d1117", bgAlt: "#161b22", fg: "#c9d1d9", gutterFg: "#3d444d", cursor: "#c9d1d9", selection: "rgba(56,139,253,0.15)", lineHL: "rgba(255,255,255,0.03)", border: "#21262d" }),
    syntaxHighlighting(darkSyntax),
  ],
  "github-light": [
    theme({ bg: "#ffffff", bgAlt: "#f6f8fa", fg: "#24292f", gutterFg: "#8c959f", cursor: "#24292f", selection: "rgba(84,174,255,0.15)", lineHL: "rgba(0,0,0,0.03)", border: "#d0d7de" }, false),
    syntaxHighlighting(lightSyntax),
  ],
  "monochrome": [
    theme({ bg: "#000000", bgAlt: "#0a0a0a", fg: "#e5e5e5", gutterFg: "#404040", cursor: "#ffffff", selection: "rgba(255,255,255,0.1)", lineHL: "rgba(255,255,255,0.02)", border: "#1a1a1a" }),
    syntaxHighlighting(monochromeSyntax),
  ],
} as const;

export type EditorThemeName = keyof typeof EDITOR_THEMES;

export const THEME_LABELS: Record<EditorThemeName, string> = {
  "codenest-dark": "CodeNest Dark",
  "codenest-light": "CodeNest Light",
  "obsidian": "Obsidian",
  "night-owl": "Night Owl",
  "dracula": "Dracula",
  "github-dark": "GitHub Dark",
  "github-light": "GitHub Light",
  "monochrome": "Monochrome",
};

export const THEME_PREVIEWS: Record<EditorThemeName, { bg: string; fg: string }> = {
  "codenest-dark":  { bg: "#0a0a0a", fg: "#f5f5f5" },
  "codenest-light": { bg: "#ffffff", fg: "#111827" },
  "obsidian":       { bg: "#1e1e1e", fg: "#d4d4d4" },
  "night-owl":      { bg: "#011627", fg: "#d6deeb" },
  "dracula":        { bg: "#282a36", fg: "#f8f8f2" },
  "github-dark":    { bg: "#0d1117", fg: "#c9d1d9" },
  "github-light":   { bg: "#ffffff", fg: "#24292f" },
  "monochrome":     { bg: "#000000", fg: "#e5e5e5" },
};
