"use client";

import { useState } from "react";
import EditorialImage from "@/components/shared/EditorialImage";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import { galleryCategories, galleryItems } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

export default function GalleryGrid() {
  const [category, setCategory] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);

  const items =
    category === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === category);

  return (
    <div>
      {/* Category filter */}
      <div
        role="tablist"
        aria-label="Gallery categories"
        className="flex flex-wrap gap-2.5"
      >
        {galleryCategories.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={category === cat.key}
            onClick={() => setCategory(cat.key)}
            className={cn(
              "border px-5 py-2.5 text-[13px] tracking-[0.06em] transition-colors",
              category === cat.key
                ? "border-ink bg-ink text-linen"
                : "border-ink/15 text-ink/70 hover:border-ink hover:text-ink"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Editorial grid */}
      <div className="mt-10 columns-2 gap-4 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map((item, i) => {
          const label = item.image?.label || item.pair?.[0]?.label;
          return (
            <button
              key={`${item.category}-${label}`}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="group block w-full text-left"
              aria-label={`View larger: ${label}`}
            >
              {item.pair ? (
                <div className="grid grid-cols-2 gap-1">
                  {item.pair.map((img, j) => (
                    <EditorialImage
                      key={img.label}
                      image={img}
                      alt={img.label}
                      aspect="portrait"
                      sizes="(max-width: 1024px) 25vw, 16vw"
                      className="transition-opacity group-hover:opacity-90"
                    />
                  ))}
                </div>
              ) : (
                <EditorialImage
                  image={item.image}
                  alt={item.image.label}
                  aspect={item.aspect}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="transition-opacity group-hover:opacity-90"
                />
              )}
              <span className="mt-2 block text-[11px] uppercase tracking-[0.22em] text-ink/45">
                {item.pair ? "Before & After" : label}
              </span>
            </button>
          );
        })}
      </div>

      <GalleryLightbox
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
}
