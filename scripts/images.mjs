// Maakt van elke foto in public/img een WebP per breedte (lib/image-sizes.json) in public/_img.
// Draait vóór dev en build; bestaande bestanden worden overgeslagen. Nooit groter dan het origineel.
// In de naam staat een hash van de bronfoto (wd-1-640.3f2a9c1b.webp): vervang je een foto in het CMS, dan krijgt hij
// een nieuwe naam. Daardoor mag /_img/* een jaar gecachet worden (public/_headers). lib/image-manifest.json koppelt
// elke foto aan zijn hash voor de loader.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public/img");
const out = path.join(root, "public/_img");
const sizes = JSON.parse(fs.readFileSync(path.join(root, "lib/image-sizes.json"), "utf8"));
const widths = [...sizes.imageSizes, ...sizes.deviceSizes];

fs.mkdirSync(out, { recursive: true });
const manifest = {};
let made = 0;
for (const file of fs.readdirSync(src).sort()) {
  if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
  const input = fs.readFileSync(path.join(src, file));
  const base = file.replace(/\.[a-z0-9]+$/i, "");
  const hash = crypto.createHash("sha1").update(input).digest("hex").slice(0, 8);
  manifest[base] = hash;
  for (const w of widths) {
    const target = path.join(out, `${base}-${w}.${hash}.webp`);
    if (fs.existsSync(target)) continue;
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target);
    made++;
  }
}

// Oude varianten (vervangen foto, of van vóór de hash in de naam) weg, zodat public/_img niet blijft groeien.
let removed = 0;
for (const f of fs.readdirSync(out)) {
  const m = f.match(/^(.*)-\d+\.([0-9a-f]{8})\.webp$/);
  if (m && manifest[m[1]] === m[2]) continue;
  fs.unlinkSync(path.join(out, f));
  removed++;
}

fs.writeFileSync(path.join(root, "lib/image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${made} WebP-bestanden gemaakt, ${removed} oude verwijderd in public/_img (${widths.length} breedtes)`);
