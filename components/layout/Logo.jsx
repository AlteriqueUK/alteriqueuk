import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The client's wordmark, used in the header.
 *
 * The supplied artwork (`logo for header.png`) is a 768px square that is
 * mostly empty space, so it is trimmed to the wordmark itself in
 * `logo-header.png` — that way its height can be set directly and it lines up
 * with everything else on the bar.
 *
 * It is black artwork: it belongs on the linen background. The footer sits on
 * ink and keeps <Wordmark /> in linen instead.
 *
 * `alt` is empty by default because the header logo sits inside a link that
 * already announces itself; pass an alt where the image has to carry the name
 * on its own, as in the mobile menu heading.
 */
export default function Logo({ className, alt = "" }) {
  return (
    <Image
      src="/images/logo-header.png"
      alt={alt}
      width={409}
      height={125}
      priority
      className={cn("h-7 w-auto", className)}
    />
  );
}
