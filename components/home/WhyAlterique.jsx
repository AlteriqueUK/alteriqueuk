import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/FadeIn";

const REASONS = [
  {
    num: "01",
    title: "Fine-fabric specialists",
    text: "Silk, cashmere, lace, leather — over 60 years of combined experience with the fabrics that demand the most care.",
  },
  {
    num: "02",
    title: "Trusted by brands & private clients",
    text: "Leading brands and discerning private clients trust us with premium and designer pieces every day.",
  },
  {
    num: "03",
    title: "Everything under one roof",
    text: "Alterations, bespoke tailoring, dry cleaning and interiors — one team, one consistent standard.",
  },
  {
    num: "04",
    title: "Made to last",
    text: "We extend the life of garments — better for the pieces you love, and for the planet's resources.",
  },
];

export default function WhyAlterique() {
  return (
    <section className="bg-ink text-linen">
      <div className="container-site py-18 sm:py-24">
        <SectionHeading
          eyebrow="Why alterique"
          title="The difference is in the detail"
          dark
        />
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, i) => (
            <FadeIn key={reason.num} delay={i * 80}>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-champagne">
                {reason.num}
              </p>
              <h3 className="mt-4 text-base font-normal tracking-[0.02em]">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-linen/60">
                {reason.text}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
