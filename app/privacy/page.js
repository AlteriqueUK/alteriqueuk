import { siteConfig, fullAddress } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy",
  description: "How alterique collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

/**
 * Placeholder privacy policy — must be reviewed by the client (and ideally
 * a professional) before launch. Update the effective date on publication.
 */
export default function PrivacyPage() {
  return (
    <section className="container-site py-14 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Legal</p>
        <h1 className="display mt-6 text-4xl sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/50">Effective date: to be confirmed at launch</p>

        <div className="mt-12 space-y-10 text-base font-light leading-relaxed text-ink/75">
          <section>
            <h2 className="display text-2xl text-ink">Who we are</h2>
            <p className="mt-4">
              {siteConfig.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an
              alterations, tailoring and garment care business at {fullAddress}.
              This policy explains how we handle personal information collected
              through this website.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-ink">What we collect</h2>
            <p className="mt-4">
              When you contact us or request a quote, we collect the details
              you provide: your name, phone number, email address, your message
              and any photographs you upload of your garments. We do not
              collect more than we need to respond to your enquiry.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-ink">How we use it</h2>
            <p className="mt-4">
              Your details are used only to respond to your enquiry, prepare
              your quote and carry out the work you ask us to do. We do not
              sell your data, and we do not share it with third parties except
              the service providers who host this website and deliver our
              email and messaging.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-ink">Photographs you upload</h2>
            <p className="mt-4">
              Photographs submitted with quote requests are stored securely,
              used only to assess and quote for the work, and deleted once no
              longer needed. They are never shared or published without your
              explicit permission.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-ink">Cookies & analytics</h2>
            <p className="mt-4">
              This website uses analytics to understand how visitors use it so
              we can improve. Where analytics cookies are used, you will be
              asked for consent before they are set.
            </p>
          </section>

          <section>
            <h2 className="display text-2xl text-ink">Your rights</h2>
            <p className="mt-4">
              Under UK GDPR you may request access to, correction of, or
              deletion of the personal data we hold about you. To do so,
              contact us at {siteConfig.email.display} or call{" "}
              {siteConfig.phone.display}.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
