import { ArrowUpRight, Star } from "lucide-react";
import home from "@/content/home.json";
import { getProduct } from "@/lib/products";
import { average, type Review } from "@/lib/reviews";
import { Marquee } from "./Marquee";
import { Reveal, SplitTitle } from "./Reveal";

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
 * De kaarten lopen als band voorbij en staan stil zodra je eroverheen gaat om te lezen.
 */
export function Reviews({ items, id = "reviews", className = "" }: { items: Review[]; id?: string; className?: string }) {
  if (!items.length) return null;
  // Te weinig kaarten voor een naadloze band op een breed scherm: dan herhalen we de reeks binnen één kopie.
  const row = items.length < 6 ? [...items, ...items] : items;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 md:flex-row md:items-end lg:px-10">
        <h2 id={`${id}-title`} className="display text-[clamp(2.25rem,4.4vw,3.75rem)] md:mr-auto"><SplitTitle first={summary.title} second={summary.titleSecond} /></h2>
        <Reveal>
          {summary.url ? (
            <a href={summary.url} target="_blank" rel="noopener noreferrer" className="group flex items-end gap-4">
              <span className="display text-[3.25rem] !leading-[0.8]">{summary.score}</span>
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
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-10 lg:mt-14">
        <Marquee seconds={row.length * 9} touch="scroll" label="Klantreviews">
          <ul className="flex">
            {row.map((r, i) => {
              const p = r.product ? getProduct(r.product) : undefined;
              return (
                <li key={i} className="mr-4 flex w-[20rem] shrink-0 flex-col rounded-2xl bg-studio p-6 sm:w-[24rem] sm:p-7">
                  <Stars rating={r.rating} size={13} />
                  <blockquote className="mb-6 mt-4 text-[1.0625rem] leading-relaxed">“{r.text}”</blockquote>
                  <p className="mt-auto flex items-center gap-3 text-sm">
                    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper">{r.name.trim()[0]}</span>
                    <span>
                      <span className="font-semibold">{r.name}</span>
                      {r.place && <span className="text-muted">, {r.place}</span>}
                      {r.date && <span className="text-muted"> · {month(r.date)}</span>}
                      {p && <span className="block text-xs text-muted">Kocht: {p.kind === "thobe" ? "Thobe " : ""}{p.name}</span>}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </Marquee>
      </Reveal>
    </section>
  );
}
