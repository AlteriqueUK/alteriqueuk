import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/data/services";
import { journal } from "@/lib/data/journal";

export default function sitemap() {
  const base = siteConfig.siteUrl;

  const staticPages = ["", "/gallery", "/journal", "/quote", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    })
  );

  const servicePages = services.map((service) => ({
    url: `${base}/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const articles = journal.map((article) => ({
    url: `${base}/journal/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticPages, ...servicePages, ...articles];
}
