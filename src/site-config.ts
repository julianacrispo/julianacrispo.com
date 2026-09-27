interface SiteConfig {
  name: string;
  description: string;
  // URL(s) of an existing sitemap to mirror at /sitemap.xml with hosts
  // rewritten to this site's domain. Empty to disable.
  sourceSitemapUrl: string | string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "Juliana Crispo · 3 Minute Friday",
  description:
    "Every Friday I breakdown 3 things in under 3 minutes that I'm loving/reading/doing this week and why you'll love them too.",
  sourceSitemapUrl: "",
};
