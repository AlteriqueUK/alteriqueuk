import QuoteRail from "@/components/quote/QuoteRail";
import QuoteForm from "@/components/quote/QuoteForm";

export const metadata = {
  title: "Request a Quote",
  description:
    "Send alterique photographs of your garment and the work it needs — we'll reply with a considered quote, usually the same day.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <div className="grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.85fr_1.15fr]">
      <QuoteRail />
      <section className="flex items-center justify-center px-5 py-12 sm:px-12 lg:px-14 lg:py-18">
        <QuoteForm />
      </section>
    </div>
  );
}
