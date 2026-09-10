import type { UrlObject } from "url";

import type { PlaceFilter, StatusFilter } from "./filters";

export interface TablesHrefParams {
  date?: string;
  place?: PlaceFilter;
  status?: StatusFilter;
  page?: number;
}

export const buildTablesHref = (
  params: TablesHrefParams,
): string | UrlObject => {
  const query: Record<string, string> = {};
  if (params.date) query.date = params.date;
  if (params.place && params.place !== "all") query.place = params.place;
  if (params.status && params.status !== "all") query.status = params.status;
  if (params.page && params.page > 1) query.page = String(params.page);

  const entries = Object.entries(query);
  if (entries.length === 0) return "/dashboard/tables";
  return { pathname: "/dashboard/tables", query };
};