import { Button } from "@components";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react/dist/ssr";

import { BookingBadge } from "./booking-badge";

const FILTER_ACTIVE = "border! px-3! py-2! size-fit!";
const FILTER_INACTIVE = `${FILTER_ACTIVE} text-muted! border-muted!`;

const FILTERS = [
  { label: "All", className: FILTER_ACTIVE },
  { label: "Pending (2)", className: FILTER_INACTIVE },
  { label: "Confirmed (5)", className: FILTER_INACTIVE },
];

const HEADERS = ["TIME", "GUEST", "PARTY", "TABLE", "BOOKING", "PAYMENT", ""];

export const BookingTable = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter.label}
            variant="outline"
            className={filter.className}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <div className="size-full border border-muted rounded-lg p-4 space-y-4 h-full scrollbar-hidden overflow-y-scroll">
        <div className="grid grid-cols-[.75fr_1fr_.75fr_.75fr_auto_auto_auto] gap-4">
          {HEADERS.map((header) => (
            <span key={header} className="text-xs font-medium">
              {header}
            </span>
          ))}
          <span className="text-d-body text-foreground">02:30 PM</span>
          <span className="text-d-body text-foreground">John Cena</span>
          <span className="text-d-body text-foreground">4 People</span>
          <span className="text-d-body text-foreground">Table 4</span>
          <span>
            <BookingBadge status="Confirmed" variant="positive" />
          </span>
          <span>
            <BookingBadge status="Unpaid" />
          </span>
          <span>
            <DotsThreeVerticalIcon className="size-4 text-accent-100" />
          </span>
        </div>
      </div>
    </div>
  );
};