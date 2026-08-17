/**
 * Service page content. Each entry drives one page at /(services)/[slug]
 * via the shared service page template.
 *
 * `image` fields: when the client's photography arrives, drop files into
 * /public/images and set `src` (e.g. "/images/bridal-hero.jpg"). Until then
 * the EditorialImage component renders an art-directed placeholder using
 * `label` + `tone` ("linen" | "deep" | "green" | "ink").
 *
 * Current `src` values are temporary Unsplash imagery (free licence) so the
 * client can review the design with real photography.
 */

const u = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const services = [
  {
    slug: "alterations",
    navLabel: "Alterations",
    title: "Clothing Alterations",
    metaTitle: "Clothing Alterations in Walthamstow, London | alterique",
    metaDescription:
      "Expert clothing alterations in Walthamstow, East London. Trousers, jackets, dresses, denim and fine fabrics — altered with precision by specialists with over 60 years of combined experience.",
    hero: {
      eyebrow: "Alterations",
      title: "Made to fit you, precisely",
      text: "From a simple trouser hem to reshaping a tailored jacket, every alteration is measured, pinned and finished by hand with the care your clothes deserve.",
      image: {
        src: u("1533758488827-1ed0f9b03899", 1600),
        label: "Tailor pinning a jacket sleeve",
        tone: "deep",
      },
    },
    intro: [
      "A garment that fits properly changes how you feel in it. Our alterations team works across everyday clothing, tailoring and fine fabrics, adjusting each piece so it sits naturally on you — not almost right, exactly right.",
      "With over 60 years of combined experience, we handle premium and designer pieces every day, and treat every garment that comes through the door with the same attention.",
    ],
    details: [
      {
        name: "Trouser shortening & lengthening",
        text: "Machine-finished, hand-finished or original hems, matched to the garment's construction.",
      },
      {
        name: "Waist adjustments",
        text: "Taking in or letting out waistbands on trousers, skirts and jeans while keeping the line clean.",
      },
      {
        name: "Jacket alterations",
        text: "Sleeve length, body shaping, shoulder adjustments and re-lining on blazers, suits and coats.",
      },
      {
        name: "Dress alterations",
        text: "Hems, straps, bodice shaping and resizing on occasion wear, workwear and everyday dresses.",
      },
      {
        name: "Denim alterations",
        text: "Original-hem shortening, tapering and waist work that preserves the character of your jeans.",
      },
      {
        name: "Zip replacements & repairs",
        text: "Zips, buttons, seams and invisible mending — small repairs that extend a garment's life.",
      },
      {
        name: "Leather & specialist fabrics",
        text: "Careful work on leather, suede, silk, cashmere and other fabrics that demand experience.",
      },
    ],
    gallery: [
      {
        src: u("1641320197434-6ae0ca235048"),
        label: "Hand-stitched hem detail",
        tone: "linen",
      },
      {
        src: u("1585412459212-8def26f7e84c"),
        label: "Suit jacket, pressed and finished",
        tone: "deep",
      },
      {
        src: u("1497997092403-f091fcf5b6c4"),
        label: "Precision work on dark wool",
        tone: "green",
      },
    ],
    faqs: [
      {
        q: "How long do alterations take?",
        a: "Most standard alterations are ready within 3–5 days. Simple jobs such as trouser shortening can often be turned around faster, and we offer an express service where possible — just ask when you visit.",
      },
      {
        q: "Do I need an appointment?",
        a: "No — walk-ins are welcome during opening hours. For fittings on tailored or occasion wear we recommend allowing a little extra time so we can pin the garment on you properly.",
      },
      {
        q: "Can you alter designer and premium garments?",
        a: "Yes. Fine fabrics and premium brands are our specialism. We regularly work on designer tailoring, silk, cashmere and delicate construction, and we will always advise honestly if we feel an alteration could compromise a garment.",
      },
      {
        q: "How much do alterations cost?",
        a: "Pricing depends on the garment and the work required. Send us photos through our quote form, or bring the piece in, and we'll give you a clear price before any work begins.",
      },
    ],
    relatedServices: ["dry-cleaning", "bridal"],
    relatedJournal: ["how-trouser-shortening-works", "can-leather-jackets-be-altered"],
  },
  {
    slug: "dry-cleaning",
    navLabel: "Dry Cleaning",
    title: "Dry Cleaning",
    metaTitle: "Premium Dry Cleaning in Walthamstow, London | alterique",
    metaDescription:
      "Premium dry cleaning and garment care in Walthamstow. Suits, dresses, silk, cashmere and delicate fabrics cleaned, pressed and finished to an exceptional standard.",
    hero: {
      eyebrow: "Dry Cleaning",
      title: "Garment care, taken seriously",
      text: "Cleaning, pressing and finishing for everything from everyday suits to the most delicate silk — handled by people who understand fabric.",
      image: {
        src: u("1561053720-76cd73ff22c3", 1600),
        label: "Pressed shirts on wooden hangers",
        tone: "linen",
      },
    },
    intro: [
      "Good dry cleaning is invisible: colours stay true, fabric keeps its hand, and a suit comes back sharper than it went in. We treat garment care as an extension of tailoring — every piece is inspected, treated and finished individually.",
      "Delicate and premium fabrics are our specialism, and we're trusted with pieces their owners genuinely care about.",
    ],
    details: [
      {
        name: "Suits & tailoring",
        text: "Careful cleaning and hand-finishing that preserves structure, canvas and shape.",
      },
      {
        name: "Dresses & occasion wear",
        text: "From everyday dresses to beaded and embellished eveningwear.",
      },
      {
        name: "Silk, cashmere & fine knitwear",
        text: "Gentle, fabric-appropriate processes for the pieces that need the most care.",
      },
      {
        name: "Coats & outerwear",
        text: "Seasonal cleaning that keeps wool, down and technical outerwear at their best.",
      },
      {
        name: "Shirt service",
        text: "Cleaned and crisply pressed shirts, ready on hangers.",
      },
      {
        name: "Stain treatment",
        text: "Considered, fabric-safe treatment of marks and stains — with honest advice on what's possible.",
      },
    ],
    gallery: [
      {
        src: u("1518168334734-591c8bfc5445"),
        label: "Steam finishing",
        tone: "deep",
      },
      {
        src: u("1606259458027-54d2a728b6ab"),
        label: "Silk, handled gently",
        tone: "linen",
      },
      {
        src: u("1604506847073-4a8e18e07d92"),
        label: "Ready for collection",
        tone: "green",
      },
    ],
    faqs: [
      {
        q: "How often should I dry clean a suit?",
        a: "Less often than most people think — typically every 4–6 wears, or when it's visibly soiled or has lost its shape. Over-cleaning wears fabric prematurely. Between cleans, brushing and proper hanging do most of the work.",
      },
      {
        q: "Can you clean delicate fabrics like silk and cashmere?",
        a: "Yes — fine fabrics are our specialism. Each piece is assessed individually and cleaned with a process appropriate to the fibre, construction and any embellishment.",
      },
      {
        q: "How quickly can my dry cleaning be ready?",
        a: "Standard turnaround is 2–3 days. If you need something sooner, tell us when you drop it off and we'll do our best to accommodate an express turnaround.",
      },
      {
        q: "Can you remove any stain?",
        a: "We'll always be honest: some stains can be removed completely, some can be significantly improved, and a few are permanent. We assess each garment before treatment and tell you what to expect.",
      },
    ],
    relatedServices: ["alterations", "curtains"],
    relatedJournal: ["how-often-dry-clean-suit", "cashmere-care-guide"],
  },
  {
    slug: "bridal",
    navLabel: "Bridal",
    title: "Bridal Alterations",
    metaTitle: "Wedding Dress & Bridal Alterations in London | alterique",
    metaDescription:
      "Specialist wedding dress and bridal alterations in Walthamstow, London. Fittings, bodice shaping, hems and bustles — handled with the care your dress deserves.",
    hero: {
      eyebrow: "Bridal",
      title: "Your dress, perfected",
      text: "Wedding dress alterations are a craft of their own. We fit, shape and finish bridal and occasion wear so it moves with you on the day — beautifully.",
      image: {
        src: u("1521467752200-3bccf80f16ed", 1600),
        label: "Ivory lace wedding gown",
        tone: "linen",
      },
    },
    intro: [
      "Few garments matter more than a wedding dress, and few are more complex to alter — layered skirts, boned bodices, delicate lace and fabrics that show every stitch. This is work we love and take seriously.",
      "We recommend starting alterations 6–8 weeks before the day, with a fitting schedule built around you. Bridesmaids, mothers of the bride and occasion wear are equally welcome.",
    ],
    details: [
      {
        name: "Fittings",
        text: "Unhurried, private fittings where your dress is pinned on you, in your wedding shoes.",
      },
      {
        name: "Bodice shaping",
        text: "Taking in or letting out structured, boned and corseted bodices without disturbing the line.",
      },
      {
        name: "Hems on layered skirts",
        text: "Multi-layer hems on tulle, chiffon, satin and lace, levelled precisely to your shoes.",
      },
      {
        name: "Bustles",
        text: "French, American or bespoke bustles so your train lifts elegantly for the evening.",
      },
      {
        name: "Straps, sleeves & necklines",
        text: "Adjustments and additions that keep you comfortable and secure all day.",
      },
      {
        name: "Post-wedding cleaning",
        text: "Careful cleaning after the day, so your dress is preserved as beautifully as it was worn.",
      },
    ],
    gallery: [
      {
        src: u("1706741921229-b3d2e431daab"),
        label: "Beaded bodice detail",
        tone: "deep",
      },
      {
        src: u("1525169087805-031a4da0623c"),
        label: "Lace, up close",
        tone: "linen",
      },
      {
        src: u("1591221662157-6f62de5508eb"),
        label: "Floral lace gown",
        tone: "green",
      },
    ],
    faqs: [
      {
        q: "When should I book wedding dress alterations?",
        a: "Ideally 6–8 weeks before your wedding, with the final fitting 1–2 weeks before the day. If your date is closer than that, contact us — we can often accommodate shorter timelines.",
      },
      {
        q: "How many fittings will I need?",
        a: "Most brides need two to three fittings: an initial pinning, a check fitting once the work is done, and a final try-on close to the day. Complex reshaping may need one more.",
      },
      {
        q: "What should I bring to a fitting?",
        a: "Your wedding shoes and the underwear or shapewear you'll wear on the day — both change how the dress sits, so we fit around them.",
      },
      {
        q: "Can you alter heavily beaded or lace dresses?",
        a: "Yes. Beading, appliqué and lace require the seams to be carefully unpicked, altered and rebuilt so the work is invisible. It's precisely the kind of detail-heavy work our team specialises in.",
      },
    ],
    relatedServices: ["alterations", "dry-cleaning"],
    relatedJournal: ["wedding-dress-alterations-timeline", "silk-care-guide"],
  },
  {
    slug: "curtains",
    navLabel: "Curtains",
    title: "Curtains",
    metaTitle: "Curtain Alterations, Cleaning & Made to Measure | alterique",
    metaDescription:
      "Curtain alterations, curtain cleaning and made-to-measure curtains in Walthamstow, London. Precise work on interlined, pleated and delicate window treatments.",
    hero: {
      eyebrow: "Interiors — Curtains",
      title: "Beautifully dressed windows",
      text: "Shortening, relining, cleaning and made-to-measure — the same precision we bring to clothing, applied to your home.",
      image: {
        src: u("1578500467296-441a11d5d55a", 1600),
        label: "Full-length linen curtains in soft light",
        tone: "green",
      },
    },
    intro: [
      "Curtains are tailoring at architectural scale: long seams, heavy interlinings and pleats that must hang perfectly straight. We alter, remake and clean curtains of every construction, from simple panels to interlined, hand-pleated drapes.",
      "Moving house and the curtains don't fit? Inherited beautiful fabric that needs new life? This is exactly what we do.",
    ],
    details: [
      {
        name: "Curtain shortening & resizing",
        text: "Length and width adjustments that keep hems level and pleats even.",
      },
      {
        name: "Relining & interlining",
        text: "New linings, blackout linings and thermal interlinings to refresh or upgrade existing curtains.",
      },
      {
        name: "Heading changes",
        text: "Converting between pencil pleat, eyelet, pinch pleat and wave headings.",
      },
      {
        name: "Curtain cleaning",
        text: "Careful cleaning appropriate to the fabric, lining and construction — colours kept true, sizing preserved.",
      },
      {
        name: "Made to measure",
        text: "New curtains made to your measurements in your chosen fabric, finished by hand.",
      },
      {
        name: "Repairs",
        text: "Sun-damaged linings, failed stitching, tape and hook replacement.",
      },
    ],
    gallery: [
      {
        src: u("1539208175673-6b9149754096"),
        label: "Full drapes, evenly pleated",
        tone: "deep",
      },
      {
        src: u("1688732324812-9c67f0a35b4b"),
        label: "Sheers at the window",
        tone: "linen",
      },
      {
        src: u("1682421938316-4b186e25174c"),
        label: "Soft light through linen",
        tone: "green",
      },
    ],
    faqs: [
      {
        q: "Can you shorten ready-made curtains?",
        a: "Yes — shortening ready-made curtains to fit your windows is one of our most common jobs, and far more economical than replacing them. We keep hems level and pleats sitting correctly.",
      },
      {
        q: "Do you clean interlined curtains?",
        a: "Yes. Interlined and lined curtains need a careful, fabric-appropriate process to avoid shrinkage and puckering. We assess construction before cleaning and advise on the best approach.",
      },
      {
        q: "Do you offer made-to-measure curtains?",
        a: "We do. Bring your measurements — or the details of your windows — and your chosen fabric, and we'll make curtains finished to a standard you won't find on the high street.",
      },
      {
        q: "Can you alter curtains for a house move?",
        a: "Absolutely. We regularly resize curtains for new windows — shortening, narrowing, joining or remaking them so good fabric moves home with you.",
      },
    ],
    relatedServices: ["soft-furnishings", "dry-cleaning"],
    relatedJournal: ["curtain-cleaning-guide"],
  },
  {
    slug: "soft-furnishings",
    navLabel: "Soft Furnishings",
    title: "Soft Furnishings",
    metaTitle: "Soft Furnishings — Cushions, Covers & Blinds | alterique",
    metaDescription:
      "Soft furnishing services in Walthamstow, London: cushion covers, seat cushions, blinds, throws and home textiles made, altered and cleaned with care.",
    hero: {
      eyebrow: "Interiors — Soft Furnishings",
      title: "The details that make a home",
      text: "Cushions, covers, blinds and home textiles — made, altered and cared for with a tailor's eye.",
      image: {
        src: u("1512880366380-a8446f4321e1", 1600),
        label: "Cushions in natural fabrics",
        tone: "deep",
      },
    },
    intro: [
      "The textiles in a room do quiet work: they soften light, add texture and pull a space together. We make and care for soft furnishings with the same precision we bring to clothing — clean seams, sharp corners, invisible closures.",
      "From a single cushion cover in a treasured fabric to a full set of blinds, no job is too small to be done properly.",
    ],
    details: [
      {
        name: "Cushion covers",
        text: "Made to measure in your fabric, with piped, zipped or envelope closures.",
      },
      {
        name: "Seat & bench cushions",
        text: "Box cushions and window-seat pads, shaped and filled to fit.",
      },
      {
        name: "Roman blinds",
        text: "Made to measure and altered, lined or blackout.",
      },
      {
        name: "Throws & bed textiles",
        text: "Bedspreads, valances and runners, made or resized.",
      },
      {
        name: "Cleaning & repair",
        text: "Careful cleaning and repair of covers, cushions and home textiles.",
      },
    ],
    gallery: [
      {
        src: u("1573736860558-79527a353222"),
        label: "Cushion covers, crisply finished",
        tone: "linen",
      },
      {
        src: u("1649185885618-4bda573fc4b4"),
        label: "Soft textures at home",
        tone: "green",
      },
      {
        src: u("1594734415578-00fc9540929b"),
        label: "Natural linen textiles",
        tone: "deep",
      },
    ],
    faqs: [
      {
        q: "Can you make cushion covers from my own fabric?",
        a: "Yes — bring your fabric and the cushion pads (or their measurements) and we'll make covers to fit exactly, with your choice of closure and finish.",
      },
      {
        q: "Do you make Roman blinds to measure?",
        a: "We do, in your chosen fabric with standard or blackout lining. We can also alter existing blinds to fit new windows.",
      },
      {
        q: "Can old or delicate home textiles be repaired?",
        a: "Often, yes. Treasured quilts, embroidered cloths and older textiles can usually be stabilised and repaired sympathetically — we'll assess the piece and advise honestly.",
      },
    ],
    relatedServices: ["curtains", "dry-cleaning"],
    relatedJournal: ["curtain-cleaning-guide", "fabric-care-symbols-explained"],
  },
];

export function getService(slug) {
  return services.find((s) => s.slug === slug);
}

/** Nav grouping: Curtains + Soft Furnishings sit under "Interiors" */
export const interiorSlugs = ["curtains", "soft-furnishings"];
export const mainServices = services.filter((s) => !interiorSlugs.includes(s.slug));
export const interiorServices = services.filter((s) => interiorSlugs.includes(s.slug));
