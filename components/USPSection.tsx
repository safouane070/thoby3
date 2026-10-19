import Image from "next/image";
import { Headset, Leaf, ShieldCheck, Truck } from "lucide-react";
import { SHIPPING_COPY } from "@/lib/products";

// Drie korte beloftes uit de originele shop; geen kaarten, geen herhaling van de ticker.
export function USPSection() {
  return (
    <section aria-labelledby="usp-title" className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-24 lg:grid-cols-[5fr_6fr] lg:gap-24 lg:px-10 lg:py-32">
      <div className="relative order-last aspect-[4/5] overflow-hidden border border-line bg-sand lg:order-first">
        <Image src="/img/wd-2.jpg" alt="Manchet van de White Desert thobe met het THOBY3-merkteken" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
      </div>

      <div>
        <h2 id="usp-title" className="max-w-xl font-serif text-5xl leading-[1] md:text-6xl">Vóór 17:00 besteld, vandaag onderweg.</h2>
        <p className="mt-6 flex max-w-md items-start gap-3 text-taupe-strong">
          <Truck size={20} className="mt-0.5 shrink-0 text-ink" aria-hidden />
          {SHIPPING_COPY}
        </p>

        <ul className="mt-12 border-t border-line">
          <li className="grid grid-cols-[2rem_1fr] gap-x-4 border-b border-line py-6">
            <ShieldCheck size={22} className="mt-0.5 text-ink" aria-hidden />
            <p className="font-medium">Vertrouwd en veilig betalen</p>
          </li>
          <li className="grid grid-cols-[2rem_1fr] gap-x-4 border-b border-line py-6">
            <Leaf size={22} className="mt-0.5 text-ink" aria-hidden />
            <p><span className="font-medium">Ethisch geproduceerd.</span> <span className="text-taupe-strong">Elke thobe is tot in detail afgewerkt.</span></p>
          </li>
          <li className="grid grid-cols-[2rem_1fr] gap-x-4 border-b border-line py-6">
            <Headset size={22} className="mt-0.5 text-ink" aria-hidden />
            <p>
              <span className="font-medium">Twijfel je over je maat?</span>{" "}
              <a href="https://wa.me/31641344799" target="_blank" rel="noopener noreferrer" className="text-taupe-strong underline decoration-line-strong underline-offset-4 hover:text-ink">Stuur ons een bericht via WhatsApp.</a>
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
