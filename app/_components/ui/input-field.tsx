import type { ReactNode } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  classNameContainer?: string;
  label?: string;
  labelRequired?: boolean;
  labelClassName?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export const InputField = ({
  id,
  className = "",
  classNameContainer = "",
  label,
  labelRequired,
  labelClassName,
  leftSlot,
  rightSlot,
  ...props
}: InputFieldProps) => {
  let inputClassName =
    "px-4 h-10 w-full border border-muted bg-base-200 text-foreground placeholder:text-muted/60 rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300 autofill:shadow-[inset_0_0_0px_1000px] autofill:shadow-base-100";
  if (leftSlot) inputClassName += " pl-9";
  if (rightSlot) inputClassName += " pr-9";
  inputClassName += ` ${className}`;

  return (
    <div className={`flex flex-col gap-1 ${classNameContainer}`}>
      {label && (
        <label
          htmlFor={id}
          className={`${labelClassName} text-c-caption font-medium`}
        >
          {label}
          {labelRequired && <span className="text-negative">*</span>}
        </label>
      )}
      <div className={leftSlot || rightSlot ? "relative w-full" : ""}>
        {leftSlot && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            {leftSlot}
          </span>
        )}
        <input id={id} className={inputClassName} {...props} />
        {rightSlot && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;