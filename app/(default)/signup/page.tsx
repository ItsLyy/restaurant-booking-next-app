import SignupForm from "./_components/signup-form";

export default function SignupPage() {
  return (
    <section className="flex h-svh w-full justify-center items-center">
      <div className="w-full max-w-125 h-fit p-6 bg-base-200 border border-muted rounded-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-c-header-lg text-foreground">Sign Up</h1>
          <span className="text-c-body">Please insert credentials</span>
        </header>
        <SignupForm />
      </div>
    </section>
  );
}
