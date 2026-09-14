"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@db/client";
import { restaurantPhotos, restaurants } from "@db/schema";

import type { FormState } from "@types";
import { getDashboardRole } from "@libs/session";

import {
  deleteStoredPhoto,
  uploadPhoto,
} from "@data/storage/photos";

import {
  buildNextPhotoId,
  readAllPhotos,
} from "../_data/photos";

import { MAX_GALLERY_PHOTOS } from "../_constants";

const RESTAURANT_ID = "rest-001";

const COVER_ID = "photo-r1-cover";

async function requireAuthorized(): Promise<FormState | null> {
  const role = await getDashboardRole();
  if (role === null) return { success: false, message: "Unauthorized." };
  return null;
}

function now(): string {
  return new Date().toISOString();
}

async function readUploadedPhoto(
  kind: "cover" | "post" | "menu",
  formData: FormData,
): Promise<
  | { okay: true; url: string }
  | { okay: false; error: FormState }
> {
  const entry = formData.get("photo");
  if (entry === null || typeof entry === "string") {
    return {
      okay: false,
      error: { errors: { photo: ["Please choose an image to upload."] } },
    };
  }
  if (!(entry instanceof File)) {
    return { okay: false, error: { errors: { photo: ["Invalid upload."] } } };
  }

  const result = await uploadPhoto(entry, kind);
  if (!result.url) {
    return {
      okay: false,
      error: { errors: { photo: [result.error ?? "Upload failed."] } },
    };
  }
  return { okay: true, url: result.url };
}

export async function updateCoverAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const unauthorized = await requireAuthorized();
  if (unauthorized) return unauthorized;

  const upload = await readUploadedPhoto("cover", formData);
  if (!upload.okay) return upload.error;

  const photos = await readAllPhotos();
  const cover = photos.find((photo) => photo.id === COVER_ID);
  if (!cover) {
    return { success: false, message: "Cover photo not found." };
  }

  const previousUrl = cover.url;
  const updatedAt = now();

  try {
    await db
      .update(restaurantPhotos)
      .set({ url: upload.url, updatedAt })
      .where(eq(restaurantPhotos.id, COVER_ID));
  } catch {
    await deleteStoredPhoto(upload.url);
    return {
      success: false,
      message: "Cover could not be saved to the live site.",
    };
  }

  await deleteStoredPhoto(previousUrl);

  await revalidatePaths();
  return { success: true, message: "Cover image updated." };
}

async function addPhotoAction(
  kind: "post" | "menu",
  formData: FormData,
): Promise<FormState> {
  const unauthorized = await requireAuthorized();
  if (unauthorized) return unauthorized;

  if (kind === "post") {
    const existing = (await readAllPhotos()).filter(
      (photo) => photo.restaurantId === RESTAURANT_ID && photo.type === "post",
    );
    if (existing.length >= MAX_GALLERY_PHOTOS) {
      return {
        success: false,
        message: `Your gallery already shows its maximum of ${MAX_GALLERY_PHOTOS} photos. Delete one before adding another.`,
      };
    }
  }

  const upload = await readUploadedPhoto(kind, formData);
  if (!upload.okay) return upload.error;

  const timestamp = now();
  const id = buildNextPhotoId(await readAllPhotos(), kind);

  try {
    await db.insert(restaurantPhotos).values({
      id,
      url: upload.url,
      type: kind,
      restaurantId: RESTAURANT_ID,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).onConflictDoNothing();
  } catch {
    await deleteStoredPhoto(upload.url);
    return {
      success: false,
      message: "Photo could not be saved to the live site.",
    };
  }

  await revalidatePaths();
  return {
    success: true,
    message: kind === "post" ? "Gallery photo added." : "Menu image added.",
  };
}

export async function addPostPhotoAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  return addPhotoAction("post", formData);
}

export async function addMenuPhotoAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  return addPhotoAction("menu", formData);
}

export async function deletePhotoAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const unauthorized = await requireAuthorized();
  if (unauthorized) return unauthorized;

  const photoId = String(formData.get("photoId") ?? "");
  const photos = await readAllPhotos();
  const target = photos.find((photo) => photo.id === photoId);
  if (!target) {
    return { success: false, message: "Photo not found." };
  }
  if (target.type === "cover") {
    return { success: false, message: "The cover image cannot be deleted." };
  }

  try {
    await db.delete(restaurantPhotos).where(eq(restaurantPhotos.id, photoId));
  } catch {
    return {
      success: false,
      message: "Photo could not be removed from the live site.",
    };
  }

  await deleteStoredPhoto(target.url);

  await revalidatePaths();
  return { success: true, message: "Photo deleted." };
}

async function revalidatePaths(): Promise<void> {
  revalidatePath("/dashboard/photos", "page");
  const restaurant =
    (
      await db
        .select({ slug: restaurants.slug })
        .from(restaurants)
        .where(eq(restaurants.id, RESTAURANT_ID))
        .limit(1)
    )[0] ?? null;
  if (restaurant) revalidatePath(`/restaurants/${restaurant.slug}`, "page");
}