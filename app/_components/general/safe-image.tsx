"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";
import { ImageIcon } from "@phosphor-icons/react/dist/ssr";

type SafeImageProps = ImageProps & {
  fallbackIcon?: ReactNode;
};

const INVALID_SOURCES = new Set(["", "/", "null", "undefined"]);

const isInvalidSrc = (src: ImageProps["src"]): boolean =>
  typeof src === "string" && INVALID_SOURCES.has(src.trim());

export const SafeImage = ({
  src,
  alt,
  fill,
  width,
  height,
  className,
  fallbackIcon,
  onError,
  ...rest
}: SafeImageProps) => {
  const [failed, setFailed] = useState(() => isInvalidSrc(src));

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setFailed(true);
    onError?.(event);
  };

  if (failed) {
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" ? alt : undefined}
        className={`flex items-center justify-center bg-base-200 text-muted/60 ${
          fill ? "absolute inset-0" : ""
        }`}
        style={!fill ? { width, height } : undefined}
      >
        {fallbackIcon ?? <ImageIcon className="size-1/3" />}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
};