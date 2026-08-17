import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/FadeIn";
import { siteConfig, fullAddress } from "@/lib/site-config";

export default function LocationHours() {
  return (
    <section className="border-t border-ink/10 bg-linen-deep/40">
      <div className="container-site grid gap-12 py-18 sm:py-24 lg:grid-cols-2">
        <FadeIn>
          <SectionHeading
            eyebrow="Visit us"
            title="On Queens Road, Walthamstow"
            lede="Walk-ins are always welcome — bring the garment in and we'll advise on the spot."
          />
          <address className="mt-8 text-base font-light not-italic leading-relaxed text-ink/75">
            {fullAddress}
          </address>
          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            <a
              href={siteConfig.google.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
            >
              Get directions
            </a>
            <a
              href={siteConfig.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
            >
              View on Google Maps
            </a>
          </div>
          <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-ink/60">
            {siteConfig.parking}
          </p>
        </FadeIn>
        <FadeIn delay={120}>
          <div className="border border-ink/10 bg-linen p-8 sm:p-10">
            <p className="eyebrow">Opening hours</p>
            <ul className="mt-6 divide-y divide-ink/8">
              {siteConfig.openingHours.map((row) => (
                <li
                  key={row.days}
                  className="flex items-baseline justify-between gap-6 py-3.5 text-[15px] font-light"
                >
                  <span className="text-ink/80">{row.days}</span>
                  <span className={row.hours === "Closed" ? "text-ink/45" : "text-ink"}>
                    {row.hours}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={siteConfig.phone.href}
                className="inline-flex items-center bg-ink px-6 py-3 text-sm tracking-[0.04em] text-linen transition-opacity hover:opacity-85"
              >
                {siteConfig.phone.display}
              </a>
              <a
                href={siteConfig.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-ink/20 px-6 py-3 text-sm tracking-[0.04em] text-ink transition-colors hover:border-ink"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
