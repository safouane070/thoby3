import { ArrowUpRight, Star } from "lucide-react";
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
  if (!items.length) return null;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <h2 id={`${id}-title`} className="display text-[clamp(2.5rem,4.6vw,4.25rem)]">{summary.title}{summary.titleSecond && <><br />{summary.titleSecond}</>}</h2>
        {summary.url ? (
          <a href={summary.url} target="_blank" rel="noopener noreferrer" className="group flex items-end gap-4">
            <span className="display text-[3.5rem] leading-[0.8]">{summary.score}</span>
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
      </div>
      {/* Kolommen in plaats van een raster: reviews zijn ongelijk lang, dus geen rij gelijke kaarten met gaten. */}
      <ul className="mt-10 gap-4 md:columns-2 lg:mt-14 lg:columns-3 max-md:[&>li:nth-child(n+4)]:hidden">
        {items.map((r, i) => {
          const p = r.product ? getProduct(r.product) : undefined;
          return (
            <li key={i} className="mb-4 break-inside-avoid bg-paper p-6 sm:p-7">
              <Stars rating={r.rating} />
              <blockquote className="mt-4 leading-relaxed">“{r.text}”</blockquote>
              <p className="mt-5 text-sm">
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
