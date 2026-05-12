import Image from "next/image";

import banner from "@assets/images/owner-banner.jpg";

const OwnerActionSection = () => {
  return (
    <section className="relative text-base-100 bg-base-200 rounded-lg w-full overflow-hidden">
      <Image
        src={banner}
        alt="Owner Action"
        className="object-cover"
        fill
        sizes="100%"
      />
      <div className="relative top-0 left-0 right-0 bottom-0 flex flex-col gap-6 size-full p-6 bg-linear-90 from-53% from-black/60 to-black/20">
        <span className="text-c-header-md">Are you a restaurant owner?</span>
        <div className="space-y-1">
          <p>Register your restaurant</p>
          <p className="opacity-80">
            Tell us more about you and we will approve you as soon as possible
          </p>
        </div>
      </div>
    </section>
  );
};

export default OwnerActionSection;
