import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * Closing call-to-action used at the foot of most pages:
 * quiet ink band, quote CTA plus direct contact routes.
 */
export default function CtaBand({
  title = "Ready when you are",
  text = "Send us photographs for a considered quote, or simply call in — walk-ins are always welcome.",
}) {
  return (
    <section className="bg-ink text-linen">
      <div className="container-site py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow-dark">Get in touch</p>
          <h2 className="display mt-5 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-5 text-base font-light leading-relaxed text-linen/70">
            {text}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center bg-linen px-7 py-3.5 text-sm tracking-[0.04em] text-ink transition-opacity hover:opacity-85"
            >
              Request a quote
            </Link>
            <a
              href={siteConfig.phone.href}
              className="inline-flex items-center border border-linen/30 px-7 py-3.5 text-sm tracking-[0.04em] text-linen transition-colors hover:border-linen"
            >
              Call {siteConfig.phone.display}
            </a>
            <a
              href={siteConfig.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-linen/80 underline decoration-champagne underline-offset-4 transition-colors hover:text-linen"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
