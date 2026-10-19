import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { discountPct, products } from "@/lib/products";
import { Price } from "./Price";

const hero = products[0];
// CSS-entree in plaats van Framer: speelt al vóór hydration, dus de kop (LCP) wacht niet op JavaScript.
const rise = (i: number) => ({ animationDelay: `${80 + i * 60}ms` });

// Compositie: de kop staat in de lege lucht, de karavaan blijft vrij, copy en CTA liggen op de duinen.
export function Hero() {
  return (
    <section className="on-dark relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-obsidian text-ivory">
      <Image src="/img/hero.jpg" alt="Karavaan kamelen op een duin bij zonsondergang" fill preload sizes="100vw" className="-z-20 object-cover object-[50%_60%] saturate-[0.85]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/45 via-transparent via-30% to-obsidian/90 to-75%" />

      <div className="mx-auto w-full max-w-[1440px] px-5 pt-40 lg:px-10 lg:pt-44">
        {/* Alleen beweging, geen fade: een onzichtbare kop telt niet als LCP. */}
        <h1 style={rise(0)} className="rise-y font-serif text-[clamp(3rem,7.4vw,6.5rem)] font-medium leading-[0.95]">
          De <span className="whitespace-nowrap">White-Desert</span><br /><em className="font-normal">Thobe</em>
        </h1>
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] items-end gap-8 px-5 pb-12 pt-24 lg:grid-cols-[1fr_auto] lg:px-10 lg:pb-16">
        <div>
          <p style={rise(1)} className="rise max-w-md leading-relaxed text-ivory/85">
            Ervaar de serene en pure uitstraling van de woestijn. Elke maat in twee pasvormen, ontworpen voor jouw postuur.
          </p>
          <div style={rise(2)} className="rise mt-7 flex flex-wrap gap-3">
            <Link href="/#collectie" className="press btn-light group inline-flex items-center gap-3 px-7 py-4 text-sm font-medium">
              Shop de collectie <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/#vakmanschap" className="press inline-flex items-center border border-white/35 px-7 py-4 text-sm font-medium hover:border-white/70 hover:bg-white/10">
              Ontdek ons vakmanschap
            </Link>
          </div>
        </div>

        <div style={rise(3)} className="rise hidden lg:block">
          <Link href={`/product/${hero.slug}`} className="press flex w-[340px] items-center gap-5 bg-ivory p-3 text-ink hover:bg-white">
            <div className="relative h-32 w-24 shrink-0 bg-sand">
              <Image src={hero.images.primary} alt="Thobe White Desert" fill sizes="96px" className="object-cover object-top mix-blend-multiply" />
            </div>
            <div>
              <p className="text-xs font-medium">-{discountPct(hero)}% nu</p>
              <p className="mt-1 font-serif text-2xl leading-tight">Thobe White Desert</p>
              <Price price={hero.price} compareAt={hero.compareAt} className="mt-1 text-sm" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
