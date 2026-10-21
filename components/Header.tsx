"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "./Brand";
import { useStore } from "./StoreProvider";
import { getProduct } from "@/lib/products";
import { useMediaQuery } from "@/lib/use-media-query";

const nav = [
  { id: "collectie", href: "/#collectie", label: "Collectie" },
  { id: "doos", href: "/#doos", label: "De doos" },
  { id: "pasvorm", href: "/#pasvorm", label: "Maatkaart" },
  { id: "stof", href: "/#stof", label: "Stof" },
  { id: "faq", href: "/#faq", label: "Vragen" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

// Gescrold = de aankondigingsbalk mag weg. Externe bron (scrollpositie) zonder effect of extra render bij laden.
const subscribeScroll = (cb: () => void) => { window.addEventListener("scroll", cb, { passive: true }); return () => window.removeEventListener("scroll", cb); };
const isScrolled = () => window.scrollY > 8;

const artikelen = (n: number) => `${n} ${n === 1 ? "artikel" : "artikelen"}`;
const SPRING = { type: "spring", stiffness: 400, damping: 35 } as const;
// 48px tapdoel op touch, 40px vanaf desktop.
const ICON_BTN = "press relative flex h-12 w-12 items-center justify-center lg:h-10 lg:w-10";
// Breedte nooit groter dan het scherm min de header-inspringing, zodat het paneel op 320px niet buiten beeld valt.
const fit = (rem: number) => `w-[min(${rem}rem,calc(100vw-1.5rem))]`;

// Lichte disclosure i.p.v. Radix Popover (scheelt floating-ui in de eerste bundel).
// Esc sluit en zet focus terug op de knop, klik buiten sluit; open/dicht met dezelfde pop-animatie.
// Positie: rechts onder de dichtstbijzijnde relative ouder (de header-rij), dus altijd uitgelijnd met de balk.
function HeaderPanel({ label, triggerClass, trigger, width, onOpen, children }: {
  label: string; triggerClass: string; trigger: ReactNode; width: string; onOpen?: () => void; children: (close: () => void) => ReactNode;
}) {
  const id = useId();
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");
  const btn = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setState((st) => (st === "open" ? "closing" : st)), []);

  useEffect(() => {
    if (state !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      btn.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!box.current?.contains(t) && !btn.current?.contains(t)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [state, close]);

  // Unmount na de sluitanimatie (100ms). Een timer i.p.v. animationend: die vuurt niet in verborgen tabbladen.
  useEffect(() => {
    if (state !== "closing") return;
    const t = setTimeout(() => setState("closed"), 120);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <>
      <button ref={btn} type="button" aria-label={label} aria-expanded={state === "open"} aria-controls={id}
        onClick={() => { if (state === "open") close(); else { onOpen?.(); setState("open"); } }} className={triggerClass}>
        {trigger}
      </button>
      {state !== "closed" && (
        <div ref={box} id={id} role="region" aria-label={label}
          className={`absolute right-0 top-full z-[60] origin-top-right border border-line bg-paper p-4 text-ink ${width} ${state === "open" ? "animate-[pop_160ms_var(--ease-out)]" : "animate-[pop_120ms_cubic-bezier(0.23,1,0.32,1)_reverse]"}`}>
          {children(close)}
        </div>
      )}
    </>
  );
}

function Wishlist({ onOpen }: { onOpen: () => void }) {
  const { wishlist, toggleWish, money } = useStore();
  return (
    <HeaderPanel label={`Verlanglijst, ${artikelen(wishlist.length)}`} width={fit(20)} triggerClass={ICON_BTN} onOpen={onOpen}
      trigger={<Heart size={18} className={wishlist.length ? "fill-gold text-gold" : ""} />}>
      {(close) => (
        <>
          <p className="display mb-3 text-2xl">Verlanglijst</p>
          {wishlist.length === 0 ? (
            <p className="text-sm text-taupe">Tik op het hartje bij een product om het hier te bewaren.</p>
          ) : (
            <ul className="divide-y divide-line">
              {wishlist.map((slug) => {
                const p = getProduct(slug)!;
                return (
                  <li key={slug} className="flex items-center gap-3 py-3">
                    <Link href={`/product/${slug}`} onClick={close} className="flex flex-1 items-center gap-3">
                        <span className="relative h-14 w-11 shrink-0 bg-studio"><Image src={p.images.primary} alt="" fill sizes="44px" className="object-cover mix-blend-multiply" /></span>
                        <span><span className="display block text-lg">{p.name}</span><span className="text-xs text-taupe">{money(p.price)}</span></span>
                    </Link>
                    <button onClick={() => toggleWish(slug)} aria-label={`Verwijder ${p.name}`} className="press p-2"><X size={14} /></button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </HeaderPanel>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count, setDrawerOpen } = useStore();
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);
  const [spy, setSpy] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const prev = useRef(count);

  // Open menu: Esc sluit (focus terug op de knop) en de pagina eronder scrolt niet mee.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      menuBtn.current?.focus();
    };
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = before;
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);
  const [bumped, setBumped] = useState(0);

  useEffect(() => {
    if (count > prev.current) setBumped((n) => n + 1);
    prev.current = count;
  }, [count]);

  useEffect(() => {
    if (pathname !== "/") return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        setSpy(nav.find((n) => seen.has(n.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [pathname]);

  // Menu sluit bij elke routewissel (ook via logo of winkelwagen): state bijstellen tijdens render, zonder effect.
  const [menuPath, setMenuPath] = useState(pathname);
  // Vanaf desktop bestaat het mobiele menu niet; anders bleef de scroll-lock hangen na het draaien of vergroten van het scherm.
  const desktop = useMediaQuery("(min-width: 1024px)");
  if (desktop && menu) setMenu(false);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenu(false);
  }

  // Alleen bij een bestaand product: de 404-pagina (ook op /product/onbekend) is zonder markering gebouwd, anders hydration-mismatch.
  const onProduct = pathname.startsWith("/product/") && !!getProduct(pathname.split("/")[2] ?? "");
  const active = hover ?? (onProduct ? "collectie" : pathname === "/" ? spy : null);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-transform duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${scrolled ? "-translate-y-9" : ""}`}>
      <AnnouncementBar />
      {/* De balk is de banderol van de doos: zwart karton met een gouden lijn langs de rand. */}
      <div className="board on-dark border-b border-gold/40">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative flex h-14 items-center justify-between pl-5 pr-2 lg:pl-10 lg:pr-7">
            <Link href="/" aria-label="THOBY3, naar de homepage" className="inline-flex h-12 items-center">
              {/* Woordmerk 16-20px hoog (~76-95px breed): past op 320px naast drie 48px-knoppen. Het volledige embleem staat in de footer. */}
              <Logo className="h-[clamp(1rem,5vw,1.125rem)] text-paper" />
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:block" aria-label="Hoofdmenu" onMouseLeave={() => setHover(null)}>
              <ul className="flex items-center">
                {nav.map((n) => (
                  <li key={n.id}>
                    <Link href={n.href} onMouseEnter={() => setHover(n.id)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
                      aria-current={active === n.id && !hover ? "location" : undefined}
                      className={`tag relative block whitespace-nowrap px-3 py-2 transition-colors xl:px-4 duration-200 ${active === n.id ? "text-gold" : "text-paper/80 hover:text-paper"}`}>
                      {active === n.id && <m.span layoutId="activeNavRule" className="absolute inset-x-3 xl:inset-x-4 -bottom-px h-px bg-gold" transition={SPRING} />}
                      <span className="relative">{n.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center">
              <Wishlist onOpen={() => setMenu(false)} />
              <button className={ICON_BTN} onClick={() => { setMenu(false); setDrawerOpen(true); }} aria-label={`Winkelwagen, ${artikelen(count)}`}>
                <ShoppingBag size={18} />
                {count > 0 && (
                  <span key={bumped} className="bump num absolute right-1.5 top-2 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-gold px-1 text-[0.6875rem] font-bold leading-none text-ink ring-2 ring-board lg:right-0.5 lg:top-0.5">{count}</span>
                )}
              </button>
              <button ref={menuBtn} className={`${ICON_BTN} lg:hidden`} onClick={() => setMenu(!menu)} aria-label={menu ? "Sluit menu" : "Open menu"} aria-expanded={menu} aria-controls="mobiel-menu">
                {menu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menu && (
              <m.nav
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} id="mobiel-menu" className="max-h-[calc(100dvh-5.875rem)] overflow-y-auto overscroll-contain border-t border-line-dark px-5 pb-4 pt-2 lg:hidden" aria-label="Mobiel menu"
              >
                {nav.map((n) => (
                  <Link key={n.id} href={n.href} onClick={() => setMenu(false)} className="display block border-b border-line-dark py-3.5 text-3xl last:border-0">{n.label}</Link>
                ))}
              </m.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Onder het menu: de pagina gedimd; een tik erop sluit het menu. */}
      <AnimatePresence>
        {menu && (
          <m.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.2 }}
            onClick={() => setMenu(false)} className="absolute inset-x-0 top-full h-[100dvh] bg-board/60 lg:hidden" />
        )}
      </AnimatePresence>
    </header>
  );
}
