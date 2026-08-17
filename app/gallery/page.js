import GalleryGrid from "@/components/gallery/GalleryGrid";
import CtaBand from "@/components/shared/CtaBand";

export const metadata = {
  title: "Gallery",
  description:
    "A closer look at the work — alterations, bridal fittings, dry cleaning, curtains and before-and-after transformations from the alterique workroom.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <section className="container-site py-14 sm:py-16">
        <p className="eyebrow">Gallery</p>
        <h1 className="display mt-6 max-w-2xl text-4xl sm:text-5xl">
          The work, up close
        </h1>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink/70 sm:text-lg">
          Fittings, finishes and transformations from the workroom — the
          detail that photographs can show, and the care that it implies.
        </p>
        <div className="mt-12">
          <GalleryGrid />
        </div>
      </section>
      <CtaBand
        title="Have something that needs this kind of care?"
        text="Send us photographs for a considered quote — or bring the piece in and we'll look at it together."
      />
    </>
  );
}
