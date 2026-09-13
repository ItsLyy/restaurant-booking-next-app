"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CameraIcon,
  UploadSimpleIcon,
  UserIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

interface AvatarUploaderProps {
  initialAvatar?: string;
  fullName: string;
  error?: string;
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const AvatarUploader = ({
  initialAvatar,
  fullName,
  error,
}: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (file: File | null) => {
    setValidationError(null);

    if (!file) {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError("Avatar must be a JPG, PNG, WEBP, or GIF image.");
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setValidationError("Avatar image must be 2MB or smaller.");
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const activeSrc = previewUrl ?? initialAvatar;
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-base-100/70 border border-muted/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative group shrink-0">
          <div className="size-24 rounded-2xl overflow-hidden bg-base-200 border-2 border-accent-200/30 shadow-xs flex items-center justify-center relative">
            {activeSrc ? (
              <Image
                src={activeSrc}
                alt={fullName || "Profile Avatar"}
                fill
                unoptimized={Boolean(previewUrl)}
                sizes="96px"
                className="object-cover object-center"
              />
            ) : (
              <span className="text-xl font-semibold text-accent-100">
                {initials || <UserIcon className="size-8 text-muted" />}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload photo"
            className="absolute -bottom-2 -right-2 size-8 rounded-full bg-accent-100 text-base-100 flex items-center justify-center shadow-md hover:bg-accent-200 transition-colors cursor-pointer"
          >
            <CameraIcon weight="bold" className="size-4" />
          </button>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 grow min-w-0">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Profile Photo
            </h4>
            <p className="text-xs text-muted">
              JPG, PNG, WEBP, or GIF up to 2MB. Square images look best.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-muted bg-base-100 text-foreground hover:bg-base-200 hover:border-accent-200 transition-colors cursor-pointer"
            >
              <UploadSimpleIcon weight="bold" className="size-3.5 text-accent-200" />
              <span>Choose photo</span>
            </button>

            {selectedFile && (
              <button
                type="button"
                onClick={() => handleFileChange(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-negative hover:bg-negative/10 transition-colors cursor-pointer"
              >
                <XIcon weight="bold" className="size-3.5" />
                <span>Revert photo</span>
              </button>
            )}
          </div>

          {selectedFile && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-positive/10 text-positive text-[11px] font-medium">
              <span>Selected: {selectedFile.name}</span>
              <span className="opacity-70">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
          )}

          {(validationError || error) && (
            <span className="flex items-center gap-1 text-xs text-negative">
              <WarningCircleIcon className="size-3.5 shrink-0" />
              {validationError || error}
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          id="avatarFile"
          name="avatarFile"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          aria-label="Upload profile photo"
          className="sr-only"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) handleFileChange(dropped);
        }}
        className={`hidden md:flex items-center justify-center p-3 rounded-xl border border-dashed text-xs text-muted transition-colors ${
          isDragging
            ? "border-accent-200 bg-accent-100/5 text-accent-100"
            : "border-muted/40 hover:border-muted/80"
        }`}
      >
        <span>Drag and drop a new picture here to replace current photo</span>
      </div>
    </div>
  );
};
