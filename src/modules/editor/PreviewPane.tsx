"use client";

import { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface PreviewPaneProps {
  html: string;
  css: string;
  js: string;
  autoRefresh?: boolean;
}

export function PreviewPane({ html, css, js, autoRefresh = true }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const buildDocument = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch(e) {
      console.error('[Preview Error]', e.message);
    }
  <\/script>
</body>
</html>`;

  const refresh = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(buildDocument());
    doc.close();
  };

  useEffect(() => {
    if (autoRefresh) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, css, js]);

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-surface-border bg-canvas-secondary px-3 py-1.5">
        <span className="text-xs text-ink-tertiary font-medium">Preview</span>
        <button
          onClick={refresh}
          className="flex h-6 w-6 items-center justify-center rounded text-ink-tertiary transition-colors hover:bg-surface hover:text-ink-primary"
          title="Refresh preview"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>

      {/* iframe sandbox */}
      <iframe
        ref={iframeRef}
        title="Live preview"
        sandbox="allow-scripts allow-same-origin"
        className="flex-1 w-full border-none"
      />
    </div>
  );
}
