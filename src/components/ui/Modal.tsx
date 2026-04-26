import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-5xl",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}

export function Modal({ open, onClose, title, description, children, size = "md", className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal
        className={cn(
          "relative z-10 w-full rounded-2xl border border-[#2e2e2e] bg-[#111111] shadow-2xl animate-scale-in",
          sizes[size],
          className
        )}
      >
        {title && (
          <div className="flex items-start justify-between border-b border-[#2e2e2e] px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#f5f5f5]">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-[#6b6b6b]">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
