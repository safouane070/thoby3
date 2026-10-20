import type { Metadata } from "next";
import home from "@/content/home.json";
import { getProduct, products } from "@/lib/products";

/** Alleen true op de echte site (Cloudflare-variabele SITE_LIVE=true); de pages.dev-preview blijft uit Google. */
export const SITE_LIVE = process.env.SITE_LIVE === "true";
export const SITE_URL = "https://thoby3.com";

// Next vervangt openGraph per pagina in zijn geheel (geen diepe merge): elke pagina spreidt deze basis.
export const baseOpenGraph = {
  type: "website",
  locale: "nl_NL",
  siteName: "THOBY3",
  // Het product zelf, niet de sfeerfoto: dit is wat je ziet bij delen via WhatsApp of Instagram.
  images: [{ url: (getProduct(home.hero.featuredProduct) ?? products[0]).images.primary, alt: `Thobe ${(getProduct(home.hero.featuredProduct) ?? products[0]).name}` }],
} satisfies Metadata["openGraph"];
