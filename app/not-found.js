import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[50vh] flex-col items-start justify-center py-16">
      <p className="eyebrow">404</p>
      <h1 className="display mt-6 text-4xl sm:text-5xl">
        This page has been altered away
      </h1>
      <p className="mt-5 max-w-md text-base font-light leading-relaxed text-ink/70">
        The page you&rsquo;re looking for doesn&rsquo;t exist — but the
        workroom is very much open.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center bg-ink px-7 py-3.5 text-sm tracking-[0.04em] text-linen transition-opacity hover:opacity-85"
      >
        Back to the homepage
      </Link>
    </section>
  );
}
