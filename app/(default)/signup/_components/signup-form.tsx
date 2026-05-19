"use client";

import { Form } from "@components";
import { SignupAction } from "../_actions/signup";
import Link from "next/link";

const SignupForm = () => {
  return (
    <Form action={SignupAction} className="space-y-12">
      <div className="space-y-3">
        <Form.InputField
          id="username"
          label="Username"
          placeholder="Username"
        />
        <Form.InputField id="email" label="Email" placeholder="Email" />
        <Form.InputField
          id="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
        <Form.InputField
          id="password-confirmation"
          label="Password Confirmation"
          placeholder="Password Confirmation"
          type="password"
        />
      </div>
      <div className="space-y-2">
        <Form.SubmitButton className="w-full">Signup</Form.SubmitButton>
        <span className="text-c-button">
          Already have an account?{" "}
          <Link href="/signin" className="text-accent-100">
            Signin here
          </Link>
        </span>
      </div>
    </Form>
  );
};

export default SignupForm;
