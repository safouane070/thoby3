"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart, Plus, X } from "lucide-react";
import { BLUR, FITS, SIZES, discountPct, isThobe, sizeCode, type Fit, type Product } from "@/lib/products";
import { Price } from "./Price";
import { useStore } from "./StoreProvider";
import { useAfterPaint } from "@/lib/after-paint";
import { useMediaQuery } from "@/lib/use-media-query";

function SizePicker({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add } = useStore();
  const [fit, setFit] = useState<Fit>("slim");
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8, transition: { duration: 0.12 } }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="board on-dark absolute inset-x-2 bottom-2 z-20 p-3"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div role="group" aria-label="Pasvorm" className="flex gap-1">
          {FITS.map((f) => (
            <button key={f.id} type="button" aria-pressed={fit === f.id} onClick={() => setFit(f.id)}
              className={`press tag min-h-10 border px-3 ${fit === f.id ? "border-gold text-gold shadow-[inset_0_0_0_1px_var(--gold)]" : "border-line-dark text-paper"}`}>{f.label}</button>
          ))}
        </div>
        <button onClick={onClose} aria-label="Sluiten" className="press -m-1 flex h-10 w-10 items-center justify-center text-paper"><X size={16} /></button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {SIZES.map((s) => (
          <button key={s.label} title={s.bodyHeight} aria-label={`Maat ${sizeCode(s.label, fit)}, ${s.bodyHeight}, in winkelwagen`}
            onClick={() => { add({ slug: product.slug, size: s.label, fit }); onClose(); }}
            className="press display min-h-12 border border-line-dark text-lg text-paper hover:border-gold hover:text-gold">
            {s.label}
          </button>
        ))}
      </div>
    </m.div>
  );
}

/** Eén labelstijl voor alles op een productfoto (korting, binnenkort terug). */
export const BADGE = "tag bg-ink px-2.5 py-1.5 !text-[0.6875rem] text-paper";

// Kaart als hangtag: foto op het studiogrijs, eronder het label met het ponsgaatje, de naam en de maatcodes van het nekmerk.
export function ProductCard({ product, feature = false }: { product: Product; feature?: boolean }) {
  const { wishlist, toggleWish, add } = useStore();
  const [picking, setPicking] = useState(false);
  // De sfeerfoto verschijnt alleen bij hover met een muis: touch-toestellen downloaden hem niet, en desktop pas na de eerste paint.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const hoverImg = useAfterPaint() && canHover;
  const wished = wishlist.includes(product.slug);
  const href = `/product/${product.slug}`;
  const pct = discountPct(product);
  const thobe = isThobe(product);

  return (
    <article className="group flex h-full flex-col">
      <div className={`relative overflow-hidden bg-studio ${feature ? "aspect-[4/5] lg:aspect-auto lg:min-h-[32rem] lg:flex-1" : "aspect-[3/4]"}`}>
        {/* Hover: alleen een rustige crossfade naar de sfeerfoto, en alleen met een muis. */}
        <Link href={href} className="absolute inset-0 block" aria-label={product.name} tabIndex={-1}>
          <Image src={product.images.primary} alt={product.name} fill sizes={feature ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"} placeholder="blur" blurDataURL={BLUR}
            className={`${thobe ? "object-cover" : "object-contain p-[12%]"} mix-blend-multiply transition-opacity duration-[400ms] ease-[ease] ${hoverImg ? "group-hover:opacity-0" : ""}`} />
          {hoverImg && (
            <Image src={product.images.lifestyle} alt="" fill sizes={feature ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
              className="object-cover opacity-0 mix-blend-multiply transition-opacity duration-[400ms] ease-[ease] group-hover:opacity-100" />
          )}
        </Link>

        <div className="pointer-events-none absolute bottom-3 left-3 flex flex-col items-start gap-1.5">
          {pct > 0 && <span className={BADGE}>-{pct}%</span>}
          {product.soldOut && <span className={BADGE}>Binnenkort terug</span>}
        </div>

        <button onClick={() => toggleWish(product.slug)} aria-pressed={wished} aria-label={wished ? "Verwijder uit verlanglijst" : "Zet op verlanglijst"}
          className="press absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center text-ink hover:text-gold-ink lg:h-10 lg:w-10">
          <Heart size={18} className={`transition-colors duration-200 ${wished ? "fill-ink" : ""}`} />
        </button>

        {!product.soldOut && !picking && (
          <button
            onClick={() => (thobe ? setPicking(true) : add({ slug: product.slug }))}
            className="press tag absolute inset-x-2 bottom-2 z-10 flex min-h-12 items-center justify-center gap-2 bg-ink text-paper hover:bg-[#2a2a2c] [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-[opacity,transform] [@media(hover:hover)]:duration-200 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <Plus size={14} aria-hidden /> {thobe ? "Kies je maat" : "In winkelwagen"}
          </button>
        )}
        <AnimatePresence>{picking && <SizePicker product={product} onClose={() => setPicking(false)} />}</AnimatePresence>
      </div>

      <div className={`flex flex-col border-x border-b border-line bg-paper px-4 pb-5 pt-5 sm:px-5 ${feature ? "" : "flex-1"}`}>
        <div className="flex flex-col gap-1 min-[480px]:flex-row min-[480px]:items-baseline min-[480px]:justify-between min-[480px]:gap-3">
          <h3 className={`display ${feature ? "text-[clamp(2rem,3.4vw,3rem)]" : "text-2xl sm:text-[1.75rem]"}`}>
            <Link href={href} className="underline-offset-4 hover:underline">{thobe ? <><span className="sr-only">Thobe </span>{product.name}</> : product.name}</Link>
          </h3>
          <Price price={product.price} compareAt={product.compareAt} className="num text-lg font-semibold" />
        </div>
        {thobe ? (
          <>
            {product.colors[0] && (
              <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                <span aria-hidden className="h-3 w-3 border border-line-strong" style={{ background: product.colors[0].hex }} /> {product.colors[0].name}
              </p>
            )}
            {product.soldOut ? null : feature ? (
              // Elke maatcode opent het product met die maat en pasvorm al gekozen.
              <ul aria-label="Kies een maat" className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {SIZES.flatMap((s) => (["slim", "broad"] as const).map((f) => ({ s, f }))).map(({ s, f }) => (
                  <li key={sizeCode(s.label, f)}>
                    <Link href={`${href}?${new URLSearchParams({ fit: f, size: s.label })}`} aria-label={`Maat ${sizeCode(s.label, f)}, ${s.bodyHeight}`}
                      className="press num flex min-h-9 min-w-11 items-center justify-center border border-line-strong px-2 text-sm font-bold hover:border-ink hover:bg-ink hover:text-gold">
                      {sizeCode(s.label, f)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tag mt-auto pt-3 !text-[0.75rem] text-muted">8 maten · <span className="whitespace-nowrap">S-1 t/m XL-2</span></p>
            )}
          </>
        ) : (
          <p className="mt-auto pt-3 text-sm text-gold-ink">Gratis bij elke thobe</p>
        )}
      </div>
    </article>
  );
}
