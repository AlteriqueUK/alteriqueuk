import { getTestimonialsByService } from "@/lib/data/testimonials";
import { siteConfig } from "@/lib/site-config";

export default function ServiceTestimonials({ service }) {
  const quotes = getTestimonialsByService(service.slug);
  if (!quotes.length) return null;
  return (
    <section className="border-y border-ink/10 bg-linen-deep/40">
      <div className="container-site py-16 sm:py-20">
        <p className="eyebrow">What customers say</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {quotes.map((t) => (
            <figure key={t.name} className="border-l border-champagne pl-6">
              <blockquote className="text-lg font-light leading-relaxed text-ink/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[13px] tracking-[0.06em] text-ink/55">
                {t.name} · {t.source}
              </figcaption>
            </figure>
          ))}
        </div>
        <a
          href={siteConfig.google.reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
        >
          Read all reviews on Google
        </a>
      </div>
    </section>
  );
}
