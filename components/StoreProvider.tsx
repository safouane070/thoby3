"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CURRENCIES, FITS, REWARD_FROM, GIFT_BOX_PRICE, SIZES, getProduct, type Currency, type Fit } from "@/lib/products";

export const MAX_QTY = 10;
const STORAGE_KEY = "thoby3.store.v1";

// localStorage is door de gebruiker aan te passen: alleen bestaande producten, maten en geldige aantallen komen terug.
const isLine = (v: unknown): v is Line => {
  const l = v as Line;
  return typeof l === "object" && l !== null && typeof l.id === "string" && !!getProduct(l.slug)
    && Number.isInteger(l.qty) && l.qty >= 1 && l.qty <= MAX_QTY
    && (l.size === undefined || SIZES.some((s) => s.label === l.size))
    && (l.fit === undefined || l.fit === "slim" || l.fit === "broad");
};

export type Line = { id: string; slug: string; size?: string; fit?: Fit; giftBox?: boolean; qty: number };
export type NewLine = Omit<Line, "id" | "qty">;

type Store = {
  lines: Line[];
  count: number;
  subtotal: number;
  giftUnlocked: boolean;
  remainingForReward: number;
  add: (l: NewLine) => void;
  setQty: (id: string, qty: number) => void;
  lineUnit: (l: Line) => number;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  lang: string;
  setLang: (l: string) => void;
  money: (eur: number) => string;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [lang, setLang] = useState("NL");
  const [announcement, setAnnouncement] = useState("");
  const hydrated = useRef(false);

  // Opslaan staat vóór inlezen: bij mount slaat hij over, daarna schrijft elke wijziging weg.
  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, wishlist })); } catch {}
  }, [lines, wishlist]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved) {
        // Eenmalig inlezen uit een extern systeem na hydration; SSR kent localStorage niet.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLines(Array.isArray(saved.lines) ? saved.lines.filter(isLine) : []);
        setWishlist(Array.isArray(saved.wishlist) ? saved.wishlist.filter((s: unknown) => typeof s === "string" && getProduct(s)) : []);
      }
    } catch {}
    hydrated.current = true;
  }, []);

  const lineUnit = useCallback((l: Line) => (getProduct(l.slug)?.price ?? 0) + (l.giftBox ? GIFT_BOX_PRICE : 0), []);

  const add = useCallback((n: NewLine) => {
    const id = [n.slug, n.size, n.fit, n.giftBox ? "box" : ""].join("|");
    setLines((ls) =>
      ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l)) : [...ls, { ...n, id, qty: 1 }],
    );
    const p = getProduct(n.slug);
    const detail = n.size ? `, maat ${n.size}, ${FITS.find((f) => f.id === n.fit)?.label}` : "";
    const msg = `${p?.kind === "thobe" ? "Thobe " : ""}${p?.name}${detail} toegevoegd aan je winkelwagen.`;
    // Een no-break space laat screenreaders een identiek bericht opnieuw voorlezen.
    setAnnouncement((prev) => (prev === msg ? `${msg} ` : msg));
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback(
    (id: string, qty: number) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)))),
    [],
  );

  const toggleWish = useCallback((slug: string) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])), []);

  const value = useMemo<Store>(() => {
    const subtotal = lines.reduce((sum, l) => sum + lineUnit(l) * l.qty, 0);
    const money = (eur: number) =>
      new Intl.NumberFormat(CURRENCIES[currency].locale, { style: "currency", currency }).format(eur * CURRENCIES[currency].rate);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      giftUnlocked: subtotal >= REWARD_FROM,
      remainingForReward: Math.max(0, REWARD_FROM - subtotal),
      add, setQty, lineUnit, drawerOpen, setDrawerOpen, wishlist, toggleWish, currency, setCurrency, lang, setLang, money,
    };
  }, [lines, drawerOpen, wishlist, currency, lang, add, setQty, lineUnit, toggleWish]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>
    </Ctx.Provider>
  );
}
