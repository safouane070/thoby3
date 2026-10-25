"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Accordion } from "radix-ui";
import home from "@/content/home.json";
import { FITS, HAS_MEASUREMENTS, SIZES, sizeCode, type Fit } from "@/lib/products";
import { Reveal, SplitTitle } from "./Reveal";
import { ThobePair, shapeOf } from "./ThobeDiagram";
import { useStore } from "./StoreProvider";

const CHOICE = "press flex min-h-14 flex-col items-center justify-center rounded-xl border";
const choiceState = (on: boolean) => (on ? "border-ink bg-ink text-paper" : "border-line-strong text-ink hover:border-ink");

/** Maten van één pasvorm naast de tekening, met de knop die die maat meteen kiest. */
function FitColumn({ fit, size, align }: { fit: Fit; size: string; align: "left" | "right" }) {
  const s = SIZES.find((x) => x.label === size) ?? SIZES[0];
  const f = FITS.find((x) => x.id === fit)!;
  const href = `/product/${home.hero.featuredProduct}?${new URLSearchParams({ fit, size })}`;
  const rows = [["Borst", s.chest[fit]], ["Schouders", s.shoulders[fit]], ["Mouw", s.sleeve[fit]]] as const;
  return (
    <div className={`flex flex-col ${align === "right" ? "lg:items-end lg:text-right" : ""}`}>
      <p className="display text-[clamp(1.75rem,3vw,2.5rem)]">{sizeCode(s.label, fit)} <span className="text-muted">{f.label}</span></p>
      <p className="mt-2 hidden max-w-[30ch] text-sm leading-relaxed text-muted sm:block">{f.note}</p>
      {/* Drie kolommen pas vanaf xl: daaronder is de kolom naast de tekening te smal en loopt "Schouders" in "Mouw". */}
      {HAS_MEASUREMENTS && (
        <dl className="mt-5 w-full max-w-[18rem] border-y border-line-strong text-left xl:grid xl:grid-cols-3">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-line py-2 [&:not(:first-child)]:border-t xl:block xl:py-3 xl:[&:not(:first-child)]:border-l xl:[&:not(:first-child)]:border-t-0 xl:[&:not(:first-child)]:pl-3">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="num text-xl font-medium xl:text-2xl">{v}<span className="ml-0.5 text-sm font-normal text-muted">cm</span></dd>
            </div>
          ))}
        </dl>
      )}
      <Link href={href} className="press btn-primary tag group mt-5 flex min-h-12 w-full max-w-[18rem] items-center justify-center gap-2 whitespace-nowrap px-5">
        Shop {sizeCode(s.label, fit)} <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

