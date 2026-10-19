// Haalt per product prijs, van-prijs, voorraad en de variatie-ID's (maat × pasvorm × cadeaudoos) op uit de openbare
// WooCommerce Store API van thoby3.com en schrijft ze in content/products.json. WooCommerce is hiervoor de bron:
// de checkout rekent met díe prijzen, dus de site toont ze ook.
// Draait bij elke build (--soft: bij een storing bouwt de site met de laatst bekende waarden) en handmatig: npm run sync:woo
import fs from "node:fs";

const SHOP = "https://thoby3.com/wp-json/wc/store/v1/products/";
const FILE = new URL("../content/products.json", import.meta.url);
const soft = process.argv.includes("--soft");
const products = JSON.parse(fs.readFileSync(FILE, "utf8"));

const get = async (id) => {
  const res = await fetch(SHOP + id, { headers: { "user-agent": "thoby3-site-sync" }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`WooCommerce gaf ${res.status} voor product ${id}`);
  return res.json();
};
// "S 1.60m - 1.70m" of "s-1-60m-1-70m" -> "S"
const sizeOf = (v) => v.split(/[\s-]/)[0].toUpperCase();
const fitOf = (v) => ({ slank: "slim", breed: "broad" })[v.toLowerCase()];
const attr = (variation, name) => variation.attributes.find((a) => a.name === name)?.value ?? "";
const euro = (minor, unit) => Number(minor) / 10 ** unit;

try {
  for (const p of products) {
    const woo = await get(p.id);
    const unit = woo.prices.currency_minor_unit;
    p.price = euro(woo.prices.price, unit);
    const regular = euro(woo.prices.regular_price, unit);
    if (regular > p.price) p.compareAt = regular;
    else delete p.compareAt;
    p.soldOut = !woo.is_in_stock;
    if (woo.type !== "variable") {
      delete p.variations;
      console.log(`${p.name}: €${p.price}, ${p.soldOut ? "uitverkocht" : "op voorraad"}`);
      continue;
    }
    p.variations = woo.variations.map((v) => {
      const out = { size: sizeOf(attr(v, "Maat")), fit: fitOf(attr(v, "Postuur")), giftBox: attr(v, "Cadeaudoos toevoegen").startsWith("Ja"), wooId: v.id };
      if (!out.size || !out.fit) throw new Error(`Onbekende variatie ${v.id} bij ${p.name}: ${JSON.stringify(v.attributes)}`);
      return out;
    });
    console.log(`${p.name}: €${p.price}${p.compareAt ? ` (was €${p.compareAt})` : ""}, ${p.variations.length} variaties, ${p.soldOut ? "uitverkocht" : "op voorraad"}`);
  }
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2) + "\n");
} catch (err) {
  if (!soft) throw err;
  // Liever een site met de laatst bekende prijzen dan geen nieuwe build; de melding staat in de Cloudflare-buildlog.
  console.warn(`! WooCommerce-sync overgeslagen, laatst bekende waarden blijven staan: ${err.message}`);
}
