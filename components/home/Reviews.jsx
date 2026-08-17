import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/FadeIn";
import { testimonials } from "@/lib/data/testimonials";
import { siteConfig } from "@/lib/site-config";

export default function Reviews() {
  return (
    <section className="container-site py-18 sm:py-24">
      <SectionHeading
        eyebrow="Reviews"
        title={`${siteConfig.google.rating} on Google`}
        lede={`${siteConfig.google.reviewCount} reviews from customers who trusted us with the pieces that matter.`}
      />
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <FadeIn key={t.name} delay={i * 100}>
            <figure className="border-l border-champagne pl-6">
              <p className="text-sm text-champagne" aria-label="Five stars">
                ★★★★★
              </p>
              <blockquote className="mt-4 text-lg font-light leading-relaxed text-ink/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-[13px] tracking-[0.06em] text-ink/55">
                {t.name} · {t.source}
              </figcaption>
            </figure>
          </FadeIn>
        ))}
      </div>
      <a
        href={siteConfig.google.reviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block text-sm text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
      >
        Read all reviews on Google
      </a>
    </section>
  );
}
