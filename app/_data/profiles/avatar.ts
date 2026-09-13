import { mkdirSync, writeFileSync } from "fs";
import path from "path";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const AVATARS_DIR = path.join(process.cwd(), "public", "avatars");

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

  mkdirSync(AVATARS_DIR, { recursive: true });
  const fileName = `${prefix}-${Date.now()}.${extension}`;
  writeFileSync(path.join(AVATARS_DIR, fileName), Buffer.from(await entry.arrayBuffer()));

  return { path: `/avatars/${fileName}` };
}