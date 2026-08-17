/**
 * Gallery content. Image `src` values are temporary Unsplash photography
 * (free licence) until the client's own shots arrive — then swap `src` to
 * files in /public/images and EditorialImage picks them up automatically.
 *
 * `aspect`: "portrait" | "landscape" | "square" — drives the editorial layout.
 * `pair`: for Before & After items, [beforeImage, afterImage].
 */

const u = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const galleryCategories = [
  { key: "all", label: "All" },
  { key: "alterations", label: "Alterations" },
  { key: "bridal", label: "Bridal" },
  { key: "dry-cleaning", label: "Dry Cleaning" },
  { key: "interiors", label: "Curtains & Interiors" },
  { key: "workshop", label: "Workshop" },
  { key: "before-after", label: "Before & After" },
];

export const galleryItems = [
  {
    category: "bridal",
    aspect: "portrait",
    image: {
      src: u("1560463210-faa56f0bdba8"),
      label: "Wedding dress, ready for its fitting",
      tone: "linen",
    },
  },
  {
    category: "workshop",
    aspect: "landscape",
    image: {
      src: u("1770910195240-ddec777b77f6"),
      label: "The workroom",
      tone: "deep",
    },
  },
  {
    category: "alterations",
    aspect: "portrait",
    image: {
      src: u("1606501126768-b78d4569d3f9"),
      label: "At the machine",
      tone: "green",
    },
  },
  {
    category: "before-after",
    aspect: "square",
    pair: [
      {
        src: u("1585412459212-8def26f7e84c", 800),
        label: "Before — jacket awaiting work",
        tone: "deep",
      },
      {
        src: u("1594938298603-c8148c4dae35", 800),
        label: "After — fitted to size",
        tone: "linen",
      },
    ],
  },
  {
    category: "dry-cleaning",
    aspect: "portrait",
    image: {
      src: u("1603252109303-2751441dd157"),
      label: "Cleaned, pressed, hung",
      tone: "linen",
    },
  },
  {
    category: "interiors",
    aspect: "landscape",
    image: {
      src: u("1688732324812-9c67f0a35b4b"),
      label: "Sheer curtains, evenly hung",
      tone: "green",
    },
  },
  {
    category: "alterations",
    aspect: "square",
    image: {
      src: u("1542272604-787c3835535d"),
      label: "Original-hem denim work",
      tone: "ink",
    },
  },
  {
    category: "bridal",
    aspect: "landscape",
    image: {
      src: u("1660325848053-f067c31f22ca"),
      label: "Lace detail on ivory",
      tone: "linen",
    },
  },
  {
    category: "workshop",
    aspect: "portrait",
    image: {
      src: u("1578353022142-09264fd64295"),
      label: "Threads and tailor's shears",
      tone: "deep",
    },
  },
  {
    category: "before-after",
    aspect: "square",
    pair: [
      {
        src: u("1536992266094-82847e1fd431", 800),
        label: "Before — worn knitwear",
        tone: "deep",
      },
      {
        src: u("1646270968802-6bad28659329", 800),
        label: "After — cared for and folded",
        tone: "linen",
      },
    ],
  },
  {
    category: "interiors",
    aspect: "square",
    image: {
      src: u("1624351231514-aa7a3189d9cf"),
      label: "Cushions in client fabric",
      tone: "green",
    },
  },
  {
    category: "dry-cleaning",
    aspect: "landscape",
    image: {
      src: u("1517502166878-35c93a0072f0"),
      label: "Garments ready for collection",
      tone: "deep",
    },
  },
];
