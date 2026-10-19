import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

export const dynamic = "force-static";

const BASE = "https://thoby3.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({ url: `${BASE}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: p.kind === "thobe" ? 0.9 : 0.6 })),
  ];
}
