import Image from "next/image";

import logo from "@assets/logo.jpg";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`${className} relative aspect-square size-8`}>
      <Image src={logo} alt="Logo" className="absolute inset-0 size-full" />
    </div>
  );
};

export default Logo;
