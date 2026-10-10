interface SiteConfig {
  name: string;
  description: string;
  // URL(s) of an existing sitemap to mirror at /sitemap.xml with hosts
  // rewritten to this site's domain. Empty to disable.
  sourceSitemapUrl: string | string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "Juliana Crispo · 3 Things Friday",
  description:
    "Every Friday, I break down 3 things I'm loving, reading, or doing this week, and why you might love them too. All in a 3-minute read.",
  sourceSitemapUrl: "",
};
