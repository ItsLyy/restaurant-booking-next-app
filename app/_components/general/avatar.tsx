import { UserIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

import { SafeImage } from "./safe-image";

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fallbackIcon?: ReactNode;
}

export const Avatar = ({
  src,
  alt,
  className,
  sizes = "44px",
  fallbackIcon,
}: AvatarProps) => {
  return (
    <div
      className={`relative rounded-lg bg-base-200 size-11 overflow-hidden ${className}`}
    >
      <SafeImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="text-transparent object-cover object-center"
        fallbackIcon={
          fallbackIcon ?? <UserIcon className="size-5 text-muted/60" />
        }
      />
    </div>
  );
};