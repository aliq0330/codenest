"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { RightPanel } from "./RightPanel";

interface AppShellProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
}

export function AppShell({ children, showRightPanel = true }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Left Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((p) => !p)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Center feed */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 py-4">{children}</div>
          </main>

          {/* Right panel */}
          {showRightPanel && (
            <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-surface-border xl:block">
              <RightPanel />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
