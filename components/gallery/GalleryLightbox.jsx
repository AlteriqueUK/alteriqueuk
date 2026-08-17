"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import EditorialImage from "@/components/shared/EditorialImage";

export default function GalleryLightbox({ item, onClose }) {
  const label = item?.image?.label || item?.pair?.[0]?.label || "";
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-3xl border-ink/10 bg-linen p-2 sm:p-3"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{label}</DialogTitle>
        {item?.pair ? (
          <div className="grid grid-cols-2 gap-2">
            {item.pair.map((img) => (
              <div key={img.label}>
                <EditorialImage
                  image={img}
                  alt={img.label}
                  aspect="portrait"
                  sizes="50vw"
                />
                <p className="mt-2 px-1 pb-1 text-[11px] uppercase tracking-[0.2em] text-ink/50">
                  {img.label}
                </p>
              </div>
            ))}
          </div>
        ) : item ? (
          <div>
            <EditorialImage
              image={item.image}
              alt={item.image.label}
              aspect={item.aspect === "portrait" ? "portrait" : "landscape"}
              sizes="90vw"
            />
            <p className="mt-2 px-1 pb-1 text-[11px] uppercase tracking-[0.2em] text-ink/50">
              {item.image.label}
            </p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
