export const RestaurantItemSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full animate-pulse">
      <div className="relative w-full sm:w-71.75 aspect-[3/2] shrink-0 rounded-2xl bg-base-200" />
      <div className="flex justify-between p-2 grow min-w-0">
        <div className="flex flex-col gap-4 min-w-0">
          <div className="text-c-body flex flex-col gap-2 text-muted w-full sm:w-76 min-w-0">
            <div className="text-c-header-md text-foreground line-clamp-2 text-ellipsis h-4 w-35 bg-base-200 rounded-full" />
            <div className="leading-tight py-0 line-clamp-2 text-ellipsis bg-base-200 h-4 w-75 rounded-full" />
            <div className="leading-tight line-clamp-2 text-ellipsis bg-base-200 h-4 w-60 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col justify-between items-end shrink-0">
          <div className="text-c-body font-medium h-4 w-12.5 bg-base-200 rounded-full" />
          <div className="text-c-body text-foreground h-4 w-35 bg-base-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};
