import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   "bg-[#f5f5f5] text-[#0a0a0a] hover:opacity-90 active:opacity-80",
  secondary: "bg-[#1a1a1a] text-[#a3a3a3] hover:bg-[#242424] hover:text-[#f5f5f5] border border-[#2e2e2e]",
  ghost:     "text-[#a3a3a3] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]",
  danger:    "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
  outline:   "border border-[#2e2e2e] text-[#a3a3a3] hover:border-[#6b6b6b] hover:text-[#f5f5f5]",
};

const sizes: Record<Size, string> = {
  xs: "h-6 px-2 text-xs gap-1 rounded-md",
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-sm gap-2 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading, icon, iconRight, fullWidth, children, className, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6b6b6b]",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading
        ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
});
