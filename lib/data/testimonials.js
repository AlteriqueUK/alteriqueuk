/**
 * Hand-picked testimonials. The first two are real quotes from the Google
 * Business Profile; add more as the client selects favourites.
 * `services`: which service pages the quote should appear on.
 */

export const testimonials = [
  {
    quote: "Great service, friendly staff and reasonable prices.",
    name: "Patrick",
    source: "Google review",
    services: ["alterations", "dry-cleaning", "curtains", "soft-furnishings"],
  },
  {
    quote: "I had a suit jacket fitted to size, would strongly recommend.",
    name: "Graeme Irvine",
    source: "Google review",
    services: ["alterations", "bridal", "dry-cleaning"],
  },
];

export function getTestimonialsByService(slug) {
  return testimonials.filter((t) => t.services.includes(slug));
}
