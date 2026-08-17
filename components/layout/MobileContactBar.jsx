import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * Discreet fixed contact bar on mobile (brief §26): Call | WhatsApp | Quote.
 * Hidden on desktop; the layout adds matching bottom padding on mobile.
 */
export default function MobileContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-linen/15 bg-ink text-linen md:hidden">
      <a
        href={siteConfig.phone.href}
        className="py-3.5 text-center text-xs tracking-[0.12em] uppercase"
      >
        Call
      </a>
      <a
        href={siteConfig.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-x border-linen/15 py-3.5 text-center text-xs tracking-[0.12em] uppercase"
      >
        WhatsApp
      </a>
      <Link
        href="/quote"
        className="py-3.5 text-center text-xs tracking-[0.12em] uppercase text-champagne"
      >
        Quote
      </Link>
    </div>
  );
}
