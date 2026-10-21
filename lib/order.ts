// Prijsberekening van een bestelling, gedeeld door de afrekenpagina (weergave) en functions/api/checkout.ts (wat er
// echt betaald wordt). Alleen relatieve imports: de Cloudflare-functie kent de @/-alias niet.
import productData from "../content/products.json" with { type: "json" };
import shop from "../content/shop.json" with { type: "json" };

export type CartLine = { slug: string; size?: string; fit?: string; giftBox?: boolean; qty: number };
/** Bedragen in centen. */
export type OrderLine = { slug: string; name: string; detail: string; qty: number; cents: number };
export type Order = { lines: OrderLine[]; subtotal: number; shipping: number; total: number };

export const MAX_QTY = 10;
const MAX_LINES = 20;
export const COUNTRIES = shop.shipping;
const cents = (eur: number) => Math.round(eur * 100);
const FIT_LABEL: Record<string, string> = Object.fromEntries(shop.fits.map((f) => [f.id, f.label.toLowerCase()]));

/** Verzendkosten in centen, of null als we niet naar dit land versturen. */
export function shippingCents(country: string, subtotal: number): number | null {
  const c = COUNTRIES.find((x) => x.country === country);
  if (!c) return null;
  return c.freeFrom && subtotal >= cents(shop.rewardFrom) ? 0 : cents(c.price);
}

/**
 * Bouwt de bestelling op uit wat de browser stuurt (dus niet te vertrouwen): alleen bestaande, leverbare producten,
 * geldige maten en aantallen; prijzen komen uit content/*.json. Bij elke thobe hoort één set musk & siwak, gratis.
 */
export function buildOrder(input: unknown, country: string): Order | { error: string } {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_LINES) return { error: "Je winkelwagen is leeg." };
  const lines: OrderLine[] = [];
  let thobes = 0;
  for (const raw of input as CartLine[]) {
    const p = productData.find((x) => x.slug === raw?.slug);
    if (!p || p.soldOut) return { error: "Een artikel in je winkelwagen is niet meer leverbaar. Haal het uit je winkelwagen." };
    if (!Number.isInteger(raw.qty) || raw.qty < 1 || raw.qty > MAX_QTY) return { error: "Een aantal in je winkelwagen klopt niet." };
    if (p.kind === "thobe") {
      if (!shop.sizes.some((s) => s.label === raw.size) || !FIT_LABEL[raw.fit ?? ""]) return { error: "Kies bij elke thobe een maat en pasvorm." };
      thobes += raw.qty;
      lines.push({
        slug: p.slug, name: `Thobe ${p.name}`, qty: raw.qty,
        detail: `Maat ${raw.size}-${raw.fit === "slim" ? 1 : 2}, ${FIT_LABEL[raw.fit!]}${raw.giftBox ? ", in de geschenkdoos" : ""}`,
        cents: cents(p.price) + (raw.giftBox ? cents(shop.giftBoxPrice) : 0),
      });
    } else {
      lines.push({ slug: p.slug, name: p.name, detail: "", qty: raw.qty, cents: cents(p.price) });
    }
  }
  const subtotal = lines.reduce((n, l) => n + l.cents * l.qty, 0);
  const shipping = shippingCents(country, subtotal);
  if (shipping === null) return { error: "Naar dit land versturen we nog niet. Stuur ons een bericht, dan kijken we wat kan." };
  for (const slug of ["musk", "siwak"]) {
    const g = productData.find((x) => x.slug === slug);
    if (thobes && g) lines.push({ slug, name: g.name, detail: "Cadeau bij je thobe", qty: thobes, cents: 0 });
  }
  return { lines, subtotal, shipping, total: subtotal + shipping };
}
