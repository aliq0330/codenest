"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { coreExtensions, lineNumbersExtension, activeLineExtension, autoCompleteExtension, codeFoldingExtension, wordWrapExtension } from "./extensions";
import { themes, EditorThemeName } from "./themes";
import type { EditorSettings } from "@/types";

interface UseCodeMirrorOptions {
  doc: string;
  language: "javascript" | "typescript" | "html" | "css";
  settings: EditorSettings;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const languageExtensions: Record<string, () => Extension> = {
  javascript: () => javascript(),
  typescript: () => javascript({ typescript: true }),
  html: () => html(),
  css: () => css(),
};

export function useCodeMirror({
  doc,
  language,
  settings,
  onChange,
  readOnly = false,
}: UseCodeMirrorOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const buildExtensions = useCallback((): Extension[] => {
    const exts: Extension[] = [coreExtensions];

    // Language
    const langExt = languageExtensions[language] ?? languageExtensions.javascript;
    exts.push(langExt());

    // Theme
    const themeName = (settings.theme as EditorThemeName) ?? "codenest-dark";
    const themeExts = themes[themeName] ?? themes["codenest-dark"];
    exts.push(...(themeExts as Extension[]));

    // Settings-driven extensions
    if (settings.lineNumbers) exts.push(lineNumbersExtension(), activeLineExtension());
    if (settings.autoComplete) exts.push(autoCompleteExtension());
    if (settings.bracketMatching) exts.push(codeFoldingExtension());
    if (settings.wordWrap) exts.push(wordWrapExtension());
    if (readOnly) exts.push(EditorState.readOnly.of(true));

    // Font size via inline style
    exts.push(
      EditorView.theme({
        ".cm-content": { fontSize: `${settings.fontSize}px` },
        ".cm-gutters": { fontSize: `${settings.fontSize}px` },
      })
    );

    // onChange listener
    exts.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current?.(update.state.doc.toString());
        }
      })
    );

    return exts;
  }, [language, settings, readOnly]);

  // Mount editor
  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc,
      extensions: buildExtensions(),
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update extensions when settings change (without destroying editor)
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: [],
    });
    const state = EditorState.create({
      doc: viewRef.current.state.doc,
      extensions: buildExtensions(),
    });
    viewRef.current.setState(state);
  }, [settings, language, buildExtensions]);

  // Sync doc from outside when it changes programmatically
  const setDoc = useCallback((newDoc: string) => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current === newDoc) return;
    view.dispatch({
      changes: { from: 0, to: current.length, insert: newDoc },
    });
  }, []);

  const getDoc = useCallback((): string => {
    return viewRef.current?.state.doc.toString() ?? "";
  }, []);

  const focus = useCallback(() => {
    viewRef.current?.focus();
  }, []);

  return { containerRef, view: viewRef, setDoc, getDoc, focus };
}
