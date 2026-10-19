// Controleert content/*.json vóór de build. Inhoud komt uit het CMS: een fout (verkeerd adres, ontbrekende foto,
// variant zonder WooCommerce-ID) stopt de build, zodat Cloudflare de vorige werkende versie online houdt.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, "content", f), "utf8"));
const products = read("products.json");
const shop = read("shop.json");
const home = read("home.json");
const site = read("site.json");
const errors = [];
const fail = (msg) => errors.push(msg);
const image = (where, src) => {
  if (!src) return;
  if (!src.startsWith("/img/") || !fs.existsSync(path.join(root, "public", src))) fail(`${where}: foto ${src} bestaat niet in public/img`);
};

const slugs = new Set();
for (const [i, p] of products.entries()) {
  const at = `Product ${i + 1} (${p.name ?? "zonder naam"})`;
  if (!p.name) fail(`${at}: naam ontbreekt`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug ?? "")) fail(`${at}: adres "${p.slug}" mag alleen kleine letters, cijfers en streepjes bevatten`);
  if (slugs.has(p.slug)) fail(`${at}: adres "${p.slug}" komt twee keer voor`);
  slugs.add(p.slug);
  if (!/^\d+$/.test(p.id ?? "")) fail(`${at}: WooCommerce product-ID "${p.id}" is geen nummer`);
  if (!["thobe", "accessory"].includes(p.kind)) fail(`${at}: soort moet thobe of accessory zijn`);
  if (!(p.price > 0)) fail(`${at}: geen prijs (draai npm run sync:woo; staat het product in WooCommerce?)`);
  image(`${at}, productfoto`, p.images?.primary);
  if (!p.images?.primary) fail(`${at}: productfoto ontbreekt`);
  image(`${at}, sfeerfoto`, p.images?.lifestyle);
  image(`${at}, detailfoto`, p.images?.detail);
  if (!p.gallery?.length) fail(`${at}: geen foto's voor de productpagina`);
  for (const g of p.gallery ?? []) image(`${at}, galerij`, g);
  if (p.kind === "thobe") {
    // Elke maat × pasvorm moet (zonder én met cadeaudoos) een WooCommerce-variatie hebben, anders kan die keuze niet afrekenen.
    for (const s of shop.sizes) for (const f of shop.fits) for (const box of [false, true]) {
      if (!p.variations?.some((v) => v.size === s.label && v.fit === f.id && v.giftBox === box && Number.isInteger(v.wooId)))
        fail(`${at}: geen WooCommerce-variatie voor maat ${s.label}, ${f.label}${box ? " met cadeaudoos" : ""}`);
    }
  }
}

if (shop.fits.map((f) => f.id).sort().join() !== "broad,slim") fail("Pasvormen: de codes moeten slim en broad zijn");
if (new Set(shop.sizes.map((s) => s.label)).size !== shop.sizes.length) fail("Maten: een maat komt twee keer voor");
for (const k of ["rewardFrom", "giftValue", "giftBoxPrice"]) if (!(shop[k] >= 0)) fail(`Winkel: ${k} moet een bedrag zijn`);

for (const [where, slug] of [["Homepagina, uitgelicht product", home.hero.featuredProduct], ["Homepagina, knop cadeaubalk", home.craft.giftProduct]])
  if (!slugs.has(slug)) fail(`${where}: product "${slug}" bestaat niet`);
image("Homepagina, grote foto", home.hero.image);
image("Homepagina, blok Vóór 17:00", home.usp.image);
for (const d of home.fabric.details) image(`Homepagina, detailfoto ${d.label}`, d.image);
for (const u of home.usp.items) if (!["shield", "leaf", "headset", "truck"].includes(u.icon)) fail(`Homepagina, belofte "${u.title}": onbekend icoon ${u.icon}`);
for (const a of site.announcements) if (!["gift", "truck", "clock"].includes(a.icon)) fail(`Aankondiging "${a.text}": onbekend icoon ${a.icon}`);
if (!/^\d{8,15}$/.test(site.contact.whatsapp)) fail("Contact: WhatsApp-nummer moet alleen cijfers met landcode zijn (bijv. 31641344799)");

if (errors.length) {
  console.error(`\nDe inhoud heeft ${errors.length} fout(en); de site is niet opnieuw gepubliceerd:\n- ${errors.join("\n- ")}\n`);
  process.exit(1);
}
console.log(`content: ${products.length} producten en alle teksten in orde`);
