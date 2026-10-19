"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Gift, Lock, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Drawer } from "vaul";
import { FITS, REWARD_FROM, getProduct } from "@/lib/products";
import { useMediaQuery } from "@/lib/use-media-query";
import { PAYMENT_METHODS, PaymentMark } from "./Brand";
import { MAX_QTY, useStore } from "./StoreProvider";

const GIFTS = [getProduct("musk")!, getProduct("siwak")!];
const TAP = { type: "spring", stiffness: 500, damping: 30 } as const;
const BURST = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);

// Eén drempel (€50): gratis verzending én cadeau. De badge krijgt bij het ontgrendelen eenmalig een ring en een korte burst.
function Reward({ progress, unlocked, burst, children }: { progress: number; unlocked: boolean; burst: number; children: ReactNode }) {
  return (
    <div>
      <p className="text-[0.8125rem]" aria-live="polite">{children}</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-0.5 flex-1 overflow-hidden bg-black/[0.08]" role="progressbar" aria-label="Voortgang naar gratis verzending en cadeau" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <m.div className="h-full origin-left bg-gold" initial={false} animate={{ scaleX: progress }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <span className="relative">
          <span key={burst} className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${unlocked ? "border-gold bg-gold text-ink" : "border-line-strong text-taupe"} ${burst ? "ring-once" : ""}`}>
            <Gift size={16} aria-hidden />
          </span>
          {burst > 0 && (
            <span key={`b${burst}`} aria-hidden className="pointer-events-none absolute inset-0">
              {BURST.map((a, i) => (
                <m.span key={i} className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-gold"
                  initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(a) * 30, y: Math.sin(a) * 30, opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
              ))}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function Qty({ qty, name, onChange }: { qty: number; name: string; onChange: (n: number) => void }) {
  return (
    <div className="flex w-fit items-center border border-line">
      <m.button whileTap={{ scale: 0.95 }} transition={TAP} onClick={() => onChange(qty - 1)} aria-label={`Minder ${name}`} className="flex h-12 w-12 items-center justify-center hover:bg-black/[0.04] md:h-9 md:w-9"><Minus size={14} /></m.button>
      <span className="relative h-12 w-8 overflow-hidden text-center text-sm leading-[3rem] tabular-nums md:h-9 md:leading-9" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          <m.span key={qty} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">{qty}</m.span>
        </AnimatePresence>
      </span>
      <m.button whileTap={{ scale: 0.95 }} transition={TAP} onClick={() => onChange(qty + 1)} disabled={qty >= MAX_QTY} aria-label={`Meer ${name}`} className="flex disabled:cursor-not-allowed disabled:opacity-30 h-12 w-12 items-center justify-center hover:bg-black/[0.04] md:h-9 md:w-9"><Plus size={14} /></m.button>
    </div>
  );
}

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, setQty, lineUnit, subtotal, giftUnlocked, remainingForReward, money, count } = useStore();
  const [note, setNote] = useState(false);
  // Mobiel: bottom sheet die je omlaag wegveegt; vanaf tablet: zijlade rechts.
  const desktop = useMediaQuery("(min-width: 768px)");
  // De demo-melding hoort bij één bezoek aan de lade; sluiten wist hem (lade sluit altijd via onOpenChange).
  const onOpenChange = (open: boolean) => { setDrawerOpen(open); if (!open) setNote(false); };

  // CartDrawer blijft altijd gemount, dus de overgang "nog niet -> ontgrendeld" wordt hier gezien (ook als add() de lade net opent).
  // De burst start na de slide-in (350ms) zodat hij niet onder de animatie verdwijnt.
  const was = useRef(giftUnlocked);
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    if (giftUnlocked && !was.current) {
      const t = setTimeout(() => setBurst((n) => n + 1), 350);
      was.current = true;
      return () => clearTimeout(t);
    }
    was.current = giftUnlocked;
  }, [giftUnlocked]);

  return (
    <Drawer.Root open={drawerOpen} onOpenChange={onOpenChange} direction={desktop ? "right" : "bottom"}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-[28px] border-t border-line bg-ivory outline-none md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:max-w-[440px] md:rounded-none md:border-l md:border-t-0">
          <div aria-hidden className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-black/15 md:hidden" />
          <div className="flex items-center justify-between border-b border-line px-6 py-3 md:py-4">
            <Drawer.Title className="font-serif text-3xl">Winkelwagen <span className="font-sans text-sm text-taupe">({count})</span></Drawer.Title>
            <Drawer.Close aria-label="Sluit winkelwagen" className="press -mr-3 flex h-12 w-12 items-center justify-center md:-mr-2 md:h-10 md:w-10"><X size={20} /></Drawer.Close>
          </div>
          <Drawer.Description className="sr-only">Je geselecteerde producten, cadeau en verzendvoortgang.</Drawer.Description>

          <div className={`border-b bg-sand px-6 py-5 transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${giftUnlocked ? "border-gold/40 shadow-[inset_0_0_0_1px_rgba(197,168,128,0.4)]" : "border-line"}`}>
            <Reward progress={Math.min(1, subtotal / REWARD_FROM)} unlocked={giftUnlocked} burst={burst}>
              {giftUnlocked
                ? <strong className="font-medium">Gratis verzending en gratis Musk & Siwak ontgrendeld</strong>
                : <>Nog <strong className="font-medium">{money(remainingForReward)}</strong> tot gratis verzending en je gratis Musk & Siwak</>}
            </Reward>
          </div>

          <div className="flex-1 overflow-y-auto px-6" data-vaul-no-drag>
            {lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                <ShoppingBag strokeWidth={1} size={44} className="text-taupe" aria-hidden />
                <p className="font-serif text-2xl">Je winkelwagen is leeg</p>
                <Drawer.Close className="press min-h-12 border border-ink px-6 py-3 text-sm font-medium hover:bg-ink hover:text-ivory">Verder winkelen</Drawer.Close>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                <AnimatePresence initial={false} mode="popLayout">
                  {lines.map((l) => {
                    const p = getProduct(l.slug)!;
                    return (
                      <m.li key={l.id} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.2 }} className="flex gap-4 py-5">
                        <div className="relative h-28 w-20 shrink-0 border border-line bg-sand"><Image src={p.images.primary} alt="" fill sizes="80px" className="object-cover mix-blend-multiply" /></div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <p className="font-serif text-xl leading-tight">{p.kind === "thobe" ? "Thobe " : ""}{p.name}</p>
                            <p className="text-sm tabular-nums">{money(lineUnit(l) * l.qty)}</p>
                          </div>
                          {l.size && <p className="mt-1 text-xs text-taupe">Maat {l.size} · {FITS.find((f) => f.id === l.fit)?.label}{l.giftBox ? " · Cadeaudoos" : ""}</p>}
                          <div className="mt-auto"><Qty qty={l.qty} name={p.name} onChange={(n) => setQty(l.id, n)} /></div>
                        </div>
                      </m.li>
                    );
                  })}
                  {giftUnlocked && GIFTS.map((g) => (
                    <m.li key={g.slug} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.2 }} className="flex items-center gap-4 py-4">
                      <div className="relative h-14 w-14 shrink-0 border border-line bg-sand"><Image src={g.images.primary} alt="" fill sizes="56px" className="object-cover mix-blend-multiply" /></div>
                      <div className="flex-1"><p className="font-serif text-lg leading-tight">{g.name}</p><p className="text-xs text-taupe">Cadeau bij je bestelling</p></div>
                      <p className="text-xs font-medium">Gratis</p>
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {lines.length > 0 && (
            <div className="border-t border-line px-6 py-5">
              <div className="flex items-baseline justify-between"><span className="text-sm text-taupe">Subtotaal incl. btw</span><span className="font-serif text-3xl tabular-nums">{money(subtotal)}</span></div>
              <p className="mt-1 text-xs text-taupe">{giftUnlocked ? "Gratis verzending" : "Verzending wordt bij het afrekenen berekend."}</p>
              <button onClick={() => setNote(true)} className="press btn-primary mt-4 w-full py-4 text-sm font-medium">Afrekenen</button>
              {note && <p role="status" className="mt-3 text-center text-xs text-taupe">Demo: de checkout is nog niet gekoppeld aan een betaalprovider.</p>}
              <div className="mt-4 flex flex-col items-center gap-2.5">
                <p className="flex items-center gap-1.5 text-xs text-taupe-strong"><Lock size={12} aria-hidden /> Veilig betalen, SSL-versleuteld</p>
                <ul className="flex flex-wrap justify-center gap-1.5 text-ink/70" aria-label="Betaalmethodes">
                  {PAYMENT_METHODS.map((pm) => (
                    <li key={pm.name} className="flex h-7 items-center rounded border border-line px-2 [&_svg]:max-h-3.5"><PaymentMark method={pm} /></li>
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
