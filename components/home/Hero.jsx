import Link from "next/link";
import EditorialImage from "@/components/shared/EditorialImage";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="container-site grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <div className="max-w-xl">
        <p className="eyebrow">Tailoring · Alterations · Garment Care</p>
        <h1 className="display mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.25rem]">
          Every garment,
          <br />
          fitted beautifully
        </h1>
        <p className="mt-7 max-w-md text-base font-light leading-relaxed text-ink/70 sm:text-lg">
          Expert alterations, tailoring and garment care in Walthamstow — from
          wedding dresses and designer pieces to the clothes you wear every
          day.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/quote"
            className="inline-flex items-center bg-ink px-7 py-3.5 text-sm tracking-[0.04em] text-linen transition-opacity hover:opacity-85"
          >
            Request a quote
          </Link>
          <a
            href={siteConfig.phone.href}
            className="inline-flex items-center border border-ink/20 px-7 py-3.5 text-sm tracking-[0.04em] text-ink transition-colors hover:border-ink"
          >
            Call us
          </a>
          <a
            href={siteConfig.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink/70 underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
          >
            WhatsApp
          </a>
        </div>
        <p className="mt-10 text-[13px] tracking-[0.04em] text-ink/60">
          <span className="text-champagne">★★★★★</span>{" "}
          {siteConfig.google.rating} — {siteConfig.google.reviewCount} Google
          reviews
        </p>
      </div>
      <EditorialImage
        image={{
          // Temporary Unsplash photograph until the client's hero shot arrives
          src: "https://images.unsplash.com/photo-1626274890657-e28d5b65b04b?q=80&w=1600&auto=format&fit=crop",
          label: "Tailor at work — hero photograph",
          tone: "deep",
        }}
        alt="Sewing machine on a wooden work table in the alterique workroom"
        aspect="portrait"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="lg:aspect-[4/5]"
      />
    </section>
  );
}
