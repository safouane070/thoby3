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
if (typeof shop.showCompareAt !== "boolean") fail("Winkel: 'Van-prijs tonen' moet aan of uit staan");

// Maattabel: de maathulp rekent met de lichaamslengte, dus die moet leesbaar zijn en oplopen zonder gaten.
let prevMax = 0;
for (const s of shop.sizes) {
  const m = (s.bodyHeight ?? "").match(/^\s*(\d[.,]\d{2})\s*[–-]\s*(\d[.,]\d{2})\s*m\s*$/);
  if (!m) { fail(`Maat ${s.label}: lichaamslengte "${s.bodyHeight}" moet zo geschreven zijn: 1.70 – 1.78 m`); continue; }
  const [min, max] = [m[1], m[2]].map((v) => Math.round(parseFloat(v.replace(",", ".")) * 100));
  if (min >= max) fail(`Maat ${s.label}: van-lengte moet kleiner zijn dan tot-lengte`);
  if (prevMax && min > prevMax) fail(`Maat ${s.label}: er zit een gat in de maattabel (${prevMax} → ${min} cm)`);
  prevMax = max;
  for (const [k, label] of [["length", "lengte"], ["chestSlim", "borstomvang slank"], ["chestBroad", "borstomvang breed"]])
    if (s[k] && !/^\d{2,3}$/.test(String(s[k]).trim())) fail(`Maat ${s.label}: ${label} "${s[k]}" moet een getal in cm zijn (bijv. 112), of leeg`);
}

for (const [where, slug] of [["Homepagina, uitgelicht product", home.hero.featuredProduct], ["Homepagina, knop cadeaubalk", home.craft.giftProduct]])
  if (!slugs.has(slug)) fail(`${where}: product "${slug}" bestaat niet`);
image("Homepagina, grote foto", home.hero.image);
image("Homepagina, blok Vóór 17:00", home.usp.image);
for (const d of home.fabric.details) image(`Homepagina, detailfoto ${d.label}`, d.image);
for (const u of home.usp.items) if (!["truck", "exchange", "whatsapp", "shield"].includes(u.icon)) fail(`Homepagina, belofte "${u.title}": onbekend icoon ${u.icon}`);
for (const a of site.announcements) if (!["gift", "truck", "clock", "exchange"].includes(a.icon)) fail(`Aankondiging "${a.text}": onbekend icoon ${a.icon}`);
for (const [i, q] of (home.faq?.items ?? []).entries()) if (!q.q?.trim() || !q.a?.trim()) fail(`Veelgestelde vraag ${i + 1}: vraag en antwoord zijn allebei nodig`);
if (site.newsletter.action && !/^https:\/\//.test(site.newsletter.action)) fail("Nieuwsbrief: formulier-adres moet met https:// beginnen (of leeg)");
if (site.newsletter.action && !/^[\w\-[\]]+$/.test(site.newsletter.field ?? "")) fail("Nieuwsbrief: veldnaam voor e-mail ontbreekt (bijv. EMAIL)");

// Reviews: alleen echte klantreviews. Ze verschijnen op de site én als sterren in Google.
const reviews = read("reviews.json");
for (const [i, r] of reviews.entries()) {
  const at = `Review ${i + 1} (${r.name ?? "zonder naam"})`;
  if (!r.name?.trim()) fail(`${at}: naam ontbreekt`);
  if (!r.text?.trim()) fail(`${at}: tekst ontbreekt`);
  if (!Number.isInteger(r.rating) || r.rating < 1 || r.rating > 5) fail(`${at}: sterren moeten 1 t/m 5 zijn`);
  if (r.product && !slugs.has(r.product)) fail(`${at}: product "${r.product}" bestaat niet`);
  if (r.date && !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) fail(`${at}: datum moet zo: 2026-10-20`);
}
if (!/^\d{8,15}$/.test(site.contact.whatsapp)) fail("Contact: WhatsApp-nummer moet alleen cijfers met landcode zijn (bijv. 31641344799)");

// Juridische pagina's: de HTML uit het CMS wordt letterlijk getoond, dus alleen een vaste set tags en veilige links mag erin.
const legal = read("legal.json");
const TAGS = new Set(["h2", "h3", "p", "ul", "ol", "li", "strong", "b", "em", "i", "br", "a", "table", "thead", "tbody", "tr", "th", "td"]);
const RESERVED = new Set(["product", "img", "_img", "_next", "api"]);
const legalSlugs = new Set();
for (const p of legal) {
  const at = `Juridische pagina "${p.title ?? p.slug}"`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug ?? "") || RESERVED.has(p.slug)) fail(`${at}: ongeldig adres "${p.slug}"`);
  if (legalSlugs.has(p.slug)) fail(`${at}: adres "${p.slug}" komt twee keer voor`);
  legalSlugs.add(p.slug);
  if (!p.title) fail(`${at}: titel ontbreekt`);
  for (const [, close, name, attrs] of (p.body ?? "").matchAll(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g)) {
    const tag = name.toLowerCase();
    if (!TAGS.has(tag)) { fail(`${at}: <${tag}> is niet toegestaan`); continue; }
    if (close) continue;
    const rest = attrs.replace(/\s*\/$/, "");
    if (tag !== "a") { if (rest.trim()) fail(`${at}: <${tag}> mag geen attributen hebben (${rest.trim().slice(0, 40)})`); continue; }
    const found = [...rest.matchAll(/([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)];
    if (rest.replace(/([a-zA-Z-]+)\s*=\s*("[^"]*"|'[^']*')/g, "").trim()) fail(`${at}: onleesbare link-attributen`);
    for (const [, key, , dq, sq] of found) {
      const value = dq ?? sq ?? "";
      if (!["href", "title", "target", "rel"].includes(key.toLowerCase())) fail(`${at}: link-attribuut ${key} is niet toegestaan`);
      if (key.toLowerCase() === "href" && !/^(https?:|mailto:|tel:|\/|#)/i.test(value.trim())) fail(`${at}: link "${value.slice(0, 40)}" is niet toegestaan`);
    }
  }
}

// Wettelijk verplicht voor een webshop (art. 3:15d BW): bij de echte livegang een fout, op de preview een waarschuwing.
for (const [k, label] of [["name", "Bedrijfsnaam"], ["kvk", "KvK-nummer"], ["btw", "Btw-id"], ["address", "Vestigingsadres"]])
  if (!site.company?.[k]?.trim()) {
    const msg = `Bedrijfsgegevens: ${label} ontbreekt (verplicht voor livegang)`;
    if (process.env.SITE_LIVE === "true") fail(msg); else console.warn(`! ${msg}`);
  }

if (errors.length) {
  console.error(`\nDe inhoud heeft ${errors.length} fout(en); de site is niet opnieuw gepubliceerd:\n- ${errors.join("\n- ")}\n`);
  process.exit(1);
}
console.log(`content: ${products.length} producten en alle teksten in orde`);
