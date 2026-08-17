import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyAlterique from "@/components/home/WhyAlterique";
import TrustedBy from "@/components/home/TrustedBy";
import Reviews from "@/components/home/Reviews";
import GalleryPreview from "@/components/home/GalleryPreview";
import JournalPreview from "@/components/home/JournalPreview";
import InstagramStrip from "@/components/home/InstagramStrip";
import LocationHours from "@/components/home/LocationHours";
import CtaBand from "@/components/shared/CtaBand";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedServices />
      <WhyAlterique />
      <TrustedBy />
      <Reviews />
      <GalleryPreview />
      <JournalPreview />
      <InstagramStrip />
      <LocationHours />
      <CtaBand />
    </>
  );
}