// De maatkaart als één werkblad: kies je maat, en slank en breed staan naast elkaar op hetzelfde raster,
// even lang en zichtbaar verschillend in de breedte. De volledige tabel staat eronder, uitklapbaar.
export function FitShowcase() {
  // Begint bij jouw bewaarde maat, maar rondkijken slaat niets op: anders stond een vergeleken maat ongemerkt
  // voorgeselecteerd op de productpagina. De "Shop"-knop neemt de keuze mee in de URL.
  const { pref } = useStore();
  const [local, setLocal] = useState<{ size?: string; fit?: Fit }>({});
  const size = local.size ?? pref.size ?? "M";
  const fit: Fit = local.fit ?? pref.fit ?? "slim";
  const setSize = (sz: string) => setLocal((x) => ({ ...x, size: sz }));
  const setFit = (f: Fit) => setLocal((x) => ({ ...x, fit: f }));
  const s = SIZES.find((x) => x.label === size) ?? SIZES[0];

  return (
    <section id="pasvorm" aria-labelledby="pasvorm-title" className="bg-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <h2 id="pasvorm-title" className="display text-[clamp(2.25rem,4.4vw,3.75rem)]"><SplitTitle first={home.fit.title} second={home.fit.titleSecond} /></h2>
            <Reveal><p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{home.fit.text}</p></Reveal>
          </div>
          <fieldset>
            <legend className="caption mb-2 text-muted">Jouw maat, op lichaamslengte</legend>
            <div className="grid grid-cols-4 gap-1.5 lg:w-[28rem]">
              {SIZES.map((x) => (
                <button key={x.label} type="button" aria-pressed={size === x.label} aria-label={`Maat ${x.label}, ${x.bodyHeight}`} onClick={() => setSize(x.label)}
                  className={`${CHOICE} ${choiceState(size === x.label)}`}>
                  <span className="text-xl font-semibold">{x.label}</span>
                  <span className={`num text-xs ${size === x.label ? "text-paper/70" : "text-muted"}`}>{x.bodyHeight.replace(" cm", "")}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Het werkblad: tekening in het midden, de maten van elke pasvorm aan zijn eigen kant. */}
        {/* Zonder maten in het CMS geen tekening op schaal (die zou op 0 cm instorten): dan alleen de twee pasvormen. */}
        <div className={`mt-10 grid items-start gap-8 rounded-[1.75rem] bg-studio p-5 sm:p-8 lg:mt-14 lg:gap-6 lg:p-12 ${HAS_MEASUREMENTS ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)_minmax(0,1fr)]" : "lg:grid-cols-2"}`}>
          {HAS_MEASUREMENTS && (
            <div className="relative lg:order-2">
              <p className="caption text-center text-muted" aria-live="polite"><span className="num">{s.length} cm</span> · zelfde lengte</p>
              <ThobePair slim={shapeOf(s, "slim")} broad={shapeOf(s, "broad")} className="mx-auto mt-2 block w-full max-w-[44rem]" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-6 lg:contents">
            <div className={`lg:order-1 ${HAS_MEASUREMENTS ? "lg:pt-16" : ""}`}><FitColumn fit="slim" size={size} align={HAS_MEASUREMENTS ? "right" : "left"} /></div>
            <div className={`lg:order-3 ${HAS_MEASUREMENTS ? "lg:pt-16" : ""}`}><FitColumn fit="broad" size={size} align="left" /></div>
          </div>
        </div>

        {/* Geen lengte-advies hier: de maatknoppen hierboven tonen de lichaamslengte al. */}
        {HAS_MEASUREMENTS && (
            // De volledige maattabel, ingeklapt: de maten van je gekozen maat staan hierboven al. Per maat een groep met de
            // lichaamslengte als kopregel; tik op een rij en de tekening springt naar die maat. Past op 320px zonder opzij schuiven.
            <Accordion.Root type="single" collapsible className="mt-10 border-t border-line-strong lg:mt-20 lg:max-w-[calc(50%-2.5rem)]">
              <Accordion.Item value="tabel" className="group">
                <Accordion.Header>
                  <Accordion.Trigger className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-6 py-4 text-left font-medium">
                    Volledige maattabel <span className="font-normal text-muted">alle maten, in cm</span>
                    <span aria-hidden className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-studio transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:bg-ink group-data-[state=open]:text-paper"><Plus size={14} /></span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-content overflow-hidden">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Maattabel in centimeters, plat gemeten</caption>
                <thead>
                  <tr className="caption border-b border-line-strong text-muted">
                    <th className="py-2.5 pl-2 pr-2 font-medium">Maat</th>
                    <th className="py-2.5 pr-2 font-medium">Borst</th><th className="py-2.5 pr-2 font-medium">Schouder</th>
                    <th className="py-2.5 pr-2 font-medium">Mouw</th><th className="py-2.5 pr-2 font-medium">Lengte</th>
                  </tr>
                </thead>
                {SIZES.map((x) => (
                  <tbody key={x.label} className="num text-base">
                    <tr className="border-b border-line">
                      <th scope="rowgroup" colSpan={5} className="pb-1.5 pl-2 pt-4 text-left text-xs font-medium text-muted">
                        Maat {x.label} · voor {x.bodyHeight}
                      </th>
                    </tr>
                    {FITS.map(({ id: f }) => {
                      const on = x.label === size && f === fit;
                      return (
                        <tr key={f} onClick={() => { setSize(x.label); setFit(f); }}
                          className={`cursor-pointer border-b transition-colors duration-200 ${on ? "bg-ink text-paper" : "[@media(hover:hover)]:hover:bg-studio"} ${f === "broad" ? "border-line-strong" : "border-line"}`}>
                          <th scope="row" className="py-1 pl-0 pr-2 font-semibold">
                            {/* De rij is klikbaar met de muis; de knop maakt dezelfde keuze bereikbaar met toetsenbord en schermlezer. */}
                            <button type="button" aria-pressed={on} onClick={(e) => { e.stopPropagation(); setSize(x.label); setFit(f); }} className="min-h-10 px-2 text-left font-semibold">{sizeCode(x.label, f)}</button>
                          </th>
                          <td className="py-2.5 pr-2">{x.chest[f]}</td><td className="py-2.5 pr-2">{x.shoulders[f]}</td>
                          <td className="py-2.5 pr-2">{x.sleeve[f]}</td><td className="py-2.5 pr-2">{x.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                ))}
              </table>
              <p className="mb-2 mt-3 text-xs leading-relaxed text-muted">Alles in cm. Kleding plat gemeten: borst van oksel tot oksel, lengte van schouder tot zoom. {home.fit.note}</p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
        )}
      </div>
    </section>
  );
}
