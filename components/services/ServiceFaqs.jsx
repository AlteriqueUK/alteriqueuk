import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeading from "@/components/shared/SectionHeading";

export default function ServiceFaqs({ service }) {
  if (!service.faqs?.length) return null;
  return (
    <section className="container-site py-16 sm:py-22">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading
          eyebrow="Questions"
          title="Asked often, answered honestly"
        />
        <Accordion type="single" collapsible className="w-full">
          {service.faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`} className="border-ink/12">
              <AccordionTrigger className="py-5 text-left text-[15px] font-normal tracking-[0.01em] hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm font-light leading-relaxed text-ink/70">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
