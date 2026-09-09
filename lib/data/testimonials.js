/**
 * Real reviews from the Google Business Profile, quoted verbatim.
 *
 * `featured`: appears in the homepage review slider (keep it to four or five —
 *   the slider shows one at a time and cycles through them).
 * `services`: which service pages the quote should also appear on.
 *
 * When a new review is worth showing, copy it here word for word and mark it
 * featured; drop `featured` from an older one to keep the slider short.
 */

export const testimonials = [
  {
    quote:
      "I couldn’t recommend Alterique enough. Shaz and the team are incredibly efficient and friendly, and Shaz’s attention to detail is second to none. The suit I had tailored was fitted to perfection, and the pricing was also very reasonable.",
    name: "Aaron Nuhi",
    source: "Google review",
    featured: true,
    services: ["alterations", "dry-cleaning"],
  },
  {
    quote:
      "Great experience at Alterique! Had to have a bridesmaid dress altered last minute, staff were so friendly and kind. Dress was altered very quickly and looks amazing! Thank you!",
    name: "Riani Wells",
    source: "Google review",
    featured: true,
    services: ["bridal", "alterations"],
  },
  {
    quote:
      "Quick service, very professional and very good at what they do. I came in with an idea about how I want my dress to be modified and I was listened to and we came to a mutual conclusion on something that would look better. Really recommend!",
    name: "Dana Alexandra",
    source: "Google review",
    featured: true,
    services: ["alterations", "bridal"],
  },
  {
    quote:
      "Amazing service! Customer service is exceptional, huge thanks especially to Sephora for accommodating my requests at short notice!",
    name: "Marwa A",
    source: "Google review",
    featured: true,
    services: ["alterations", "bridal", "dry-cleaning"],
  },
  {
    quote: "I had a suit jacket fitted to size, would strongly recommend.",
    name: "Graeme Irvine",
    source: "Google review",
    featured: true,
    services: ["alterations", "bridal", "dry-cleaning"],
  },
  {
    quote:
      "Two fabulous pieces of work from this place. Firstly, they repaired a beautifully old pleated skirt inherited from my mother but full of moth holes - beautifully done and now wareable. Secondly they took in 3 pairs of tailored trousers and a skirt which are now a great fit. Really great work - carefull and professional.",
    name: "Graham Smith",
    source: "Google review",
    services: ["alterations", "dry-cleaning"],
  },
  {
    quote: "Great service, friendly staff and reasonable prices.",
    name: "Patrick",
    source: "Google review",
    services: ["alterations", "dry-cleaning", "curtains", "soft-furnishings"],
  },
];

/** The four or five shown in the homepage slider. */
export const featuredTestimonials = testimonials.filter((t) => t.featured);

export function getTestimonialsByService(slug) {
  return testimonials.filter((t) => t.services.includes(slug));
}
