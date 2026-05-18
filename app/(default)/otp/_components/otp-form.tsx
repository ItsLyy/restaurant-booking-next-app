"use client";

import { useRef, useState } from "react";

import { Form } from "@components";

import { verifyOTPAction } from "../_actions/otp";

import type { InputHTMLAttributes } from "react";

const OTPForm = () => {
  const [codes, setCodes] = useState(new Array(6).fill(""));
  const inputRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;

    if (value.length > 1) {
      return;
    }

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  return (
    <Form className="space-y-12" action={verifyOTPAction}>
      <div className="grid grid-cols-6 grid-row-1 gap-3 w-full h-15">
        {codes.map((code, index) => (
          <InputCode
            key={index}
            value={code}
            ref={inputRef}
            index={index}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      <div className="space-y-2">
        <Form.SubmitButton className="w-full">Verify</Form.SubmitButton>
        <span className="text-c-button">
          Don’t receive code?{" "}
          <button type="button" className="text-accent-200">
            Resend
          </button>
        </span>
      </div>
    </Form>
  );
};

interface InputCodeProps extends InputHTMLAttributes<HTMLInputElement> {
  ref: React.RefObject<HTMLInputElement[]>;
  index: number;
}

const InputCode = ({ ref, index, ...props }: InputCodeProps) => {
  return (
    <input
      {...props}
      type="number"
      className="border-muted text-foreground bg-base-200 border rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent-200/20 ease-in-out duration-300 transition-all"
      maxLength={1}
      ref={(el: HTMLInputElement) => {
        ref.current[index] = el;
      }}
    />
  );
};

export default OTPForm;
