import Link from "next/link";
import EditorialImage from "@/components/shared/EditorialImage";
import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/FadeIn";
import { galleryItems } from "@/lib/data/gallery";

export default function GalleryPreview() {
  const featured = galleryItems.filter((item) => item.image).slice(0, 4);
  return (
    <section className="border-y border-ink/10 bg-linen-deep/40">
      <div className="container-site py-18 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Gallery" title="The work, up close" />
          <Link
            href="/gallery"
            className="text-sm text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
          >
            View the gallery
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((item, i) => (
            <FadeIn key={item.image.label} delay={i * 80}>
              <Link href="/gallery" className="group block">
                <EditorialImage
                  image={item.image}
                  alt={item.image.label}
                  aspect="portrait"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="transition-opacity group-hover:opacity-90"
                />
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
