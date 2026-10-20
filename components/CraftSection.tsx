import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import home from "@/content/home.json";
import { GIFT_VALUE, getProduct } from "@/lib/products";

const GIFTS = ["musk", "siwak"].map((slug) => getProduct(slug)!.images.primary);
import { Price } from "./Price";
import { ClipReveal } from "./ClipReveal";

export function CraftSection() {
  return (
    <>
      {/* Scherpe detailfoto naast de tekst (zelfde opbouw als het pasvorm-blok), i.p.v. een opgeblazen uitsnede van de hero. */}
      <section id="vakmanschap" className="on-dark bg-obsidian py-24 text-ivory lg:py-32">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 lg:grid-cols-[6fr_5fr] lg:gap-24 lg:px-10">
          <div>
            <h2 className="max-w-xl font-serif text-5xl leading-[0.98] md:text-7xl">{home.craft.title} <em>{home.craft.titleItalic}</em></h2>
            <p className="mt-8 max-w-lg leading-relaxed text-ivory/75">{home.craft.text}</p>
            <dl className="mt-10 grid max-w-lg grid-cols-3 border-t border-white/15">
              {home.craft.facts.map((f) => (
                <div key={f.label} className="pr-4 pt-5">
                  <dt className="text-xs text-ivory/55">{f.label}</dt>
                  <dd className="mt-1.5 font-serif text-xl leading-tight sm:text-2xl">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/#collectie" className="press btn-light mt-10 inline-flex min-h-12 items-center px-8 py-4 text-sm font-medium">{home.craft.button}</Link>
          </div>
          <ClipReveal className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:max-w-none">
            <Image src={home.craft.image} alt={home.craft.imageAlt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-[60%_30%]" />
          </ClipReveal>
        </div>
      </section>

      <section className="border-b border-line bg-sand" aria-label="Gratis cadeau">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex shrink-0 -space-x-3" aria-hidden>
              {GIFTS.map((src) => (
                <div key={src} className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-sand bg-ivory">
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
            <p className="max-w-xl font-serif text-2xl leading-snug md:text-3xl">
              <Gift size={22} className="mr-2 inline text-ink" aria-hidden />
              {home.craft.giftText} <Price price={GIFT_VALUE} />
            </p>
          </div>
          <Link href={`/product/${home.craft.giftProduct}`} className="press inline-flex min-h-12 items-center self-start border border-ink px-6 py-3 text-sm font-medium hover:bg-ink hover:text-ivory md:self-auto">{home.craft.giftButton}</Link>
        </div>
      </section>
    </>
  );
}
