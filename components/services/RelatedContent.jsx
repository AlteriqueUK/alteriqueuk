import Link from "next/link";
import JournalCard from "@/components/journal/JournalCard";
import { getService } from "@/lib/data/services";
import { getArticle } from "@/lib/data/journal";

/**
 * Internal-linking block (brief §11): related journal articles and
 * related services for the current service page.
 */
export default function RelatedContent({ service }) {
  const articles = (service.relatedJournal || [])
    .map(getArticle)
    .filter(Boolean);
  const related = (service.relatedServices || [])
    .map(getService)
    .filter(Boolean);

  if (!articles.length && !related.length) return null;

  return (
    <section className="container-site py-16 sm:py-22">
      {articles.length > 0 && (
        <>
          <p className="eyebrow">From the journal</p>
          <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:max-w-4xl">
            {articles.map((article) => (
              <JournalCard key={article.slug} article={article} />
            ))}
          </div>
        </>
      )}
      {related.length > 0 && (
        <div className="mt-16 border-t border-ink/10 pt-10">
          <p className="eyebrow">You may also need</p>
          <div className="mt-6 flex flex-wrap gap-4">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="border border-ink/15 px-6 py-3 text-sm tracking-[0.04em] text-ink/80 transition-colors hover:border-ink hover:text-ink"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
