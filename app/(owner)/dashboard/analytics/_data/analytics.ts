import { readFileSync } from "fs";
import path from "path";

import rawRestaurants from "@data/dummy/restaurants.json";
import rawTables from "@data/dummy/tables.json";
import { getEffectiveBookingStatus } from "../../../../_data/bookings/booking-deadline";

import type { IBooking, IPayment, IRestaurant, ITable } from "@types";

const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);
const PAYMENTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/payments.json",
);

const RESTAURANT_ID = "rest-001";

const TABLES = rawTables as ITable[];
const RESTAURANTS = rawRestaurants as IRestaurant[];

const todayString = (): string => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

export type Bucket = "pending" | "confirmed" | "completed" | "cancelled";

export interface KpiData {
  revenue: number;
  bookings: number;
  guests: number;
  completionRate: number;
  avgParty: number;
  avgTicket: number;
  revenueDelta: number | null;
  bookingsDelta: number | null;
  deltaCaption: string | null;
}

export interface MonthlyPoint {
  key: string;
  label: string;
  revenue: number;
  bookings: number;
  completed: number;
  cancelled: number;
}

export interface DayPoint {
  day: string;
  bookings: number;
  revenue: number;
}

export interface HourPoint {
  time: string;
  label: string;
  bookings: number;
}

export interface StatusPoint {
  key: Bucket;
  label: string;
  count: number;
  color: string;
}

export interface PaymentPoint {
  key: string;
  label: string;
  count: number;
  color: string;
}

export interface TablePoint {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
}

export interface AnalyticsData {
  restaurantName: string;
  period: { from: string; to: string };
  monthsCount: number;
  kpis: KpiData;
  monthly: MonthlyPoint[];
  byDayOfWeek: DayPoint[];
  byHour: HourPoint[];
  statusBreakdown: StatusPoint[];
  paymentBreakdown: PaymentPoint[];
  topTables: TablePoint[];
  peakDayIndex: number;
  peakHourIndex: number;
}

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });

const monthLabel = (key: string): string =>
  MONTH_FORMATTER.format(new Date(`${key}-01T00:00:00`));

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const hourLabel = (time: string): string => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
};

const deriveBucket = (
  booking: IBooking,
  payment: IPayment | undefined,
  today: string,
): Bucket => {
  if (
    booking.status === "cancelled" ||
    booking.status === "no_show" ||
    getEffectiveBookingStatus(booking, payment) === "cancelled"
  ) {
    return "cancelled";
  }
  if (booking.status === "confirmed") {
    if (booking.date < today) {
      return payment?.status === "paid" ? "completed" : "cancelled";
    }
    return "confirmed";
  }
  if (booking.status === "completed") return "completed";
  return "pending";
};

const percentDelta = (current: number, previous: number): number | null =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

