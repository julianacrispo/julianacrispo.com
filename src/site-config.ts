interface SiteConfig {
  name: string;
  description: string;
  // URL(s) of an existing sitemap to mirror at /sitemap.xml with hosts
  // rewritten to this site's domain. Empty to disable.
  sourceSitemapUrl: string | string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "Juliana Crispo · 5 Minutes of Frankness",
  description:
    "Every Friday I breakdown some new bullshit I'm seeing on the internet and give you the real tea in under 5 minutes.",
  sourceSitemapUrl: "",
};
