"use client";

import Link from "next/link";

import { GoogleLogoIcon, LockSimpleIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";

import { Button, Form } from "@components";
import PasswordField from "@components/auth/password-field";

import { SigninAction } from "../_actions/signin";

const SigninForm = () => {
  return (
    <Form action={SigninAction} className="space-y-12">
      <div className="space-y-3">
        <Form.InputField
          id="username"
          label="Username"
          placeholder="Enter your username"
          autoComplete="username"
          spellCheck={false}
          autoFocus
          leftSlot={<UserIcon className="size-4" />}
        />
        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          leftSlot={<LockSimpleIcon className="size-4" />}
        />
      </div>
      <div className="space-y-2">
        <Form.SubmitButton className="w-full">Sign in</Form.SubmitButton>
        <span className="text-c-button">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent-100 hover:underline">
            Sign up here
          </Link>
        </span>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border/50" />
          <span className="text-c-body text-xs">or</span>
          <span className="h-px flex-1 bg-border/50" />
        </div>
        <Button
          as="link"
          href="/api/auth/google"
          variant="outline"
          className="w-full"
          rel="nofollow"
        >
          <GoogleLogoIcon className="mr-2 size-4" />
          Continue with Google
        </Button>
      </div>
    </Form>
  );
};

export default SigninForm;