export const getAnalyticsData = (): AnalyticsData => {
  const restaurant = RESTAURANTS.find((item) => item.id === RESTAURANT_ID);
  const restaurantName = restaurant?.name ?? "My Restaurant";

  const restaurantTables = TABLES.filter(
    (table) => table.restaurantId === RESTAURANT_ID,
  );
  const tableIds = new Set(restaurantTables.map((table) => table.id));

  const raw: IBooking[] = JSON.parse(
    readFileSync(BOOKINGS_FILE_PATH, "utf8"),
  ) as IBooking[];
  const payments: IPayment[] = JSON.parse(
    readFileSync(PAYMENTS_FILE_PATH, "utf8"),
  ) as IPayment[];

  const paymentByBookingId = new Map(
    payments.map((item) => [item.bookingId, item] as const),
  );

  const today = todayString();

  const bookings: IBooking[] = [];
  const derivedBuckets = new Map<string, Bucket>();
  for (const booking of raw) {
    if (!tableIds.has(booking.tableId)) continue;
    bookings.push(booking);
    derivedBuckets.set(
      booking.id,
      deriveBucket(booking, paymentByBookingId.get(booking.id), today),
    );
  }

  const isPaid = (booking: IBooking): boolean =>
    paymentByBookingId.get(booking.id)?.status === "paid";
  const priceOf = (booking: IBooking): number =>
    paymentByBookingId.get(booking.id)?.price ?? 0;

  const periods = bookings.map((booking) => booking.date);
  const from = periods.length ? periods.sort()[0] : "";
  const to = periods.length ? periods.at(-1) ?? "" : "";

  const monthMap = new Map<string, MonthlyPoint>();
  for (const booking of bookings) {
    const key = booking.date.slice(0, 7);
    const entry = monthMap.get(key) ?? {
      key,
      label: monthLabel(key),
      revenue: 0,
      bookings: 0,
      completed: 0,
      cancelled: 0,
    };
    entry.bookings += 1;
    if (isPaid(booking)) entry.revenue += priceOf(booking);
    const bucket = derivedBuckets.get(booking.id) ?? "pending";
    if (bucket === "completed") entry.completed += 1;
    if (bucket === "cancelled") entry.cancelled += 1;
    monthMap.set(key, entry);
  }
  const monthly = [...monthMap.values()].sort((a, b) =>
    a.key.localeCompare(b.key),
  );

  const currentMonth = today.slice(0, 7);
  const closedMonths = monthly.filter((month) => month.key < currentMonth);
  const lastClosed = closedMonths.at(-1);
  const previousClosed = closedMonths.at(-2);
  const deltaCaption =
    lastClosed && previousClosed
      ? `${lastClosed.label} vs ${previousClosed.label}`
      : null;
  const revenueDelta =
    lastClosed && previousClosed
      ? percentDelta(lastClosed.revenue, previousClosed.revenue)
      : null;
  const bookingsDelta =
    lastClosed && previousClosed
      ? percentDelta(lastClosed.bookings, previousClosed.bookings)
      : null;

  const days: DayPoint[] = DAY_NAMES.map((day) => ({
    day,
    bookings: 0,
    revenue: 0,
  }));
  for (const booking of bookings) {
    const dayIndex = (new Date(`${booking.date}T00:00:00`).getDay() + 6) % 7;
    days[dayIndex].bookings += 1;
    if (isPaid(booking)) days[dayIndex].revenue += priceOf(booking);
  }
  const peakDayIndex = days.reduce(
    (max, day, index) => (day.bookings > days[max].bookings ? index : max),
    0,
  );

  const hourCounts = new Map<string, number>();
  for (const booking of bookings) {
    hourCounts.set(booking.time, (hourCounts.get(booking.time) ?? 0) + 1);
  }
  const byHour: HourPoint[] = [...hourCounts.entries()]
    .map(([time, count]) => ({ time, label: hourLabel(time), bookings: count }))
    .sort((a, b) => a.time.localeCompare(b.time));
  const peakHourIndex = byHour.reduce(
    (max, hour, index) => (hour.bookings > byHour[max].bookings ? index : max),
    0,
  );

  const counted = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  } as Record<Bucket, number>;
  for (const booking of bookings) {
    counted[derivedBuckets.get(booking.id) ?? "pending"] += 1;
  }

  const statusCandidates: StatusPoint[] = [
    { key: "completed", label: "Completed", count: counted.completed, color: "#4a7c59" },
    { key: "confirmed", label: "Confirmed", count: counted.confirmed, color: "#7b3f20" },
    { key: "pending", label: "Pending", count: counted.pending, color: "#9e5229" },
    { key: "cancelled", label: "Cancelled", count: counted.cancelled, color: "#a32d2d" },
  ];
  const statusBreakdown = statusCandidates.filter((point) => point.count > 0);

  const paymentCounts = new Map<string, number>();
  for (const booking of bookings) {
    const payment = paymentByBookingId.get(booking.id);
    if (!payment) continue;
    paymentCounts.set(payment.status, (paymentCounts.get(payment.status) ?? 0) + 1);
  }
  const PAYMENT_META: Record<string, { label: string; color: string }> = {
    paid: { label: "Paid", color: "#4a7c59" },
    unpaid: { label: "Unpaid", color: "#9e5229" },
    failed: { label: "Failed", color: "#a32d2d" },
    refunded: { label: "Refunded", color: "#9a7a65" },
    unrefunded: { label: "Unrefunded", color: "#9a7a65" },
  };
  const paymentBreakdown: PaymentPoint[] = ["paid", "unpaid", "failed", "refunded", "unrefunded"]
    .filter((key) => (paymentCounts.get(key) ?? 0) > 0)
    .map((key) => ({
      key,
      label: PAYMENT_META[key].label,
      count: paymentCounts.get(key) ?? 0,
      color: PAYMENT_META[key].color,
    }));

  const tableStats = new Map<string, { bookings: number; revenue: number }>();
  for (const booking of bookings) {
    const entry = tableStats.get(booking.tableId) ?? { bookings: 0, revenue: 0 };
    entry.bookings += 1;
    if (isPaid(booking)) entry.revenue += priceOf(booking);
    tableStats.set(booking.tableId, entry);
  }
  const topTables: TablePoint[] = [...tableStats.entries()]
    .map(([id, stats]) => ({
      id,
      name: TABLES.find((table) => table.id === id)?.name ?? "Unknown",
      bookings: stats.bookings,
      revenue: stats.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const revenue = bookings.reduce(
    (sum, booking) => sum + (isPaid(booking) ? priceOf(booking) : 0),
    0,
  );
  const guests = bookings.reduce((sum, booking) => sum + booking.partySize, 0);
  const paidCount = bookings.filter((booking) => isPaid(booking)).length;
  const realized = counted.completed + counted.cancelled;

  return {
    restaurantName,
    period: { from, to },
    monthsCount: monthly.length,
    kpis: {
      revenue,
      bookings: bookings.length,
      guests,
      completionRate: realized === 0 ? 0 : Math.round((counted.completed / realized) * 100),
      avgParty: bookings.length ? Number((guests / bookings.length).toFixed(1)) : 0,
      avgTicket: paidCount ? Math.round(revenue / paidCount) : 0,
      revenueDelta,
      bookingsDelta,
      deltaCaption,
    },
    monthly,
    byDayOfWeek: days,
    byHour,
    statusBreakdown,
    paymentBreakdown,
    topTables,
    peakDayIndex,
    peakHourIndex,
  };
};