import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, left, right, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#a3a3a3]">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-[#1a1a1a] px-3 py-2 transition-colors",
          "focus-within:border-[#6b6b6b]",
          error ? "border-red-500" : "border-[#2e2e2e]"
        )}
      >
        {left && <span className="shrink-0 text-[#6b6b6b]">{left}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex-1 bg-transparent text-sm text-[#f5f5f5] placeholder:text-[#3d3d3d] focus:outline-none disabled:opacity-50",
            className
          )}
          {...props}
        />
        {right && <span className="shrink-0 text-[#6b6b6b]">{right}</span>}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[#6b6b6b]">{hint}</p>}
    </div>
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#a3a3a3]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-lg border bg-[#1a1a1a] px-3 py-2 text-sm text-[#f5f5f5] placeholder:text-[#3d3d3d]",
          "transition-colors focus:border-[#6b6b6b] focus:outline-none resize-none disabled:opacity-50",
          error ? "border-red-500" : "border-[#2e2e2e]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[#6b6b6b]">{hint}</p>}
    </div>
  );
});
