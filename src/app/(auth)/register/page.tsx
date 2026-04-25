import type { Metadata } from "next";
import { AuthLayout } from "@/layouts/AuthLayout";
import { RegisterForm } from "@/modules/auth/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function Register() {
  return (
    <AuthLayout title="Join CodeNest" subtitle="Create your developer account">
      <RegisterForm />
    </AuthLayout>
  );
}
