import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface Ctx { active: string; set: (v: string) => void; }
const TabsCtx = createContext<Ctx>({ active: "", set: () => {} });

export function Tabs({ defaultTab, children, className, onChange }: {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (tab: string) => void;
}) {
  const [active, setActive] = useState(defaultTab);
  const set = (v: string) => { setActive(v); onChange?.(v); };
  return (
    <TabsCtx.Provider value={{ active, set }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="tablist" className={cn("flex border-b border-[#2e2e2e]", className)}>
      {children}
    </div>
  );
}

export function Tab({ value, children, count, className }: {
  value: string;
  children: React.ReactNode;
  count?: number;
  className?: string;
}) {
  const { active, set } = useContext(TabsCtx);
  const isActive = active === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => set(value)}
      className={cn(
        "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
        isActive ? "text-[#f5f5f5]" : "text-[#6b6b6b] hover:text-[#a3a3a3]",
        className
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("text-xs", isActive ? "text-[#6b6b6b]" : "text-[#3d3d3d]")}>{count}</span>
      )}
      {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-[#f5f5f5]" />}
    </button>
  );
}

export function TabPanel({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { active } = useContext(TabsCtx);
  if (active !== value) return null;
  return <div role="tabpanel" className={cn("animate-fade-in", className)}>{children}</div>;
}
