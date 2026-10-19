import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import home from "@/content/home.json";
import { GIFT_VALUE } from "@/lib/products";
import { Price } from "./Price";

export function CraftSection() {
  return (
    <>
      <section id="vakmanschap" className="on-dark relative isolate flex min-h-[80svh] items-end overflow-hidden bg-obsidian text-ivory">
        <Image src="/img/hero.jpg" alt="" fill sizes="100vw" className="-z-20 origin-bottom scale-[2.6] object-cover object-[50%_100%] saturate-[0.8] sepia-[0.18]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/90 via-obsidian/50 to-obsidian/20" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-40 lg:px-10 lg:pb-24">
          <h2 className="max-w-3xl font-serif text-5xl leading-[0.98] md:text-7xl">{home.craft.title} <em>{home.craft.titleItalic}</em></h2>
          <p className="mt-8 max-w-xl leading-relaxed text-ivory/80">
            {home.craft.text}
          </p>
          <Link href="/#collectie" className="press btn-light mt-10 inline-block px-8 py-4 text-sm font-medium">{home.craft.button}</Link>
        </div>
      </section>

      <section className="border-b border-line bg-sand" aria-label="Gratis cadeau">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex shrink-0 -space-x-3" aria-hidden>
              {["/img/musk-1.jpg", "/img/siwak-2.jpg"].map((src) => (
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
