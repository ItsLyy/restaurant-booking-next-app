export const RestaurantItemSkeleton = () => {
  return (
    <div className="flex gap-6 w-full animate-pulse">
      <div className="relative w-71.75 h-48 shrink-0 rounded-2xl bg-base-200" />
      <div className="flex justify-between p-2 grow">
        <div className="flex flex-col gap-4">
          <div className="text-c-body flex flex-col gap-2 text-muted w-76">
            <div className="text-c-header-md text-foreground line-clamp-2 text-ellipsis h-4 w-35 bg-base-200 rounded-full" />
            <div className="leading-tight py-0 line-clamp-2 text-ellipsis bg-base-200 h-4 w-75 rounded-full" />
            <div className="leading-tight line-clamp-2 text-ellipsis bg-base-200 h-4 w-60 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="text-c-body font-medium h-4 w-12.5 bg-base-200 rounded-full" />
          <div className="text-c-body text-foreground h-4 w-35 bg-base-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};
