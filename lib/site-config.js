/**
 * Single source of truth for business details.
 * Everything here is rendered across the site (header, footer, contact,
 * structured data), so a change in this file updates the whole site.
 *
 * TODO before launch: confirm email, Instagram handle and final domain.
 */

export const siteConfig = {
  name: "alterique",
  legalName: "Alterique",
  tagline: "Expert tailoring, alterations & garment care in Walthamstow",
  description:
    "Specialists in expert tailoring, alterations and garment care. From bridal and occasion wear to everyday pieces and soft furnishings, our skilled team ensures every garment fits beautifully and lasts longer.",

  siteUrl: "https://www.alterique.co.uk", // TODO: confirm final domain

  address: {
    street: "29 Queens Rd",
    city: "London",
    postcode: "E17 8PY",
    country: "GB",
    area: "Walthamstow",
  },

  phone: {
    display: "07887 255558",
    href: "tel:+447887255558",
  },
  whatsapp: {
    display: "07887 255558",
    href: "https://wa.me/447887255558",
  },
  email: {
    display: "hello@alterique.co.uk", // TODO: confirm
    href: "mailto:hello@alterique.co.uk",
  },
  instagram: {
    handle: "@alterique", // TODO: confirm
    href: "https://www.instagram.com/alterique",
  },

  openingHours: [
    { days: "Monday – Friday", hours: "9am – 6pm" },
    { days: "Saturday", hours: "10am – 4pm" },
    { days: "Sunday", hours: "Closed" },
  ],
  /** Machine-readable hours for LocalBusiness schema */
  openingHoursSpecification: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    { days: ["Saturday"], opens: "10:00", closes: "16:00" },
  ],

  google: {
    rating: "5.0",
    reviewCount: 97,
    reviewsUrl: "https://share.google/FFXh0xr0TdYOxSvW9",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=alterique%2C+29+Queens+Rd%2C+London+E17+8PY",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=alterique%2C+29+Queens+Rd%2C+London+E17+8PY",
  },

  parking: "Pay-and-display parking is available on Queens Road and nearby side streets.", // TODO: confirm

  /** Where the quote form posts to. Set NEXT_PUBLIC_API_URL when the Render backend is live. */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
};

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.city} ${siteConfig.address.postcode}`;
