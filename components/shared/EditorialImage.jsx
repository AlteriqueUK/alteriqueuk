import Image from "next/image";
import { cn } from "@/lib/utils";

const ASPECTS = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
  hero: "aspect-[4/5] md:aspect-auto",
};

const TONES = {
  linen: "bg-linen-deep text-ink/40",
  deep: "bg-[#d6d1c0] text-ink/45",
  green: "bg-ambleside text-linen/80",
  ink: "bg-ink text-linen/60",
};

/**
 * All site imagery flows through this component. When the client's photos
 * arrive, add `src` to the image object in the data files and the photo
 * replaces the placeholder — no component changes needed.
 */
export default function EditorialImage({
  image,
  alt,
  aspect = "landscape",
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}) {
  const aspectClass = ASPECTS[aspect] || aspect;

  if (image?.src) {
    return (
      <div className={cn("relative overflow-hidden", aspectClass, className)}>
        <Image
          src={image.src}
          alt={alt || image.label || ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt || image?.label || "Image placeholder"}
      className={cn(
        "relative flex items-end overflow-hidden",
        aspectClass,
        TONES[image?.tone] || TONES.linen,
        className
      )}
    >
      <span className="p-4 text-[10px] uppercase tracking-[0.3em]">
        {image?.label}
      </span>
    </div>
  );
}
