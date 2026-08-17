import { siteConfig } from "@/lib/site-config";

/** JSON-LD builders for structured data (brief §21). */

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.siteUrl}/#business`,
    name: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    telephone: "+447887255558",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postcode,
      addressCountry: siteConfig.address.country,
    },
    openingHoursSpecification: siteConfig.openingHoursSpecification.map(
      (spec) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: spec.days,
        opens: spec.opens,
        closes: spec.closes,
      })
    ),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.google.rating,
      reviewCount: siteConfig.google.reviewCount,
    },
    sameAs: [siteConfig.instagram.href],
    priceRange: "££",
  };
}

export function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    url: `${siteConfig.siteUrl}/${service.slug}`,
    areaServed: "London",
    provider: { "@id": `${siteConfig.siteUrl}/#business` },
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: `${siteConfig.siteUrl}/journal/${article.slug}`,
    author: { "@type": "Organization", name: siteConfig.legalName },
    publisher: { "@id": `${siteConfig.siteUrl}/#business` },
  };
}

/** Renders a schema object as a JSON-LD script tag (use inside server components). */
export function JsonLd({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
