import Link from "next/link";
import EditorialImage from "@/components/shared/EditorialImage";
import FadeIn from "@/components/shared/FadeIn";

export default function ServiceGallery({ service }) {
  if (!service.gallery?.length) return null;
  return (
    <section className="border-y border-ink/10 bg-linen-deep/40">
      <div className="container-site py-16 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="eyebrow">In the workroom</p>
          <Link
            href="/gallery"
            className="text-sm text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
          >
            View the full gallery
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {service.gallery.map((image, i) => (
            <FadeIn key={image.label} delay={i * 80}>
              <EditorialImage
                image={image}
                alt={image.label}
                aspect="landscape"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
