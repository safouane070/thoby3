"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart, Plus, X } from "lucide-react";
import { BLUR, FITS, SIZES, discountPct, isThobe, type Fit, type Product } from "@/lib/products";
import { FitSilhouette } from "./FitSilhouette";
import { FitToggle } from "./FitToggle";
import { Price } from "./Price";
import { useStore } from "./StoreProvider";
import { useAfterPaint } from "@/lib/after-paint";
import { useMediaQuery } from "@/lib/use-media-query";

function SizePicker({ product, fit, onClose }: { product: Product; fit: Fit; onClose: () => void }) {
  const { add } = useStore();
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8, transition: { duration: 0.12 } }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-2 bottom-2 z-20 border border-line bg-ivory/95 p-3 backdrop-blur-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-taupe">Kies je maat · {FITS.find((f) => f.id === fit)!.label}</p>
        <button onClick={onClose} aria-label="Sluiten" className="press -m-1 p-1"><X size={14} /></button>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {SIZES.map((s) => (
          <button key={s.label} title={s.bodyHeight} onClick={() => { add({ slug: product.slug, size: s.label, fit }); onClose(); }}
            className="press min-h-12 border border-line py-3 text-sm hover:border-ink hover:bg-ink hover:text-ivory sm:py-2.5 lg:min-h-0">
            {s.label}
          </button>
        ))}
      </div>
    </m.div>
  );
}

/** Eén labelstijl voor alles op een productfoto (korting, binnenkort terug). */
export const BADGE = "border border-line-strong bg-ivory/90 px-2 py-1 text-[0.6875rem] font-medium text-ink";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish, add } = useStore();
  const [picking, setPicking] = useState(false);
  // De sfeerfoto verschijnt alleen bij hover met een muis: touch-toestellen downloaden hem niet, en desktop pas na de eerste paint.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const hoverImg = useAfterPaint() && canHover;
  const [fit, setFit] = useState<Fit>("slim");
  const wished = wishlist.includes(product.slug);
  const href = isThobe(product) ? `/product/${product.slug}?fit=${fit}` : `/product/${product.slug}`;
  const pct = discountPct(product);
  const thobe = isThobe(product);

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden border border-line bg-sand transition-[border-color] duration-200 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:border-line-strong">
        {/* Hover: alleen een rustige crossfade naar de sfeerfoto, en alleen met een muis (hoverImg). Hover zie je vaak: geen extra beweging. */}
        <Link href={href} className="absolute inset-0 block" aria-label={product.name} tabIndex={-1}>
          <Image src={product.images.primary} alt={product.name} fill sizes="(min-width:1024px) 25vw, 50vw" placeholder="blur" blurDataURL={BLUR}
            className={`object-cover mix-blend-multiply transition-opacity duration-[400ms] ease-[ease] ${hoverImg ? "group-hover:opacity-0" : ""}`} />
          {hoverImg && (
            <Image src={product.images.lifestyle} alt="" fill sizes="(min-width:1024px) 25vw, 50vw"
              className="object-cover opacity-0 mix-blend-multiply transition-opacity duration-[400ms] ease-[ease] group-hover:opacity-100" />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {pct > 0 && <span className={BADGE}>-{pct}%</span>}
          {product.soldOut && <span className={BADGE}>Binnenkort terug</span>}
        </div>

        <button onClick={() => toggleWish(product.slug)} aria-pressed={wished} aria-label={wished ? "Verwijder uit verlanglijst" : "Zet op verlanglijst"}
          className="press absolute right-2 top-2 z-10 flex h-12 w-12 items-center lg:h-10 lg:w-10 justify-center rounded-full bg-ivory/80 backdrop-blur-md hover:bg-ivory">
          <Heart size={16} className={`transition-colors duration-200 ${wished ? "fill-ink text-ink" : ""}`} />
        </button>

        {!product.soldOut && !picking && (
          <button
            onClick={() => (thobe ? setPicking(true) : add({ slug: product.slug }))}
            className="press absolute inset-x-2 bottom-2 z-10 flex min-h-12 items-center justify-center gap-2 bg-ink py-3 text-xs lg:min-h-0 font-medium text-ivory hover:bg-ink/90 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-[opacity,transform] [@media(hover:hover)]:duration-200 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <Plus size={14} aria-hidden /> Snel toevoegen
          </button>
        )}
        <AnimatePresence>{picking && <SizePicker product={product} fit={fit} onClose={() => setPicking(false)} />}</AnimatePresence>
      </div>

      {/* Smalle kaarten (2 kolommen op telefoon): prijs onder de titel, anders wordt de naam in drie regels geperst. */}
      <div className="mt-4 flex flex-col gap-1 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between min-[480px]:gap-3">
        <h3 className="font-serif text-xl leading-tight sm:text-2xl"><Link href={href} className="-mx-2 -my-3 inline-block px-2 py-3 underline-offset-4 hover:underline">{thobe ? `Thobe ${product.name}` : product.name}</Link></h3>
        <Price price={product.price} compareAt={product.compareAt} className="text-sm min-[480px]:flex-col min-[480px]:!items-end min-[480px]:!gap-0 min-[480px]:pt-0.5" />
      </div>

      {thobe && !product.soldOut && (
        // Op smalle kaarten (2 kolommen) geen formulier: de pasvorm kies je in de maatkiezer of op de productpagina.
        <div className="mt-3 hidden items-center gap-3 md:flex">
          <FitSilhouette fit={fit} className="h-10 w-5 shrink-0 text-ink" />
          <FitToggle value={fit} onChange={setFit} id={`fit-${product.slug}`} className="flex-1" />
        </div>
      )}
    </article>
  );
}
