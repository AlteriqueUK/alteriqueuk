import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig, fullAddress } from "@/lib/site-config";

export const metadata = {
  title: "Contact",
  description:
    "Visit alterique at 29 Queens Rd, Walthamstow, London E17 8PY — or reach us by phone, WhatsApp or email. Walk-ins welcome.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="container-site py-14 sm:py-16">
        <p className="eyebrow">Contact</p>
        <h1 className="display mt-6 max-w-2xl text-4xl sm:text-5xl">
          Come in, call, or write
        </h1>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink/70 sm:text-lg">
          Whichever suits you — walk-ins are always welcome, and photographs
          over WhatsApp are often enough for a quick quote.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Details */}
          <div>
            <dl className="space-y-8">
              <div>
                <dt className="eyebrow">Visit</dt>
                <dd className="mt-3 text-base font-light leading-relaxed text-ink/80">
                  <address className="not-italic">{fullAddress}</address>
                  <a
                    href={siteConfig.google.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-ambleside underline decoration-champagne underline-offset-4 hover:text-ink"
                  >
                    Get directions
                  </a>
                  <p className="mt-2 text-sm text-ink/60">{siteConfig.parking}</p>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Call or message</dt>
                <dd className="mt-3 space-y-1.5 text-base font-light text-ink/80">
                  <a href={siteConfig.phone.href} className="block hover:text-ink">
                    {siteConfig.phone.display}
                  </a>
                  <a
                    href={siteConfig.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-ambleside underline decoration-champagne underline-offset-4 hover:text-ink"
                  >
                    Message us on WhatsApp
                  </a>
                  <a href={siteConfig.email.href} className="block hover:text-ink">
                    {siteConfig.email.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Opening hours</dt>
                <dd className="mt-3">
                  <ul className="max-w-xs space-y-1.5 text-base font-light text-ink/80">
                    {siteConfig.openingHours.map((row) => (
                      <li key={row.days} className="flex justify-between gap-6">
                        <span>{row.days}</span>
                        <span className={row.hours === "Closed" ? "text-ink/45" : ""}>
                          {row.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="mt-10 aspect-[4/3] w-full overflow-hidden border border-ink/10">
              <iframe
                title="Map — alterique, 29 Queens Rd, London E17 8PY"
                src="https://maps.google.com/maps?q=alterique%2C%2029%20Queens%20Rd%2C%20London%20E17%208PY&output=embed"
                className="h-full w-full grayscale-[35%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="display text-2xl sm:text-3xl">Send a message</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-ink/65">
              For quotes with photographs, our{" "}
              <Link
                href="/quote"
                className="text-ambleside underline decoration-champagne underline-offset-4 hover:text-ink"
              >
                quote form
              </Link>{" "}
              is the quickest route.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
