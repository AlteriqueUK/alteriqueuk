"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Wordmark from "@/components/layout/Wordmark";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/alterations", label: "Alterations" },
  { href: "/dry-cleaning", label: "Dry Cleaning" },
  { href: "/bridal", label: "Bridal" },
  {
    label: "Interiors",
    children: [
      { href: "/curtains", label: "Curtains" },
      { href: "/soft-furnishings", label: "Soft Furnishings" },
    ],
  },
  { href: "/gallery", label: "Gallery" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-linen transition-shadow",
        scrolled && "border-b border-ink/10"
      )}
    >
      <div className="container-site flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="alterique — home" className="text-ink">
          <Wordmark />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative">
                <button
                  type="button"
                  className={cn(
                    "text-[13px] tracking-[0.08em] text-ink/70 transition-colors hover:text-ink",
                    link.children.some((c) => c.href === pathname) && "text-ink"
                  )}
                  aria-haspopup="true"
                >
                  {link.label}
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="flex min-w-44 flex-col border border-ink/10 bg-linen py-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="px-5 py-2.5 text-[13px] tracking-[0.08em] text-ink/70 transition-colors hover:bg-linen-deep hover:text-ink"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[13px] tracking-[0.08em] text-ink/70 transition-colors hover:text-ink",
                  pathname === link.href && "text-ink"
                )}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/quote"
            className="ml-2 bg-ink px-5 py-2.5 text-[13px] tracking-[0.06em] text-linen transition-opacity hover:opacity-85"
          >
            Request a Quote
          </Link>
        </nav>

        {/* Mobile menu */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/quote"
            className="bg-ink px-4 py-2 text-xs tracking-[0.06em] text-linen"
          >
            Quote
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="p-2 text-ink"
              aria-label="Open menu"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-ink/10 bg-linen">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Wordmark className="text-ink" />
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile"
                className="mt-2 flex flex-col px-4"
              >
                {NAV_LINKS.flatMap((link) =>
                  link.children ? link.children : [link]
                ).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "border-b border-ink/8 py-3.5 text-[15px] font-light tracking-[0.04em] text-ink/80 transition-colors hover:text-ink",
                      pathname === link.href && "text-ink"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3 px-4 pb-8">
                <a
                  href={siteConfig.phone.href}
                  className="block border border-ink/20 px-5 py-3 text-center text-sm text-ink"
                >
                  Call {siteConfig.phone.display}
                </a>
                <a
                  href={siteConfig.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-ink px-5 py-3 text-center text-sm text-linen"
                >
                  WhatsApp us
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
