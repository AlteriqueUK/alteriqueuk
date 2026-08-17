import FadeIn from "@/components/shared/FadeIn";

export default function ServiceIntro({ service }) {
  return (
    <section className="border-y border-ink/10 bg-linen-deep/40">
      <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20">
        <FadeIn>
          <div className="hairline" />
        </FadeIn>
        <FadeIn delay={100}>
          <div className="space-y-5 text-base font-light leading-relaxed text-ink/75 sm:text-lg">
            {service.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
