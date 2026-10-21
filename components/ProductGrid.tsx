import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import home from "@/content/home.json";
import { GIFT_BOX_PRICE, eur, isThobe, products } from "@/lib/products";
import { ProductCard } from "./ProductCard";

// Uitverkocht achteraan (sort is stabiel, de CMS-volgorde blijft verder intact). De eerste leverbare thobe staat groot.
const sorted = [...products].sort((a, b) => Number(!!a.soldOut) - Number(!!b.soldOut));
const feature = sorted.find((p) => isThobe(p) && !p.soldOut) ?? sorted[0];
const rest = sorted.filter((p) => p !== feature);

export function ProductGrid() {
  return (
    <section id="collectie" aria-labelledby="collectie-title" className="bg-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="collectie-title" className="display text-[clamp(2.5rem,4.6vw,4.25rem)]">{home.collection.title}{home.collection.titleSecond && <><br />{home.collection.titleSecond}</>}</h2>
          <p className="max-w-[44ch] leading-relaxed text-muted lg:pb-2">{home.collection.text}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:mt-16 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10">
          <div className="col-span-2 lg:col-span-6 lg:row-span-2"><ProductCard product={feature} feature /></div>
          {rest.map((p) => <div key={p.slug} className="lg:col-span-3"><ProductCard product={p} /></div>)}

          {/* De geschenkdoos als vierde tegel: geen product, wel een keuze bij elke thobe. */}
          <Link href="/#doos" className="group relative flex min-h-64 flex-col justify-end overflow-hidden bg-board p-4 text-paper sm:p-5 lg:col-span-3">
            <Image src="/img/box-sand.jpg" alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover object-[55%_40%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-board/90 via-board/30 to-transparent" />
            <span className="relative">
              <span className="display block text-[clamp(1.125rem,5.2vw,1.75rem)] lg:text-[1.75rem]">In de geschenkdoos</span>
              <span className="tag mt-2 flex items-center gap-2 text-paper/85">Bij elke thobe, + {eur(GIFT_BOX_PRICE)} <ArrowRight size={14} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" /></span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
