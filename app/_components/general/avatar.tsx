import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
}

export const Avatar = ({ src, alt, className }: AvatarProps) => {
  return (
    <div
      className={`relative rounded-lg bg-base-200 size-11 overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="44px"
        className={`text-transparent object-cover object-center`}
      />
    </div>
  );
};
