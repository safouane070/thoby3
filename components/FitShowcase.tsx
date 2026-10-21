"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import home from "@/content/home.json";
import { FITS, HAS_MEASUREMENTS, SIZES, sizeCode, type Fit } from "@/lib/products";
import { SizeAdvisor } from "./SizeAdvisor";
import { ThobeDiagram, shapeOf } from "./ThobeDiagram";

const other = (f: Fit): Fit => (f === "slim" ? "broad" : "slim");
const CHOICE = "press flex min-h-12 items-center justify-center border transition-colors duration-200";
const choiceState = (on: boolean) => (on ? "border-ink bg-ink text-gold" : "border-line-strong text-ink hover:border-ink");

// De maatkaart: kies maat en pasvorm, de thobe ernaast staat op schaal (1 eenheid = 1 cm) met de andere pasvorm gestippeld.
export function FitShowcase() {
  const [fit, setFit] = useState<Fit>("slim");
  const [size, setSize] = useState("M");
  const s = SIZES.find((x) => x.label === size) ?? SIZES[0];
  const active = FITS.find((f) => f.id === fit)!;
  // Eén tekening, op twee plekken: op mobiel direct onder de maatknoppen, op desktop vast in de rechterkolom.
  const diagram = (
    <div className="border border-line-strong bg-paper p-4 sm:p-6">
      <ThobeDiagram shape={shapeOf(s, fit)} ghost={shapeOf(s, other(fit))} className="mx-auto block w-full max-w-[34rem]" />
      <p className="tag mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 !text-[0.75rem] text-muted">
        <span><span className="text-ink">{sizeCode(s.label, fit)}</span> op schaal</span>
        <span>Gestippeld: {sizeCode(s.label, other(fit))}</span>
      </p>
    </div>
  );
  const shopHref = `/product/${home.hero.featuredProduct}?${new URLSearchParams({ fit, size })}`;

  return (
    <section id="pasvorm" aria-labelledby="pasvorm-title" className="bg-sand">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 lg:grid-cols-[6fr_5fr] lg:gap-20 lg:px-10 lg:py-28 [&>*]:min-w-0">
        <div>
          <h2 id="pasvorm-title" className="display text-[clamp(2.5rem,4.6vw,4.25rem)]">{home.fit.title}{home.fit.titleSecond && <><br />{home.fit.titleSecond}</>}</h2>
          <p className="mt-6 max-w-[52ch] leading-relaxed text-muted">{home.fit.text}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
            <fieldset>
              <legend className="tag mb-2 text-muted">Pasvorm</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {FITS.map((f) => (
                  <button key={f.id} type="button" aria-pressed={fit === f.id} onClick={() => setFit(f.id)} className={`${CHOICE} tag px-4 ${choiceState(fit === f.id)}`}>
                    {f.label} <span className="ml-1.5 opacity-60">-{f.id === "slim" ? 1 : 2}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="tag mb-2 text-muted">Maat</legend>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZES.map((x) => (
                  <button key={x.label} type="button" aria-pressed={size === x.label} aria-label={`Maat ${x.label}, ${x.bodyHeight}`} onClick={() => setSize(x.label)}
                    className={`${CHOICE} display text-xl ${choiceState(size === x.label)}`}>{x.label}</button>
                ))}
              </div>
            </fieldset>
          </div>
          <p className="mt-4 min-h-12 max-w-[52ch] text-sm leading-relaxed text-muted" aria-live="polite">
            <strong className="font-semibold text-ink">{sizeCode(s.label, fit)}</strong> · voor {s.bodyHeight} · {active.note}
          </p>

          <div className="mt-6 lg:hidden">{diagram}</div>

          {HAS_MEASUREMENTS && (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-sm">
                <caption className="sr-only">Maattabel in centimeters, plat gemeten</caption>
                <thead>
                  <tr className="tag border-b border-line-strong !text-[0.75rem] text-muted">
                    <th className="py-2.5 pl-2 pr-3 font-semibold">Maat</th>
                    <th className="py-2.5 pr-3 font-semibold">Borst</th><th className="py-2.5 pr-3 font-semibold">Schouders</th>
                    <th className="py-2.5 pr-3 font-semibold">Mouw</th><th className="py-2.5 pr-2 font-semibold">Lengte thobe</th>
                  </tr>
                </thead>
                {/* Per maat een groep: de lichaamslengte als kopregel (geldt voor slank én breed), daaronder -1 en -2. */}
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
                          className={`cursor-pointer border-b transition-colors duration-200 ${on ? "bg-ink text-paper" : "hover:bg-paper"} ${f === "broad" ? "border-line-strong" : "border-line"}`}>
                          <th scope="row" className={`py-2 pl-2 pr-3 font-bold ${on ? "text-gold" : ""}`}>{sizeCode(x.label, f)}</th>
                          <td className="py-2 pr-3">{x.chest[f]}</td><td className="py-2 pr-3">{x.shoulders[f]}</td>
                          <td className="py-2 pr-3">{x.sleeve[f]}</td><td className="py-2 pr-2">{x.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                ))}
              </table>
              <p className="mt-3 text-xs leading-relaxed text-muted">Alles in cm. Kleding plat gemeten: borst van oksel tot oksel, lengte van schouder tot zoom. {home.fit.note}</p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="hidden lg:block">{diagram}</div>
          {/* Hoort bij de gekozen maat in de tekening, dus direct eronder; de maathulp is een aparte stap. */}
          <Link href={shopHref} className="press btn-primary tag group mt-4 inline-flex min-h-14 items-center gap-3 px-7 !text-[0.9375rem]">
            Shop White Desert in {sizeCode(s.label, fit)} <ArrowRight size={16} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <SizeAdvisor fit={fit} onPick={setSize} pickLabel={(sz) => `Toon ${sizeCode(sz, fit)}`} className="mt-10 border-t border-line-strong pt-8" />
        </div>
      </div>
    </section>
  );
}
