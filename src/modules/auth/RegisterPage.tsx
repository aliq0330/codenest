import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export function RegisterPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !username || !email || !password) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.signUp(email, password, username, displayName);
      toast.success("Account created! Check your email to confirm.");
      navigate("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    try {
      await authService.signInWithGitHub();
    } catch {
      toast.error("GitHub sign-in failed");
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-[#f5f5f5]">Create your account</h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">Join CodeNest and share your code</p>
      </div>

      <button
        onClick={handleGitHub}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] py-2.5 text-sm font-medium text-[#f5f5f5] transition-all hover:bg-[#242424] hover:border-[#6b6b6b]"
      >
        <GitHubIcon className="h-4 w-4" />
        Continue with GitHub
      </button>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#2e2e2e]" />
        <span className="text-xs text-[#3d3d3d]">or</span>
        <div className="h-px flex-1 bg-[#2e2e2e]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="Display Name"
          type="text"
          placeholder="Your Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete="name"
          required
        />
        <Input
          label="Username"
          type="text"
          placeholder="yourhandle"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          autoComplete="username"
          left={<span className="text-xs text-[#6b6b6b]">@</span>}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          hint="At least 8 characters"
          required
          right={
            <button type="button" onClick={() => setShowPw((p) => !p)} className="text-[#6b6b6b] hover:text-[#a3a3a3]">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-1">
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-[#6b6b6b]">
        By signing up you agree to our{" "}
        <span className="text-[#a3a3a3] cursor-pointer hover:underline">Terms</span> and{" "}
        <span className="text-[#a3a3a3] cursor-pointer hover:underline">Privacy Policy</span>.
      </p>

      <p className="mt-4 text-center text-sm text-[#6b6b6b]">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-[#f5f5f5] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
