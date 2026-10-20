import { Star } from "lucide-react";
import home from "@/content/home.json";
import { getProduct } from "@/lib/products";
import { average, type Review } from "@/lib/reviews";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} van de 5 sterren`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} aria-hidden className={i <= Math.round(rating) ? "fill-ink text-ink" : "text-line-strong"} />)}
    </span>
  );
}

/** Reviewblok; rendert niets zonder reviews (nooit lege of verzonnen social proof). */
export function Reviews({ items, id = "reviews", className = "" }: { items: Review[]; id?: string; className?: string }) {
  if (!items.length) return null;
  const avg = average(items);
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <h2 id={`${id}-title`} className="font-serif text-5xl leading-none md:text-6xl">{home.reviews.title} <em>{home.reviews.titleItalic}</em></h2>
        <p className="flex items-center gap-3 text-sm"><Stars rating={avg} size={16} /> <span><strong className="font-medium">{avg.toLocaleString("nl-NL")}</strong> / 5 · {items.length} {items.length === 1 ? "review" : "reviews"}</span></p>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((r, i) => {
          const p = r.product ? getProduct(r.product) : undefined;
          return (
            <li key={i} className="flex flex-col border border-line bg-ivory p-6">
              <Stars rating={r.rating} />
              <blockquote className="mt-4 flex-1 leading-relaxed">“{r.text}”</blockquote>
              <p className="mt-5 text-sm">
                <span className="font-medium">{r.name}</span>
                {r.place && <span className="text-taupe">, {r.place}</span>}
                {p && <span className="block text-xs text-taupe">Kocht: {p.kind === "thobe" ? "Thobe " : ""}{p.name}</span>}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
