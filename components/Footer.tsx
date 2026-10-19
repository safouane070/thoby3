import Link from "next/link";
import { Lock, Mail, MessageCircle, Phone } from "lucide-react";
import { Emblem, PAYMENT_METHODS, PaymentMark } from "./Brand";
import { Newsletter } from "./Newsletter";

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
            <h2 className="mt-8 font-serif text-3xl leading-tight">Als eerste weten<br />van nieuwe drops</h2>
            <p className="mb-6 mt-3 max-w-sm text-sm text-ivory/60">Schrijf je in voor exclusieve collecties en vroege toegang.</p>
            <Newsletter />
          </div>

          <nav aria-label="Winkel">
            <h3 className="text-sm font-medium text-ivory">Winkel</h3>
            <ul className="mt-3 text-sm text-ivory/75">
              <li><Link href="/#collectie" className={LINK}>Collectie</Link></li>
              <li><Link href="/product/white-desert" className={LINK}>White Desert</Link></li>
              <li><Link href="/product/caramel-sands" className={LINK}>Caramel Sands</Link></li>
              <li><Link href="/#pasvorm" className={LINK}>Maten & pasvorm</Link></li>
            </ul>
          </nav>

          <nav aria-label="Juridisch">
            <h3 className="text-sm font-medium text-ivory">Juridisch</h3>
            <ul className="mt-3 text-sm text-ivory/75">
              <li><a href="https://thoby3.com/algemene-voorwaarden-privacy-beleid/" target="_blank" rel="noopener noreferrer" className={LINK}>Algemene voorwaarden & privacy (AVG)</a></li>
              <li><a href="https://thoby3.com/levering-retourbeleid/" target="_blank" rel="noopener noreferrer" className={LINK}>Levering & retour</a></li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-medium text-ivory">Contact</h3>
            <ul className="mt-3 text-sm text-ivory/75">
              <li><a href="mailto:info@thoby3.com" className={LINK}><Mail size={15} aria-hidden /> info@thoby3.com</a></li>
              <li><a href="tel:+31641344799" className={LINK}><Phone size={15} aria-hidden /> +31 6 41344799</a></li>
              <li><a href="https://wa.me/31641344799" target="_blank" rel="noopener noreferrer" className={LINK}><MessageCircle size={15} aria-hidden /> WhatsApp</a></li>
              <li><a href="https://www.instagram.com/thoby3.official" target="_blank" rel="noopener noreferrer" className={LINK}>Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ivory/15 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-ivory/50">© 2026 THOBY3®. Alle rechten voorbehouden.</p>
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
