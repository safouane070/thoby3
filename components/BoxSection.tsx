import Link from "next/link";
import { ArrowRight } from "lucide-react";
import home from "@/content/home.json";
import { GIFT_BOX_PRICE, eur, whatsapp } from "@/lib/products";
import { LidReveal } from "./LidReveal";

const box = home.box;

// Binnen in de doos: de groet en de drie stappen uit het deksel, de open doos onder een deksel dat wegschuift,
// en onderaan de beloftes als de kleine print op de bodem van de doos.
export function BoxSection() {
  return (
    <section id="doos" aria-labelledby="doos-title" className="board on-dark">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 lg:grid-cols-[5fr_6fr] lg:items-center lg:gap-24 lg:px-16 lg:py-40 xl:px-24 [&>*]:min-w-0">
        <div>
          <p lang="ar" dir="rtl" className="text-left font-kufi text-[clamp(2.75rem,5vw,4.25rem)] leading-none text-paper">{box.greetingArabic}</p>
          <p className="caption mt-4 text-muted-dark">{box.greeting}</p>

          <h2 id="doos-title" className="display mt-12 text-[clamp(2.75rem,5.6vw,5.25rem)] text-paper">{box.title}{box.titleSecond && <><br /><em>{box.titleSecond}</em></>}</h2>
          <p className="mt-6 max-w-[46ch] leading-relaxed text-muted-dark">{box.text}</p>

          {/* De drie stappen uit het deksel, als genummerde regels: de volgorde is de boodschap. */}
          {/* Cursieve gouden cijfers zoals in het deksel; de regels krijgen lucht en een haarlijn in goud. */}
          <ol className="mt-12 border-t border-gold/25">
            {box.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline border-b border-gold/25 py-6 lg:grid-cols-[4.5rem_minmax(0,1fr)] lg:py-7">
                <span aria-hidden className="display text-[1.75rem] italic text-gold lg:text-[2.25rem]">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[1.875rem] text-paper lg:text-[2.5rem]">{s.title}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href={`/product/${box.product}?box=1`} className="press btn-gold tag group inline-flex min-h-14 items-center gap-3 px-7 !text-[0.9375rem]">
              {box.button} <ArrowRight size={16} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <p className="text-sm leading-snug text-muted-dark">Geschenkdoos + {eur(GIFT_BOX_PRICE)}<br />Musk & siwak gratis bij elke thobe</p>
          </div>
        </div>

        <figure>
          <div className="shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"><LidReveal src={box.image} alt={box.imageAlt} /></div>
          <figcaption className="caption mt-5 font-normal text-muted-dark">White Desert, gevouwen onder de banderol</figcaption>
        </figure>
      </div>

      {/* De kleine print op de bodem van de doos: één regel, geen iconenrij. */}
      <div className="border-t border-line-dark">
        <ul className="mx-auto flex max-w-[1440px] flex-wrap gap-x-10 gap-y-3 px-5 py-6 text-sm text-muted-dark lg:px-10">
          {home.promises.map((p) => (
            <li key={p.title}>
              <span className="font-semibold text-paper">{/[.?!]$/.test(p.title) ? p.title : `${p.title}.`}</span>{" "}
              {p.whatsapp
                ? <a href={whatsapp("Hoi THOBY3, ik twijfel over mijn maat.")} target="_blank" rel="noopener noreferrer" className="underline decoration-paper/40 underline-offset-4 hover:text-paper">{p.text}</a>
                : p.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
