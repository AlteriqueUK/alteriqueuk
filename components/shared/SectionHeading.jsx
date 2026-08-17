import { cn } from "@/lib/utils";

/**
 * Standard section opener: eyebrow label, display heading, optional lede.
 * `dark` flips the palette for sections on an ink background.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  dark = false,
  align = "left",
  className,
}) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "display mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-linen" : "text-ink"
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 text-base font-light leading-relaxed sm:text-lg",
            dark ? "text-linen/70" : "text-ink/70"
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
