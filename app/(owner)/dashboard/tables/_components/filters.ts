import type { TablePlace, TableStatus } from "../_data/tables";

export type PlaceFilter = "all" | TablePlace;
export type StatusFilter = "all" | TableStatus;

export const parsePlaceFilter = (
  value: string | string[] | undefined,
): PlaceFilter =>
  value === "indoor" || value === "outdoor" || value === "private"
    ? value
    : "all";

export const parseStatusFilter = (
  value: string | string[] | undefined,
): StatusFilter =>
  value === "free" || value === "reserved" || value === "occupied"
    ? value
    : "all";