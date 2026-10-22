"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import home from "@/content/home.json";
import { getProduct } from "@/lib/products";
import { average, type Review } from "@/lib/reviews";

const summary = home.reviews;
const month = (d: string) => new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(new Date(d));

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} van de 5 sterren`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} aria-hidden className={i <= Math.round(rating) ? "fill-ink text-ink" : "text-line-strong"} />)}
    </span>
  );
}

/**
 * Reviewblok; rendert niets zonder reviews (nooit lege of verzonnen social proof). Staat er een Trustpilot-score in het
 * CMS, dan tonen we die (met link) in plaats van een eigen gemiddelde: de selectie hier is niet het hele beeld.
 */
export function Reviews({ items, id = "reviews", className = "" }: { items: Review[]; id?: string; className?: string }) {
  const track = useRef<HTMLUListElement>(null);
  // Eén kaart verder (breedte van de eerste kaart plus de tussenruimte); scroll-snap lijnt hem daarna uit.
  const step = (dir: 1 | -1) => {
    const card = track.current?.firstElementChild as HTMLElement | null;
    if (card) track.current!.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };
  if (!items.length) return null;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
        <h2 id={`${id}-title`} className="display text-[clamp(2.5rem,4.6vw,4.25rem)] md:mr-auto">{summary.title}{summary.titleSecond && <><br /><em>{summary.titleSecond}</em></>}</h2>
        {summary.url ? (
          <a href={summary.url} target="_blank" rel="noopener noreferrer" className="group flex items-end gap-4">
            <span className="display text-[4rem] !leading-[0.8]">{summary.score}</span>
            <span className="text-sm leading-snug">
              <Stars rating={Number(summary.score.replace(",", "."))} size={15} />
              <span className="mt-1 flex items-center gap-1 underline decoration-line-strong underline-offset-4 group-hover:decoration-ink">
                {summary.count} reviews op Trustpilot <ArrowUpRight size={14} aria-hidden />
              </span>
            </span>
          </a>
        ) : (
          <p className="flex items-center gap-3 text-sm"><Stars rating={average(items)} size={16} /> {items.length} {items.length === 1 ? "review" : "reviews"}</p>
        )}
        {/* Pijlen alleen vanaf md: op de telefoon veeg je, en daar staat de volgende kaart al half in beeld. */}
        {items.length > 1 && (
          <div className="hidden gap-2 md:ml-4 md:flex lg:ml-8">
            {([[-1, "Vorige reviews", ArrowLeft], [1, "Volgende reviews", ArrowRight]] as const).map(([dir, label, Icon]) => (
              <button key={dir} type="button" onClick={() => step(dir)} aria-label={label}
                className="press flex h-11 w-11 items-center justify-center border border-line-strong hover:border-ink">
                <Icon size={16} aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Eén rij die opzij schuift: veeg op de telefoon, pijlen op desktop. Drie kaarten in beeld vanaf lg. */}
      <ul ref={track} aria-label="Klantreviews" className="mt-8 flex lg:mt-10 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((r, i) => {
          const p = r.product ? getProduct(r.product) : undefined;
          return (
            <li key={i} className="flex w-[85%] shrink-0 snap-start flex-col border border-line bg-paper p-6 shadow-[0_1px_2px_rgba(26,26,26,0.04)] sm:w-[calc((100%-1rem)/2)] sm:p-7 lg:w-[calc((100%-2rem)/3)]">
              <Stars rating={r.rating} size={13} />
              <blockquote className="display mb-6 mt-4 text-[1.1875rem] !leading-[1.4] !tracking-normal">“{r.text}”</blockquote>
              <p className="mt-auto border-t border-line pt-4 text-sm">
                <span className="font-semibold">{r.name}</span>
                {r.place && <span className="text-muted">, {r.place}</span>}
                {r.date && <span className="text-muted"> · {month(r.date)}</span>}
                {p && <span className="block text-xs text-muted">Kocht: {p.kind === "thobe" ? "Thobe " : ""}{p.name}</span>}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
