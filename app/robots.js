import { siteConfig } from "@/lib/site-config";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
