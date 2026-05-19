"use client";

import Link from "next/link";

import { Form } from "@components";

import { SigninAction } from "../_actions/signin";

const SigninForm = () => {
  return (
    <Form action={SigninAction} className="space-y-12">
      <div className="space-y-3">
        <Form.InputField
          id="username"
          label="Username"
          placeholder="Username"
        />
        <Form.InputField
          id="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
      </div>
      <div className="space-y-2">
        <Form.SubmitButton className="w-full">Signin</Form.SubmitButton>
        <span className="text-c-button">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-accent-100">
            Signup here
          </Link>
        </span>
      </div>
    </Form>
  );
};

export default SigninForm;
