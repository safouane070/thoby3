"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import home from "@/content/home.json";
import { FITS, HAS_MEASUREMENTS, SIZES, sizeCode, type Fit } from "@/lib/products";
import { SizeAdvisor } from "./SizeAdvisor";
import { ThobePair, shapeOf } from "./ThobeDiagram";
import { useStore } from "./StoreProvider";

const CHOICE = "press flex min-h-14 flex-col items-center justify-center border transition-colors duration-200";
const choiceState = (on: boolean) => (on ? "border-ink bg-ink text-gold" : "border-line-strong text-ink hover:border-ink");

/** Maten van één pasvorm naast de tekening, met de knop die die maat meteen kiest. */
function FitColumn({ fit, size, align }: { fit: Fit; size: string; align: "left" | "right" }) {
  const s = SIZES.find((x) => x.label === size) ?? SIZES[0];
  const f = FITS.find((x) => x.id === fit)!;
  const href = `/product/${home.hero.featuredProduct}?${new URLSearchParams({ fit, size })}`;
  const rows = [["Borst", s.chest[fit]], ["Schouders", s.shoulders[fit]], ["Mouw", s.sleeve[fit]]] as const;
  return (
    <div className={`flex flex-col ${align === "right" ? "lg:items-end lg:text-right" : ""}`}>
      <p className="display text-[clamp(2rem,3.6vw,3.25rem)]">{sizeCode(s.label, fit)} <span className="text-muted">{f.label}</span></p>
      <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-muted">{f.note}</p>
      {HAS_MEASUREMENTS && (
        <dl className="mt-5 w-full max-w-[18rem] border-y border-line-strong text-left sm:grid sm:grid-cols-3">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between border-line py-2 [&:not(:first-child)]:border-t sm:block sm:py-3 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-t-0 sm:[&:not(:first-child)]:pl-3">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className={`num text-xl font-bold sm:text-2xl ${k === "Borst" ? "text-gold-ink" : ""}`}>{v}<span className="ml-0.5 text-sm font-semibold text-muted">cm</span></dd>
            </div>
          ))}
        </dl>
      )}
      <Link href={href} className="press btn-primary tag group mt-5 flex min-h-12 w-full max-w-[18rem] items-center justify-center gap-2.5 px-5">
        Shop {sizeCode(s.label, fit)} <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

// De maatkaart als één werkblad: kies je maat, en slank en breed staan naast elkaar op hetzelfde raster,
// even lang en zichtbaar verschillend in de breedte. De volledige tabel staat eronder, uitklapbaar.
export function FitShowcase() {
  // Jouw maat uit de winkel (gedeeld met de balk en de productpagina); zonder keuze tonen we M, zonder die op te slaan.
  const { pref, setPref } = useStore();
  const size = pref.size ?? "M";
  const fit: Fit = pref.fit ?? "slim";
  const setSize = (sz: string) => setPref({ size: sz });
  const setFit = (f: Fit) => setPref({ fit: f });
  const s = SIZES.find((x) => x.label === size) ?? SIZES[0];

  return (
    <section id="pasvorm" aria-labelledby="pasvorm-title" className="bg-sand">
      <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <h2 id="pasvorm-title" className="display text-[clamp(2.5rem,4.6vw,4.25rem)]">{home.fit.title}{home.fit.titleSecond && <><br />{home.fit.titleSecond}</>}</h2>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{home.fit.text}</p>
          </div>
          <fieldset>
            <legend className="caption mb-2 text-muted">Jouw maat, op lichaamslengte</legend>
            <div className="grid grid-cols-4 gap-1.5 lg:w-[28rem]">
              {SIZES.map((x) => (
                <button key={x.label} type="button" aria-pressed={size === x.label} aria-label={`Maat ${x.label}, ${x.bodyHeight}`} onClick={() => setSize(x.label)}
                  className={`${CHOICE} ${choiceState(size === x.label)}`}>
                  <span className="display text-2xl">{x.label}</span>
                  <span className={`num text-xs ${size === x.label ? "text-paper/70" : "text-muted"}`}>{x.bodyHeight.replace(" m", "")}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Het werkblad: tekening in het midden, de maten van elke pasvorm aan zijn eigen kant. */}
        <div className="mt-10 grid items-start gap-8 bg-paper p-5 sm:p-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)_minmax(0,1fr)] lg:gap-6 lg:p-10">
          <div className="relative lg:order-2">
            <p className="num text-center text-lg font-bold text-gold-ink" aria-live="polite">{s.length} cm <span className="font-semibold">· zelfde lengte</span></p>
            <ThobePair slim={shapeOf(s, "slim")} broad={shapeOf(s, "broad")} className="mx-auto mt-2 block w-full max-w-[44rem]" />
          </div>
          <div className="grid grid-cols-2 gap-6 lg:contents">
            <div className="lg:order-1 lg:pt-16"><FitColumn fit="slim" size={size} align="right" /></div>
            <div className="lg:order-3 lg:pt-16"><FitColumn fit="broad" size={size} align="left" /></div>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20">
          {HAS_MEASUREMENTS && (
            // De volledige maattabel, open op de pagina: per maat een groep met de lichaamslengte als kopregel.
            // Klik op een rij en de tekening erboven springt naar die maat; de gekozen pasvorm licht op.
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-sm">
                <caption className="sr-only">Maattabel in centimeters, plat gemeten</caption>
                <thead>
                  <tr className="tag border-b border-line-strong !text-[0.75rem] text-muted">
                    <th className="py-2.5 pl-2 pr-3 font-semibold">Maat</th>
                    <th className="py-2.5 pr-3 font-semibold">Borst</th><th className="py-2.5 pr-3 font-semibold">Schouders</th>
                    <th className="py-2.5 pr-3 font-semibold">Mouw</th><th className="py-2.5 pr-2 font-semibold">Lengte thobe</th>
                  </tr>
                </thead>
                {SIZES.map((x) => (
                  <tbody key={x.label} className="num text-base">
                    <tr className="border-b border-line">
                      <th scope="rowgroup" colSpan={5} className="tag pb-1.5 pl-2 pt-4 text-left !text-[0.6875rem] font-semibold text-muted">
                        Maat {x.label} · voor {x.bodyHeight}
                      </th>
                    </tr>
                    {FITS.map(({ id: f }) => {
                      const on = x.label === size && f === fit;
                      return (
                        <tr key={f} onClick={() => { setSize(x.label); setFit(f); }}
                          className={`cursor-pointer border-b transition-colors duration-200 ${on ? "bg-ink text-paper" : "[@media(hover:hover)]:hover:bg-paper"} ${f === "broad" ? "border-line-strong" : "border-line"}`}>
                          <th scope="row" className={`py-2.5 pl-2 pr-3 font-bold ${on ? "text-gold" : ""}`}>{sizeCode(x.label, f)}</th>
                          <td className="py-2.5 pr-3">{x.chest[f]}</td><td className="py-2.5 pr-3">{x.shoulders[f]}</td>
                          <td className="py-2.5 pr-3">{x.sleeve[f]}</td><td className="py-2.5 pr-2">{x.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                ))}
              </table>
              <p className="mt-3 text-xs leading-relaxed text-muted">Alles in cm. Kleding plat gemeten: borst van oksel tot oksel, lengte van schouder tot zoom. {home.fit.note}</p>
            </div>
          )}
          <SizeAdvisor onPick={setSize} pickLabel={(sz) => `Toon maat ${sz}`} className="border-t border-line-strong pt-5" />
        </div>
      </div>
    </section>
  );
}
