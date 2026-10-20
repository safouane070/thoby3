"use client";

import { useState } from "react";
import home from "@/content/home.json";
import { FITS, HAS_MEASUREMENTS, SIZES, type Fit } from "@/lib/products";
import { FitSilhouette } from "./FitSilhouette";
import { FitToggle } from "./FitToggle";
import { Reveal } from "./Reveal";
import { SizeAdvisor } from "./SizeAdvisor";

export function FitShowcase() {
  const [fit, setFit] = useState<Fit>("slim");
  const active = FITS.find((f) => f.id === fit)!;

  return (
    <section id="pasvorm" className="on-dark bg-obsidian py-24 text-ivory lg:py-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="font-serif text-5xl leading-[0.95] md:text-7xl">
            {home.fit.title}<br /><em>{home.fit.titleItalic}</em>
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ivory/70">
            {home.fit.text}
          </p>

          <FitToggle value={fit} onChange={setFit} id="fit-showcase" tone="dark" className="mt-10 w-full max-w-72" />
          <p className="mt-4 min-h-12 max-w-md text-sm text-ivory/80" aria-live="polite">{active.note}</p>

          <table className="mt-8 w-full max-w-md text-left text-sm">
            <caption className="sr-only">Maattabel</caption>
            <thead>
              <tr className="border-b border-white/15 text-xs text-ivory/60">
                <th className="py-2 font-normal">Maat</th><th className="py-2 font-normal">Lichaamslengte</th>
                {HAS_MEASUREMENTS && <><th className="py-2 font-normal">Borstomvang ({active.label.toLowerCase()})</th><th className="py-2 font-normal">Lengte thobe</th></>}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s.label} className="border-b border-white/10">
                  <th className="py-3 font-serif text-xl font-medium">{s.label}</th><td className="py-3 text-ivory/80">{s.bodyHeight}</td>
                  {HAS_MEASUREMENTS && <><td className="py-3 text-ivory/80">{s.chest[fit] ? `${s.chest[fit]} cm` : "–"}</td><td className="py-3 text-ivory/80">{s.length ? `${s.length} cm` : "–"}</td></>}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-ivory/60">{home.fit.note}</p>
          <SizeAdvisor tone="dark" shopHref={(size) => `/product/${home.hero.featuredProduct}?${new URLSearchParams({ fit, size })}`} className="mt-8 max-w-md border-t border-white/15 pt-6" />
        </div>

        <Reveal className="relative mx-auto aspect-[1/1.5] w-full max-w-sm">
          <FitSilhouette fit={fit} detailed className="h-full w-full" />
          <div className="absolute inset-y-[4%] left-0 flex items-center" aria-hidden>
            <div className="h-full w-px border-l border-dashed border-gold/60" />
            <span className="absolute left-3 top-1/2 origin-left -rotate-90 whitespace-nowrap text-[0.625rem] uppercase tracking-[0.25em] text-gold">Zelfde lengte</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
