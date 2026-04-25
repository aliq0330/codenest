import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  online?: boolean;
}

const sizeMap: Record<AvatarSize, { container: string; indicator: string }> = {
  xs: { container: "h-5 w-5 text-[10px]", indicator: "h-1.5 w-1.5" },
  sm: { container: "h-7 w-7 text-xs", indicator: "h-2 w-2" },
  md: { container: "h-9 w-9 text-sm", indicator: "h-2.5 w-2.5" },
  lg: { container: "h-11 w-11 text-base", indicator: "h-3 w-3" },
  xl: { container: "h-16 w-16 text-lg", indicator: "h-3.5 w-3.5" },
  "2xl": { container: "h-24 w-24 text-2xl", indicator: "h-4 w-4" },
};

export function Avatar({ src, alt = "Avatar", size = "md", className, online }: AvatarProps) {
  const { container, indicator } = sizeMap[size];

  return (
    <div className={cn("relative shrink-0", container, className)}>
      <div className="h-full w-full overflow-hidden rounded-full bg-surface-hover ring-1 ring-surface-border">
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface font-semibold uppercase text-ink-tertiary">
            {alt.charAt(0)}
          </div>
        )}
      </div>

      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-canvas",
            indicator,
            online ? "bg-semantic-success" : "bg-ink-disabled"
          )}
        />
      )}
    </div>
  );
}
