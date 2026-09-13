"use client";

import { useCallback, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@components";

import { isBookingTooSoon } from "@data/bookings/booking-deadline";

import { Calendar } from "./calendar";
import { PartySize } from "./party-size";
import { Time } from "./time";

import type { ITable } from "@types";

interface CustomerIdentity {
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface BookingActionProps {
  customer?: CustomerIdentity;
  restaurantId: string;
  slotsByDay: Record<number, string[]>;
  tables: ITable[];
  busyTablesByTime: Record<string, Record<string, string[]>>;
}

const getDayOfWeek = (date: string) => new Date(`${date}T00:00:00`).getDay();

const getFreeTables = (
  tables: ITable[],
  busyTablesByTime: Record<string, Record<string, string[]>>,
  date: string,
  time: string,
) => {
  const busy = new Set(busyTablesByTime[date]?.[time] ?? []);
  return tables.filter((table) => !busy.has(table.id));
};

const getAvailableTimes = (
  slotsByDay: Record<number, string[]>,
  tables: ITable[],
  busyTablesByTime: Record<string, Record<string, string[]>>,
  date: string,
) => {
  const slots = slotsByDay[getDayOfWeek(date)] ?? [];
  return slots.filter(
    (time) =>
      !isBookingTooSoon(date, time) &&
      getFreeTables(tables, busyTablesByTime, date, time).length > 0,
  );
};

const getMaxPartySize = (
  tables: ITable[],
  busyTablesByTime: Record<string, Record<string, string[]>>,
  date: string,
  time: string,
) => {
  let max = 0;
  for (const table of getFreeTables(tables, busyTablesByTime, date, time)) {
    if (table.capacity > max) {
      max = table.capacity;
    }
  }
  return max;
};

export const BookingAction = ({
  customer,
  restaurantId,
  slotsByDay,
  tables,
  busyTablesByTime,
}: BookingActionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPartySize, setSelectedPartySize] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleAvailableTimes = useCallback(
    (date: string) =>
      getAvailableTimes(slotsByDay, tables, busyTablesByTime, date),
    [slotsByDay, tables, busyTablesByTime],
  );

  if (!customer) {
    const signinHref = `/signin?next=${encodeURIComponent(pathname)}`;
    return (
      <div className="border border-muted rounded-2xl w-full overflow-hidden">
        <div className="py-4 px-6 bg-base-200 border-b border-muted">
          <h2 className="text-foreground text-c-header-md">Book a Table</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-c-normal text-muted">
            Sign in to view availability and reserve a table at this
            restaurant.
          </p>
          <Button as="link" href={signinHref} className="w-full">
            Sign in to book
          </Button>
        </div>
      </div>
    );
  }

  const availableTimes = selectedDate
    ? getAvailableTimes(slotsByDay, tables, busyTablesByTime, selectedDate)
    : [];

  const hasSelectedSlot = !!selectedDate && !!selectedTime;

  const maxParty = hasSelectedSlot
    ? getMaxPartySize(tables, busyTablesByTime, selectedDate, selectedTime)
    : 0;

  const partyOptions: number[] = [];
  for (let size = 1; size <= maxParty; size++) {
    partyOptions.push(size);
  }

  const partyEmptyMessage = !selectedDate
    ? "Select a date to see available party sizes."
    : !selectedTime
      ? "Select a time to see available party sizes."
      : null;

  const canBook =
    hasSelectedSlot && selectedPartySize !== null && !isSubmitting;

  const handleSelectDate = (date: string | null) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedPartySize(null);
    setBookingError(null);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    if (!selectedDate) return;

    const max = getMaxPartySize(tables, busyTablesByTime, selectedDate, time);
    if (selectedPartySize !== null && selectedPartySize > max) {
      setSelectedPartySize(null);
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || selectedPartySize === null) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      router.push(
        `/bookings/confirmation?restaurantId=${encodeURIComponent(
          restaurantId,
        )}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(
          selectedTime,
        )}&partySize=${selectedPartySize}`,
      );
    } catch {
      setBookingError("Could not open the booking confirmation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-muted rounded-2xl w-full overflow-hidden">
      <div className="py-4 px-6 bg-base-200 border-b border-muted">
        <h2 className="text-foreground text-c-header-md">Book a Table</h2>
      </div>
      <Calendar
        selectedDate={selectedDate}
        onSelect={handleSelectDate}
        getAvailableTimes={handleAvailableTimes}
      />
      <Time
        times={availableTimes}
        selectedTime={selectedTime}
        onSelect={handleSelectTime}
      />
      <PartySize
        options={partyOptions}
        emptyMessage={partyEmptyMessage}
        selectedPartySize={selectedPartySize}
        onSelect={setSelectedPartySize}
      />
      <div className="px-6 pb-4 space-y-2">
        {bookingError ? (
          <p className="text-c-body text-negative">{bookingError}</p>
        ) : null}
        <Button className="w-full" disabled={!canBook} onClick={handleBook}>
          {isSubmitting ? "Booking…" : "Book"}
        </Button>
      </div>
    </div>
  );
};