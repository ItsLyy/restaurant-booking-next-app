import { StarIcon } from "@phosphor-icons/react/dist/ssr";

export const Reviews = () => {
  return (
    <>
      <div className="flex items-center gap-3 px-6 py-3 border border-positive bg-positive/20 text-positive rounded-lg">
        <StarIcon size={20} weight="duotone" />
        <span className="text-c-button font-normal">
          <span className="text-[20px] font-medium">4.5 </span>/ 5.0 out of
          total 400
        </span>
      </div>
      <div className="space-y-6"></div>
    </>
  );
};
