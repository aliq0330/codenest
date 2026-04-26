import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "error" | "info";

const variants: Record<Variant, string> = {
  default: "bg-[#1a1a1a] text-[#a3a3a3] border border-[#2e2e2e]",
  success: "bg-green-500/10 text-green-400 border border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  error:   "bg-red-500/10 text-red-400 border border-red-500/20",
  info:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

export function Badge({ variant = "default", children, className }: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}

export function TagPill({ label, href, onRemove, className }: {
  label: string;
  href?: string;
  onRemove?: () => void;
  className?: string;
}) {
  const base = cn(
    "inline-flex items-center gap-1 rounded-full border border-[#2e2e2e] bg-[#1a1a1a]",
    "px-2.5 py-0.5 text-xs font-medium text-[#a3a3a3]",
    "transition-colors hover:border-[#6b6b6b] hover:text-[#f5f5f5]",
    className
  );
  const inner = (
    <>
      <span className="text-[#6b6b6b]">#</span>
      {label}
      {onRemove && (
        <button onClick={onRemove} type="button" className="ml-0.5 text-[#3d3d3d] hover:text-[#a3a3a3]">×</button>
      )}
    </>
  );
  return href
    ? <a href={href} className={base}>{inner}</a>
    : <span className={base}>{inner}</span>;
}
