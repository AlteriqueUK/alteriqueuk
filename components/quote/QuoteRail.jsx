import { siteConfig } from "@/lib/site-config";

const ASSURANCES = [
  "Handled by specialists in tailoring & garment care",
  "Your photographs are stored securely, never shared",
  "No obligation — a quote is simply a conversation",
];

/** Left brand rail of the quote page (design supplied by client-side mockup). */
export default function QuoteRail() {
  return (
    <section className="flex items-center bg-ink px-8 py-14 text-linen sm:px-12 lg:px-14 lg:py-18">
      <div className="max-w-105">
        <p className="eyebrow-dark">Alterique</p>
        <h1 className="display mt-10 text-5xl sm:text-6xl lg:text-7xl">
          Request
          <br />a quote
        </h1>
        <p className="mt-7 text-[17px] font-light leading-[1.65] text-linen/70">
          Tell us about the piece. Share a few photographs and the work it
          needs — we&rsquo;ll reply with a considered quote, usually the same
          day.
        </p>

        <ul className="mt-12 space-y-4.5">
          {ASSURANCES.map((line) => (
            <li
              key={line}
              className="flex items-start gap-3.5 text-sm leading-normal text-linen/85"
            >
              <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-champagne" />
              {line}
            </li>
          ))}
        </ul>

        <p className="mt-14 border-t border-linen/15 pt-7 text-[13px] tracking-[0.02em] text-linen/55">
          Prefer to talk?{" "}
          <a
            href={siteConfig.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-champagne pb-0.5 text-linen no-underline"
          >
            WhatsApp
          </a>{" "}
          ·{" "}
          <a
            href={siteConfig.phone.href}
            className="border-b border-champagne pb-0.5 text-linen no-underline"
          >
            Call
          </a>
        </p>
      </div>
    </section>
  );
}
