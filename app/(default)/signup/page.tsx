import AuthCard from "@components/auth/auth-card";
import SignupForm from "./_components/signup-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for a new account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return (
    <AuthCard
      step={1}
      title="Sign Up"
      subtitle="Create your account — we'll verify your email next."
    >
      <SignupForm />
    </AuthCard>
  );
}