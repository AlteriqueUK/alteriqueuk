/**
 * Journal (editorial knowledge centre) content.
 * Each article renders at /journal/[slug] and cross-links with a service page.
 * Placeholder copy — to be reviewed/replaced by the client before launch.
 * Image `src` values are temporary Unsplash photography (free licence).
 */

const u = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const journal = [
  {
    slug: "how-often-dry-clean-suit",
    title: "How often should you dry clean a suit?",
    excerpt:
      "Less often than you think. Over-cleaning is one of the fastest ways to age good tailoring — here's the rhythm we recommend instead.",
    category: "Garment Care",
    date: "2026-07-14",
    readTime: "4 min read",
    image: {
      src: u("1549037173-e3b717902c57"),
      label: "Suit jackets on the rail",
      tone: "deep",
    },
    relatedService: "dry-cleaning",
    body: [
      {
        heading: "The short answer",
        paragraphs: [
          "For a suit in regular rotation, every four to six wears is a sensible rhythm — or sooner if it's visibly marked, has absorbed odours, or has lost its press. A suit worn occasionally may only need cleaning two or three times a year.",
          "Dry cleaning is gentle compared to washing, but it is still a chemical and mechanical process. Every unnecessary clean removes a little life from the cloth, so the goal is to clean when the suit needs it, not on a fixed schedule.",
        ],
      },
      {
        heading: "What to do between cleans",
        paragraphs: [
          "Most of what keeps a suit looking sharp happens at home. Brush it after wearing with a natural-bristle clothes brush to lift dust and dry soil from the fibres. Hang it on a proper shaped hanger and give it a day's rest between wears so the wool can recover.",
          "Steam — from a hand steamer or simply hanging the suit in a steamy bathroom — relaxes creases and refreshes the fabric without any cleaning at all.",
        ],
      },
      {
        heading: "When to bring it in",
        paragraphs: [
          "Bring your suit to us when there's a visible stain, when the trousers have bagged at the knee, when the lapel roll has flattened, or before a long spell in the wardrobe — moths are drawn to worn, unwashed cloth.",
          "Our finishing is done by hand, so structure, canvas and shape are preserved. If you're unsure whether a suit needs cleaning or just pressing, ask — we'll tell you honestly.",
        ],
      },
    ],
  },
  {
    slug: "wedding-dress-alterations-timeline",
    title: "Wedding dress alterations: the timeline that works",
    excerpt:
      "When to book, how many fittings to expect, and what to bring — a calm, realistic schedule for the months before your day.",
    category: "Bridal",
    date: "2026-06-30",
    readTime: "5 min read",
    image: {
      src: u("1644292204200-627c50d4557a"),
      label: "Wedding dress hanging in soft light",
      tone: "linen",
    },
    relatedService: "bridal",
    body: [
      {
        heading: "Eight weeks out: the first fitting",
        paragraphs: [
          "Six to eight weeks before the wedding is the sweet spot for a first fitting. Your weight is unlikely to change dramatically, but there's comfortable time for even complex work — bodice reshaping, multi-layer hems, a bustle.",
          "Bring your wedding shoes and the underwear or shapewear you'll wear on the day. Both change how the dress sits, and we pin everything around them.",
        ],
      },
      {
        heading: "The middle fitting",
        paragraphs: [
          "Two to three weeks later, you'll try the dress with the main alterations complete. This is where we refine: a hem levelled by a few millimetres, a strap eased, the bustle tested so someone in your party can learn to hook it.",
        ],
      },
      {
        heading: "The final fitting",
        paragraphs: [
          "One to two weeks before the day, the dress should fit perfectly and need nothing. You collect it pressed, bagged and ready. We schedule this close to the wedding deliberately, so the fit reflects you on the day itself.",
          "If your timeline is shorter than any of this, don't panic — contact us. Rush bridal work is something we handle regularly; the earlier we see the dress, the more we can do.",
        ],
      },
    ],
  },
  {
    slug: "how-trouser-shortening-works",
    title: "How trouser shortening actually works",
    excerpt:
      "Machine hem, hand-finished, or original hem? What the choices mean and why the right one depends on the trouser.",
    category: "Alterations",
    date: "2026-06-12",
    readTime: "4 min read",
    image: {
      src: u("1593032465175-481ac7f401a0"),
      label: "Tailored trousers, correctly broken",
      tone: "green",
    },
    relatedService: "alterations",
    body: [
      {
        heading: "First, the measurement",
        paragraphs: [
          "Good trouser length starts on the body, not the table. We pin your trousers while you're wearing them, with the shoes you'll actually wear, because a half-inch changes how the trouser breaks over the shoe.",
        ],
      },
      {
        heading: "The three finishes",
        paragraphs: [
          "A machine hem is the standard finish for casual trousers and chinos — clean, durable and quick. A hand-finished (blind-stitched) hem is invisible from the outside and is what tailored trousers deserve. An original hem, used mostly on jeans, re-attaches the factory hem so the authentic stitching and wash line are preserved.",
          "Turn-ups, tapering and lengthening (where the cloth allows) are all part of the same conversation — tell us the look you want and we'll advise what the garment can do.",
        ],
      },
      {
        heading: "What it costs and how long it takes",
        paragraphs: [
          "Trouser shortening is usually same-week, often faster. Pricing depends on the finish and fabric — send a photo through our quote form or drop in and we'll confirm on the spot.",
        ],
      },
    ],
  },
  {
    slug: "cashmere-care-guide",
    title: "The cashmere care guide",
    excerpt:
      "Cashmere rewards gentle habits. How to wash, dry, store and de-pill the softest thing you own.",
    category: "Garment Care",
    date: "2026-05-20",
    readTime: "5 min read",
    image: {
      src: u("1760013531865-89ff324f83a6"),
      label: "Folded cashmere knitwear",
      tone: "linen",
    },
    relatedService: "dry-cleaning",
    body: [
      {
        heading: "Washing",
        paragraphs: [
          "Despite its reputation, cashmere doesn't need constant professional cleaning — but it does need gentleness. Hand-wash in cool water with a specialist wool wash, supporting the garment's weight, and never wring. For structured or embellished pieces, or anything you'd hate to risk, bring it to us.",
        ],
      },
      {
        heading: "Drying and storing",
        paragraphs: [
          "Dry flat on a towel, reshaped by hand, away from direct heat. Never hang wet knitwear — it will grow. Store folded, clean, and ideally with cedar; moths prefer cashmere above almost everything else in your wardrobe.",
        ],
      },
      {
        heading: "Pilling and repairs",
        paragraphs: [
          "Pilling is normal — it's the short fibres working loose — and a cashmere comb removes it safely. Small holes caught early are very repairable: our invisible mending rebuilds the knit rather than patching over it, which is exactly the kind of quiet work we love.",
        ],
      },
    ],
  },
  {
    slug: "silk-care-guide",
    title: "The silk care guide",
    excerpt:
      "Silk is stronger than it looks and fussier than it admits. What to do — and what never to do — with your finest fabric.",
    category: "Garment Care",
    date: "2026-05-02",
    readTime: "4 min read",
    image: {
      src: u("1618434958571-459c9c972ae8"),
      label: "Silk fabric detail",
      tone: "linen",
    },
    relatedService: "bridal",
    body: [
      {
        heading: "The golden rules",
        paragraphs: [
          "Never rub a stain on silk — blot it, and get the piece to a professional quickly. Water can mark silk permanently, perfume and deodorant should always go on before the garment, and direct sunlight will fade dyed silk faster than almost any other fibre.",
        ],
      },
      {
        heading: "Cleaning",
        paragraphs: [
          "Some plain silks tolerate careful cool hand-washing, but structured, lined, pleated or printed silk should be professionally cleaned. The risk isn't just shrinkage — it's water marks, dye movement and lost lustre that can't be recovered.",
        ],
      },
      {
        heading: "Pressing and storage",
        paragraphs: [
          "Silk should be pressed on the reverse, at low temperature, ideally slightly damp through a cloth. Store it hanging on padded hangers or folded with acid-free tissue — and always clean silk before long storage, because invisible marks yellow with time.",
        ],
      },
    ],
  },
  {
    slug: "curtain-cleaning-guide",
    title: "The curtain cleaning guide",
    excerpt:
      "Curtains hold more dust than anything else in the room. When to clean them, how — and why lined curtains need special care.",
    category: "Interiors",
    date: "2026-04-15",
    readTime: "4 min read",
    image: {
      src: u("1682421938316-4b186e25174c"),
      label: "Curtains in morning light",
      tone: "green",
    },
    relatedService: "curtains",
    body: [
      {
        heading: "How often",
        paragraphs: [
          "Every one to two years for most rooms; more often in kitchens, on busy roads or in homes with smokers or open fires. Between cleans, a gentle vacuum with an upholstery brush keeps dust from settling into the weave.",
        ],
      },
      {
        heading: "Why lined curtains are different",
        paragraphs: [
          "Face fabric, lining and interlining often shrink at different rates, which is how home-washed curtains end up puckered and short. Professional cleaning assesses the construction first and uses a process that keeps all the layers stable.",
        ],
      },
      {
        heading: "While they're down",
        paragraphs: [
          "Cleaning is the ideal moment for maintenance: sun-rotted linings replaced, hems relevelled, headings repaired or converted. Tell us about anything that's bothered you about how they hang — it can usually be fixed in the same visit.",
        ],
      },
    ],
  },
  {
    slug: "can-leather-jackets-be-altered",
    title: "Can leather jackets be altered?",
    excerpt:
      "Yes — with the right hands. What's possible with leather, what isn't, and how to tell the difference before you buy.",
    category: "Alterations",
    date: "2026-03-28",
    readTime: "4 min read",
    image: {
      src: u("1727518154538-59e7dc479f8f"),
      label: "Leather jacket detail",
      tone: "ink",
    },
    relatedService: "alterations",
    body: [
      {
        heading: "What's possible",
        paragraphs: [
          "Sleeves can be shortened (usually from the shoulder on styles with zipped cuffs), bodies can be taken in, zips replaced and linings renewed. Done well, altered leather looks factory-original.",
        ],
      },
      {
        heading: "The one-way rule",
        paragraphs: [
          "Leather remembers. Every stitch leaves a permanent hole, so unlike cloth, leather work can rarely be let back out. That makes the pinning and measuring stage critical — and it's why leather belongs with specialists rather than a general repair counter.",
        ],
      },
      {
        heading: "Buying with alterations in mind",
        paragraphs: [
          "If you're choosing between sizes, buy the one that fits your shoulders — shoulders are the hardest thing to alter in any jacket, and leather is no exception. Almost everything else can be brought in to fit.",
        ],
      },
    ],
  },
  {
    slug: "fabric-care-symbols-explained",
    title: "Fabric care symbols, explained",
    excerpt:
      "The washing, bleaching, drying, ironing and cleaning symbols on your labels — decoded once and for all.",
    category: "Garment Care",
    date: "2026-03-10",
    readTime: "6 min read",
    image: {
      src: u("1635274605638-d44babc08a4f"),
      label: "Folded shirts, freshly laundered",
      tone: "deep",
    },
    relatedService: "dry-cleaning",
    body: [
      {
        heading: "The five families",
        paragraphs: [
          "Every care label uses five symbols: a wash tub (washing), a triangle (bleaching), a square (drying), an iron (ironing) and a circle (professional cleaning). Dots indicate temperature — more dots, more heat — and a hand in the tub means hand-wash only.",
        ],
      },
      {
        heading: "The circle, decoded",
        paragraphs: [
          "The circle is the professional cleaning symbol. A letter inside (P, F or W) tells the cleaner which process is safe; a bar underneath calls for a gentler cycle. A crossed-out circle means the garment must not be dry cleaned — which matters more than any other symbol on the label.",
        ],
      },
      {
        heading: "When the label and the garment disagree",
        paragraphs: [
          "Labels describe the shell fabric, but trims, linings, beading and glued construction can all fail in processes the label technically allows. This is where experience earns its keep — when in doubt, bring the piece in and we'll read the whole garment, not just the label.",
        ],
      },
    ],
  },
];

export function getArticle(slug) {
  return journal.find((a) => a.slug === slug);
}

export function getArticlesByService(serviceSlug) {
  return journal.filter((a) => a.relatedService === serviceSlug);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
