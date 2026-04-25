import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor, lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap, codeFolding } from "@codemirror/language";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { lintKeymap } from "@codemirror/lint";

// Core editor extensions — always applied
export const coreExtensions: Extension = [
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  rectangularSelection(),
  crosshairCursor(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
    indentWithTab,
  ]),
];

// Optional extensions based on editor settings
export function lineNumbersExtension(): Extension {
  return [lineNumbers(), highlightActiveLineGutter()];
}

export function activeLineExtension(): Extension {
  return highlightActiveLine();
}

export function autoCompleteExtension(): Extension {
  return autocompletion({
    activateOnTyping: true,
    maxRenderedOptions: 10,
  });
}

export function codeFoldingExtension(): Extension {
  return [codeFolding(), foldGutter()];
}

export function wordWrapExtension(): Extension {
  return EditorView.lineWrapping as unknown as Extension;
}
// Re-export for convenience
export { EditorView } from "@codemirror/view";
