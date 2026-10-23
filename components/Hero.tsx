import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import home from "@/content/home.json";
import { eur, getProduct, products } from "@/lib/products";
import { Emblem } from "./Brand";
import { Marquee } from "./Marquee";
import { Parallax } from "./Parallax";
import { Stars } from "./Reviews";

const content = home.hero;
const reviews = home.reviews;
const product = getProduct(content.featuredProduct) ?? products[0];
// CSS-entree in plaats van Framer: speelt al vóór hydration, dus de kop (LCP) wacht niet op JavaScript.
const rise = (i: number) => ({ animationDelay: `${300 + i * 80}ms` });
// Productfeiten, geen beloftes: die staan al in de aankondigingsbalk en de footer.
const band = ["Satijnkatoen", "Slank en breed", "Zelfde lengte", "Acht maten", "In de geschenkdoos"];

/** Woorden die elk uit een masker omhoog schuiven, met een oplopende vertraging. */
function Words({ text, from }: { text: string; from: number }) {
  return text.split(" ").map((w, i) => (
    <span key={i}>{i > 0 && " "}<span className="mask-word"><span className="hero-word" style={{ animationDelay: `${from + i * 70}ms` }}>{w}</span></span></span>
  ));
}

/** Rond label dat langzaam draait, met het embleem in het midden. */
function Badge() {
  return (
    <div aria-hidden className="relative h-24 w-24 rounded-full bg-paper/85 text-ink shadow-[0_12px_32px_-12px_rgba(11,11,11,0.35)] backdrop-blur-md sm:h-28 sm:w-28 lg:h-32 lg:w-32">
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full">
        <defs><path id="badge-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
        <text fontSize="7.4" fontWeight="500" fill="currentColor">
          <textPath href="#badge-circle" textLength="236" lengthAdjust="spacing">SATIJNKATOEN · SLANK &amp; BREED · THOBY3 ·</textPath>
        </text>
      </svg>
      <Emblem className="absolute left-1/2 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2 sm:h-9 lg:h-10" />
    </div>
  );
}

// Een opening als een filmtitel: de kop schuift woord voor woord omhoog, de foto opent uit een kleiner venster
// en zakt bij het scrollen trager weg dan de pagina. Daaronder een lopende band met de beloftes.
export function Hero() {
  const titleWords = content.title.split(" ").length;
  return (
    <section aria-labelledby="hero-title" className="bg-sand pt-[5.875rem]">
      {/* Telefoon: kop, knop, dan meteen de thobe (product in het eerste scherm), toelichting eronder.
          Desktop: tekst links verticaal gecentreerd, foto rechts. Eén DOM, de volgorde komt uit grid-areas. */}
      <div className="mx-auto grid max-w-[1440px] px-5 pb-12 pt-6 [grid-template-areas:'a'_'b'_'d'_'c'] lg:grid-cols-2 lg:grid-rows-[1fr_auto_1fr] lg:gap-x-16 lg:px-10 lg:pb-20 lg:pt-10 lg:[grid-template-areas:'a_d'_'c_d'_'b_d']">
        <div className="[grid-area:a] lg:self-end">
          {reviews.url && (
            <a href={reviews.url} target="_blank" rel="noopener noreferrer" style={rise(0)}
              className="rise press btn-ghost inline-flex min-h-9 items-center gap-2 px-3.5 text-[0.8125rem]">
              <Stars rating={Number(reviews.score.replace(",", "."))} size={12} />
              <span className="font-semibold">{reviews.score}</span>
              <span className="text-muted">op Trustpilot</span>
              <ArrowUpRight size={13} aria-hidden className="text-muted" />
            </a>
          )}
          <h1 id="hero-title" className="display mt-5 text-[clamp(2.125rem,10.4vw,2.75rem)] !leading-[0.98] !tracking-[-0.045em] sm:text-[clamp(2.75rem,5.4vw,5rem)] lg:mt-6">
            <span className="block"><Words text={content.title} from={120} /></span>
            <span className="block text-muted"><Words text={content.titleSecond} from={120 + titleWords * 70} /></span>
          </h1>
        </div>

        <div style={rise(4)} className="rise mt-6 flex gap-3 [grid-area:b] lg:mt-8 lg:self-start">
          <Link href={`/product/${product.slug}`} className="press btn-primary tag group inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 px-6 !text-[0.9375rem] sm:flex-none">
            {content.buttonPrimary} <span className="num text-paper/60">{eur(product.price)}</span>
            <ArrowRight size={16} aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
          <Link href="/#pasvorm" className="press btn-ghost tag hidden min-h-12 items-center px-6 !text-[0.9375rem] sm:inline-flex">{content.buttonSecondary}</Link>
        </div>

        <div style={rise(3)} className="rise mt-8 [grid-area:c] lg:mt-8">
          <p className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-muted lg:text-lg">{content.text}</p>
          <Link href="/#pasvorm" className="press btn-ghost tag mt-5 inline-flex min-h-12 items-center px-6 !text-[0.9375rem] sm:hidden">{content.buttonSecondary}</Link>
        </div>

        {/* De paneelkleur is het grijs van de foto zelf, zodat foto en vlak naadloos in elkaar lopen. */}
        <div className="relative mt-8 [grid-area:d] lg:mt-0">
          <figure className="open-frame relative aspect-[4/5] overflow-hidden bg-[#d3d7d7] lg:aspect-auto lg:h-[min(80svh,48rem)]">
            <Parallax distance={90} scale={1.1} className="absolute inset-0">
              <Image src={content.image} alt={content.imageAlt} fill preload sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-top" />
            </Parallax>
            <figcaption style={rise(6)} className="rise absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-paper/85 py-2 pl-4 pr-2 text-sm shadow-[0_8px_24px_-12px_rgba(11,11,11,0.3)] backdrop-blur-md">
              <span><span className="font-semibold">{product.name}</span> <span className="text-muted">· {product.colors[0]?.name}</span></span>
              <Link href={`/product/${product.slug}`} aria-label={`Bekijk ${product.name}`} className="press flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
                <ArrowRight size={14} aria-hidden />
              </Link>
            </figcaption>
          </figure>
          <div style={rise(7)} className="rise absolute -top-6 right-3 lg:-left-14 lg:right-auto lg:top-16"><Badge /></div>
        </div>
      </div>

      <Marquee seconds={30} label="THOBY3 in het kort" className="border-y border-line py-5 lg:py-6">
        {band.map((t) => (
          <span key={t} className="flex items-center gap-8 pr-8 text-[clamp(1.25rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] whitespace-nowrap lg:gap-12 lg:pr-12">
            {t} <span aria-hidden><Emblem className="h-[0.9em] w-auto text-gold" /></span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
