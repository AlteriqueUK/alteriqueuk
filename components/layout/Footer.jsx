import Link from "next/link";
import Wordmark from "@/components/layout/Wordmark";
import { siteConfig, fullAddress } from "@/lib/site-config";
import { services } from "@/lib/data/services";

const EXPLORE_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/journal", label: "Journal" },
  { href: "/quote", label: "Request a Quote" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-linen">
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        {/* Brand */}
        <div>
          <Wordmark className="text-linen" />
          <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-linen/60">
            Specialists in expert tailoring, alterations and garment care —
            trusted with the pieces that matter.
          </p>
          <a
            href={siteConfig.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-linen/70 underline decoration-champagne underline-offset-4 transition-colors hover:text-linen"
          >
            Instagram
          </a>
        </div>

        {/* Services */}
        <nav aria-label="Services">
          <p className="eyebrow-dark">Services</p>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/${s.slug}`}
                  className="text-sm font-light text-linen/70 transition-colors hover:text-linen"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Explore */}
        <nav aria-label="Explore">
          <p className="eyebrow-dark">Explore</p>
          <ul className="mt-5 space-y-3">
            {EXPLORE_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-light text-linen/70 transition-colors hover:text-linen"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Visit */}
        <div>
          <p className="eyebrow-dark">Visit</p>
          <address className="mt-5 text-sm font-light not-italic leading-relaxed text-linen/70">
            {fullAddress}
          </address>
          <a
            href={siteConfig.google.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-linen/70 underline decoration-champagne underline-offset-4 transition-colors hover:text-linen"
          >
            Get directions
          </a>
          <ul className="mt-5 space-y-1.5 text-sm font-light text-linen/70">
            {siteConfig.openingHours.map((row) => (
              <li key={row.days} className="flex justify-between gap-6">
                <span>{row.days}</span>
                <span>{row.hours}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-1.5 text-sm font-light">
            <a
              href={siteConfig.phone.href}
              className="block text-linen/70 transition-colors hover:text-linen"
            >
              {siteConfig.phone.display}
            </a>
            <a
              href={siteConfig.email.href}
              className="block text-linen/70 transition-colors hover:text-linen"
            >
              {siteConfig.email.display}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-linen/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-linen/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p>Committed to extending the life of garments — and the planet&rsquo;s resources.</p>
        </div>
      </div>
    </footer>
  );
}
