"use client";

import { createContext, use, useActionState, useMemo } from "react";

import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload";
import { InputField } from "../ui/input-field";

import type { FormAction, FormState } from "@types";

export interface FormProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "action"
> {
  action: FormAction;
  children: React.ReactNode;
}

interface FormContextProps {
  state: FormState;
  loading: boolean;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);
export const useFormContext = () => {
  const context = use(FormContext);
  if (!context) throw new Error("useFormContext must be used within a Form");
  return context;
};

const Form = ({ action, children, ...props }: FormProps) => {
  const [state, formAction, loading] = useActionState(action, {});
  const value = useMemo(() => ({ state, loading }), [state, loading]);
  return (
    <FormContext.Provider value={value}>
      <form action={formAction} {...props}>
        {children}
        <FormMessage />
      </form>
    </FormContext.Provider>
  );
};

const FormMessage = () => {
  const { state } = useFormContext();
  if (!state.message) return null;
  return (
    <p
      className={`text-c-caption font-medium ${
        state.success ? "text-positive" : "text-negative"
      }`}
    >
      {state.message}
    </p>
  );
};

interface FormInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  labelRequired?: boolean;
  error?: string;
}

const FormInputField = ({
  id,
  className,
  label,
  labelClassName,
  labelRequired,
  error,
  ...props
}: FormInputFieldProps) => {
  const { state } = useFormContext();
  const fieldError = error ?? state.errors?.[id]?.[0];
  return (
    <div className="flex flex-col gap-1">
      <InputField
        {...props}
        id={id}
        name={id}
        className={className}
        labelClassName={labelClassName}
        label={label}
        labelRequired={labelRequired}
        aria-invalid={fieldError ? true : undefined}
      />
      {fieldError && (
        <span className="text-c-caption text-negative">{fieldError}</span>
      )}
    </div>
  );
};

interface FormFileFieldProps {
  id: string;
  label?: string;
  accept?: string;
  className?: string;
}

const FormFileField = ({
  id,
  label,
  accept,
  className,
}: FormFileFieldProps) => {
  const { state } = useFormContext();
  const fieldError = state.errors?.[id]?.[0];
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      {label && (
        <label htmlFor={id} className="text-c-caption font-medium">
          {label}
        </label>
      )}
      <FileUpload id={id} accept={accept} error={Boolean(fieldError)} />
      {fieldError && (
        <span className="text-c-caption text-negative">{fieldError}</span>
      )}
    </div>
  );
};

interface FormSubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

const FormSubmitButton = ({
  children,
  className,
  variant,
}: FormSubmitButtonProps) => {
  const { loading } = useFormContext();
  return (
    <Button
      type="submit"
      className={className}
      variant={variant}
      as="button"
      disabled={loading}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
};

Form.InputField = FormInputField;
Form.FileField = FormFileField;
Form.SubmitButton = FormSubmitButton;

export default Form;
