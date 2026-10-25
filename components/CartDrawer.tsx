"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Gift, Lock, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { Drawer } from "vaul";
import { FITS, getProduct, sizeCode } from "@/lib/products";
import { useMediaQuery } from "@/lib/use-media-query";
import { PAYMENT_METHODS, PaymentMark } from "./Brand";
import { MAX_QTY, useStore } from "./StoreProvider";

const GIFTS = [getProduct("musk")!, getProduct("siwak")!];
const TAP = { type: "spring", stiffness: 500, damping: 30 } as const;

function Qty({ qty, name, onChange }: { qty: number; name: string; onChange: (n: number) => void }) {
  return (
    <div className="flex w-fit items-center rounded-full border border-line">
      <m.button whileTap={{ scale: 0.95 }} transition={TAP} onClick={() => onChange(qty - 1)} aria-label={qty === 1 ? `Verwijder ${name}` : `Minder ${name}`} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-black/[0.04] md:h-9 md:w-9">{qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</m.button>
      <span className="relative h-12 w-8 overflow-hidden text-center text-sm leading-[3rem] tabular-nums md:h-9 md:leading-9" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          <m.span key={qty} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">{qty}</m.span>
        </AnimatePresence>
      </span>
      <m.button whileTap={{ scale: 0.95 }} transition={TAP} onClick={() => onChange(qty + 1)} disabled={qty >= MAX_QTY} aria-label={`Meer ${name}`} className="flex disabled:cursor-not-allowed disabled:opacity-30 h-12 w-12 items-center justify-center rounded-full hover:bg-black/[0.04] md:h-9 md:w-9"><Plus size={14} /></m.button>
    </div>
  );
}

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, setQty, lineUnit, subtotal, giftUnlocked, giftSets, freeShipping, remainingForShipping, money, count, lastAdded } = useStore();
  // Mobiel: bottom sheet die je omlaag wegveegt; vanaf tablet: zijlade rechts.
  const desktop = useMediaQuery("(min-width: 768px)");


  return (
    <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen} direction={desktop ? "right" : "bottom"}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col border-t border-line bg-paper outline-none md:inset-y-0 md:left-auto md:right-0 md:max-h-none rounded-t-[1.5rem] md:w-full md:max-w-[440px] md:rounded-none md:border-l md:border-t-0">
          <div aria-hidden className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-black/15 md:hidden" />
          <div className="flex items-center justify-between border-b border-line px-6 py-3 md:py-4">
            <Drawer.Title className="display text-xl">Winkelwagen <span className="text-sm font-normal text-taupe">({count})</span></Drawer.Title>
            <Drawer.Close aria-label="Sluit winkelwagen" className="press -mr-3 flex h-12 w-12 items-center justify-center md:-mr-2 md:h-10 md:w-10"><X size={20} /></Drawer.Close>
          </div>
          <Drawer.Description className="sr-only">Je geselecteerde producten, cadeau en verzending.</Drawer.Description>

          <div className="mx-4 mt-1 rounded-2xl bg-studio px-5 py-4">
            {/* Geen voortgangsbalk: in Nederland (de meeste klanten) is verzending altijd gratis, een halfvolle balk zei het tegendeel. */}
            <p className="flex items-start gap-2 text-[0.8125rem]" aria-live="polite">
              <Truck size={15} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                <strong className="block font-medium">{freeShipping ? "Gratis verzending in Nederland en de EU" : "Gratis verzending in Nederland"}</strong>
                {!freeShipping && lines.length > 0 && <span className="text-taupe">Naar de rest van de EU nog {money(remainingForShipping)} tot gratis verzending.</span>}
              </span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-[0.8125rem]">
              <Gift size={15} className="shrink-0" aria-hidden />
              {giftUnlocked
                ? <strong className="font-medium">Gratis musk & siwak{giftSets > 1 ? ` (${giftSets}×, één set per thobe)` : ""} zit bij je bestelling</strong>
                : "Bij elke thobe krijg je gratis musk & siwak"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6" data-vaul-no-drag>
            {lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                <ShoppingBag strokeWidth={1} size={44} className="text-taupe" aria-hidden />
                <p className="display text-xl">Je winkelwagen is leeg</p>
                <Drawer.Close className="press btn-ghost min-h-12 px-6 py-3 text-sm font-medium">Verder winkelen</Drawer.Close>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {/* Zonder layout-engine: een verwijderde regel dooft kort uit, daarna sluit de lijst aan. */}
                <AnimatePresence initial={false}>
                  {lines.map((l) => {
                    const p = getProduct(l.slug)!;
                    return (
                      <m.li key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.2 }} className={`flex gap-4 py-5 ${l.id === lastAdded && drawerOpen ? "just-added" : ""}`}>
                        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-studio"><Image src={p.images.primary} alt="" fill sizes="80px" className="object-cover mix-blend-multiply" /></div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <p className="font-medium leading-tight">{p.kind === "thobe" ? "Thobe " : ""}{p.name}</p>
                            <p className="text-sm tabular-nums">{money(lineUnit(l) * l.qty)}</p>
                          </div>
                          {l.size && <p className="mt-1 text-xs text-taupe">Maat {l.fit ? sizeCode(l.size, l.fit) : l.size} · {FITS.find((f) => f.id === l.fit)?.label}{l.giftBox ? " · In de geschenkdoos" : ""}</p>}
                          <div className="mt-auto"><Qty qty={l.qty} name={p.name} onChange={(n) => setQty(l.id, n)} /></div>
                        </div>
                      </m.li>
                    );
                  })}
                  {giftUnlocked && GIFTS.map((g) => (
                    <m.li key={g.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.2 }} className="flex items-center gap-4 py-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-studio"><Image src={g.images.primary} alt="" fill sizes="56px" className="object-cover mix-blend-multiply" /></div>
                      <div className="flex-1"><p className="text-sm font-medium leading-tight">{g.name}{giftSets > 1 && <span className="num ml-1.5 text-sm text-taupe">× {giftSets}</span>}</p><p className="text-xs text-taupe">Cadeau bij je thobe</p></div>
                      <p className="text-xs font-medium">Gratis</p>
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {lines.length > 0 && (
            <div className="border-t border-line px-6 py-5">
              <div className="flex items-baseline justify-between"><span className="text-sm text-taupe">Subtotaal incl. btw</span><span className="display text-2xl tabular-nums">{money(subtotal)}</span></div>              <Link href="/afrekenen" onClick={() => setDrawerOpen(false)} className="press btn-primary tag mt-4 flex min-h-14 w-full items-center justify-center py-4 !text-[0.9375rem]">Afrekenen</Link>
              <div className="mt-4 flex flex-col items-center gap-2.5">
                <p className="flex items-center gap-1.5 text-xs text-taupe-strong"><Lock size={12} aria-hidden /> Veilig betalen, SSL-versleuteld</p>
                <ul className="flex flex-wrap justify-center gap-1.5 text-ink/70" aria-label="Betaalmethodes">
                  {PAYMENT_METHODS.map((pm) => (
                    <li key={pm.name} className="flex h-7 items-center rounded-md border border-line px-2 [&_svg]:max-h-3.5"><PaymentMark method={pm} /></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
