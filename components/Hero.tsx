import Image from "next/image";
import home from "@/content/home.json";
import { getProduct, products } from "@/lib/products";
import { HeroBanderol } from "./HeroBanderol";

const content = home.hero;
const product = getProduct(content.featuredProduct) ?? products[0];
// CSS-entree in plaats van Framer: speelt al vóór hydration, dus de kop (LCP) wacht niet op JavaScript.
const rise = (i: number) => ({ animationDelay: `${80 + i * 70}ms` });

// Per foto: waar schouder en zoom vallen, in % van de fotohoogte, gemeten op het bestand.
// Een andere foto in het CMS krijgt geen lengtelijn: liever geen lijn dan een lijn naast de thobe.
const MEASURED: Record<string, { top: number; bottom: number }> = {
  "/img/wd-1.jpg": { top: 6.5, bottom: 90.5 },
};

/** De thobe op ware lengte in zijn studiovlak, met de lengtelijn op de foto zelf: van schouder tot zoom. */
function MeasuredFigure() {
  const m = MEASURED[content.image];
  return (
    <figure className="relative mx-auto aspect-[3/4] h-[min(45svh,26rem)] bg-studio lg:mr-0 lg:h-full">
      {/* Multiply op het studiopapier: de koele studiogrijs wordt warm grijs en valt in het zandpalet. */}
      <div className="absolute inset-0">
        <Image src={content.image} alt={content.imageAlt} fill preload sizes="(min-width:1024px) 34vw, 80vw" className="settle object-cover mix-blend-multiply" />
        {m && (
          <div aria-hidden className="absolute left-[11%] flex w-5 flex-col items-center" style={{ top: `${m.top}%`, bottom: `${100 - m.bottom}%` }}>
            {/* Zoals een maat op een patroon: de lijn breekt open voor het label, geen vlak erachter. */}
            <span className="draw-fade h-px w-4 bg-ink" />
            <span className="draw-y w-px flex-1 origin-bottom bg-ink" />
            <span className="draw-label caption rotate-180 whitespace-nowrap py-2.5 [writing-mode:vertical-rl]">Zelfde lengte, slank en breed</span>
            <span className="draw-y w-px flex-1 origin-top bg-ink" />
            <span className="draw-fade h-px w-4 bg-ink" />
          </div>
        )}
      </div>
    </figure>
  );
}

// De thobe zelf, op lengte. Onderaan ligt de banderol uit de doos: daar kies je pasvorm en maat en bestel je meteen.
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col bg-sand pt-[5.875rem]">
      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-5 px-5 pb-5 pt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-1 lg:gap-16 lg:px-10 lg:py-10">
        <div>
          {/* Alleen beweging, geen fade: een onzichtbare kop telt niet als LCP. */}
          <h1 id="hero-title" style={rise(0)} className="rise-y display text-[clamp(2.5rem,6.4vw,6rem)] text-ink">
            {content.title}<br />{content.titleSecond}
          </h1>
          {/* Op de telefoon zegt de kop het al en kiest de banderol eronder; de toelichting krijgt pas ruimte vanaf sm. */}
          <p style={rise(1)} className="rise mt-4 hidden max-w-[40ch] leading-relaxed text-muted sm:block lg:mt-7 lg:text-lg">
            {content.text}
          </p>
        </div>
        <div className="lg:h-[min(64svh,42rem)]">
          <MeasuredFigure />
        </div>
      </div>

      <div style={rise(2)} className="rise relative">
        <HeroBanderol product={product} cta={content.buttonPrimary} help={content.buttonSecondary} />
      </div>
    </section>
  );
}
