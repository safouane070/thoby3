"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { Check, ChevronRight, Gift, Heart, Layers } from "lucide-react";
import { ToggleGroup } from "radix-ui";
import { BLUR, FITS, GIFT_BOX_PRICE, GIFT_VALUE, SIZES, discountPct, isThobe, products, type Fit, type Product } from "@/lib/products";
import { FabricSpotlight } from "./FabricSpotlight";
import { FitSilhouette } from "./FitSilhouette";
import { FitToggle } from "./FitToggle";
import { Price } from "./Price";
import { useStore } from "./StoreProvider";

// Vaul hoort niet in de eerste bundel: de viewer laadt bij hover/focus op de foto, of bij de klik zelf.
const ImageViewer = dynamic(() => import("./ImageViewer").then((m) => m.ImageViewer), { ssr: false });

// Hover-zoom alleen voor muis (touch krijgt gewoon de foto); origin volgt de pointer zonder re-render.
function Gallery({ product }: { product: Product }) {
  const [img, setImg] = useState(0);
  // Alleen foto 1 laadt direct; de rest pas bij hover/focus/klik op de thumbnail (scheelt ~4 grote downloads).
  const [seen, setSeen] = useState<number[]>([0]);
  const warm = (i: number) => setSeen((s) => (s.includes(i) ? s : [...s, i]));
  const [zoom, setZoom] = useState(false);
  const [viewer, setViewer] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const inner = useRef<HTMLDivElement>(null);
  const pct = discountPct(product);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !inner.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    inner.current.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    setZoom(true);
  };

  return (
    <div className="grid gap-3 lg:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col" role="group" aria-label="Productfoto's">
        {product.gallery.map((src, i) => (
          <button key={src} aria-pressed={i === img} aria-label={`${product.name}, foto ${i + 1} bekijken`} onPointerEnter={() => warm(i)} onFocus={() => warm(i)} onClick={() => { warm(i); setImg(i); }}
            className={`press relative aspect-[3/4] w-20 shrink-0 border bg-sand lg:w-full ${i === img ? "border-ink" : "border-line opacity-70 hover:opacity-100"}`}>
            <Image src={src} alt="" fill sizes="88px" className="object-cover mix-blend-multiply" />
          </button>
        ))}
      </div>
      <div onPointerMove={move} onPointerLeave={() => setZoom(false)} className="relative order-1 aspect-[3/4] cursor-zoom-in overflow-hidden border border-line bg-sand lg:order-2">
        <div ref={inner} className={`absolute inset-0 transition-transform duration-200 ease-out ${zoom ? "scale-[2.2]" : "scale-100"}`}>
          {product.gallery.map((src, i) => seen.includes(i) && (
            <Image key={src} src={src} alt={i === img ? `${product.name}, foto ${i + 1}` : ""} fill loading={i === 0 ? "eager" : undefined} fetchPriority={i === 0 ? "high" : undefined} sizes="(min-width:1024px) 55vw, 100vw" quality={90}
              placeholder="blur" blurDataURL={BLUR}
              className={`object-cover mix-blend-multiply transition-opacity duration-300 ease-in-out ${i === img ? "opacity-100" : "opacity-0"}`} />
          ))}
        </div>
        <button onPointerEnter={() => setViewerReady(true)} onFocus={() => setViewerReady(true)} onClick={() => { setViewerReady(true); setViewer(true); }} aria-label={`Vergroot foto ${img + 1} van ${product.name}`} className="absolute inset-0 cursor-zoom-in focus-visible:-outline-offset-4" />
        {pct > 0 && <span className="pointer-events-none absolute left-3 top-3 bg-ink px-2 py-1 text-[0.6875rem] font-medium text-ivory">-{pct}%</span>}
      </div>

      {viewerReady && <ImageViewer open={viewer} onOpenChange={setViewer} src={product.gallery[img]} title={`${product.name}, foto ${img + 1}`} />}
    </div>
  );
}

