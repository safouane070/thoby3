// Haalt per product de WooCommerce-variatie-ID's (maat × pasvorm × cadeaudoos) en voorraad op via de openbare
// Store API van thoby3.com en schrijft ze in content/products.json. Prijzen worden alleen vergeleken, niet overschreven.
// Gebruik: npm run sync:woo   (na het toevoegen van een product of variatie in WooCommerce)
import fs from "node:fs";

const SHOP = "https://thoby3.com/wp-json/wc/store/v1/products/";
const FILE = new URL("../content/products.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const get = async (id) => {
  const res = await fetch(SHOP + id, { headers: { "user-agent": "thoby3-site-sync" } });
  if (!res.ok) throw new Error(`WooCommerce gaf ${res.status} voor product ${id}`);
  return res.json();
};
// "S 1.60m - 1.70m" of "s-1-60m-1-70m" -> "S"
const sizeOf = (v) => v.split(/[\s-]/)[0].toUpperCase();
const fitOf = (v) => ({ slank: "slim", breed: "broad" })[v.toLowerCase()];
const attr = (variation, name) => variation.attributes.find((a) => a.name === name)?.value ?? "";

for (const p of data.products) {
  const woo = await get(p.id);
  p.soldOut = !woo.is_in_stock;
  const price = Number(woo.prices.price) / 100;
  if (Math.abs(price - p.price) > 0.001) console.warn(`! ${p.name}: site €${p.price}, WooCommerce €${price}`);
  if (woo.type !== "variable") {
    delete p.variations;
    continue;
  }
  p.variations = woo.variations.map((v) => {
    const out = { size: sizeOf(attr(v, "Maat")), fit: fitOf(attr(v, "Postuur")), giftBox: attr(v, "Cadeaudoos toevoegen").startsWith("Ja"), wooId: v.id };
    if (!out.size || !out.fit) throw new Error(`Onbekende variatie ${v.id} bij ${p.name}: ${JSON.stringify(v.attributes)}`);
    return out;
  });
  console.log(`${p.name}: ${p.variations.length} variaties, ${p.soldOut ? "uitverkocht" : "op voorraad"}`);
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
