import Image from "next/image";
import home from "@/content/home.json";
import { getProduct, products } from "@/lib/products";
import { HeroBanderol } from "./HeroBanderol";

const content = home.hero;
const product = getProduct(content.featuredProduct) ?? products[0];
// CSS-entree in plaats van Framer: speelt al vóór hydration, dus de kop (LCP) wacht niet op JavaScript.
const rise = (i: number) => ({ animationDelay: `${80 + i * 70}ms` });

// De thobe gedragen, met de doos in handen: product en cadeau in één beeld. De kop staat links op het zand,
// en onderaan ligt de banderol: daar kies je meteen pasvorm en maat. Multiply trekt het studiogrijs naar het zand.
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-sand pt-[5.875rem]">
      {/* Mobiel een liggende uitsnede bovenaan; desktop vult de foto de rechterkant en loopt links uit in het zand. */}
      <div className="relative aspect-[2/1] w-full sm:aspect-[16/10] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[64%] lg:[mask-image:linear-gradient(to_right,transparent,#000_24%)]">
        <Image src={content.image} alt={content.imageAlt} fill preload sizes="(min-width:1024px) 64vw, 100vw"
          className="settle object-cover object-[50%_58%] mix-blend-multiply lg:object-[50%_45%]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-8 pt-7 lg:px-10 lg:pb-16 lg:pt-10">
        {/* Alleen beweging, geen fade: een onzichtbare kop telt niet als LCP. */}
        <h1 id="hero-title" style={rise(0)} className="rise-y display text-[clamp(3.25rem,5.1vw,4.75rem)] text-ink lg:max-w-[50%]">
          {content.title}<br />{content.titleSecond}
        </h1>
        <p style={rise(1)} className="rise mt-5 max-w-[34ch] leading-relaxed text-muted lg:mt-6 lg:max-w-[38ch] lg:text-lg">
          {content.text}
        </p>
      </div>

      <div style={rise(2)} className="rise relative">
        <HeroBanderol product={product} cta={content.buttonPrimary} help={content.buttonSecondary} />
      </div>
    </section>
  );
}
