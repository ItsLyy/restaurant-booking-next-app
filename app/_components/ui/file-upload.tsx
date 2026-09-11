"use client";

import { useRef, useState } from "react";

import {
  FileImageIcon,
  FilePdfIcon,
  FileTextIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

interface FileUploadProps {
  id: string;
  accept?: string;
  error?: boolean;
  hint?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileTypeIcon = ({ type }: { type: string }) => {
  if (type === "application/pdf") {
    return <FilePdfIcon weight="fill" className="size-6" aria-hidden="true" />;
  }
  if (type === "image/jpeg" || type === "image/png") {
    return <FileImageIcon weight="fill" className="size-6" aria-hidden="true" />;
  }
  return <FileTextIcon weight="fill" className="size-6" aria-hidden="true" />;
};

export const FileUpload = ({
  id,
  accept,
  error,
  hint = "JPG, PNG, or PDF · max 5MB",
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const commitFile = (next: File | null) => {
    setFile(next);
    if (!next && inputRef.current) {
      inputRef.current.value = "";
      return;
    }
    if (next && inputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(next);
      inputRef.current.files = transfer.files;
    }
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files?.[0] ?? null;
    if (dropped) commitFile(dropped);
  };

  let containerClassName =
    "group relative flex flex-col items-center justify-center gap-2 w-full px-4 py-10 rounded-xl border-2 border-dashed transition-colors duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-accent-200/30 focus-within:outline-0";
  if (error) {
    containerClassName += " border-negative/70 text-negative";
  } else if (dragging) {
    containerClassName += " border-accent-200 bg-accent-100/5 text-accent-100";
  } else if (file) {
    containerClassName += " border-positive/70 text-positive";
  } else {
    containerClassName +=
      " border-muted bg-base-200 text-muted hover:border-accent-200 hover:text-accent-100";
  }

  return (
    <label
      htmlFor={id}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={containerClassName}
    >
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept={accept}
        aria-label={
          file
            ? `Change upload, ${file.name} is selected`
            : "Upload a file, click or drag and drop"
        }
        aria-invalid={error ? true : undefined}
        className="sr-only"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      {file ? (
        <>
          <div className="size-12 flex items-center justify-center rounded-full bg-positive/10">
            <FileTypeIcon type={file.type} />
          </div>
          <div className="flex flex-col items-center gap-0.5 max-w-full">
            <span className="text-c-button text-foreground truncate max-w-full">
              {file.name}
            </span>
            <span className="text-c-caption text-muted">
              {formatFileSize(file.size)} · click to change
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="size-12 flex items-center justify-center rounded-full bg-muted/10">
            <UploadSimpleIcon
              weight="fill"
              className="size-6"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-c-button">
              Click to upload or drag and drop
            </span>
            <span className="text-c-caption text-muted">{hint}</span>
          </div>
        </>
      )}
      {file && (
        <button
          type="button"
          aria-label="Remove file"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            commitFile(null);
          }}
          className="absolute top-2 right-2 size-7 flex items-center justify-center rounded-full bg-base-100 border border-muted text-muted hover:text-negative cursor-pointer"
        >
          <XIcon weight="bold" className="size-4" aria-hidden="true" />
        </button>
      )}
    </label>
  );
};

export default FileUpload;