import Link from "next/link";
import { ArrowLeftRight, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Emblem, PAYMENT_METHODS, PaymentMark } from "./Brand";
import { Newsletter } from "./Newsletter";
import site from "@/content/site.json";
import home from "@/content/home.json";
import { isThobe, products } from "@/lib/products";

const { contact } = site;
const tel = contact.phone.replace(/[^+\d]/g, "");
// Wettelijk verplichte bedrijfsgegevens; alleen ingevulde velden verschijnen (bij livegang eist check-content ze allemaal).
const { company } = site;
const companyLine = [company.kvk && `KvK ${company.kvk}`, company.btw && `Btw ${company.btw}`, company.address].filter(Boolean).join(" · ");

// 40px tapdoel op touch, 32px op desktop.
const LINK = "inline-flex min-h-10 items-center transition-colors duration-200 hover:text-ink lg:min-h-8";
const HEAD = "caption mb-1 text-ink";
const PROMISE_ICONS = { truck: Truck, exchange: ArrowLeftRight, shield: ShieldCheck, whatsapp: MessageCircle };

// Compact: wie hier komt zoekt een link of zekerheid, geen tweede hero. Op de telefoon ongeveer één scherm.
export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-sand">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-10 lg:px-10 lg:pb-10 lg:pt-14">
        {/* De beloftes als één regel met icoon: kort te scannen, geen tegels. */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-line pb-8 text-sm font-medium lg:grid-cols-4 lg:pb-10">
          {home.promises.map((p) => {
            const Icon = PROMISE_ICONS[p.icon as keyof typeof PROMISE_ICONS] ?? Truck;
            const body = <><Icon size={18} aria-hidden className="shrink-0" /> {p.title}</>;
            return (
              <li key={p.title}>
                {p.whatsapp
                  ? <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center gap-2.5 underline decoration-line-strong underline-offset-4 hover:decoration-ink">{body}</a>
                  : <span className="flex min-h-10 items-center gap-2.5" title={p.text}>{body}</span>}
              </li>
            );
          })}
        </ul>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-8 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-16 lg:pt-12 [&>*]:min-w-0">
          <div className="col-span-2 lg:col-span-1">
            <Emblem className="h-10 w-auto text-ink" />
            {/* Zonder maildienst geen nieuwsbriefbelofte: dan gaat het blok gewoon over Instagram. */}
            <p className="mb-4 mt-4 max-w-sm text-sm text-muted">{site.newsletter.action ? site.newsletter.text : "Nieuwe kleuren en restocks staan het eerst op Instagram."}</p>
            <Newsletter />
          </div>

          <nav aria-label="Winkel">
            <h2 className={HEAD}>Winkel</h2>
            <ul className="text-sm text-muted">
              {products.filter(isThobe).map((p) => (
                <li key={p.slug}><Link href={`/product/${p.slug}`} className={LINK}>{p.name}</Link></li>
              ))}
              <li><Link href="/#pasvorm" className={LINK}>Maatkaart</Link></li>
              <li><Link href="/#faq" className={LINK}>Veelgestelde vragen</Link></li>
            </ul>
          </nav>

          <nav aria-label="Contact en voorwaarden">
            <h2 className={HEAD}>Contact</h2>
            <ul className="text-sm text-muted">
              <li><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className={LINK}>WhatsApp</a></li>
              <li><a href={`mailto:${contact.email}`} className={LINK}>{contact.email}</a></li>
              <li><a href={`tel:${tel}`} className={LINK}>{contact.phone}</a></li>
              {site.legal.map((l) => (
                <li key={l.url}>
                  {l.url.startsWith("/") ? (
                    <Link href={l.url} className={LINK}>{l.label}</Link>
                  ) : (
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className={LINK}>{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-line pt-6 lg:mt-12"><BottomRow /></div>
      </div>
    </footer>
  );
}

function BottomRow() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <ul className="flex flex-wrap items-center gap-1.5 text-ink/70" aria-label="Betaalmethodes">
        {PAYMENT_METHODS.map((m) => (
          <li key={m.name} className="flex h-7 items-center rounded-md border border-line px-2 [&_svg]:max-h-3.5"><PaymentMark method={m} /></li>
        ))}
      </ul>
      <div className="space-y-1 text-xs text-muted lg:text-right">
        <p>© {new Date().getFullYear()} {company.name || "THOBY3"} · Uit Nederland</p>
        {companyLine && <p>{companyLine}</p>}
      </div>
    </div>
  );
}

/** Afrekenen: alleen voorwaarden, betaalmethodes en bedrijfsgegevens. Geen links die je de flow uit trekken. */
export function CheckoutFooter() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="mx-auto max-w-[1440px] space-y-4 px-5 py-8 lg:px-10">
        <ul className="flex flex-wrap gap-x-5 text-sm text-muted">
          {site.legal.map((l) => (
            <li key={l.url}>
              {l.url.startsWith("/")
                ? <Link href={l.url} className={LINK}>{l.label}</Link>
                : <a href={l.url} target="_blank" rel="noopener noreferrer" className={LINK}>{l.label}</a>}
            </li>
          ))}
        </ul>
        <BottomRow />
      </div>
    </footer>
  );
}
