import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/FadeIn";
import JournalCard from "@/components/journal/JournalCard";
import { getJournal } from "@/lib/journal-source";

export default async function JournalPreview() {
  const journal = await getJournal();
  const latest = journal.slice(0, 3);
  return (
    <section className="container-site py-18 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Journal"
          title="Notes on garment care"
          lede="Practical guides from the workroom — how to care for what you own, and what's possible when it needs work."
        />
        <Link
          href="/journal"
          className="text-sm text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
        >
          Read the journal
        </Link>
      </div>
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {latest.map((article, i) => (
          <FadeIn key={article.slug} delay={i * 80}>
            <JournalCard article={article} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
