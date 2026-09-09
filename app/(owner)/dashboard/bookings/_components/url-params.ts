import type { UrlObject } from "url";

import type { BookingFilter } from "./booking-filter";

export interface BookingsHrefParams {
  date?: string;
  filter?: BookingFilter;
  query?: string;
}

/**
 * Builds a /dashboard/bookings href that preserves every current filter
 * parameter and applies the given overrides. Omitting `date` keeps the
 * default (today); `status: "all"` and empty `query` are dropped.
 */
export const buildBookingsHref = (
  params: BookingsHrefParams,
): string | UrlObject => {
  const query: Record<string, string> = {};
  if (params.date) query.date = params.date;
  if (params.filter && params.filter !== "all") query.status = params.filter;
  if (params.query) query.q = params.query;

  const entries = Object.entries(query);
  if (entries.length === 0) return "/dashboard/bookings";
  return { pathname: "/dashboard/bookings", query };
};