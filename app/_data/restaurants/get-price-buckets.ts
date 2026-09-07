import { cache } from "react";
import tables from "../dummy/tables.json";

export interface PriceBucket {
  min: number;
  max: number;
}

const BUCKET_COUNT = 3;

export const getPriceBuckets = cache((): PriceBucket[] => {
  let min = Infinity;
  let max = -Infinity;
  for (const table of tables) {
    if (table.price < min) min = table.price;
    if (table.price > max) max = table.price;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];

  const span = max - min;
  const buckets: PriceBucket[] = [];
  for (let index = 0; index < BUCKET_COUNT; index++) {
    const bucketMin = min + (span * index) / BUCKET_COUNT;
    const bucketMax = min + (span * (index + 1)) / BUCKET_COUNT;
    buckets.push({
      min: Math.round(bucketMin),
      max: Math.round(bucketMax),
    });
  }
  return buckets;
});