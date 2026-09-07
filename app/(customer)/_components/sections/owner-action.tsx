import Image from "next/image";
import Link from "next/link";

import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";

import banner from "@assets/images/owner-banner.jpg";

export const OwnerActionSection = () => {
  return (
    <section className="relative text-base-100 bg-base-200 rounded-lg w-full overflow-hidden">
      <Image
        src={banner}
        alt=""
        className="object-cover"
        fill
        sizes="100vw"
      />
      <div className="relative top-0 left-0 right-0 bottom-0 flex flex-col gap-6 size-full p-6 bg-linear-90 from-53% from-black/60 to-black/20">
        <h2 className="text-c-header-md">Are you a restaurant owner?</h2>
        <div className="space-y-1">
          <p>Register your restaurant</p>
          <p className="opacity-80">
            Tell us more about you and we will approve you as soon as possible
          </p>
        </div>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 w-fit text-c-button hover:underline underline-offset-4"
        >
          Create your owner account
          <ArrowSquareOutIcon size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
