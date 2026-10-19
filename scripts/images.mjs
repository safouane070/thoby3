// Maakt van elke foto in public/img een WebP per breedte (lib/image-sizes.json) in public/_img.
// Draait vóór dev en build; bestaande, actuele bestanden worden overgeslagen. Nooit groter dan het origineel.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public/img");
const out = path.join(root, "public/_img");
const sizes = JSON.parse(fs.readFileSync(path.join(root, "lib/image-sizes.json"), "utf8"));
const widths = [...sizes.imageSizes, ...sizes.deviceSizes];

fs.mkdirSync(out, { recursive: true });
let made = 0;
for (const file of fs.readdirSync(src)) {
  if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
  const input = path.join(src, file);
  const base = file.replace(/\.[a-z0-9]+$/i, "");
  const mtime = fs.statSync(input).mtimeMs;
  for (const w of widths) {
    const target = path.join(out, `${base}-${w}.webp`);
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= mtime) continue;
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target);
    made++;
  }
}
console.log(`images: ${made} WebP-bestanden gemaakt in public/_img (${widths.length} breedtes)`);
