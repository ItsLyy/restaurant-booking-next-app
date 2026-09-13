import { cache } from "react";

import { db } from "@db/client";
import { tables } from "@db/schema";

export interface PriceBucket {
  min: number;
  max: number;
}

const BUCKET_COUNT = 3;

export const getPriceBuckets = cache(async (): Promise<PriceBucket[]> => {
  let lowest = Number.POSITIVE_INFINITY;
  let highest = Number.NEGATIVE_INFINITY;
  const priceRows = await db
    .select({ price: tables.price })
    .from(tables);

  for (const row of priceRows) {
    if (row.price < lowest) lowest = row.price;
    if (row.price > highest) highest = row.price;
  }
  if (!Number.isFinite(lowest) || !Number.isFinite(highest)) return [];

  const span = highest - lowest;
  const buckets: PriceBucket[] = [];
  for (let index = 0; index < BUCKET_COUNT; index++) {
    const bucketMin = lowest + (span * index) / BUCKET_COUNT;
    const bucketMax = lowest + (span * (index + 1)) / BUCKET_COUNT;
    buckets.push({
      min: Math.round(bucketMin),
      max: Math.round(bucketMax),
    });
  }
  return buckets;
});