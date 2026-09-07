"use client";

import { useCallback, useState } from "react";

import { Check } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";

import { toBookingCode } from "@data/bookings/booking-code";

import { createBookingAction } from "./_actions/booking-action";
import { Calendar } from "./calendar";
import { PartySize } from "./party-size";
import { Time } from "./time";

import { formatDayDate, formatTime } from "@utils";

import type { ITable } from "@types";

interface BookingActionProps {
  restaurantId: string;
  restaurantName: string;
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
  return slots.filter((time) =>
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
  restaurantId,
  restaurantName,
  slotsByDay,
  tables,
  busyTablesByTime,
}: BookingActionProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPartySize, setSelectedPartySize] = useState<number | null>(null);
  const [localBusyTablesByTime, setLocalBusyTablesByTime] = useState<
    Record<string, Record<string, string[]>>
  >(() => ({ ...busyTablesByTime }));
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const availableTimes = selectedDate
    ? getAvailableTimes(slotsByDay, tables, localBusyTablesByTime, selectedDate)
    : [];

  const handleAvailableTimes = useCallback(
    (date: string) =>
      getAvailableTimes(slotsByDay, tables, localBusyTablesByTime, date),
    [slotsByDay, tables, localBusyTablesByTime],
  );

  const hasSelectedSlot = !!selectedDate && !!selectedTime;

  const maxParty = hasSelectedSlot
    ? getMaxPartySize(tables, localBusyTablesByTime, selectedDate, selectedTime)
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

    const max = getMaxPartySize(tables, localBusyTablesByTime, selectedDate, time);
    if (selectedPartySize !== null && selectedPartySize > max) {
      setSelectedPartySize(null);
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || selectedPartySize === null) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const result = await createBookingAction({
        restaurantId,
        date: selectedDate,
        time: selectedTime,
        partySize: selectedPartySize,
      });

      setLocalBusyTablesByTime((current) => {
        const byDate = { ...(current[selectedDate] ?? {}) };
        const busy = new Set(byDate[selectedTime] ?? []);
        busy.add(result.booking.tableId);
        byDate[selectedTime] = [...busy];
        return { ...current, [selectedDate]: byDate };
      });

      setBookingCode(toBookingCode(result.booking.id));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not create the booking.";
      setBookingError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedPartySize(null);
    setBookingCode(null);
    setBookingError(null);
  };

  if (bookingCode) {
    return (
      <div className="border border-muted rounded-2xl w-full overflow-hidden">
        <div className="py-4 px-6 bg-base-200 border-b border-muted">
          <h2 className="text-foreground text-c-header-md">Book a Table</h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="size-12 rounded-full bg-positive/20 text-positive flex items-center justify-center">
            <Check className="size-6" />
          </div>
          <p className="text-c-header-md text-foreground">Booking Confirmed!</p>
          <p className="text-c-body text-muted">
            Your reservation at <span className="text-foreground">{restaurantName}</span> has
            been requested.
          </p>
          <dl className="space-y-1 text-c-body">
            <div className="flex justify-between">
              <dt className="text-muted">Code</dt>
              <dd className="text-foreground">{bookingCode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Date</dt>
              <dd className="text-foreground">
                {selectedDate ? formatDayDate(selectedDate) : "-"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Time</dt>
              <dd className="text-foreground">
                {selectedTime ? formatTime(selectedTime) : "-"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Party</dt>
              <dd className="text-foreground">{selectedPartySize} people</dd>
            </div>
          </dl>
          <Button className="w-full" variant="outline" onClick={handleReset}>
            Make Another Booking
          </Button>
        </div>
      </div>
    );
  }

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