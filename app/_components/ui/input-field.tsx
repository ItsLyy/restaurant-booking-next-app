interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  label?: string;
  labelRequired?: boolean;
  labelClassName?: string;
}

export const InputField = ({
  id,
  className,
  label,
  labelRequired,
  labelClassName,
  ...props
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className={`${labelClassName} text-c-caption font-medium`}
        >
          {label}
          {labelRequired && <span className="required">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`${className} px-4 h-10 border border-muted bg-base-200 text-foreground placeholder:text-muted/60 rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 easy-in-out transition-all duration-300 autofill:shadow-[inset_0_0_0px_1000px] autofill:shadow-base-100`}
        {...props}
      />
    </div>
  );
};

export default InputField;
