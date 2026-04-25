import Link from "next/link";
import { Code2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-primary">
            <Code2 className="h-5 w-5 text-canvas" />
          </div>
          <span className="text-xl font-bold tracking-tight text-ink-primary">CodeNest</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-surface-border bg-canvas-secondary p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-ink-primary">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-ink-tertiary">{subtitle}</p>}
          </div>
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-ink-disabled">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-ink-tertiary hover:text-ink-secondary">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-ink-tertiary hover:text-ink-secondary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
