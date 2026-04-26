import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizes: Record<Size, string> = {
  "xs":  "h-5 w-5 text-[9px]",
  "sm":  "h-7 w-7 text-xs",
  "md":  "h-9 w-9 text-sm",
  "lg":  "h-11 w-11 text-base",
  "xl":  "h-16 w-16 text-lg",
  "2xl": "h-24 w-24 text-2xl",
};

const dotSizes: Record<Size, string> = {
  "xs": "h-1.5 w-1.5 border",
  "sm": "h-2 w-2 border",
  "md": "h-2.5 w-2.5 border-2",
  "lg": "h-3 w-3 border-2",
  "xl": "h-3.5 w-3.5 border-2",
  "2xl":"h-4 w-4 border-2",
};

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: Size;
  online?: boolean;
  className?: string;
}

export function Avatar({ src, alt = "User", size = "md", online, className }: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", sizes[size], className)}>
      <div className="h-full w-full overflow-hidden rounded-full bg-[#1a1a1a] ring-1 ring-[#2e2e2e]">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-semibold uppercase text-[#6b6b6b]">
            {alt.charAt(0)}
          </div>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-[#0a0a0a]",
            dotSizes[size],
            online ? "bg-green-500" : "bg-[#3d3d3d]"
          )}
        />
      )}
    </div>
  );
}
