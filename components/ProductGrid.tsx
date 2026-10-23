import home from "@/content/home.json";
import { isThobe, products } from "@/lib/products";
import { GiftStrip } from "./GiftStrip";
import { ProductCard } from "./ProductCard";
import { Reveal, SplitTitle } from "./Reveal";

// Leverbaar eerst (sort is stabiel, de CMS-volgorde blijft verder intact).
const thobes = products.filter(isThobe).sort((a, b) => Number(!!a.soldOut) - Number(!!b.soldOut));
// Drie kolommen op desktop: valt de laatste rij één plek kort, dan vullen musk en siwak die plek; anders een eigen rij.
// De doos heeft verderop een eigen blok.
const giftSpan = thobes.length % 3 === 2 ? "lg:col-span-1" : "lg:col-span-3";

// De thobes even groot naast elkaar, musk en siwak op hun eigen schaal ernaast of eronder.
export function ProductGrid() {
  return (
    <section id="collectie" aria-labelledby="collectie-title" className="bg-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-28">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="collectie-title" className="display text-[clamp(2.25rem,4.4vw,3.75rem)]"><SplitTitle first={home.collection.title} second={home.collection.titleSecond} /></h2>
          <Reveal className="lg:pb-1.5"><p className="max-w-[44ch] leading-relaxed text-muted">{home.collection.text}</p></Reveal>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:mt-14 lg:grid-cols-3 lg:gap-x-6">
          {thobes.map((p, i) => <Reveal key={p.slug} delay={0.1 * i}><ProductCard product={p} sizes="(min-width:1024px) 33vw, 50vw" /></Reveal>)}
          <Reveal delay={0.2} className={`col-span-2 ${giftSpan}`}><GiftStrip className="h-full" /></Reveal>
        </div>
      </div>
    </section>
  );
}
