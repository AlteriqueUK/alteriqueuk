import EditorialImage from "@/components/shared/EditorialImage";
import { siteConfig } from "@/lib/site-config";

/**
 * Curated Instagram strip (brief §17): no live feed dependency — the client
 * refreshes these images occasionally. Fast, never breaks, always on-brand.
 */
const u = (id) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`;

const POSTS = [
  {
    src: u("1673201229733-69d19c5c4a87"),
    label: "From the workroom",
    tone: "deep",
  },
  {
    src: u("1782787230428-02c6192a62ab"),
    label: "Bridal, this week",
    tone: "linen",
  },
  {
    src: u("1637069585336-827b298fe84a"),
    label: "Original-hem denim",
    tone: "green",
  },
  {
    src: u("1666358065297-18e26b09887b"),
    label: "Finished and collected",
    tone: "ink",
  },
];

export default function InstagramStrip() {
  return (
    <section className="border-t border-ink/10">
      <div className="container-site py-16 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="eyebrow">Instagram</p>
          <a
            href={siteConfig.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
          >
            Follow {siteConfig.instagram.handle}
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {POSTS.map((post) => (
            <a
              key={post.label}
              href={siteConfig.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <EditorialImage
                image={post}
                alt={`Instagram — ${post.label}`}
                aspect="square"
                sizes="(max-width: 640px) 50vw, 25vw"
                className="transition-opacity group-hover:opacity-90"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
