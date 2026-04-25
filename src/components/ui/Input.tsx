import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftAddon, rightAddon, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-surface px-3 py-2 transition-colors focus-within:border-ink-tertiary",
          error ? "border-semantic-error" : "border-surface-border",
        )}
      >
        {leftAddon && <span className="shrink-0 text-ink-tertiary">{leftAddon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none disabled:opacity-50",
            className
          )}
          {...props}
        />
        {rightAddon && <span className="shrink-0 text-ink-tertiary">{rightAddon}</span>}
      </div>
      {error && <p className="text-xs text-semantic-error">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-tertiary">{hint}</p>}
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
        <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary transition-colors focus:border-ink-tertiary focus:outline-none resize-none disabled:opacity-50",
          error ? "border-semantic-error" : "border-surface-border",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-semantic-error">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-tertiary">{hint}</p>}
    </div>
  );
});
