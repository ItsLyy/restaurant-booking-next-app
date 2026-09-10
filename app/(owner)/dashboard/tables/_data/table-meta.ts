export const TABLE_CATEGORIES = [
  "standard",
  "booth",
  "counter",
  "bar",
  "lounge",
  "outdoor",
  "private",
  "vip",
] as const;

export type TableCategory = (typeof TABLE_CATEGORIES)[number];

export const PLACE_LABELS = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  private: "Private",
} as const;

export type TablePlace = "indoor" | "outdoor" | "private";
export type TableStatus = "free" | "reserved" | "occupied";