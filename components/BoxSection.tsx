import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import home from "@/content/home.json";
import { GIFT_BOX_PRICE, eur } from "@/lib/products";
import { LidReveal } from "./LidReveal";
import { Parallax } from "./Parallax";
import { Reveal, SplitTitle } from "./Reveal";

const box = home.box;

// De geschenkdoos: links de belofte, rechts het deksel dat bij het scrollen wegkantelt, met de dichte doos
// in de hand als tweede foto die sneller meeschuift (diepte zonder schaduwtrucs).
export function BoxSection() {
  return (
    <section id="doos" aria-labelledby="doos-title" className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-32">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <h2 id="doos-title" className="display text-[clamp(2.25rem,4.4vw,3.75rem)]"><SplitTitle first={box.title} second={box.titleSecond} /></h2>
          <Reveal delay={0.1}><p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted">{box.text}</p></Reveal>
          <ul className="mt-8 space-y-3">
            {box.features.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={0.15 + i * 0.06} className="flex items-center gap-3">
                  <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-paper"><Check size={14} strokeWidth={2} /></span>
                  <span className="font-medium">{f.title}</span>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={`/product/${box.product}?box=1`} className="press btn-primary tag group inline-flex min-h-12 items-center gap-2.5 px-6 !text-[0.9375rem]">
              {box.button} <ArrowRight size={16} aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
            <p className="text-sm text-muted">+ {eur(GIFT_BOX_PRICE)} · musk & siwak altijd gratis</p>
          </Reveal>
        </div>

        <div className="relative pb-10 lg:pb-24">
          <div className="overflow-hidden rounded-[1.75rem]"><LidReveal src={box.image} alt={box.imageAlt} /></div>
          <Parallax distance={-120} className="absolute -bottom-2 left-4 w-[40%] max-w-[16rem] lg:-left-10">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-studio shadow-[0_30px_60px_-24px_rgba(11,11,11,0.45)] ring-[6px] ring-paper">
              <Image src={box.imageHeld} alt={box.imageHeldAlt} fill sizes="(min-width:1024px) 16rem, 40vw" className="object-cover" />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
