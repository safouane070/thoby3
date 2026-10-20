import type { MetadataRoute } from "next";
import legal from "@/content/legal.json";
import { products } from "@/lib/products";

export const dynamic = "force-static";

const BASE = "https://thoby3.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({ url: `${BASE}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: p.kind === "thobe" ? 0.9 : 0.6 })),
    ...legal.map((p) => ({ url: `${BASE}/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
