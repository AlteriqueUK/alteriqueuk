import JournalCard from "@/components/journal/JournalCard";
import FadeIn from "@/components/shared/FadeIn";
import CtaBand from "@/components/shared/CtaBand";
import { journal } from "@/lib/data/journal";

export const metadata = {
  title: "Journal — Notes on garment care",
  description:
    "Practical guides from the alterique workroom: caring for cashmere, silk and tailoring, alteration timelines, curtain cleaning and more.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <>
      <section className="container-site py-14 sm:py-16">
        <p className="eyebrow">Journal</p>
        <h1 className="display mt-6 max-w-2xl text-4xl sm:text-5xl">
          Notes on garment care
        </h1>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink/70 sm:text-lg">
          What we&rsquo;ve learned in the workroom — written down so your
          clothes last longer, fit better and never surprise you at the worst
          moment.
        </p>
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {journal.map((article, i) => (
            <FadeIn key={article.slug} delay={(i % 3) * 80}>
              <JournalCard article={article} />
            </FadeIn>
          ))}
        </div>
      </section>
      <CtaBand
        title="A question the journal didn't answer?"
        text="Ask us directly — honest advice costs nothing, and walk-ins are always welcome."
      />
    </>
  );
}
