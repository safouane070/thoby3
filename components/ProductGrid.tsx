import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import home from "@/content/home.json";
import { isThobe, products, whatsapp } from "@/lib/products";
import { GiftStrip } from "./GiftStrip";
import { ProductCard } from "./ProductCard";
import { Reveal, SplitTitle } from "./Reveal";

// Alleen wat leverbaar is krijgt een grote kaart; een uitverkochte kleur is een smalle regel "binnenkort terug",
// zodat de helft van de collectie niet als "niet te koop" oogt.
const thobes = products.filter(isThobe);
const available = thobes.filter((p) => !p.soldOut);
const soon = thobes.filter((p) => p.soldOut);
// Drie kolommen op desktop: de zijkolom (binnenkort terug + musk en siwak) vult de rest van de laatste rij.
const rest = 3 - (available.length % 3 || 3);
const sideSpan = ["lg:col-span-3", "lg:col-span-1", "lg:col-span-2"][rest];
// Telefoon: één leverbare thobe over de volle breedte; vanaf tablet staat de zijkolom ernaast (anders wordt de foto metershoog).
const single = available.length === 1;
const cardSpan = single ? "col-span-2 sm:col-span-1" : "";

function ComingBack() {
  if (!soon.length) return null;
  return (
    <section aria-labelledby="soon-title" className="rounded-2xl border border-line p-4 sm:p-5">
      <h3 id="soon-title" className="caption text-muted">Binnenkort terug</h3>
      <ul className="mt-3 space-y-3">
        {soon.map((p) => (
          <li key={p.slug} className="flex items-center gap-4">
            <Link href={`/product/${p.slug}`} className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-studio" tabIndex={-1} aria-hidden>
              <Image src={p.images.primary} alt="" fill sizes="48px" className="object-cover opacity-70 mix-blend-multiply" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${p.slug}`} className="font-medium underline-offset-4 hover:underline"><span className="sr-only">Thobe </span>{p.name}</Link>
              <p className="flex items-center gap-2 text-sm text-muted">
                {p.colors[0] && <span aria-hidden className="h-3 w-3 shrink-0 rounded-full ring-1 ring-line-strong" style={{ background: p.colors[0].hex }} />}
                Uitverkocht
              </p>
            </div>
            <a href={whatsapp(`Hoi THOBY3, laat me weten wanneer de Thobe ${p.name} weer op voorraad is.`)} target="_blank" rel="noopener noreferrer"
              aria-label={`Laat het me weten als ${p.name} terug is`}
              className="press btn-ghost tag flex min-h-11 shrink-0 items-center gap-2 px-4 !text-[0.8125rem]">
              <Bell size={14} aria-hidden /> Herinner me
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// De thobes even groot naast elkaar, musk en siwak op hun eigen schaal ernaast of eronder.
export function ProductGrid() {
  return (
    <section id="collectie" aria-labelledby="collectie-title" className="bg-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-28">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="collectie-title" className="display text-[clamp(2.25rem,4.4vw,3.75rem)]"><SplitTitle first={home.collection.title} second={home.collection.titleSecond} /></h2>
          <Reveal className="lg:pb-1.5"><p className="max-w-[44ch] leading-relaxed text-muted">{home.collection.text}</p></Reveal>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:mt-14 lg:grid-cols-3 lg:gap-x-6">
          {available.map((p, i) => (
            <Reveal key={p.slug} delay={0.1 * i} className={cardSpan}>
              <ProductCard product={p} sizes={single ? "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" : "(min-width:1024px) 33vw, 50vw"} />
            </Reveal>
          ))}
          <Reveal delay={0.2} className={`col-span-2 flex flex-col gap-4 ${single ? "sm:col-span-1" : ""} ${sideSpan}`}>
            <ComingBack />
            <GiftStrip />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
