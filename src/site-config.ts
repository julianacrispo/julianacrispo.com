interface SiteConfig {
  name: string;
  description: string;
  // URL(s) of an existing sitemap to mirror at /sitemap.xml with hosts
  // rewritten to this site's domain. Empty to disable.
  sourceSitemapUrl: string | string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "Juliana Crispo · Sales Advisory",
  description:
    "Sales-process consulting and advisory for early-stage tech founders. Turn founder-led selling into a repeatable, scalable sales motion.",
  sourceSitemapUrl: "",
};
