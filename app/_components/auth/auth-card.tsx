import { Logo } from "../general/logo";

import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  step?: number;
}

const BASE_STEPS = ["Register", "Verify", "Role"];

const AuthSteps = ({ current }: { current: number }) => {
  const steps =
    current > BASE_STEPS.length ? [...BASE_STEPS, "Restaurant"] : BASE_STEPS;
  return (
    <ol className="flex items-center gap-3">
      {steps.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex-1 flex flex-col gap-1 min-w-0">
            <span
              className={`h-1 rounded-full transition-colors ${
                done
                  ? "bg-accent-100"
                  : active
                    ? "bg-accent-200"
                    : "bg-muted/40"
              }`}
            />
            <span
              className={`text-c-caption font-medium transition-colors ${
                active
                  ? "text-foreground"
                  : done
                    ? "text-accent-200"
                    : "text-muted"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const AuthCard = ({ title, subtitle, children, step }: AuthCardProps) => {
  return (
    <section className="flex min-h-svh w-full justify-center items-center px-4 py-8">
      <div className="w-full max-w-125 h-fit flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Logo className="size-11! rounded-lg overflow-hidden" />
          <span className="text-c-header-md text-foreground">
            RES.<span className="text-accent-100">BOOK</span>
          </span>
        </div>
        <div className="w-full p-5 sm:p-6 bg-base-200 border border-muted rounded-2xl space-y-6">
          <header className="space-y-2">
            <h1 className="text-c-header-lg text-foreground">{title}</h1>
            <span className="text-c-body text-muted">{subtitle}</span>
          </header>
          {step ? <AuthSteps current={step} /> : null}
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthCard;