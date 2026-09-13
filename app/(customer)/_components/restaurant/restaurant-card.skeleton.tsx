export const RestaurantCardSkeleton = () => {
  return (
    <div className="group cursor-pointer">
      <div className="relative w-full aspect-[3/2] bg-base-200 overflow-hidden rounded-2xl" />
      <div className="px-1 py-2.5 space-y-1">
        <span className="text-c-normal text-foreground inline-block py-2 px-4 bg-base-200 rounded-full" />
        <div className="flex justify-between items-end">
          <div className="items-center gap-2 text-c-ref inline-block py-2 px-4 bg-base-200 rounded-full" />
          <span className="text-[13px] font-medium text-foreground inline-block py-2 px-4 bg-base-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};
