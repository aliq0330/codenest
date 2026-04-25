import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface text-ink-secondary border border-surface-border",
  success: "bg-semantic-success/10 text-semantic-success border border-semantic-success/20",
  warning: "bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/20",
  error: "bg-semantic-error/10 text-semantic-error border border-semantic-error/20",
  info: "bg-semantic-info/10 text-semantic-info border border-semantic-info/20",
  outline: "text-ink-secondary border border-surface-border",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface TagPillProps {
  label: string;
  href?: string;
  onRemove?: () => void;
  className?: string;
}

export function TagPill({ label, href, onRemove, className }: TagPillProps) {
  const base = cn(
    "inline-flex items-center gap-1 rounded-full border border-surface-border bg-surface px-2.5 py-0.5 text-xs font-medium text-ink-secondary transition-colors hover:border-ink-tertiary hover:text-ink-primary",
    className
  );

  const content = (
    <>
      <span className="text-ink-tertiary">#</span>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-ink-disabled hover:text-ink-tertiary"
          type="button"
        >
          ×
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={base}>
        {content}
      </a>
    );
  }

  return <span className={base}>{content}</span>;
}
