"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContext {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsCtx = createContext<TabsContext>({ activeTab: "", setActiveTab: () => {} });

interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ defaultTab, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsCtx.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
  variant?: "underline" | "pill";
}

export function TabList({ children, className, variant = "underline" }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex",
        variant === "underline"
          ? "gap-0 border-b border-surface-border"
          : "gap-1 rounded-lg bg-surface p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  count?: number;
  variant?: "underline" | "pill";
}

export function Tab({ value, children, className, count, variant = "underline" }: TabProps) {
  const { activeTab, setActiveTab } = useContext(TabsCtx);
  const isActive = activeTab === value;

  if (variant === "pill") {
    return (
      <button
        role="tab"
        aria-selected={isActive}
        onClick={() => setActiveTab(value)}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
          isActive
            ? "bg-canvas-secondary text-ink-primary shadow-surface-sm"
            : "text-ink-tertiary hover:text-ink-secondary",
          className
        )}
      >
        {children}
        {count !== undefined && (
          <span className={cn("text-xs", isActive ? "text-ink-tertiary" : "text-ink-disabled")}>
            {count}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
        isActive ? "text-ink-primary" : "text-ink-tertiary hover:text-ink-secondary",
        className
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("text-xs", isActive ? "text-ink-tertiary" : "text-ink-disabled")}>
          {count}
        </span>
      )}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-ink-primary" />
      )}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useContext(TabsCtx);
  if (activeTab !== value) return null;
  return (
    <div role="tabpanel" className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}
