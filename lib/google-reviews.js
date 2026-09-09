import { siteConfig } from "@/lib/site-config";

/**
 * Rating and review count, taken from the Google Business Profile.
 *
 * Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID and the figures on the site
 * follow the profile on their own, rechecked once a day. Without them — or if
 * the call fails — the numbers in lib/site-config.js are used instead, so the
 * site is never left with a blank where a rating should be.
 *
 * The key is read on the server only (no NEXT_PUBLIC_ prefix), so it is never
 * shipped to the browser.
 */

const REVALIDATE = 60 * 60 * 24; // once a day is plenty for a review count

const fallback = () => ({
  rating: siteConfig.google.rating,
  reviewCount: siteConfig.google.reviewCount,
});

export async function getGoogleRating() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return fallback();

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount",
        },
        next: { revalidate: REVALIDATE },
      }
    );
    if (!res.ok) throw new Error(`Places API returned ${res.status}`);

    const { rating, userRatingCount } = await res.json();
    if (!rating || !userRatingCount) return fallback();

    return {
      rating: Number(rating).toFixed(1),
      reviewCount: userRatingCount,
    };
  } catch (err) {
    console.warn("Google rating lookup failed:", err.message);
    return fallback();
  }
}
