"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeftRight, Bell, Check, ChevronDown, ChevronRight, Gift, Heart, Layers, MessageCircle, Truck, X } from "lucide-react";
import { ToggleGroup } from "radix-ui";
import { BLUR, EXCHANGE_COPY, FITS, GIFT_BOX_PRICE, GIFT_TEXT, HAS_MEASUREMENTS, SHIPPING_COPY, SIZES, discountPct, isThobe, products, sizeCode, whatsapp, type Fit, type Product } from "@/lib/products";
import { FabricSpotlight } from "./FabricSpotlight";
import { FitToggle } from "./FitToggle";
import { Price } from "./Price";
import { BADGE } from "./ProductCard";
import { SizeAdvisor } from "./SizeAdvisor";
import { ThobePair, shapeOf } from "./ThobeDiagram";
import { useStore } from "./StoreProvider";

// Vaul hoort niet in de eerste bundel: de viewer laadt bij hover/focus op de foto, of bij de klik zelf.
const ImageViewer = dynamic(() => import("./ImageViewer").then((m) => m.ImageViewer), { ssr: false });

// Telefoon: een swipe-galerij met puntjes (zo verwacht iedereen het). Desktop: miniaturen links, de grote foto wisselt
// met een korte crossfade en blur. Eén set foto's voor allebei; een tik of klik op de foto vergroot hem.
function Gallery({ product }: { product: Product }) {
  const [img, setImg] = useState(0);
  const [viewer, setViewer] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const pct = discountPct(product);
  // Alleen in de swipe-stand (telefoon) is de baan breder dan zichtbaar; op desktop staan de foto's op elkaar.
  const swiping = () => !!track.current && track.current.scrollWidth > track.current.clientWidth + 1;
  const go = (i: number) => {
    setImg(i);
    if (swiping()) track.current!.scrollTo({ left: i * track.current!.clientWidth, behavior: "smooth" });
  };
  const onScroll = () => { if (swiping()) setImg(Math.round(track.current!.scrollLeft / track.current!.clientWidth)); };

  return (
    <div className="grid gap-3 lg:grid-cols-[88px_1fr]">
      <div className="hidden gap-2 lg:flex lg:flex-col" role="group" aria-label="Productfoto's">
        {product.gallery.map((src, i) => (
          <button key={src} aria-pressed={i === img} aria-label={`${product.name}, foto ${i + 1} bekijken`} onClick={() => go(i)}
            className={`press relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-studio ${i === img ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-70 [@media(hover:hover)]:hover:opacity-100"}`}>
            <Image src={src} alt="" fill sizes="88px" className="object-cover mix-blend-multiply" />
          </button>
        ))}
      </div>
      <div className="relative lg:w-[min(100%,calc((100vh-9rem)*0.75))]">
        <div ref={track} onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[1.5rem] bg-studio [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:relative lg:block lg:aspect-[3/4] lg:overflow-hidden">
          {product.gallery.map((src, i) => (
            <button key={src} type="button" tabIndex={i === img ? 0 : -1} aria-label={`Vergroot foto ${i + 1} van ${product.name}`}
              onPointerEnter={() => setViewerReady(true)} onFocus={() => setViewerReady(true)} onClick={() => { setImg(i); setViewerReady(true); setViewer(true); }}
              className={`relative aspect-[3/4] w-full shrink-0 cursor-zoom-in snap-center focus-visible:-outline-offset-4 lg:absolute lg:inset-0 lg:aspect-auto lg:transition-[opacity,filter] lg:duration-200 lg:ease-out ${i === img ? "lg:opacity-100 lg:blur-0" : "lg:pointer-events-none lg:opacity-0 lg:blur-[2px]"}`}>
              <Image src={src} alt={`${product.name}, foto ${i + 1}`} fill sizes="(min-width:1024px) 55vw, 100vw" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : undefined}
                placeholder="blur" blurDataURL={BLUR} className="object-cover mix-blend-multiply" />
            </button>
          ))}
        </div>
        {pct > 0 && <span className={`pointer-events-none absolute left-3 top-3 ${BADGE}`}>-{pct}%</span>}
        {product.gallery.length > 1 && (
          <div className="mt-3 flex justify-center lg:hidden" role="group" aria-label="Kies een foto">
            {product.gallery.map((src, i) => (
              <button key={src} type="button" onClick={() => go(i)} aria-label={`Foto ${i + 1}`} aria-current={i === img || undefined} className="flex h-6 items-center px-1">
                <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${i === img ? "w-5 bg-ink" : "w-1.5 bg-line-strong"}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {viewerReady && <ImageViewer open={viewer} onOpenChange={setViewer} src={product.gallery[img]} title={`${product.name}, foto ${img + 1}`} />}
    </div>
  );
}

// Kleurvarianten = de andere thobes in de collectie; uitverkocht krijgt een doorstreping.
function Colorways({ product, query }: { product: Product; query: string }) {
  return (
    <div>
      <p className="caption">Kleur <span className="ml-2 font-normal text-muted">{product.colors[0].name}</span></p>
      <ul className="mt-3 flex gap-3">
        {products.filter(isThobe).map((p) => (
          <li key={p.slug}>
            <Link href={`/product/${p.slug}${query}`} aria-label={`${p.colors[0].name}${p.soldOut ? ", uitverkocht" : ""}`} aria-current={p.slug === product.slug ? "page" : undefined}
              className={`press relative block h-11 w-11 rounded-full p-1 ring-1 ${p.slug === product.slug ? "ring-2 ring-ink" : "ring-line hover:ring-line-strong"}`}>
              <span className="block h-full w-full rounded-full ring-1 ring-black/10" style={{ background: p.colors[0].hex }} />
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
  const { add, wishlist, toggleWish, money, pref, setPref } = useStore();
  const thobe = isThobe(product);
  const [missing, setMissing] = useState(false);
  // Mobiel: de vaste CTA klapt zelf een maatkiezer uit (scrollen naar de maten bleek onbetrouwbaar en kost een extra stap).
  const [picker, setPicker] = useState(false);
  const wished = wishlist.includes(product.slug);

  // Maat en pasvorm leven in de URL (?size=M&fit=broad): delen of herladen toont exact dezelfde keuze.
  // URL-waarden zijn onbetrouwbaar, dus alleen bekende maten/pasvormen tellen. Zonder URL-keuze: jouw bewaarde maat.
  const search = useSyncExternalStore(subscribeUrl, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  const urlFit = params.get("fit");
  const fit: Fit = urlFit === "broad" || urlFit === "slim" ? urlFit : pref.fit ?? "slim";
  const urlSize = params.get("size");
  const size = urlSize && SIZES.some((x) => x.label === urlSize) ? urlSize : thobe ? pref.size ?? "" : "";
  const giftBox = thobe && params.get("box") === "1";

  // history.replaceState synct met useSearchParams zonder navigatie of extra history-entry (Next docs: Native History API).
  const syncUrl = (patch: { size?: string; fit?: Fit; box?: string }) => {
    const q = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(patch)) if (v) q.set(k, v); else q.delete(k);
    window.history.replaceState(window.history.state, "", `?${q}`);
    window.dispatchEvent(new Event(URL_EVENT));
  };
  const chooseSize = (v: string) => { setMissing(false); setPref({ size: v }); syncUrl({ size: v }); };
  const chooseFit = (f: Fit) => { setPref({ fit: f }); syncUrl({ fit: f }); };
  const setGiftBox = (on: boolean) => syncUrl({ box: on ? "1" : "" });
  const query = `?${new URLSearchParams({ fit, ...(size && { size }), ...(giftBox && { box: "1" }) })}`;

  const submit = () => {
    if (product.soldOut) return;
    setPicker(false);
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

  const label = thobe && !size ? "Kies je maat" : "In winkelwagen";
  const fitLabel = FITS.find((f) => f.id === fit)!.label;
  const sizeInfo = SIZES.find((s) => s.label === size);
  const notify = whatsapp(`Hoi THOBY3, laat me weten wanneer de ${thobe ? "Thobe " : ""}${product.name} weer op voorraad is${size ? ` (maat ${size}, ${fitLabel.toLowerCase()})` : ""}.`);
  const pickFromSticky = (s: string) => {
    chooseSize(s);
    setPicker(false);
    add({ slug: product.slug, size: s, fit, giftBox });
  };
  const total = product.price + (giftBox ? GIFT_BOX_PRICE : 0);
  const cta = "press btn-primary tag min-h-14 flex-1 py-4 !text-[0.9375rem] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-32 pt-[6.5rem] sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36">
      {/* Op de telefoon geen kruimelpad: daar telt elke pixel tot de foto en de maat. */}
      <nav aria-label="Kruimelpad" className="mb-8 hidden items-center gap-2 text-sm text-muted sm:flex">
        <Link href="/" className="-m-4 inline-block p-4 hover:text-ink">Home</Link><ChevronRight size={12} aria-hidden />
        <Link href="/#collectie" className="-my-4 inline-block py-4 hover:text-ink">Collectie</Link><ChevronRight size={12} aria-hidden />
        <span className="text-ink" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        {/* De foto blijft in beeld terwijl je rechts je keuzes maakt (geen leeg vlak onder de galerij). */}
        <div className="lg:sticky lg:top-28 lg:self-start"><Gallery product={product} /></div>

        <div>
          <h1 className="display text-[clamp(2.25rem,4vw,3.5rem)]">{thobe && <span className="sr-only">Thobe </span>}{product.name}</h1>
          <div className="mt-2 flex items-baseline gap-2 lg:mt-4"><Price price={product.price} compareAt={product.compareAt} className="num text-2xl font-medium" /><span className="text-xs text-muted">incl. btw</span></div>
          <p className="mt-3 max-w-[48ch] leading-relaxed text-muted lg:mt-5">{product.tagline}</p>

          {thobe && (
            <div className="mt-6 space-y-6 lg:mt-8 lg:space-y-7">
              <Colorways product={product} query={query} />
              <div>
                <p className="caption">Pasvorm <span className="ml-2 font-normal text-muted">zelfde lengte, twee posturen</span></p>
                <div className="mt-3">
                  <FitToggle value={fit} onChange={chooseFit} id="fit-detail" />
                  <p className="mt-2 text-sm leading-snug text-muted" aria-live="polite">{FITS.find((f) => f.id === fit)!.note}</p>
                  {/* Het verschil zien in plaats van lezen: dezelfde schaaltekening als de maatkaart, voor de gekozen maat (anders M).
                      Ingeklapt, zodat de maatkeuze hoog op de pagina blijft. */}
                  {HAS_MEASUREMENTS && (() => {
                    const s = sizeInfo ?? SIZES[1];
                    return (
                      <details className="group mt-1">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm underline decoration-line-strong underline-offset-4 hover:decoration-ink [&::-webkit-details-marker]:hidden">
                          Bekijk het verschil op schaal <ChevronDown size={14} aria-hidden className="transition-transform duration-200 group-open:rotate-180" />
                        </summary>
                      <figure className="mt-2 rounded-2xl bg-studio px-3 pb-3 pt-2">
                        <ThobePair slim={shapeOf(s, "slim")} broad={shapeOf(s, "broad")} className="mx-auto block w-full max-w-[18rem]" />
                        <figcaption className="mt-1 flex justify-between text-xs text-muted">
                          <span className={fit === "slim" ? "font-semibold text-ink" : ""}>{sizeCode(s.label, "slim")} slank</span>
                          <span>op schaal, even lang</span>
                          <span className={fit === "broad" ? "font-semibold text-ink" : ""}>{sizeCode(s.label, "broad")} breed</span>
                        </figcaption>
                      </figure>
                      </details>
                    );
                  })()}
                </div>
              </div>

              <div>
                <p className="caption" id="size-label">Maat</p>
                <ToggleGroup.Root id="size-group" type="single" value={size} onValueChange={(v) => v && chooseSize(v)} disabled={product.soldOut} aria-labelledby="size-label" className="mt-3 grid grid-cols-4 gap-2">
                  {SIZES.map((s) => (
                    <ToggleGroup.Item key={s.label} value={s.label}
                      className="press rounded-xl border border-line-strong py-2.5 hover:border-ink data-[state=on]:border-ink data-[state=on]:bg-ink data-[state=on]:text-paper disabled:cursor-not-allowed disabled:opacity-40">
                      <span className="block text-lg font-semibold">{sizeCode(s.label, fit)}</span>
                      <span className="num block text-xs opacity-70">{s.bodyHeight.replace(" cm", "")}</span>
                    </ToggleGroup.Item>
                  ))}
                </ToggleGroup.Root>
                {missing && !size && <p role="alert" className="mt-2 text-sm font-semibold text-[#a3341f]">Kies eerst een maat.</p>}
                {HAS_MEASUREMENTS && sizeInfo && (
                  <dl className="num mt-3 grid grid-cols-4 rounded-xl bg-studio text-center">
                    {([["Borst", sizeInfo.chest[fit]], ["Schouders", sizeInfo.shoulders[fit]], ["Mouw", sizeInfo.sleeve[fit]], ["Lengte", sizeInfo.length]] as const).map(([k, v]) => (
                      <div key={k} className="py-2.5 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-line"><dt className="text-xs text-muted">{k}</dt><dd className="font-semibold">{v} cm</dd></div>
                    ))}
                  </dl>
                )}
                <p className="mt-2 text-xs text-muted">{sizeInfo ? `${sizeCode(sizeInfo.label, fit)}, plat gemeten. ` : ""}Kort en vol postuur? Kies breed in de maat bij je lengte en laat hem zo nodig inkorten.</p>
                {!product.soldOut && <SizeAdvisor onPick={chooseSize} fit={fit} pickLabel={(sz) => `Kies ${sizeCode(sz, fit)}`} collapsible className="mt-3" />}
              </div>

              {/* De geschenkdoos als keuze met foto. Staat in de URL (?box=1), zodat de link vanaf de homepage hem aanzet. */}
              <label className={`press flex cursor-pointer items-center gap-4 rounded-2xl border p-3 pr-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${giftBox ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]" : "border-line-strong hover:border-ink"}`}>
                <input type="checkbox" checked={giftBox} onChange={(e) => setGiftBox(e.target.checked)} className="peer sr-only" />
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"><Image src="/img/box-sand.jpg" alt="" fill sizes="64px" className="object-cover" /></span>
                <span className="min-w-0 flex-1 text-sm leading-snug"><span className="block font-medium">In de geschenkdoos <span className="num font-normal text-muted">+ {money(GIFT_BOX_PRICE)}</span></span><span className="text-muted">Matzwart, goudfolie, banderol</span></span>
                <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line-strong text-paper peer-checked:border-ink peer-checked:bg-ink">{giftBox && <Check size={13} strokeWidth={2.5} />}</span>
              </label>

              <div className="flex flex-col gap-3 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2"><Gift size={16} className="shrink-0" aria-hidden /> {GIFT_TEXT}</p>
                <FabricSpotlight className="press flex min-h-12 items-center gap-2 underline lg:min-h-8 decoration-line-strong underline-offset-4 hover:decoration-ink"><Layers size={16} aria-hidden /> Over de stof</FabricSpotlight>
              </div>
            </div>
          )}

          {product.soldOut && (
            <div className="mt-8 rounded-2xl bg-studio p-5">
              <p className="font-medium">Uitverkocht</p>
              <p className="mt-1 text-sm text-muted">Deze kleur is nu niet te bestellen. Stuur ons een berichtje, dan laten we het je weten zodra hij terug is.</p>
            </div>
          )}

          {/* Altijd zichtbaar wélke variant je bestelt, ook als de maat uit een eerder bezoek voorgeselecteerd is. */}
          {thobe && !product.soldOut && (
            <p className="mt-8 hidden text-sm lg:block">
              {size
                ? <>Je bestelt: <strong className="font-semibold">{sizeCode(size, fit)} · {fitLabel}</strong>{giftBox ? " · in de geschenkdoos" : ""}</>
                : <span className="text-muted">Kies hierboven je maat.</span>}
            </p>
          )}
          <div className={`hidden gap-3 lg:flex ${thobe && !product.soldOut ? "mt-3" : "mt-8"}`}>
            {product.soldOut
              ? <a href={notify} target="_blank" rel="noopener noreferrer" className={`${cta} flex items-center justify-center gap-2`}><Bell size={16} aria-hidden /> Laat het me weten</a>
              : <button onClick={submit} className={cta}>{label} · {money(total)}</button>}
            <button onClick={() => toggleWish(product.slug)} aria-pressed={wished} aria-label="Verlanglijst" className="press btn-ghost flex w-14 items-center justify-center"><Heart size={18} className={wished ? "fill-ink text-ink" : ""} /></button>
          </div>

          <ul className="mt-8 space-y-3 text-[0.8125rem]">
            <li className="flex items-start gap-3"><Truck size={16} className="mt-0.5 shrink-0" aria-hidden /> {SHIPPING_COPY} Vóór 17:00 besteld, vandaag verzonden.</li>
            {thobe && <li className="flex items-start gap-3"><ArrowLeftRight size={16} className="mt-0.5 shrink-0" aria-hidden /> {EXCHANGE_COPY}: past hij niet, dan ruil je kosteloos.</li>}
            <li className="flex items-start gap-3"><MessageCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
              <a href={whatsapp(`Hoi THOBY3, ik heb een vraag over de ${thobe ? "Thobe " : ""}${product.name}.`)} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-4 hover:decoration-ink">Vraag over je maat? Stuur ons een WhatsApp</a>
            </li>
          </ul>

          <div className="mt-12 max-w-[60ch] space-y-4 border-t border-line pt-8 leading-relaxed text-muted">
            {product.description.map((d) => <p key={d}>{d}</p>)}
          </div>
        </div>
      </div>

      <div data-sticky-cta className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/90 p-3 backdrop-blur-xl pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        {picker && (
          <div id="sticky-sizes" className="sheet-enter mb-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="caption">Kies je maat</p>
              <button onClick={() => setPicker(false)} aria-label="Maatkeuze sluiten" className="press -m-2 flex h-12 w-12 items-center justify-center"><X size={18} /></button>
            </div>
            <FitToggle value={fit} onChange={chooseFit} id="fit-sticky" />
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((s) => (
                <button key={s.label} onClick={() => pickFromSticky(s.label)} className="press min-h-12 rounded-xl border border-line-strong py-2 hover:border-ink">
                  <span className="block font-semibold">{sizeCode(s.label, fit)}</span>
                  <span className="num block text-xs text-muted">{s.bodyHeight.replace(" cm", "")}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {thobe && size && !picker && !product.soldOut && (
          <p className="mb-2 px-1 text-xs text-muted">Je bestelt: <span className="font-semibold text-ink">{sizeCode(size, fit)} · {fitLabel}</span>{giftBox ? " · in de geschenkdoos" : ""}</p>
        )}
        <div className="flex gap-2">
          <button onClick={() => toggleWish(product.slug)} aria-pressed={wished} aria-label="Verlanglijst" className="press btn-ghost flex w-14 items-center justify-center"><Heart size={18} className={wished ? "fill-ink" : ""} /></button>
          {product.soldOut
            ? <a href={notify} target="_blank" rel="noopener noreferrer" className={`${cta} flex items-center justify-center gap-2`}><Bell size={16} aria-hidden /> Laat het me weten</a>
            : thobe && !size
              ? <button onClick={() => setPicker((v) => !v)} aria-expanded={picker} aria-controls="sticky-sizes" className={cta}>{label} · {money(total)}</button>
              : <button onClick={submit} className={cta}>{label} · {money(total)}</button>}
        </div>
      </div>
    </div>
  );
}
