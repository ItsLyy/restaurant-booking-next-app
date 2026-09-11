"use client";

import Link from "next/link";

import { LockSimpleIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";

import { Form } from "@components";
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
    </Form>
  );
};

export default SigninForm;