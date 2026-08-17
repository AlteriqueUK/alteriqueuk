import Link from "next/link";
import EditorialImage from "@/components/shared/EditorialImage";
import { formatDate } from "@/lib/data/journal";

export default function JournalCard({ article }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group block">
      <EditorialImage
        image={article.image}
        alt={article.title}
        aspect="landscape"
        sizes="(max-width: 768px) 100vw, 33vw"
        className="transition-opacity group-hover:opacity-90"
      />
      <p className="mt-5 text-[11px] uppercase tracking-[0.24em] text-ambleside">
        {article.category} · {article.readTime}
      </p>
      <h3 className="mt-3 text-lg font-normal leading-snug tracking-[0.01em] group-hover:underline group-hover:decoration-champagne group-hover:underline-offset-4">
        {article.title}
      </h3>
      <p className="mt-2 text-sm font-light leading-relaxed text-ink/65">
        {article.excerpt}
      </p>
      <p className="mt-3 text-xs text-ink/45">{formatDate(article.date)}</p>
    </Link>
  );
}
