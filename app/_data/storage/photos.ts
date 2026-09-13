import "server-only";

import { randomUUID } from "crypto";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const PHOTO_BUCKET = "restaurant-photos";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function storage() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined for photo uploads.",
    );
  }
  const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client.storage;
}

async function ensureBucket(): Promise<void> {
  const sb = storage();
  const { data: buckets, error } = await sb.listBuckets();
  if (!error && buckets?.some((bucket) => bucket.name === PHOTO_BUCKET)) return;
  await sb.createBucket(PHOTO_BUCKET, { public: true });
}

export interface StoredPhotoResult {
  url: string | null;
  error?: string;
}

export async function uploadPhoto(
  file: File,
  kind: "cover" | "post" | "menu",
): Promise<StoredPhotoResult> {
  const extension = ALLOWED_EXTENSIONS[file.type];
  if (!extension) {
    return {
      url: null,
      error: "Photo must be a JPG, PNG, WEBP, or GIF image.",
    };
  }
  if (file.size === 0) {
    return { url: null, error: "Please choose an image to upload." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { url: null, error: "Photo must be 5MB or smaller." };
  }

  try {
    await ensureBucket();
  } catch {
    return { url: null, error: "Photo storage could not be prepared." };
  }

  const path = `${kind}/${randomUUID()}.${extension}`;
  const { error } = await storage().from(PHOTO_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
    cacheControl: "3600",
  });
  if (error) {
    return { url: null, error: `Upload failed: ${error.message}` };
  }

  const { data } = storage().from(PHOTO_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function deleteStoredPhoto(url?: string): Promise<void> {
  if (!url) return;
  try {
    const marker = `${PHOTO_BUCKET}/`;
    const index = url.indexOf(marker);
    if (index === -1) return;
    const filePath = url.slice(index + marker.length).split("?")[0];
    if (filePath) await storage().from(PHOTO_BUCKET).remove([filePath]);
  } catch {
    // Best-effort cleanup; failures should not break the action.
  }
}