import "server-only";

import { randomUUID } from "crypto";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const AVATAR_BUCKET = "avatars";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

function storage() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined for avatar uploads.",
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
  if (!error && buckets?.some((bucket) => bucket.name === AVATAR_BUCKET)) return;
  await sb.createBucket(AVATAR_BUCKET, { public: true });
}

export interface AvatarFileResult {
  path: string | null;
  error?: string;
}

export async function saveAvatarFile(
  formData: FormData,
  prefix: string,
): Promise<AvatarFileResult> {
  const entry = formData.get("avatarFile");
  if (entry === null || typeof entry === "string") return { path: null };
  if (!(entry instanceof File) || entry.size === 0) return { path: null };

  const extension = ALLOWED_EXTENSIONS[entry.type];
  if (!extension) {
    return {
      path: null,
      error: "Avatar must be a JPG, PNG, WEBP, or GIF image.",
    };
  }
  if (entry.size > MAX_AVATAR_BYTES) {
    return { path: null, error: "Avatar must be 2MB or smaller." };
  }

  try {
    await ensureBucket();
  } catch {
    return { path: null, error: "Avatar storage could not be prepared." };
  }

  const filePath = `${prefix}/${randomUUID()}.${extension}`;
  const { error } = await storage().from(AVATAR_BUCKET).upload(filePath, entry, {
    contentType: entry.type,
    upsert: false,
    cacheControl: "3600",
  });
  if (error) {
    return { path: null, error: `Upload failed: ${error.message}` };
  }

  const { data } = storage().from(AVATAR_BUCKET).getPublicUrl(filePath);
  return { path: data.publicUrl };
}