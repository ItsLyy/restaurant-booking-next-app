import Link from "next/link";

import type { LinkProps } from "next/link";

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  as?: "button" | "link";
}

interface AsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button";
  type?: "button" | "submit" | "reset";
}
interface AsLinkProps extends LinkProps {
  as?: "link";
}

type ButtonProps = BaseButtonProps & (AsButtonProps | AsLinkProps);

export const Button = ({
  children,
  className = "",
  variant = "default",
  as = "button",
  ...props
}: ButtonProps) => {
  const baseClassName =
    "px-6 h-11 flex justify-center items-center cursor-pointer text-c-button rounded-md focus:outline-0 disabled:cursor-not-allowed disabled:opacity-60";
  let variantClassName = "";
  switch (variant) {
    case "outline":
      variantClassName =
        "bg-transparent border-2 border-accent-100 text-accent-100";
      break;
    default:
      variantClassName = "bg-accent-100 text-base-100";
  }

  if (as === "link")
    return (
      <Link
        {...(props as LinkProps)}
        className={`${baseClassName} ${variantClassName} ${className}`}
      >
        {children}
      </Link>
    );

  return (
    <button
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      className={`${baseClassName} ${variantClassName} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
