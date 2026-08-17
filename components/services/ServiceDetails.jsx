import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/FadeIn";

export default function ServiceDetails({ service }) {
  return (
    <section className="container-site py-16 sm:py-22">
      <SectionHeading eyebrow="The service" title="What we take care of" />
      <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {service.details.map((item, i) => (
          <FadeIn key={item.name} delay={(i % 3) * 80}>
            <li className="border-t border-ink/12 pt-5">
              <h3 className="text-base font-normal tracking-[0.02em]">
                {item.name}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-ink/65">
                {item.text}
              </p>
            </li>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
