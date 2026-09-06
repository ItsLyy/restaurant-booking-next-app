import SigninForm from "./_components/signin-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SigninPage() {
  return (
    <section className="flex min-h-svh w-full justify-center items-center px-4 py-8">
      <div className="w-full max-w-125 h-fit p-5 sm:p-6 bg-base-200 border border-muted rounded-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-c-header-lg text-foreground">Sign In</h1>
          <span className="text-c-body">Please insert credentials</span>
        </header>
        <SigninForm />
      </div>
    </section>
  );
}
