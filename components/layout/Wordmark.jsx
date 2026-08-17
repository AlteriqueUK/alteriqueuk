import { cn } from "@/lib/utils";

/**
 * Text wordmark stand-in until the client supplies the logo as SVG.
 * ("The Seasons" is Canva-licensed and can't be embedded as a webfont —
 * the final logo should be exported as an SVG and dropped in here.)
 */
export default function Wordmark({ className }) {
  return (
    <span
      className={cn(
        "font-display text-2xl lowercase tracking-[0.02em]",
        className
      )}
    >
      alterique
    </span>
  );
}
