import Link from "next/link";
import { ArrowLeftRight, Lock, Mail, MessageCircle, Phone, ShieldCheck, Truck } from "lucide-react";
import { Emblem, Logo, PAYMENT_METHODS, PaymentMark } from "./Brand";
import { Reveal } from "./Reveal";
import { Newsletter } from "./Newsletter";
import site from "@/content/site.json";
import home from "@/content/home.json";
import { isThobe, products } from "@/lib/products";

const { contact } = site;
const tel = contact.phone.replace(/[^+\d]/g, "");
// Wettelijk verplichte bedrijfsgegevens; alleen ingevulde velden verschijnen (bij livegang eist check-content ze allemaal).
const { company } = site;
const companyLine = [company.kvk && `KvK ${company.kvk}`, company.btw && `Btw ${company.btw}`, company.address].filter(Boolean).join(" · ");

// 40px tapdoel op touch (ruim boven de 24px-norm, houdt de footer kort), 32px op desktop.
const LINK = "inline-flex min-h-10 items-center gap-2 transition-colors duration-200 hover:text-ink lg:min-h-9";
const HEAD = "caption text-ink";
const PROMISE_ICONS = { truck: Truck, exchange: ArrowLeftRight, shield: ShieldCheck, whatsapp: MessageCircle };

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-sand">
      {/* Compact: wie hier komt zoekt een link, geen tweede hero. Het embleem klein bovenaan de eerste kolom. */}
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 lg:px-10 lg:pt-14">
        {/* De beloftes als vier rustige tegels, vlak boven de links. */}
        <ul className="mb-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {home.promises.map((p, i) => {
            const Icon = PROMISE_ICONS[p.icon as keyof typeof PROMISE_ICONS] ?? Truck;
            const body = <><Icon size={20} aria-hidden /><span className="mt-6 block font-medium">{p.title}</span><span className="mt-1 block text-sm text-muted">{p.text}</span></>;
            return (
              <li key={p.title}>
                <Reveal delay={i * 0.06} className="h-full">
                  {p.whatsapp
                    ? <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="press block h-full rounded-2xl bg-studio p-5 hover:bg-[#ebebe8]">{body}</a>
                    : <div className="h-full rounded-2xl bg-studio p-5">{body}</div>}
                </Reveal>
              </li>
            );
          })}
        </ul>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16 [&>*]:min-w-0">
          <div className="col-span-2 lg:col-span-1">
            <Emblem className="h-12 w-auto text-ink" />
            {/* Zonder maildienst geen nieuwsbriefbelofte: dan gaat het blok gewoon over Instagram. */}
            <h2 className="display mt-6 max-w-[14ch] text-2xl">{site.newsletter.action ? site.newsletter.title : "Volg THOBY3"}</h2>
            <p className="mb-4 mt-2 max-w-sm text-sm text-muted">{site.newsletter.action ? site.newsletter.text : "Nieuwe kleuren en restocks staan het eerst op Instagram."}</p>
            <Newsletter />
          </div>

          <nav aria-label="Winkel">
            <h3 className={HEAD}>Winkel</h3>
            <ul className="mt-3 text-sm text-muted">
              <li><Link href="/#collectie" className={LINK}>Collectie</Link></li>
              {products.filter(isThobe).map((p) => (
                <li key={p.slug}><Link href={`/product/${p.slug}`} className={LINK}>{p.name}</Link></li>
              ))}
              <li><Link href="/#pasvorm" className={LINK}>Maten & pasvorm</Link></li>
              <li><Link href="/#faq" className={LINK}>Veelgestelde vragen</Link></li>
            </ul>
          </nav>

          <nav aria-label="Juridisch">
            <h3 className={HEAD}>Juridisch</h3>
            <ul className="mt-3 text-sm text-muted">
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

          <div className="col-span-2 sm:col-span-1">
            <h3 className={HEAD}>Contact</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 text-sm text-muted sm:block">
              <li><a href={`mailto:${contact.email}`} className={LINK}><Mail size={15} aria-hidden /> {contact.email}</a></li>
              <li><a href={`tel:${tel}`} className={LINK}><Phone size={15} aria-hidden /> {contact.phone}</a></li>
              <li><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className={LINK}><MessageCircle size={15} aria-hidden /> WhatsApp</a></li>
              <li><a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={LINK}>Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-line pt-6 md:flex-row md:items-center">
          <div className="space-y-1 text-xs text-muted">
            <p>© {new Date().getFullYear()} {company.name || "THOBY3"} · Uit Nederland. Alle rechten voorbehouden.</p>
            {companyLine && <p>{companyLine}</p>}
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <ul className="flex flex-wrap gap-2" aria-label="Betaalmethodes">
              {PAYMENT_METHODS.map((m) => (
                <li key={m.name} className="flex h-9 min-w-14 items-center justify-center rounded-lg border border-line px-3 text-ink/70">
                  <PaymentMark method={m} />
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-xs text-muted"><Lock size={13} aria-hidden /> Veilig betalen, SSL-versleuteld</p>
          </div>
        </div>
        {/* Het woordmerk over de volle breedte als afsluiter. */}
        <Reveal className="mt-14 lg:mt-20"><span aria-hidden><Logo className="h-auto w-full text-ink" /></span></Reveal>
      </div>
    </footer>
  );
}
