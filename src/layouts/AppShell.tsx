import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { RightPanel } from "./RightPanel";

interface AppShellProps {
  rightPanel?: boolean;
  fullWidth?: boolean;
}

export function AppShell({ rightPanel = true, fullWidth = false }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar: fixed overlay drawer, outside layout flow */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className={fullWidth ? "h-full" : "mx-auto max-w-2xl"}>
              <Outlet />
            </div>
          </main>
          {rightPanel && (
            <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-[#2e2e2e] xl:block">
              <RightPanel />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
