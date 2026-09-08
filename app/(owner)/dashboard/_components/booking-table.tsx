"use client";

import { useState } from "react";

import { Button } from "@components";
import { formatShortDate } from "@utils/formatDate";

import { BookingBadge } from "./booking-badge";
import { BookingRowOptions, type ActionState } from "./booking-row-options";

import {
  confirmBookingAction,
  rejectBookingAction,
} from "../_actions/booking-actions";

import type { DashboardBooking } from "../_data/dashboard";

type Filter = "all" | "confirmed" | "pending";

const FILTER_ACTIVE = "border! px-3! py-2! size-fit!";
const FILTER_INACTIVE = `${FILTER_ACTIVE} text-muted! border-muted!`;

const HEADERS = [
  "DATE",
  "TIME",
  "GUEST",
  "PARTY",
  "TABLE",
  "BOOKING",
  "PAYMENT",
  "",
];

const STATUS_LABELS: Record<DashboardBooking["status"], string> = {
  confirmed: "Confirmed",
  pending: "Pending",
};

export const BookingTable = ({
  bookings,
}: {
  bookings: DashboardBooking[];
}) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [rows, setRows] = useState<DashboardBooking[]>(() =>
    bookings.map((booking) => ({ ...booking })),
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const onConfirm = async (id: string): Promise<ActionState> => {
    setBusyId(id);
    try {
      await confirmBookingAction(id);
      setRows((current) =>
        current.map((row) =>
          row.id === id ? { ...row, status: "confirmed" } : row,
        ),
      );
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not confirm the booking.",
      };
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async (id: string): Promise<ActionState> => {
    setBusyId(id);
    try {
      await rejectBookingAction(id);
      setRows((current) => current.filter((row) => row.id !== id));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not reject the booking.",
      };
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    pending: rows.filter((row) => row.status === "pending").length,
    confirmed: rows.filter((row) => row.status === "confirmed").length,
  };

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: `Pending (${counts.pending})`, value: "pending" },
    { label: `Confirmed (${counts.confirmed})`, value: "confirmed" },
  ];

  const filteredBookings =
    filter === "all" ? rows : rows.filter((row) => row.status === filter);

  return (
    <div className="min-h-0 flex-1 flex flex-col gap-2 box-border">
      <div className="flex gap-2">
        {filters.map((item) => (
          <Button
            key={item.value}
            variant="outline"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={filter === item.value ? FILTER_ACTIVE : FILTER_INACTIVE}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex-1 min-h-0 border border-muted rounded-lg px-4 pb-12 overflow-y-auto scrollbar-hidden box-border">
        {filteredBookings.length === 0 ? (
          <p className="text-muted text-d-caption text-center py-10">
            No bookings to show.
          </p>
        ) : (
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr>
                {HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="text-left text-xs font-medium whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="text-d-body text-muted whitespace-nowrap">
                    {formatShortDate(booking.date)}
                  </td>
                  <td className="text-d-body text-foreground whitespace-nowrap">
                    {booking.time}
                  </td>
                  <td className="text-d-body text-foreground whitespace-nowrap">
                    {booking.guest}
                  </td>
                  <td className="text-d-body text-foreground whitespace-nowrap">
                    {booking.party} People
                  </td>
                  <td className="text-d-body text-foreground whitespace-nowrap">
                    {booking.table}
                  </td>
                  <td>
                    <BookingBadge
                      status={STATUS_LABELS[booking.status]}
                      variant={
                        booking.status === "confirmed" ? "positive" : "neutral"
                      }
                    />
                  </td>
                  <td>
                    <BookingBadge
                      status={booking.isPaid ? "Paid" : "Unpaid"}
                      variant={booking.isPaid ? "positive" : "neutral"}
                    />
                  </td>
                  <td>
                    <BookingRowOptions
                      booking={booking}
                      busy={busyId === booking.id}
                      onConfirm={() => onConfirm(booking.id)}
                      onReject={() => onReject(booking.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
