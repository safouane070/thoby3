import Link from "next/link";
import { Lock, Mail, MessageCircle, Phone } from "lucide-react";
import { Emblem, PAYMENT_METHODS, PaymentMark } from "./Brand";
import { Newsletter } from "./Newsletter";
import site from "@/content/site.json";
import { isThobe, products } from "@/lib/products";

const { contact } = site;
const tel = contact.phone.replace(/[^+\d]/g, "");
// Wettelijk verplichte bedrijfsgegevens; alleen ingevulde velden verschijnen (bij livegang eist check-content ze allemaal).
const { company } = site;
const companyLine = [company.kvk && `KvK ${company.kvk}`, company.btw && `Btw ${company.btw}`, company.address].filter(Boolean).join(" · ");

// 48px tapdoel op touch, 32px op desktop; de hoogte vervangt de oude space-y-3.
const LINK = "inline-flex min-h-12 items-center gap-2 transition-colors duration-200 hover:text-gold lg:min-h-8";

export function Footer() {
  return (
    <footer id="contact" className="bg-obsidian text-ivory">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 lg:px-10 lg:pt-28">
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] [&>*]:min-w-0">
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Embleem vanaf 96px hoog: daaronder wordt het woordmerk erin onleesbaar. */}
            <Emblem className="h-24 sm:h-28" />
            <h2 className="mt-8 max-w-[14ch] font-serif text-3xl leading-tight">{site.newsletter.title}</h2>
            <p className="mb-6 mt-3 max-w-sm text-sm text-ivory/60">{site.newsletter.text}</p>
            <Newsletter />
          </div>

          <nav aria-label="Winkel">
            <h3 className="text-sm font-medium text-ivory">Winkel</h3>
            <ul className="mt-3 text-sm text-ivory/75">
              <li><Link href="/#collectie" className={LINK}>Collectie</Link></li>
              {products.filter(isThobe).map((p) => (
                <li key={p.slug}><Link href={`/product/${p.slug}`} className={LINK}>{p.name}</Link></li>
              ))}
              <li><Link href="/#pasvorm" className={LINK}>Maten & pasvorm</Link></li>
            </ul>
          </nav>

          <nav aria-label="Juridisch">
            <h3 className="text-sm font-medium text-ivory">Juridisch</h3>
            <ul className="mt-3 text-sm text-ivory/75">
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

          <div>
            <h3 className="text-sm font-medium text-ivory">Contact</h3>
            <ul className="mt-3 text-sm text-ivory/75">
              <li><a href={`mailto:${contact.email}`} className={LINK}><Mail size={15} aria-hidden /> {contact.email}</a></li>
              <li><a href={`tel:${tel}`} className={LINK}><Phone size={15} aria-hidden /> {contact.phone}</a></li>
              <li><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className={LINK}><MessageCircle size={15} aria-hidden /> WhatsApp</a></li>
              <li><a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={LINK}>Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ivory/15 pt-8 md:flex-row md:items-center">
          <div className="space-y-1 text-xs text-ivory/50">
            <p>© {new Date().getFullYear()} {company.name || "THOBY3"}®. Alle rechten voorbehouden.</p>
            {companyLine && <p>{companyLine}</p>}
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <ul className="flex flex-wrap gap-2" aria-label="Betaalmethodes">
              {PAYMENT_METHODS.map((m) => (
                <li key={m.name} className="flex h-9 min-w-14 items-center justify-center rounded-md border border-ivory/20 px-3 text-ivory/80">
                  <PaymentMark method={m} />
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-xs text-ivory/60"><Lock size={13} aria-hidden /> Veilig betalen, SSL-versleuteld</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
