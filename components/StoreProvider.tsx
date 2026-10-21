"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { FITS, REWARD_FROM, GIFT_BOX_PRICE, SIZES, eur, getProduct, type Fit } from "@/lib/products";
import { MAX_QTY } from "@/lib/order";

export { MAX_QTY };
const STORAGE_KEY = "thoby3.store.v1";

// localStorage is door de gebruiker aan te passen: alleen bestaande, leverbare producten, maten en geldige aantallen komen terug.
const isLine = (v: unknown): v is Line => {
  const l = v as Line;
  const p = typeof l === "object" && l !== null ? getProduct(l.slug) : undefined;
  return !!p && !p.soldOut && typeof l.id === "string"
    && Number.isInteger(l.qty) && l.qty >= 1 && l.qty <= MAX_QTY
    && (l.size === undefined || SIZES.some((s) => s.label === l.size))
    && (l.fit === undefined || l.fit === "slim" || l.fit === "broad");
};

export type Line = { id: string; slug: string; size?: string; fit?: Fit; giftBox?: boolean; qty: number };
export type NewLine = Omit<Line, "id" | "qty">;

type Store = {
  lines: Line[];
  /** Pas true als de winkelwagen uit localStorage is ingelezen (daarvoor is hij altijd leeg). */
  ready: boolean;
  count: number;
  subtotal: number;
  /** Cadeau (Musk & Siwak) zodra er een thobe in de winkelwagen ligt. */
  giftUnlocked: boolean;
  /** Eén set Musk & Siwak per thobe, zoals de site belooft. */
  giftSets: number;
  /** Gratis verzending (EU) vanaf REWARD_FROM. */
  freeShipping: boolean;
  remainingForShipping: number;
  add: (l: NewLine) => void;
  setQty: (id: string, qty: number) => void;
  /** Na een geslaagde betaling. */
  clear: () => void;
  lineUnit: (l: Line) => number;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  money: (amount: number) => string;
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
  const [announcement, setAnnouncement] = useState("");
  // State (geen ref): pas in de render ná het inlezen staat ready op true. Met een ref schreef het opslaan-effect bij een
  // dubbele mount (React Strict Mode) de lege beginstand weg vóór het inlezen, en was de winkelwagen na herladen leeg.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, wishlist })); } catch {}
  }, [lines, wishlist, ready]);

  useEffect(() => {
    // Eenmalig inlezen uit een extern systeem na hydration; SSR kent localStorage niet.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved) {
        setLines(Array.isArray(saved.lines) ? saved.lines.filter(isLine) : []);
        setWishlist(Array.isArray(saved.wishlist) ? saved.wishlist.filter((s: unknown) => typeof s === "string" && getProduct(s)) : []);
      }
    } catch {}
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
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
    setAnnouncement((prev) => (prev === msg ? `${msg} ` : msg));
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback(
    (id: string, qty: number) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)))),
    [],
  );

  const clear = useCallback(() => setLines([]), []);
  const toggleWish = useCallback((slug: string) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])), []);

  const value = useMemo<Store>(() => {
    const subtotal = lines.reduce((sum, l) => sum + lineUnit(l) * l.qty, 0);
    const giftSets = lines.reduce((n, l) => n + (getProduct(l.slug)?.kind === "thobe" ? l.qty : 0), 0);
    return {
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      giftUnlocked: giftSets > 0,
      giftSets,
      freeShipping: subtotal >= REWARD_FROM,
      remainingForShipping: Math.max(0, REWARD_FROM - subtotal),
      add, setQty, clear, lineUnit, drawerOpen, setDrawerOpen, wishlist, toggleWish,
      money: eur,
    };
  }, [lines, ready, drawerOpen, wishlist, add, setQty, clear, lineUnit, toggleWish]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>
    </Ctx.Provider>
  );
}
