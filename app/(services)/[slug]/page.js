import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceIntro from "@/components/services/ServiceIntro";
import ServiceDetails from "@/components/services/ServiceDetails";
import ServiceGallery from "@/components/services/ServiceGallery";
import ServiceFaqs from "@/components/services/ServiceFaqs";
import ServiceTestimonials from "@/components/services/ServiceTestimonials";
import RelatedContent from "@/components/services/RelatedContent";
import CtaBand from "@/components/shared/CtaBand";
import { services, getService } from "@/lib/data/services";
import { serviceSchema, faqSchema, JsonLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: `/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <ServiceHero service={service} />
      <ServiceIntro service={service} />
      <ServiceDetails service={service} />
      <ServiceGallery service={service} />
      <ServiceFaqs service={service} />
      <ServiceTestimonials service={service} />
      <RelatedContent service={service} />
      <CtaBand
        title={`Let's talk about your ${service.navLabel.toLowerCase()}`}
        text="Send us photographs for a considered quote, or call in — walk-ins are always welcome."
      />
      <JsonLd schema={serviceSchema(service)} />
      {service.faqs?.length > 0 && <JsonLd schema={faqSchema(service.faqs)} />}
    </>
  );
}
