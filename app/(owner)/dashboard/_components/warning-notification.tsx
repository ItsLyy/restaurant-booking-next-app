import {
  ArrowBendUpRightIcon,
  WarningIcon,
} from "@phosphor-icons/react/dist/ssr";

export const WarningNotification = () => {
  return (
    <div className="w-full px-3 py-2 flex justify-between rounded-sm bg-accent-200/20 text-accent-200">
      <div className="flex gap-2 items-center">
        <WarningIcon className="size-4" />
        <span className="text-d-caption leading-tight">
          2 bookings are waiting for your confirmation
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-d-caption leading-tight">Review More</span>
        <ArrowBendUpRightIcon className="size-4" />
      </div>
    </div>
  );
};
