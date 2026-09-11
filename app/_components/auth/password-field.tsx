"use client";

import { useState } from "react";

import {
  EyeIcon,
  EyeSlashIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Form } from "@components";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  labelRequired?: boolean;
  className?: string;
  leftSlot?: React.ReactNode;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = ({
  id,
  label,
  placeholder,
  autoComplete,
  autoFocus,
  labelRequired,
  className,
  leftSlot,
  value,
  onChange,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <Form.InputField
      id={id}
      label={label}
      labelRequired={labelRequired}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      className={className}
      leftSlot={leftSlot}
      rightSlot={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((prev) => !prev)}
          className="inline-flex items-center text-muted transition-colors hover:text-foreground cursor-pointer"
        >
          {visible ? <EyeSlashIcon className="size-4.5" /> : <EyeIcon className="size-4.5" />}
        </button>
      }
    />
  );
};

export default PasswordField;