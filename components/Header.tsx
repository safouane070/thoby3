"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Globe, Heart, Menu, ShoppingBag, X } from "lucide-react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "./Brand";
import { useStore } from "./StoreProvider";
import { CURRENCIES, LANGS, getProduct, type Currency } from "@/lib/products";

const nav = [
  { id: "collectie", href: "/#collectie", label: "Collectie" },
  { id: "pasvorm", href: "/#pasvorm", label: "Pasvorm" },
  { id: "vakmanschap", href: "/#vakmanschap", label: "Vakmanschap" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

const artikelen = (n: number) => `${n} ${n === 1 ? "artikel" : "artikelen"}`;
const SPRING = { type: "spring", stiffness: 400, damping: 35 } as const;
// 48px tapdoel op touch, 40px vanaf desktop.
const ICON_BTN = "press relative flex h-12 w-12 items-center justify-center lg:h-10 lg:w-10";
const chip = (on: boolean) => `press border py-2 text-xs ${on ? "border-ink bg-ink text-ivory" : "border-line hover:border-line-strong"}`;
// Breedte nooit groter dan het scherm min de header-inspringing, zodat het paneel op 320px niet buiten beeld valt.
const fit = (rem: number) => `w-[min(${rem}rem,calc(100vw-1.5rem))]`;

// Lichte disclosure i.p.v. Radix Popover (scheelt floating-ui in de eerste bundel).
// Esc sluit en zet focus terug op de knop, klik buiten sluit; open/dicht met dezelfde pop-animatie.
// Positie: rechts onder de dichtstbijzijnde relative ouder (de header-rij), dus altijd uitgelijnd met de pill.
function HeaderPanel({ label, triggerClass, trigger, width, children }: {
  label: string; triggerClass: string; trigger: ReactNode; width: string; children: (close: () => void) => ReactNode;
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
        onClick={() => (state === "open" ? close() : setState("open"))} className={triggerClass}>
        {trigger}
      </button>
      {state !== "closed" && (
        <div ref={box} id={id} role="region" aria-label={label}
          className={`absolute right-0 top-full z-[60] mt-3 origin-top-right rounded-2xl border border-line bg-ivory p-4 ${width} ${state === "open" ? "animate-[pop_160ms_var(--ease-out)]" : "animate-[pop_100ms_ease-in_reverse]"}`}>
          {children(close)}
        </div>
      )}
    </>
  );
}

function Locale() {
  const { lang, setLang, currency, setCurrency } = useStore();
  return (
    <HeaderPanel label="Taal en valuta" width={fit(18)} triggerClass="press flex h-12 items-center gap-2 px-3 text-xs font-medium lg:h-10"
      trigger={<><Globe size={16} aria-hidden /> {lang} · {currency}</>}>
      {() => (
        <>
          <p className="mb-2 text-xs text-taupe">Taal</p>
          <div className="mb-4 grid grid-cols-3 gap-1.5">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} aria-pressed={lang === l.code} title={l.label} className={`${chip(lang === l.code)} rounded-lg`}>{l.code}</button>
            ))}
          </div>
          <p className="mb-2 text-xs text-taupe">Valuta</p>
          <div className="grid grid-cols-5 gap-1.5">
            {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
              <button key={c} onClick={() => setCurrency(c)} aria-pressed={currency === c} className={`${chip(currency === c)} rounded-lg`}>{c}</button>
            ))}
          </div>
          <p className="mt-3 text-[0.6875rem] leading-relaxed text-taupe">Demo: taal wijzigt alleen het label, valuta rekent live om.</p>
        </>
      )}
    </HeaderPanel>
  );
}

function Wishlist() {
  const { wishlist, toggleWish, money } = useStore();
  return (
    <HeaderPanel label={`Verlanglijst, ${artikelen(wishlist.length)}`} width={fit(20)} triggerClass={ICON_BTN}
      trigger={<Heart size={18} className={wishlist.length ? "fill-ink" : ""} />}>
      {(close) => (
        <>
          <p className="mb-3 font-serif text-2xl">Verlanglijst</p>
          {wishlist.length === 0 ? (
            <p className="text-sm text-taupe">Tik op het hartje bij een product om het hier te bewaren.</p>
          ) : (
            <ul className="divide-y divide-line">
              {wishlist.map((slug) => {
                const p = getProduct(slug)!;
                return (
                  <li key={slug} className="flex items-center gap-3 py-3">
                    <Link href={`/product/${slug}`} onClick={close} className="flex flex-1 items-center gap-3">
                        <span className="relative h-14 w-11 shrink-0 border border-line bg-sand"><Image src={p.images.primary} alt="" fill sizes="44px" className="object-cover mix-blend-multiply" /></span>
                        <span><span className="block font-serif text-lg leading-tight">{p.name}</span><span className="text-xs text-taupe">{money(p.price)}</span></span>
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
  const [spy, setSpy] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const prev = useRef(count);
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
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenu(false);
  }

  const active = hover ?? (pathname.startsWith("/product") ? "collectie" : pathname === "/" ? spy : null);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <AnnouncementBar />
      <div className="px-3 pt-3 sm:px-6">
        <div className="mx-auto max-w-[1200px] rounded-[28px] border border-black/[0.06] bg-[#FAF9F6]/90 backdrop-blur-md">
          <div className="relative flex h-14 items-center justify-between pl-5 pr-2">
            <Link href="/" aria-label="THOBY3, naar de homepage" className="inline-flex h-12 items-center">
              {/* Woordmerk 16-20px hoog (~76-95px breed): past op 320px naast drie 48px-knoppen. Het volledige embleem staat in de footer. */}
              <Logo className="h-[clamp(1rem,5vw,1.25rem)]" />
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:block" aria-label="Hoofdmenu" onMouseLeave={() => setHover(null)}>
              <ul className="flex items-center">
                {nav.map((n) => (
                  <li key={n.id}>
                    <Link href={n.href} onMouseEnter={() => setHover(n.id)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
                      aria-current={active === n.id && !hover ? "location" : undefined}
                      className="relative block rounded-full px-4 py-2 text-[0.8125rem] font-medium">
                      {active === n.id && <m.span layoutId="activeNavPill" className="absolute inset-0 rounded-full bg-black/[0.06]" transition={SPRING} />}
                      <span className="relative">{n.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center">
              <div className="hidden sm:block"><Locale /></div>
              <Wishlist />
              <button className={ICON_BTN} onClick={() => setDrawerOpen(true)} aria-label={`Winkelwagen, ${artikelen(count)}`}>
                <ShoppingBag size={18} />
                {count > 0 && (
                  <span key={bumped} className="bump absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.625rem] font-medium text-ivory">{count}</span>
                )}
              </button>
              <button className={`${ICON_BTN} lg:hidden`} onClick={() => setMenu(!menu)} aria-label={menu ? "Sluit menu" : "Open menu"} aria-expanded={menu}>
                {menu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menu && (
              <m.nav
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} className="border-t border-line px-5 pb-4 pt-2 lg:hidden" aria-label="Mobiel menu"
              >
                {nav.map((n) => (
                  <Link key={n.id} href={n.href} onClick={() => setMenu(false)} className="block border-b border-line py-3.5 font-serif text-2xl last:border-0">{n.label}</Link>
                ))}
                <div className="relative pt-2 sm:hidden"><Locale /></div>
              </m.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
