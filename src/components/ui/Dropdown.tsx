import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  divider?: boolean;
}

export function Dropdown({ trigger, items, align = "right", className }: {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <div onClick={() => setOpen((p) => !p)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute top-full z-50 mt-1 min-w-[160px] rounded-xl border border-[#2e2e2e] bg-[#111111] py-1 shadow-2xl animate-scale-in",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="my-1 h-px bg-[#2e2e2e]" />}
              <button
                onClick={() => { item.onClick(); setOpen(false); }}
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors disabled:opacity-40",
                  item.variant === "danger"
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-[#a3a3a3] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
                )}
              >
                {item.icon && <span className="opacity-70">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
