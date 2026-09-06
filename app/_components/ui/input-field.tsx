interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  classNameContainer?: string;
  label?: string;
  labelRequired?: boolean;
  labelClassName?: string;
}

export const InputField = ({
  id,
  className = "",
  classNameContainer = "",
  label,
  labelRequired,
  labelClassName,
  ...props
}: InputFieldProps) => {
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
      <input
        id={id}
        className={[
          "px-4 h-10 border border-muted bg-base-200 text-foreground placeholder:text-muted/60 rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300 autofill:shadow-[inset_0_0_0px_1000px] autofill:shadow-base-100",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
};

export default InputField;
