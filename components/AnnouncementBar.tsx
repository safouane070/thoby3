import { Clock, Gift, Truck } from "lucide-react";
import { GIFT_VALUE, REWARD_FROM, eur } from "@/lib/products";

const from = eur(REWARD_FROM).replace(",00", "");
const items = [
  { icon: Gift, text: `Vanaf ${from} GRATIS Musk & Siwak t.w.v. ${eur(GIFT_VALUE)}` },
  { icon: Truck, text: `Gratis verzending vanaf ${from} in NL en EU` },
  { icon: Clock, text: "Vóór 17:00 besteld, vandaag verzonden" },
];

// Twee identieke helften, zodat translateX(-50%) exact één periode is (geen sprong in de loop).
export function AnnouncementBar() {
  const half = [0, 1].map((n) => (
    <div key={n} className="ticker-half flex shrink-0" aria-hidden={n === 1}>
      {items.concat(items).map(({ icon: Icon, text }, i) => (
        <span key={i} className="flex shrink-0 items-center gap-3 px-8 text-xs uppercase tracking-[0.18em]">
          <Icon size={14} className="text-gold" aria-hidden /> {text}
          <span className="ml-8 h-1 w-1 rounded-full bg-gold/60" aria-hidden />
        </span>
      ))}
    </div>
  ));
  return (
    <div className="ticker overflow-hidden bg-obsidian py-2.5 text-ivory" role="region" aria-label="Aanbiedingen">
      <div className="ticker-track flex w-max">{half}</div>
    </div>
  );
}
