import SectionHeading from "@/components/shared/SectionHeading";
import ReviewSlider from "@/components/home/ReviewSlider";
import { featuredTestimonials } from "@/lib/data/testimonials";
import { getGoogleRating } from "@/lib/google-reviews";
import { siteConfig } from "@/lib/site-config";

export default async function Reviews() {
  const { rating, reviewCount } = await getGoogleRating();

  return (
    <section className="container-site py-18 sm:py-24">
      <SectionHeading
        align="center"
        eyebrow="Reviews"
        title={`${rating} on Google`}
        lede={`${reviewCount} reviews from customers who trusted us with the pieces that matter.`}
      />

      <ReviewSlider reviews={featuredTestimonials} />

      <div className="mt-12 text-center">
        <a
          href={siteConfig.google.reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ambleside underline decoration-champagne underline-offset-4 transition-colors hover:text-ink"
        >
          Read all reviews on Google
        </a>
      </div>
    </section>
  );
}
