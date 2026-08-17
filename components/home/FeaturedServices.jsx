import Link from "next/link";
import EditorialImage from "@/components/shared/EditorialImage";
import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/FadeIn";
import { services } from "@/lib/data/services";

export default function FeaturedServices() {
  return (
    <section className="container-site py-18 sm:py-24">
      <SectionHeading
        eyebrow="What we do"
        title="Services"
        lede="Five disciplines, one standard of care."
      />
      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <FadeIn key={service.slug} delay={i * 80}>
            <Link href={`/${service.slug}`} className="group block">
              <EditorialImage
                image={service.hero.image}
                alt={service.title}
                aspect="portrait"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="transition-opacity group-hover:opacity-90"
              />
              <h3 className="mt-6 text-lg font-normal tracking-[0.02em]">
                {service.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-ink/65">
                {service.hero.text}
              </p>
              <span className="mt-4 inline-block text-[13px] tracking-[0.08em] text-ambleside underline decoration-champagne underline-offset-4 group-hover:text-ink">
                Discover
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
