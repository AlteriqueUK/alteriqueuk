import Link from "next/link";
import { notFound } from "next/navigation";
import EditorialImage from "@/components/shared/EditorialImage";
import CtaBand from "@/components/shared/CtaBand";
import { journal, formatDate } from "@/lib/data/journal";
import { getJournalArticle } from "@/lib/journal-source";
import { getService } from "@/lib/data/services";
import { articleSchema, JsonLd } from "@/lib/schema";

// Articles added from the admin panel have slugs unknown at build time,
// so dynamic params stay enabled (the Next.js default).
export function generateStaticParams() {
  return journal.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getJournalArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: { title: article.title, description: article.excerpt },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getJournalArticle(slug);
  if (!article) notFound();

  const service = getService(article.relatedService);

  return (
    <>
      <article className="container-site py-14 sm:py-16">
        <header className="mx-auto max-w-2xl">
          <p className="eyebrow">
            {article.category} · {article.readTime}
          </p>
          <h1 className="display mt-6 text-4xl sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-sm text-ink/50">{formatDate(article.date)}</p>
        </header>
        <EditorialImage
          image={article.image}
          alt={article.title}
          aspect="wide"
          priority
          sizes="(max-width: 1024px) 100vw, 1240px"
          className="mt-12"
        />
        <div className="mx-auto mt-14 max-w-2xl">
          {article.body.map((section) => (
            <section key={section.heading} className="mb-12">
              <h2 className="display text-2xl sm:text-3xl">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-5 text-base font-light leading-relaxed text-ink/75">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          {service && (
            <aside className="border-t border-ink/10 pt-8">
              <p className="eyebrow">Related service</p>
              <Link
                href={`/${service.slug}`}
                className="mt-4 inline-block text-lg font-light underline decoration-champagne underline-offset-4 transition-colors hover:text-ambleside"
              >
                {service.title} at alterique
              </Link>
            </aside>
          )}
        </div>
      </article>
      <CtaBand />
      <JsonLd schema={articleSchema(article)} />
    </>
  );
}
