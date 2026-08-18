import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }) {
  const { type } = await searchParams;
  const isQuote = type !== "message";

  return (
    <section className="container-site flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-xl text-center">
        <p className="eyebrow">{isQuote ? "Quotation request" : "Message"} received</p>
        <h1 className="display mt-6 text-4xl sm:text-5xl">
          Thank you
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base font-light leading-relaxed text-ink/70">
          {isQuote
            ? "Your quotation request is safely with us — details, photographs and all."
            : "Your message is safely with us."}
        </p>

        <div className="mt-12 border border-ink/10 bg-linen-deep/50 p-8 text-left sm:p-10">
          <p className="eyebrow">What happens next</p>
          <p className="mt-5 text-[15px] font-light leading-relaxed text-ink/75">
            A member of the alterique team will look over{" "}
            {isQuote ? "your request" : "your message"} and reach out to you
            personally within the next 24 hours
            {isQuote ? " with a considered quote" : ""} — keep an eye on your
            phone and inbox.
          </p>
        </div>

        <div className="mt-10">
          <p className="text-sm font-light text-ink/60">
            Is it urgent? Speak to us right away:
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={siteConfig.phone.href}
              className="bg-ink px-7 py-3.5 text-sm tracking-[0.04em] text-linen transition-opacity hover:opacity-85"
            >
              Call {siteConfig.phone.display}
            </a>
            <a
              href={siteConfig.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              className="border border-ink/20 px-7 py-3.5 text-sm tracking-[0.04em] transition-colors hover:border-ink"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <Link
          href="/"
          className="mt-12 inline-block border-b border-champagne pb-0.5 text-sm text-ink"
        >
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
