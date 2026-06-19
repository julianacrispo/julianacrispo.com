interface SiteConfig {
  name: string;
  description: string;
  // URL(s) of an existing sitemap to mirror at /sitemap.xml with hosts
  // rewritten to this site's domain. Empty to disable.
  sourceSitemapUrl: string | string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "Juliana Crispo · Fractional CRO",
  description:
    "Fractional CRO and GTM leadership for early-stage tech founders. Turn founder-led selling into a scalable go-to-market motion that compounds.",
  sourceSitemapUrl: "",
};
