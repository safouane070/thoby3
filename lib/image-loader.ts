// Statische export heeft geen image-server: scripts/images.mjs maakt bij de build van elke foto in public/img
// een WebP per breedte uit lib/image-sizes.json. Deze loader wijst next/image naar die bestanden.
// ponytail: één kwaliteit (80) voor alles; de quality-prop wordt genegeerd. Pas aan in scripts/images.mjs als dat nodig is.
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/img/")) return src;
  return `/_img/${src.slice("/img/".length).replace(/\.[a-z0-9]+$/i, "")}-${width}.webp`;
}
