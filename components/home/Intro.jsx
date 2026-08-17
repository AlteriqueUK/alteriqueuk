import FadeIn from "@/components/shared/FadeIn";

export default function Intro() {
  return (
    <section className="border-y border-ink/10 bg-linen-deep/40">
      <div className="container-site grid gap-10 py-18 sm:py-20 lg:grid-cols-2 lg:gap-20">
        <FadeIn>
          <p className="eyebrow">About alterique</p>
          <h2 className="display mt-5 text-3xl sm:text-4xl">
            Sixty years of craft,
            <br />
            under one roof
          </h2>
          <div className="hairline mt-8" />
        </FadeIn>
        <FadeIn delay={120}>
          <div className="space-y-5 text-base font-light leading-relaxed text-ink/75">
            <p>
              alterique is a team of fine-fabric and premium-brand alteration
              specialists with over 60 years of combined experience — trusted
              by leading brands and private clients alike.
            </p>
            <p>
              From bridal and occasion wear to everyday pieces and home soft
              furnishings, we make sure every garment fits beautifully and
              lasts longer. Bespoke tailoring, precise repairs and premium dry
              cleaning, all handled with the same quiet attention to detail.
            </p>
            <p>
              We&rsquo;re committed to sustainability: extending the life of
              garments, and of the planet&rsquo;s resources.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
