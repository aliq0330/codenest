import { Link, Outlet } from "react-router-dom";
import { Code2 } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f5f5]">
            <Code2 className="h-5 w-5 text-[#0a0a0a]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#f5f5f5]">CodeNest</span>
        </Link>
        <div className="rounded-2xl border border-[#2e2e2e] bg-[#111111] p-8">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-xs text-[#3d3d3d]">
          By continuing you agree to our{" "}
          <Link to="/terms" className="text-[#6b6b6b] hover:text-[#a3a3a3]">Terms</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-[#6b6b6b] hover:text-[#a3a3a3]">Privacy</Link>
        </p>
      </div>
    </div>
  );
}
