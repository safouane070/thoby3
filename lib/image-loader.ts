// Statische export heeft geen image-server: scripts/images.mjs maakt bij de build van elke foto in public/img
// een WebP per breedte uit lib/image-sizes.json, met een hash van de foto in de naam. Deze loader wijst next/image ernaar.
// ponytail: één kwaliteit (80) voor alles; de quality-prop wordt genegeerd. Pas aan in scripts/images.mjs als dat nodig is.
import manifest from "./image-manifest.json";

const hashes: Record<string, string> = manifest;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/img/")) return src;
  const base = src.slice("/img/".length).replace(/\.[a-z0-9]+$/i, "");
  // Geen variant (bijv. een foto in een submap): dan het origineel, liever groot dan kapot.
  return hashes[base] ? `/_img/${base}-${width}.${hashes[base]}.webp` : src;
}
