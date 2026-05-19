"use client";

import { createContext, use, useActionState } from "react";

import { Button } from "../ui/button";
import { InputField } from "../ui/input-field";
import { TextArea } from "../ui/text-area";

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
  return (
    <FormContext.Provider value={{ state, loading }}>
      <form action={formAction} {...props}>
        {children}
      </form>
    </FormContext.Provider>
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
  className = "",
  label,
  labelClassName = "",
  labelRequired,
  error,
  ...props
}: FormInputFieldProps) => {
  return (
    <InputField
      id={id}
      name={id}
      className={`${className}`}
      labelClassName={`${error && ""} ${labelClassName}`}
      label={label}
      labelRequired={labelRequired}
      {...props}
    />
  );
};

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  className?: string;
}

const FormTextArea = ({ id, className = "", ...props }: FormTextAreaProps) => {
  return <TextArea id={id} name={id} className={`${className}`} {...props} />;
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
  return (
    <Button type="submit" className={className} variant={variant} as="button">
      {children}
    </Button>
  );
};

Form.InputField = FormInputField;
Form.TextArea = FormTextArea;
Form.SubmitButton = FormSubmitButton;

export default Form;
