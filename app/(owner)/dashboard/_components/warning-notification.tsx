import Link from "next/link";

import {
  ArrowBendUpRightIcon,
  WarningIcon,
} from "@phosphor-icons/react/dist/ssr";

export const WarningNotification = ({
  pendingCount,
}: {
  pendingCount: number;
}) => {
  return (
    <div className="w-full px-3 py-2 flex justify-between rounded-sm bg-accent-200/20 text-accent-200">
      <div className="flex gap-2 items-center">
        <WarningIcon className="size-4" />
        <span className="text-d-caption leading-tight">
          {pendingCount === 0
            ? "All bookings are confirmed"
            : `${pendingCount} booking${pendingCount === 1 ? "" : "s"} waiting for confirmation`}
        </span>
      </div>
      <Link
        href="/dashboard/bookings"
        className="flex items-center gap-2 hover:underline"
      >
        <span className="text-d-caption leading-tight">Review More</span>
        <ArrowBendUpRightIcon className="size-4" />
      </Link>
    </div>
  );
};