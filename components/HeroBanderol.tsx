"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FITS, GIFT_BOX_PRICE, SIZES, sizeCode, type Fit, type Product } from "@/lib/products";
import { Emblem } from "./Brand";
import { useStore } from "./StoreProvider";

// Eén lijnstijl voor alle keuzes in de balk. Goud vult alleen de knop; een gekozen optie krijgt een gouden lijn.
const OPTION = "press flex min-h-12 items-center justify-center border transition-colors duration-200";
const optionState = (on: boolean) => (on ? "border-gold text-gold shadow-[inset_0_0_0_1px_var(--gold)]" : "border-line-dark text-paper hover:border-paper/60");

/** De zwarte banderol uit de doos, als werkende maatkiezer: pasvorm, maat, doos en in de winkelwagen. */
export function HeroBanderol({ product, cta, help }: { product: Product; cta: string; help: string }) {
  const { add, money } = useStore();
  const id = useId();
  const [fit, setFit] = useState<Fit>("slim");
  const [size, setSize] = useState("");
  const [box, setBox] = useState(false);
  const [missing, setMissing] = useState(false);
  const sizes = useRef<HTMLDivElement>(null);
  const total = product.price + (box ? GIFT_BOX_PRICE : 0);
  const chosen = SIZES.find((s) => s.label === size);

  const submit = () => {
    if (!size) {
      setMissing(true);
      sizes.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
      return;
    }
    add({ slug: product.slug, size, fit, giftBox: box });
  };

  return (
    <div className="board on-dark relative">
      {/* De twee goudlijnen langs de randen van de echte banderol. */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1.5 h-px bg-gold/60" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-1.5 h-px bg-gold/60" />

      <div className="mx-auto grid max-w-[1440px] gap-x-8 gap-y-3.5 px-5 pb-6 pt-5 lg:px-10 xl:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] xl:items-end xl:py-8">
        <Emblem className="hidden h-14 text-gold xl:block xl:self-center" />

        <div className="flex items-baseline justify-between gap-4 xl:block">
          <Link href={`/product/${product.slug}`} className="display text-[1.75rem] text-paper underline-offset-4 hover:underline xl:text-[2rem]">
            <span className="sr-only">Thobe </span>{product.name}
          </Link>
          <Link href="/#pasvorm" className="tag inline-flex min-h-10 items-center gap-1.5 text-paper/80 underline decoration-paper/30 underline-offset-4 hover:text-paper xl:mt-2 xl:min-h-8">
            {help} <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        {/* Mobiel: pasvorm en maat op één regel, elk met een klein label erboven. Desktop: elk een eigen kolom in de balk. */}
        <div className="grid grid-cols-[2fr_4fr] gap-3 xl:flex xl:gap-8">
          <fieldset>
            <legend className="tag mb-2 !text-[0.6875rem] text-muted-dark xl:!text-[0.8125rem]">Pasvorm</legend>
            <div className="grid grid-cols-2 gap-1.5">
              {FITS.map((f) => (
                <button key={f.id} type="button" aria-pressed={fit === f.id} aria-label={`${f.label}, maat -${f.id === "slim" ? 1 : 2}`} onClick={() => setFit(f.id)}
                  className={`${OPTION} tag px-1 !text-[0.75rem] sm:px-3 sm:!text-[0.8125rem] ${optionState(fit === f.id)} xl:min-w-28`}>
                  {f.label}<span className="ml-1.5 hidden opacity-70 sm:inline">-{f.id === "slim" ? 1 : 2}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="tag mb-2 flex gap-2 !text-[0.6875rem] text-muted-dark xl:!text-[0.8125rem]">
              Maat {chosen && <span className="text-paper">{sizeCode(chosen.label, fit)} · {chosen.bodyHeight}</span>}
            </legend>
            <div ref={sizes} className="grid grid-cols-4 gap-1.5" aria-describedby={missing && !size ? `${id}-err` : undefined}>
              {SIZES.map((s) => (
                <button key={s.label} type="button" aria-pressed={size === s.label} aria-label={`Maat ${s.label}, ${s.bodyHeight}`}
                  onClick={() => { setSize(s.label); setMissing(false); }} className={`${OPTION} display text-xl ${optionState(size === s.label)} xl:w-14`}>
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 xl:flex xl:items-end xl:gap-8">
          <label className="flex min-h-12 cursor-pointer items-center gap-3">
            <input type="checkbox" checked={box} onChange={(e) => setBox(e.target.checked)} className="peer sr-only" />
            <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center border border-paper/50 text-gold transition-colors duration-200 peer-checked:border-gold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
              {box && <Check size={14} strokeWidth={2.5} />}
            </span>
            <span className="text-sm leading-snug text-paper">Geschenk&shy;doos <span className="block text-muted-dark">+ {money(GIFT_BOX_PRICE)}</span></span>
          </label>

          <div>
            <button type="button" onClick={submit} className="press btn-gold tag flex min-h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap px-4 !text-[0.875rem] !tracking-[0.08em] sm:gap-3 sm:px-6 sm:!text-[0.9375rem] sm:!tracking-[0.14em] xl:w-auto xl:px-7">
              {cta} <span className="num font-bold tracking-normal">{money(total)}</span>
            </button>
          </div>
        </div>
        {missing && !size && <p id={`${id}-err`} role="alert" className="text-sm text-paper xl:col-span-full xl:text-right">Kies eerst je maat.</p>}
      </div>
    </div>
  );
}
