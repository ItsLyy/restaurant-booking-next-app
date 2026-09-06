import { Button } from "@components";

import { Calendar } from "./calendar";
import { PartySize } from "./party-size";
import { Time } from "./time";

export const BookingAction = () => {
  return (
    <div className="border border-muted rounded-2xl w-full overflow-hidden">
      <div className="py-4 px-6 bg-base-200 border-b border-muted">
        <h2 className="text-foreground text-c-header-md">Book a Table</h2>
      </div>
      <Calendar />
      <Time />
      <PartySize />
      <div className="px-6 pb-4">
        <Button className="w-full">Book</Button>
      </div>
    </div>
  );
};
