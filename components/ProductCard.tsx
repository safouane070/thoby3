"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Bell, Heart, Plus, X } from "lucide-react";
import { BLUR, FITS, SIZES, discountPct, isThobe, sizeCode, whatsapp, type Fit, type Product } from "@/lib/products";
import { Price } from "./Price";
import { useStore } from "./StoreProvider";
import { useAfterPaint } from "@/lib/after-paint";
import { useMediaQuery } from "@/lib/use-media-query";

// Vaul hoort niet in de eerste bundel: de maat-sheet laadt pas bij de eerste tik op "Kies je maat".
const SizeSheet = dynamic(() => import("./SizeSheet").then((m) => m.SizeSheet), { ssr: false });

function SizePicker({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add, pref } = useStore();
  // Begint op jouw bewaarde pasvorm; jouw maat staat gemarkeerd.
  const [fit, setFit] = useState<Fit>(pref.fit ?? "slim");
  return (
    // Groeit uit de knop onderin (origin onder), met de volledige transform-string zodat hij op de compositor draait.
    <m.div
      initial={{ opacity: 0, transform: "translateY(8px) scale(0.97)" }} animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      exit={{ opacity: 0, transform: "translateY(4px) scale(0.98)", transition: { duration: 0.12 } }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-x-2 bottom-2 z-20 origin-bottom rounded-2xl border border-line bg-paper/90 p-3 text-ink shadow-[0_16px_40px_-16px_rgba(11,11,11,0.35)] backdrop-blur-xl"
    >
      {/* Kop, pasvorm en maten elk op een eigen rij: past ook in een halve kaart op een telefoon van 320px. */}
      <div className="-mt-1 mb-1.5 flex items-center justify-between">
        <p className="caption">Kies je maat</p>
        <button onClick={onClose} aria-label="Sluiten" className="press -mr-2 flex h-10 w-10 items-center justify-center rounded-full"><X size={16} /></button>
      </div>
      <div role="group" aria-label="Pasvorm" className="mb-1.5 grid grid-cols-2 gap-1 rounded-full bg-studio p-1">
        {FITS.map((f) => (
          <button key={f.id} type="button" aria-pressed={fit === f.id} onClick={() => setFit(f.id)}
            className={`press tag min-h-9 rounded-full px-1 !text-[0.8125rem] ${fit === f.id ? "bg-paper shadow-[0_1px_3px_rgba(11,11,11,0.12)]" : "text-muted"}`}>{f.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {SIZES.map((s) => (
          <button key={s.label} title={s.bodyHeight} aria-label={`Maat ${sizeCode(s.label, fit)}, ${s.bodyHeight}, in winkelwagen`}
            onClick={() => { add({ slug: product.slug, size: s.label, fit }); onClose(); }}
            className={`press min-h-11 rounded-xl border text-sm font-medium hover:border-ink ${pref.size === s.label ? "border-ink" : "border-line-strong"}`}>
            {s.label}
          </button>
        ))}
      </div>
    </m.div>
  );
}

/** Eén labelstijl voor alles op een productfoto (korting, binnenkort terug). */
export const BADGE = "rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink";

// Foto op het studiogrijs met ronde hoeken, eronder naam, prijs en kleur. Geen kader: de foto draagt de kaart.
// Maat kiezen: met een muis in de kaart zelf, op telefoon en tablet in een sheet onderin (grote tikvlakken).
export function ProductCard({ product, sizes = "(min-width:1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const { wishlist, toggleWish, add } = useStore();
  const [picking, setPicking] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [sheetReady, setSheetReady] = useState(false);
  const small = useMediaQuery("(max-width: 1023px)");
  // De sfeerfoto verschijnt alleen bij hover met een muis: touch-toestellen downloaden hem niet, en desktop pas na de eerste paint.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const hoverImg = useAfterPaint() && canHover;
  const wished = wishlist.includes(product.slug);
  const href = `/product/${product.slug}`;
  const pct = discountPct(product);
  const thobe = isThobe(product);
  // Elke kaart toont eerst de hele thobe (zo zie je wat je koopt); de sfeerfoto komt bij hover met een muis.
  const [base, swap] = [product.images.primary, product.images.lifestyle];

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-studio">
        {/* Hover: alleen een rustige crossfade naar de sfeerfoto, en alleen met een muis. */}
        <Link href={href} className={`absolute inset-0 block ${product.soldOut ? "opacity-55" : ""}`} aria-label={product.name} tabIndex={-1}>
          <Image src={base} alt={product.name} fill sizes={sizes} placeholder="blur" blurDataURL={BLUR}
            className={`${thobe ? "object-cover" : "object-contain p-[12%]"} mix-blend-multiply transition-opacity duration-[400ms] ease-[ease] ${hoverImg ? "group-hover:opacity-0" : ""}`} />
          {hoverImg && (
            <Image src={swap} alt="" fill sizes={sizes}
              className="object-cover opacity-0 mix-blend-multiply transition-opacity duration-[400ms] ease-[ease] group-hover:opacity-100" />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {pct > 0 && <span className={BADGE}>-{pct}%</span>}
          {product.soldOut && <span className={BADGE}>Uitverkocht</span>}
        </div>

        <button onClick={() => toggleWish(product.slug)} aria-pressed={wished} aria-label={wished ? "Verwijder uit verlanglijst" : "Zet op verlanglijst"}
          className="press absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-paper/70 lg:h-10 lg:w-10">
          <Heart size={18} className={`transition-colors duration-200 ${wished ? "fill-ink" : ""}`} />
        </button>

        {/* Met een muis: een pil die bij hover verschijnt. Op touch: een rond plusje in de hoek, zodat de thobe zichtbaar blijft. */}
        {!product.soldOut && !picking && (
          <button
            onClick={() => {
              if (!thobe) return add({ slug: product.slug });
              if (small) { setSheetReady(true); setSheet(true); } else setPicking(true);
            }}
            aria-label={thobe ? `Kies je maat voor ${product.name}` : `${product.name} in winkelwagen`}
            className="press tag absolute bottom-3 z-10 flex min-h-11 items-center justify-center gap-2 rounded-full bg-paper/90 text-ink shadow-[0_8px_24px_-12px_rgba(11,11,11,0.3)] backdrop-blur-md hover:bg-paper [@media(hover:none)]:right-3 [@media(hover:none)]:w-11 [@media(hover:hover)]:inset-x-3 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-[opacity,transform] [@media(hover:hover)]:duration-200 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            <Plus size={16} aria-hidden /> <span className="[@media(hover:none)]:sr-only">{thobe ? "Kies je maat" : "In winkelwagen"}</span>
          </button>
        )}
        {/* Uitverkocht: geen doodlopende kaart, maar een seintje via WhatsApp zodra hij terug is. */}
        {product.soldOut && (
          <a href={whatsapp(`Hoi THOBY3, laat me weten wanneer de ${thobe ? "Thobe " : ""}${product.name} weer op voorraad is.`)} target="_blank" rel="noopener noreferrer"
            aria-label={`Laat het me weten als ${product.name} terug is`}
            className="press tag absolute inset-x-3 bottom-3 z-10 flex min-h-11 items-center justify-center gap-2 rounded-full bg-paper/90 !text-[0.8125rem] text-ink shadow-[0_8px_24px_-12px_rgba(11,11,11,0.3)] backdrop-blur-md hover:bg-paper">
            <Bell size={14} aria-hidden /> Herinner me
          </a>
        )}
        <AnimatePresence>{picking && <SizePicker product={product} onClose={() => setPicking(false)} />}</AnimatePresence>
        {sheetReady && <SizeSheet product={product} open={sheet} onOpenChange={setSheet} />}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex flex-col gap-0.5 min-[480px]:flex-row min-[480px]:items-baseline min-[480px]:justify-between min-[480px]:gap-3">
          <h3 className="font-medium">
            <Link href={href} className="underline-offset-4 hover:underline">{thobe ? <><span className="sr-only">Thobe </span>{product.name}</> : product.name}</Link>
          </h3>
          <Price price={product.price} compareAt={product.compareAt} className="num" />
        </div>
        {thobe ? (
          // Op touch is de bestelknop niet altijd zichtbaar: de status staat daarom ook bij de tekst.
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            {product.colors[0] && <span aria-hidden className="h-3 w-3 shrink-0 rounded-full ring-1 ring-line-strong" style={{ background: product.colors[0].hex }} />}
            <span>{product.colors[0] && <span className="max-sm:sr-only">{product.colors[0].name} · </span>}{product.soldOut ? "Uitverkocht" : "Op voorraad"}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted">Gratis bij elke thobe</p>
        )}
      </div>
    </article>
  );
}
