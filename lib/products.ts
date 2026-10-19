// Inhoud komt uit content/*.json (bewerkbaar via Pages CMS); dit bestand geeft er typen en afgeleide waarden aan.
import productData from "@/content/products.json";
import shop from "@/content/shop.json";

// Bron: thoby3.com WooCommerce Store API (gesynchroniseerd met scripts/sync-woo.mjs). Prijzen in EUR incl. btw.
// Afwijking t.o.v. de gevraagde interface: maten zijn S–XL met lichaamslengte (zoals de echte shop),
// niet numeriek (54, 56...), en accessoires hebben geen maten of stof (optioneel).
export type ThobeFit = "slim" | "broad";
export type Fit = ThobeFit;

export interface ThobeSize {
  label: string;
  bodyHeight: string;
  availableFits: ThobeFit[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  kind: "thobe" | "accessory";
  tagline: string;
  description: string[];
  price: number;
  compareAt?: number;
  currency: "EUR";
  soldOut?: boolean;
  colors: { name: string; hex: string }[];
  sizes: ThobeSize[];
  images: { primary: string; lifestyle: string; detail: string };
  gallery: string[];
  badge?: string;
  // WooCommerce: elke maat × pasvorm × cadeaudoos is een eigen variatie (bijgewerkt met npm run sync:woo).
  variations?: WooVariation[];
}

export type WooVariation = { size: string; fit: ThobeFit; giftBox: boolean; wooId: number };

const BOTH: ThobeFit[] = ["slim", "broad"];
export const SIZES: ThobeSize[] = shop.sizes.map((s) => ({ ...s, availableFits: BOTH }));
export const FITS = shop.fits as { id: ThobeFit; label: string; note: string }[];

// Blur-up voor string-src foto's (Next maakt die alleen zelf voor statische imports): zand, de achtergrond van elke productfoto.
export const BLUR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 4"><rect width="3" height="4" fill="#f3f1ec"/></svg>')}`;

export const GIFT_BOX_PRICE = shop.giftBoxPrice;
// Eén drempel: vanaf dit bedrag gratis verzending én gratis Musk & Siwak.
export const REWARD_FROM = shop.rewardFrom;
export const GIFT_VALUE = shop.giftValue;
export const eur = (n: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n).replace(/\s/g, "");
export const SHIPPING_COPY = shop.shippingText;

export const products: Product[] = productData.map((p) => ({
  ...p,
  kind: p.kind as Product["kind"],
  currency: "EUR",
  colors: "color" in p && p.color ? [p.color] : [],
  sizes: p.kind === "thobe" ? SIZES : [],
  variations: "variations" in p ? (p.variations as WooVariation[]) : undefined,
}));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const isThobe = (p: Product) => p.kind === "thobe";
export const discountPct = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

// Afrekenen gebeurt in de bestaande WooCommerce-shop via een "shareable checkout URL" (WooCommerce 9.9+):
// /checkout-link/?products=ID:aantal,ID:aantal zet de hele winkelwagen in één keer klaar.
export const CHECKOUT_LINK = shop.checkoutLink;

/** WooCommerce-ID voor een winkelwagenregel: de variatie bij thobes, het product-ID bij accessoires. */
export function wooId(p: Product, size?: string, fit?: Fit, giftBox?: boolean): number | undefined {
  if (!p.variations) return Number(p.id);
  return p.variations.find((v) => v.size === size && v.fit === fit && v.giftBox === !!giftBox)?.wooId;
}

export function checkoutUrl(items: { id: number; qty: number }[]) {
  return `${CHECKOUT_LINK}?products=${items.map((i) => `${i.id}:${i.qty}`).join(",")}`;
}
