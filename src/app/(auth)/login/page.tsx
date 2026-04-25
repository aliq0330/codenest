import type { Metadata } from "next";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginForm } from "@/modules/auth/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function Login() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your CodeNest account">
      <LoginForm />
    </AuthLayout>
  );
}
