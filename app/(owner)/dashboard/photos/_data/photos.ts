import { readFileSync, writeFileSync } from "fs";
import path from "path";

import type { IRestaurantPhoto } from "@types";

const RESTAURANT_ID = "rest-001";

const PHOTOS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/restaurant_photos.json",
);

function readPhotos(): IRestaurantPhoto[] {
  return JSON.parse(readFileSync(PHOTOS_FILE_PATH, "utf8")) as IRestaurantPhoto[];
}

function writePhotos(photos: IRestaurantPhoto[]): void {
  writeFileSync(
    PHOTOS_FILE_PATH,
    `${JSON.stringify(photos, null, 2)}\n`,
    "utf8",
  );
}

export interface PhotosData {
  cover: IRestaurantPhoto | null;
  posts: IRestaurantPhoto[];
  menus: IRestaurantPhoto[];
}

export function getPhotosData(): PhotosData {
  const photos = readPhotos().filter(
    (photo) => photo.restaurantId === RESTAURANT_ID,
  );
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

export function readAllPhotos(): IRestaurantPhoto[] {
  return readPhotos();
}

export function writeAllPhotos(photos: IRestaurantPhoto[]): void {
  writePhotos(photos);
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