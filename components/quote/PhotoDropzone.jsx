"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const MAX_PHOTOS = 6;
export const MAX_PHOTO_MB = 8;

/**
 * Drag-and-drop photo upload with thumbnails.
 * `photos` is [{ file, url }] — object URLs are created here and must be
 * revoked by the parent (removePhoto / after submit).
 */
export default function PhotoDropzone({ photos, onAdd, onRemove }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [warning, setWarning] = useState("");

  function addFiles(list) {
    const incoming = Array.from(list).filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_PHOTO_MB * 1024 * 1024
    );
    const rejected = list.length - incoming.length;
    const room = MAX_PHOTOS - photos.length;
    setWarning(
      rejected > 0
        ? `Some files were skipped — images only, up to ${MAX_PHOTO_MB}MB each.`
        : incoming.length > room
          ? `Up to ${MAX_PHOTOS} photographs — extra files were skipped.`
          : ""
    );
    onAdd(
      incoming
        .slice(0, room)
        .map((file) => ({ file, url: URL.createObjectURL(file) }))
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Add photographs"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") &&
          (e.preventDefault(), inputRef.current?.click())
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "cursor-pointer border border-dashed border-ink/15 bg-linen-deep px-6 py-10 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambleside",
          dragActive && "border-ambleside bg-[#dcd8ca]",
          !dragActive && "hover:border-ambleside hover:bg-[#dcd8ca]"
        )}
      >
        {/* Thin plus-circle mark */}
        <span
          aria-hidden
          className="relative mx-auto mb-3.5 block size-6.5 rounded-full border border-ambleside before:absolute before:left-1/2 before:top-1/2 before:h-px before:w-2.75 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-ambleside after:absolute after:left-1/2 after:top-1/2 after:h-2.75 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-ambleside"
        />
        <p className="text-[15px]">
          Drag photographs here, or{" "}
          <u className="underline-offset-3">browse</u>
        </p>
        <p className="mt-1 text-[13px] text-ink/45">
          JPG or PNG — a few angles helps us most
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {warning && (
        <p role="status" className="mt-3 text-[13px] text-ink/55">
          {warning}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {photos.map((photo, i) => (
            <li key={photo.url} className="relative aspect-square overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt=""
                className="h-full w-full object-cover saturate-[0.92]"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Remove photograph"
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-ink/70 text-[15px] leading-none text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
