// Next 16 schrijft segment-prefetches bij een statische export als mappen (product/x/__next.product/$d$slug/__PAGE__.txt),
// maar de browser vraagt één platte naam (product/x/__next.product.$d$slug.__PAGE__.txt) en krijgt dan een 404.
// Dit zet na de build naast elke geneste prefetch een platte kopie. ponytail: weghalen zodra Next dit zelf goed doet.
import fs from "node:fs";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "../out");
let made = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("__next.")) flatten(p, dir, e.name);
    else walk(p);
  }
}

// Elk bestand onder een __next.*-map krijgt een kopie in de oudermap, met de tussenliggende mappen als punten in de naam.
function flatten(root, parent, prefix) {
  const stack = [[root, prefix]];
  while (stack.length) {
    const [dir, name] = stack.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const src = path.join(dir, e.name);
      if (e.isDirectory()) stack.push([src, `${name}.${e.name}`]);
      else {
        fs.copyFileSync(src, path.join(parent, `${name}.${e.name}`));
        made++;
      }
    }
  }
}

if (!fs.existsSync(out)) throw new Error("out/ bestaat niet: draai eerst next build");
walk(out);
console.log(`prefetch: ${made} platte kopieën gemaakt in out/`);
