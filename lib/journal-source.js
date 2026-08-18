import { siteConfig } from "@/lib/site-config";
import { journal as staticJournal } from "@/lib/data/journal";

/**
 * Journal content now lives in MongoDB (editable from /admin). These helpers
 * fetch it from the API, falling back to the built-in articles whenever the
 * backend is unreachable or not yet configured — the journal never 404s.
 */

const REVALIDATE = 300; // re-check the API every 5 minutes

export async function getJournal() {
  if (!siteConfig.apiUrl) return staticJournal;
  try {
    const res = await fetch(`${siteConfig.apiUrl}/api/journal`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`Journal API returned ${res.status}`);
    const posts = await res.json();
    return posts.length ? posts : staticJournal;
  } catch {
    return staticJournal;
  }
}

export async function getJournalArticle(slug) {
  const posts = await getJournal();
  return posts.find((post) => post.slug === slug) || null;
}
