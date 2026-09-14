import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { restaurantPhotos } from "@db/schema";

import type { IRestaurantPhoto } from "@types";

const RESTAURANT_ID = "rest-001";

function toPhoto(row: (typeof restaurantPhotos.$inferSelect)): IRestaurantPhoto {
  return {
    id: row.id,
    url: row.url,
    type: row.type,
    restaurantId: row.restaurantId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export interface PhotosData {
  cover: IRestaurantPhoto | null;
  posts: IRestaurantPhoto[];
  menus: IRestaurantPhoto[];
}

export async function getPhotosData(): Promise<PhotosData> {
  const rows = await db
    .select()
    .from(restaurantPhotos)
    .where(eq(restaurantPhotos.restaurantId, RESTAURANT_ID));
  const photos = rows.map(toPhoto);
  return {
    cover: photos.find((photo) => photo.type === "cover") ?? null,
    posts: photos
      .filter((photo) => photo.type === "post")
      .sort((a, b) => a.id.localeCompare(b.id)),
    menus: photos
      .filter((photo) => photo.type === "menu")
      .sort((a, b) => a.id.localeCompare(b.id)),
  };
}

export async function readAllPhotos(): Promise<IRestaurantPhoto[]> {
  const rows = await db.select().from(restaurantPhotos);
  return rows.map(toPhoto);
}

export type PhotoKind = "post" | "menu";

export function buildNextPhotoId(
  photos: IRestaurantPhoto[],
  kind: PhotoKind,
): string {
  let max = 0;
  for (const photo of photos) {
    const match = photo.id.match(new RegExp(`^photo-r1-${kind}-(\\d+)$`));
    if (match) {
      const num = Number.parseInt(match[1], 10);
      if (Number.isFinite(num) && num > max) max = num;
    }
  }
  return `photo-r1-${kind}-${String(max + 1).padStart(2, "0")}`;
}