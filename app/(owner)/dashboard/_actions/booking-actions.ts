"use server";

import { and, eq, inArray, like, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@db/client";
import {
  bookings as bookingsTable,
  payments as paymentsTable,
  tables as tablesTable,
} from "@db/schema";
import { broadcastBookingEvent } from "@db/broadcast";
import { getDashboardRole } from "@libs/session";

import {
  derivePaymentDeadline,
  getEffectiveBookingStatus,
} from "@data/bookings/booking-deadline";

import type { BookingRow, PaymentRow, TableRow } from "@db/schema";
import type { IBooking, IPayment } from "@types";

const RESTAURANT_ID = "rest-001";
const MANUAL_BOOKING_ACTOR_ID = "owner-001";

const toIBooking = (row: BookingRow): IBooking => ({
  id: row.id,
  date: row.date,
  time: row.time,
  partySize: row.partySize,
  ...(row.specialRequest ? { specialRequest: row.specialRequest } : {}),
  status: row.status,
  customerId: row.customerId,
  tableId: row.tableId,
  ...(row.cancelledBy
    ? {
        cancelled: {
          date: row.cancelledDate ?? "",
          by: row.cancelledBy,
          reason: row.cancelledReason ?? "",
        },
      }
    : {}),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toIPayment = (row?: PaymentRow): IPayment | undefined => {
  if (!row) return undefined;
  return {
    id: row.id,
    price: row.price,
    status: row.status,
    deadline: row.deadline,
    gatewayToken: row.gatewayToken,
    bookingId: row.bookingId,
    paidAt: row.paidAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const buildNextPaymentId = async (): Promise<string> => {
  const rows = await db
    .select({ id: paymentsTable.id })
    .from(paymentsTable)
    .where(like(paymentsTable.id, "payment-%"));
  let max = 0;
  for (const row of rows) {
    const sequence = Number(row.id.replace("payment-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `payment-${String(max + 1).padStart(3, "0")}`;
};

const buildNextBookingId = async (): Promise<string> => {
  const rows = await db
    .select({ id: bookingsTable.id })
    .from(bookingsTable)
    .where(like(bookingsTable.id, "booking-%"));
  let max = 0;
  for (const row of rows) {
    const sequence = Number(row.id.replace("booking-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `booking-${String(max + 1).padStart(3, "0")}`;
};

const getBookingRow = async (id: string): Promise<BookingRow | undefined> => {
  const rows = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, id))
    .limit(1);
  return rows[0];
};

const getTableRow = async (id: string): Promise<TableRow | undefined> => {
  const rows = await db
    .select()
    .from(tablesTable)
    .where(eq(tablesTable.id, id))
    .limit(1);
  return rows[0];
};

const getPaymentRow = async (
  bookingId: string,
): Promise<PaymentRow | undefined> => {
  const rows = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.bookingId, bookingId))
    .limit(1);
  return rows[0];
};

const revalidateBookingPaths = (id: string): void => {
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");
  revalidatePath(`/bookings/${id}`, "page");
};

export async function confirmBookingAction(id: string): Promise<IBooking> {
  const role = await getDashboardRole();
  if (!role) {
    throw new Error("Unauthorized.");
  }

  const bookingRow = await getBookingRow(id);
  if (!bookingRow) {
    throw new Error("Booking not found.");
  }

  if (bookingRow.status !== "pending") {
    throw new Error("Only pending bookings can be confirmed.");
  }

  const tableRow = await getTableRow(bookingRow.tableId);
  const paymentRow = await getPaymentRow(id);

  if (
    getEffectiveBookingStatus(toIBooking(bookingRow), toIPayment(paymentRow)) !==
    "pending"
  ) {
    throw new Error(
      "This booking was auto-cancelled because it was not confirmed within 72 hours.",
    );
  }

  const conflictRows = await db
    .select()
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.tableId, bookingRow.tableId),
        eq(bookingsTable.date, bookingRow.date),
        eq(bookingsTable.time, bookingRow.time),
        ne(bookingsTable.id, id),
      ),
    );

  const conflictBookingIds = conflictRows.map((item) => item.id);
  const conflictPaymentRows = conflictBookingIds.length
    ? await db
        .select()
        .from(paymentsTable)
        .where(inArray(paymentsTable.bookingId, conflictBookingIds))
    : [];
  const conflictPaymentByBookingId = new Map(
    conflictPaymentRows.map((item) => [item.bookingId, item]),
  );

  const conflictingBooking = conflictRows.find((item) => {
    if (item.status === "cancelled") return false;
    return (
      getEffectiveBookingStatus(
        toIBooking(item),
        toIPayment(conflictPaymentByBookingId.get(item.id)),
      ) === "confirmed"
    );
  });
  if (conflictingBooking) {
    throw new Error(
      `Cannot confirm: that slot at ${bookingRow.time} on ${tableRow?.name ?? bookingRow.tableId} is already held by booking ${conflictingBooking.id}. Reject that booking first.`,
    );
  }

  const now = new Date().toISOString();

  await db
    .update(bookingsTable)
    .set({ status: "confirmed", updatedAt: now })
    .where(eq(bookingsTable.id, id));

  let paymentStatus: IPayment["status"] = paymentRow?.status ?? "unpaid";
  if (!paymentRow) {
    const paymentId = await buildNextPaymentId();
    await db.insert(paymentsTable).values({
      id: paymentId,
      price: tableRow?.price ?? bookingRow.partySize * 25,
      status: "unpaid",
      deadline: derivePaymentDeadline(),
      gatewayToken: `tok_sandbox_${id}`,
      paidAt: null,
      bookingId: id,
      createdAt: now,
      updatedAt: now,
    });
    paymentStatus = "unpaid";
  } else {
    await db
      .insert(paymentsTable)
      .values({
        id: paymentRow.id,
        price: paymentRow.price,
        status: paymentRow.status === "paid" ? "paid" : "unpaid",
        deadline: paymentRow.deadline,
        gatewayToken: paymentRow.gatewayToken,
        paidAt: paymentRow.paidAt,
        bookingId: id,
        createdAt: paymentRow.createdAt,
        updatedAt: paymentRow.updatedAt,
      })
      .onConflictDoNothing();
  }

  try {
    await broadcastBookingEvent("booking:confirmed", {
      bookingId: id,
      restaurantId: tableRow?.restaurantId ?? RESTAURANT_ID,
      customerId: bookingRow.customerId,
      tableId: bookingRow.tableId,
      status: "confirmed",
      date: bookingRow.date,
      time: bookingRow.time,
      partySize: bookingRow.partySize,
      paymentStatus,
    });
  } catch {
    // Broadcast error handled gracefully.
  }

  revalidateBookingPaths(id);

  return {
    ...toIBooking(bookingRow),
    status: "confirmed",
    updatedAt: now,
  };
}

export async function rejectBookingAction(
  id: string,
  reason?: string,
): Promise<IBooking> {
  const role = await getDashboardRole();
  if (!role) {
    throw new Error("Unauthorized.");
  }

  const bookingRow = await getBookingRow(id);
  if (!bookingRow) {
    throw new Error("Booking not found.");
  }

  if (bookingRow.status === "cancelled") {
    throw new Error("Booking is already cancelled.");
  }

  const cancelledReason = reason?.trim() || "Rejected by the restaurant.";
  const now = new Date().toISOString();

  await db
    .update(bookingsTable)
    .set({
      status: "cancelled",
      cancelledBy: "restaurant",
      cancelledDate: now.slice(0, 10),
      cancelledReason,
      updatedAt: now,
    })
    .where(eq(bookingsTable.id, id));

  const tableRow = await getTableRow(bookingRow.tableId);

  try {
    await broadcastBookingEvent("booking:rejected", {
      bookingId: id,
      restaurantId: tableRow?.restaurantId ?? RESTAURANT_ID,
      customerId: bookingRow.customerId,
      tableId: bookingRow.tableId,
      status: "cancelled",
      cancelledBy: "restaurant",
      cancelledReason,
    });
  } catch {
    // Broadcast error handled gracefully.
  }

  revalidateBookingPaths(id);

  return {
    ...toIBooking(bookingRow),
    status: "cancelled",
    cancelled: {
      date: now.slice(0, 10),
      by: "restaurant",
      reason: cancelledReason,
    },
    updatedAt: now,
  };
}

export async function completeBookingAction(id: string): Promise<IBooking> {
  const role = await getDashboardRole();
  if (!role) {
    throw new Error("Unauthorized.");
  }

  const bookingRow = await getBookingRow(id);
  if (!bookingRow) {
    throw new Error("Booking not found.");
  }

  if (bookingRow.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be marked as completed.");
  }

  const now = new Date().toISOString();

  await db
    .update(bookingsTable)
    .set({ status: "completed", updatedAt: now })
    .where(eq(bookingsTable.id, id));

  const paymentRow = await getPaymentRow(id);
  if (paymentRow && paymentRow.status === "unpaid") {
    await db
      .update(paymentsTable)
      .set({ status: "paid", paidAt: now, updatedAt: now })
      .where(eq(paymentsTable.bookingId, id));
  }

  const tableRow = await getTableRow(bookingRow.tableId);

  try {
    await broadcastBookingEvent("booking:completed", {
      bookingId: id,
      restaurantId: tableRow?.restaurantId ?? RESTAURANT_ID,
      customerId: bookingRow.customerId,
      tableId: bookingRow.tableId,
      status: "completed",
      paymentStatus: "paid",
    });
  } catch {
    // Broadcast error handled gracefully.
  }

  revalidateBookingPaths(id);

  return {
    ...toIBooking(bookingRow),
    status: "completed",
    updatedAt: now,
  };
}

export interface ManualBookingState {
  ok: boolean;
  error?: string;
  date?: string;
}

export async function createManualBookingAction(
  _prevState: ManualBookingState,
  formData: FormData,
): Promise<ManualBookingState> {
  const role = await getDashboardRole();
  if (!role) {
    return { ok: false, error: "Unauthorized." };
  }

  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const partySize = Number(formData.get("partySize"));
  const tableId = String(formData.get("tableId") ?? "");
  const specialRequest = String(formData.get("specialRequest") ?? "").trim();

  const todayClock = new Date();
  const today = [
    todayClock.getFullYear(),
    String(todayClock.getMonth() + 1).padStart(2, "0"),
    String(todayClock.getDate()).padStart(2, "0"),
  ].join("-");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "Please choose a valid date." };
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { ok: false, error: "Please choose a valid time." };
  }
  if (date < today) {
    return { ok: false, error: "Booking date cannot be in the past." };
  }
  if (date === today) {
    const currentTime = `${String(todayClock.getHours()).padStart(2, "0")}:${String(todayClock.getMinutes()).padStart(2, "0")}`;
    if (time <= currentTime) {
      return {
        ok: false,
        error: "Booking time must be later than the current time.",
      };
    }
  }

  const tableRows = await db
    .select()
    .from(tablesTable)
    .where(
      and(
        eq(tablesTable.id, tableId),
        eq(tablesTable.restaurantId, RESTAURANT_ID),
      ),
    )
    .limit(1);
  const table = tableRows[0];
  if (!table) {
    return { ok: false, error: "Please choose a table." };
  }
  if (!Number.isInteger(partySize) || partySize < 1) {
    return { ok: false, error: "Party size must be at least 1." };
  }
  if (partySize > table.capacity) {
    return {
      ok: false,
      error: `${table.name} only holds up to ${table.capacity} people.`,
    };
  }
  if (tableId && date && time) {
    const bookingRows = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.tableId, tableId),
          eq(bookingsTable.date, date),
          eq(bookingsTable.time, time),
        ),
      );
    const bookingIds = bookingRows.map((item) => item.id);
    const paymentRows = bookingIds.length
      ? await db
          .select()
          .from(paymentsTable)
          .where(inArray(paymentsTable.bookingId, bookingIds))
      : [];
    const paymentByBookingId = new Map(
      paymentRows.map((item) => [item.bookingId, item]),
    );
    const conflicting = bookingRows.find(
      (item) =>
        item.status !== "cancelled" &&
        getEffectiveBookingStatus(
          toIBooking(item),
          toIPayment(paymentByBookingId.get(item.id)),
        ) === "confirmed",
    );
    if (conflicting) {
      return {
        ok: false,
        error: `That slot on ${table.name} at ${time} is already taken by booking ${conflicting.id}.`,
      };
    }
  }

  const now = new Date().toISOString();
  const id = await buildNextBookingId();
  const paymentId = await buildNextPaymentId();

  try {
    await db.transaction(async (tx) => {
      await tx.insert(bookingsTable).values({
        id,
        date,
        time,
        partySize,
        specialRequest: specialRequest || null,
        status: "confirmed",
        customerId: MANUAL_BOOKING_ACTOR_ID,
        tableId,
        createdAt: now,
        updatedAt: now,
      });

      await tx.insert(paymentsTable).values({
        id: paymentId,
        price: table.price,
        status: "unpaid",
        deadline: derivePaymentDeadline(),
        gatewayToken: `tok_sandbox_${id}`,
        paidAt: null,
        bookingId: id,
        createdAt: now,
        updatedAt: now,
      });
    });
  } catch {
    return { ok: false, error: "Could not save the booking." };
  }

  try {
    await broadcastBookingEvent("booking:created", {
      bookingId: id,
      restaurantId: table.restaurantId ?? RESTAURANT_ID,
      customerId: MANUAL_BOOKING_ACTOR_ID,
      tableId,
      tableName: table.name,
      guestName: "Staff (Manual Reservation)",
      status: "confirmed",
      date,
      time,
      partySize,
      paymentStatus: "unpaid",
      price: table.price,
    });
  } catch {
    // Broadcast error handled gracefully.
  }

  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");

  return { ok: true, date };
}