// Kleurvarianten = de andere thobes in de collectie; uitverkocht krijgt een doorstreping.
function Colorways({ product, query }: { product: Product; query: string }) {
  return (
    <div>
      <p className="text-sm font-medium">Kleur <span className="ml-2 font-normal text-taupe">{product.colors[0].name}</span></p>
      <ul className="mt-3 flex gap-3">
        {products.filter(isThobe).map((p) => (
          <li key={p.slug}>
            <Link href={`/product/${p.slug}${query}`} aria-label={`${p.colors[0].name}${p.soldOut ? ", uitverkocht" : ""}`} aria-current={p.slug === product.slug ? "page" : undefined}
              className={`press relative block h-12 w-12 rounded-full border p-1 lg:h-10 lg:w-10 ${p.slug === product.slug ? "border-ink" : "border-line hover:border-line-strong"}`}>
              <span className="block h-full w-full rounded-full border border-black/10" style={{ background: p.colors[0].hex }} />
              {p.soldOut && <span aria-hidden className="absolute inset-1 rounded-full" style={{ background: "linear-gradient(135deg, transparent 46%, rgba(26,26,26,.55) 47% 53%, transparent 54%)" }} />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// replaceState vuurt geen event, dus syncUrl meldt zelf de wijziging; popstate dekt terug/vooruit.
const URL_EVENT = "thoby:urlchange";
function subscribeUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_EVENT, onChange);
  };
}

export function ProductDetail({ product }: { product: Product }) {
  const { add, wishlist, toggleWish, money } = useStore();
  const thobe = isThobe(product);
  const [giftBox, setGiftBox] = useState(false);
  const [missing, setMissing] = useState(false);
  const wished = wishlist.includes(product.slug);

  // Maat en pasvorm leven in de URL (?size=M&fit=broad): delen of herladen toont exact dezelfde keuze.
  // URL-waarden zijn onbetrouwbaar, dus alleen bekende maten/pasvormen tellen; de rest valt terug op de default.
  const search = useSyncExternalStore(subscribeUrl, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  const fit: Fit = params.get("fit") === "broad" ? "broad" : "slim";
  const urlSize = params.get("size");
  const size = urlSize && SIZES.some((x) => x.label === urlSize) ? urlSize : "";

  // history.replaceState synct met useSearchParams zonder navigatie of extra history-entry (Next docs: Native History API).
  const syncUrl = (patch: { size?: string; fit?: Fit }) => {
    const q = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(patch)) if (v) q.set(k, v); else q.delete(k);
    window.history.replaceState(window.history.state, "", `?${q}`);
    window.dispatchEvent(new Event(URL_EVENT));
  };
  const chooseSize = (v: string) => { setMissing(false); syncUrl({ size: v }); };
  const chooseFit = (f: Fit) => syncUrl({ fit: f });
  const query = `?${new URLSearchParams({ fit, ...(size && { size }) })}`;

  const submit = () => {
    if (product.soldOut) return;
    if (thobe && !size) {
      setMissing(true);
      // Op mobiel staat de CTA vast onderin; breng de maatkeuze zelf in beeld en focus.
      const group = document.getElementById("size-group");
      group?.scrollIntoView({ block: "center", behavior: "smooth" });
      group?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
      return;
    }
    add(thobe ? { slug: product.slug, size, fit, giftBox } : { slug: product.slug });
  };

  const label = product.soldOut ? "Uitverkocht" : thobe && !size ? "Kies je maat" : "In winkelwagen";
  const total = product.price + (giftBox ? GIFT_BOX_PRICE : 0);
  const cta = "press btn-primary flex-1 py-4 text-xs font-medium uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-32 pt-40 lg:px-10 lg:pb-24">
      <nav aria-label="Kruimelpad" className="mb-8 flex items-center gap-2 text-xs text-taupe">
        <Link href="/" className="-m-4 inline-block p-4 hover:text-ink">Home</Link><ChevronRight size={12} aria-hidden />
        <Link href="/#collectie" className="-my-4 inline-block py-4 hover:text-ink">Collectie</Link><ChevronRight size={12} aria-hidden />
        <span className="text-ink" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <Gallery product={product} />

        <div className="[@media(min-height:960px)]:lg:sticky [@media(min-height:960px)]:lg:top-40 lg:self-start">
          <h1 className="font-serif text-5xl leading-none md:text-6xl">{thobe ? "Thobe " : ""}<em>{product.name}</em></h1>
          <div className="mt-5 flex items-baseline gap-2"><Price price={product.price} compareAt={product.compareAt} className="text-xl" /><span className="text-xs text-taupe">incl. btw</span></div>
          <p className="mt-5 max-w-lg leading-relaxed text-taupe">{product.tagline}</p>

          {thobe && (
            <div className="mt-8 space-y-7">
              <Colorways product={product} query={query} />
              <div>
                <p className="text-sm font-medium">Pasvorm <span className="ml-2 font-normal text-taupe">zelfde lengte, twee posturen</span></p>
                <div className="mt-3 flex items-center gap-4">
                  <FitSilhouette fit={fit} className="h-16 w-8 shrink-0 text-ink" />
                  <div className="flex-1">
                    <FitToggle value={fit} onChange={chooseFit} id="fit-detail" />
                    <p className="mt-2 text-xs leading-snug text-taupe" aria-live="polite">{FITS.find((f) => f.id === fit)!.note}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium" id="size-label">Maat</p>
                <ToggleGroup.Root id="size-group" type="single" value={size} onValueChange={(v) => v && chooseSize(v)} disabled={product.soldOut} aria-labelledby="size-label" className="mt-3 grid grid-cols-4 gap-2">
                  {SIZES.map((s) => (
                    <ToggleGroup.Item key={s.label} value={s.label}
                      className="press border border-line py-3 hover:border-line-strong data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-ivory disabled:cursor-not-allowed disabled:opacity-40">
                      <span className="block font-serif text-xl">{s.label}</span>
                      <span className="block text-[0.625rem] opacity-70">{s.bodyHeight.replace(" m", "")}</span>
                    </ToggleGroup.Item>
                  ))}
                </ToggleGroup.Root>
                {missing && !size && <p role="alert" className="mt-2 text-sm text-red-700">Kies eerst een maat.</p>}
                <p className="mt-2 text-xs text-taupe">Kort en vol postuur? Kies een lange maat en laat deze inkorten.</p>
              </div>

              <label className="flex cursor-pointer items-center gap-4 border border-line p-4 transition-colors duration-200 hover:border-line-strong">
                <input type="checkbox" checked={giftBox} onChange={(e) => setGiftBox(e.target.checked)} className="peer sr-only" />
                <span className="flex h-5 w-5 items-center justify-center border border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-ink" aria-hidden>{giftBox && <Check size={13} />}</span>
                <span className="flex-1 text-sm">Cadeaudoos toevoegen</span>
                <span className="text-sm text-taupe">+ {money(GIFT_BOX_PRICE)}</span>
              </label>

              <div className="flex flex-col gap-3 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2"><Gift size={16} className="shrink-0 text-ink" aria-hidden /> {product.badge}, t.w.v. {money(GIFT_VALUE)}</p>
                <FabricSpotlight className="press flex min-h-12 items-center gap-2 underline lg:min-h-8 decoration-line-strong underline-offset-4 hover:decoration-ink"><Layers size={16} aria-hidden /> Over de stof</FabricSpotlight>
              </div>
            </div>
          )}

          <div className="mt-8 hidden gap-3 lg:flex">
            <button onClick={submit} disabled={product.soldOut} className={cta}>{label} · {money(total)}</button>
            <button onClick={() => toggleWish(product.slug)} aria-pressed={wished} aria-label="Verlanglijst" className="press flex w-14 items-center justify-center border border-line hover:border-line-strong"><Heart size={18} className={wished ? "fill-ink text-ink" : ""} /></button>
          </div>

          <div className="mt-12 space-y-4 border-t border-line pt-8 text-sm leading-relaxed text-taupe">
            {product.description.map((d) => <p key={d}>{d}</p>)}
          </div>
        </div>
      </div>

      <div data-sticky-cta className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-ivory/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <button onClick={() => toggleWish(product.slug)} aria-pressed={wished} aria-label="Verlanglijst" className="press flex w-14 items-center justify-center border border-line"><Heart size={18} className={wished ? "fill-ink text-ink" : ""} /></button>
        <button onClick={submit} disabled={product.soldOut} className={cta}>{label} · {money(total)}</button>
      </div>
    </div>
  );
}
