import Link from "next/link";
import EditorialImage from "@/components/shared/EditorialImage";
import { siteConfig } from "@/lib/site-config";

export default function ServiceHero({ service }) {
  const { hero } = service;
  return (
    <section className="container-site grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <div className="max-w-xl">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="display mt-6 text-4xl sm:text-5xl lg:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-md text-base font-light leading-relaxed text-ink/70 sm:text-lg">
          {hero.text}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/quote"
            className="inline-flex items-center bg-ink px-7 py-3.5 text-sm tracking-[0.04em] text-linen transition-opacity hover:opacity-85"
          >
            Request a quote
          </Link>
          <a
            href={siteConfig.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-ink/20 px-7 py-3.5 text-sm tracking-[0.04em] text-ink transition-colors hover:border-ink"
          >
            WhatsApp us
          </a>
        </div>
      </div>
      <EditorialImage
        image={hero.image}
        alt={hero.image.label}
        aspect="portrait"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="lg:aspect-[4/5]"
      />
    </section>
  );
}
