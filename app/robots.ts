import type { MetadataRoute } from "next";
import { SITE_LIVE } from "@/lib/seo";

export const dynamic = "force-static";

// Preview (pages.dev) niet indexeren; pas bij livegang op thoby3.com SITE_LIVE=true zetten in Cloudflare.
export default function robots(): MetadataRoute.Robots {
  return SITE_LIVE
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: "https://thoby3.com/sitemap.xml" }
    : { rules: { userAgent: "*", disallow: "/" } };
}
