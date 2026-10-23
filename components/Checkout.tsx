"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { COUNTRIES, buildOrder } from "@/lib/order";
import { eur, getProduct, products } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreProvider";

type Method = { id: string; description: string; image: string };
type MollieComponent = { mount: (el: HTMLElement) => void; unmount: () => void; addEventListener: (e: "change", cb: (ev: { error?: string; touched: boolean }) => void) => void };
type MollieJs = { createComponent: (type: string, opts?: object) => MollieComponent; createToken: () => Promise<{ token?: string; error?: { message: string } }> };
declare global { interface Window { Mollie?: (profileId: string, opts: { locale: string; testmode: boolean }) => MollieJs } }

const euro = (cents: number) => eur(cents / 100);
const DANGER = "#a3341f";
// Velden in de huisstijl: afgerond, 1px lijn, focus als tweede inktlijn (geen omlijning eromheen). 16px tekst, zodat iOS niet inzoomt.
const FIELD = "field-input block w-full rounded-xl border border-line-strong bg-paper px-3.5 py-[14px] text-base leading-[18px] placeholder:text-[#767676] focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--ink)]";
const LABEL = "caption mb-2 block text-taupe-strong";
// Mollie's kaartvelden zijn iframes: tekst via styles, rand en achtergrond via onze eigen container (.mollie-component).
const CARD_STYLES = { styles: { base: { color: "#0b0b0b", fontSize: "16px", lineHeight: "18px", "::placeholder": { color: "#767676" } }, invalid: { color: DANGER } } };
const CARD_FIELDS = [
  { type: "cardNumber", label: "Kaartnummer", span: "col-span-2" },
  { type: "cardHolder", label: "Naam op de kaart", span: "col-span-2" },
  { type: "expiryDate", label: "Vervaldatum", span: "" },
  { type: "verificationCode", label: "CVC", span: "" },
] as const;

let mollieScript: Promise<void> | undefined;
const loadMollie = () => (mollieScript ??= new Promise((resolve, reject) => {
  const s = Object.assign(document.createElement("script"), { src: "https://js.mollie.com/v1/mollie.js", onload: () => resolve(), onerror: reject });
  document.head.append(s);
}));

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`stap-${n}`} className="border-t border-line pt-6">
      <h2 id={`stap-${n}`} className="mb-6 flex items-baseline gap-3">
        <span className="num text-sm text-taupe">{n}</span>
        <span className="display text-2xl">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Field({ id, label, className = "", ...input }: { id: string; label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>{label}</label>
      <input id={id} name={id} className={FIELD} {...input} />
    </div>
  );
}

// Nederland: postcode + huisnummer vult straat en plaats in via PDOK (gratis adresdienst van de overheid).
// Lukt dat niet, dan typ je ze zelf; wat je zelf typt overschrijven we niet.
async function fillAddress(form: HTMLFormElement | null) {
  const el = (n: string) => form?.elements.namedItem(n) as HTMLInputElement | null;
  const street = el("streetAndNumber"), city = el("city");
  const pc = el("postalCode")?.value.replace(/\s/g, "").toUpperCase() ?? "";
  const nr = el("houseNumber")?.value.trim() ?? "";
  const num = nr.match(/^\d+/)?.[0];
  if (!street || !city || !/^\d{4}[A-Z]{2}$/.test(pc) || !num) return;
  try {
    const q = new URLSearchParams({ q: `postcode:${pc} and huisnummer:${num}`, fq: "type:adres", rows: "1", fl: "straatnaam,woonplaatsnaam" });
    const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?${q}`);
    const doc: { straatnaam?: string; woonplaatsnaam?: string } | undefined = (await res.json())?.response?.docs?.[0];
    if (!doc?.straatnaam) return;
    for (const [input, value] of [[street, `${doc.straatnaam} ${nr}`], [city, doc.woonplaatsnaam ?? ""]] as const) {
      if (value && (!input.value || input.dataset.auto)) { input.value = value; input.dataset.auto = "1"; }
    }
  } catch {}
}
const manual = (e: React.FormEvent<HTMLInputElement>) => { delete e.currentTarget.dataset.auto; };

function Alert({ children }: { children: ReactNode }) {
  return <p role="alert" className="mb-4 rounded-xl border bg-paper px-4 py-3 text-sm" style={{ borderColor: DANGER, color: DANGER }}>{children}</p>;
}

/** Kaartvelden van Mollie Components, ingebed in de pagina. */
function CardFields({ mollie }: { mollie: MollieJs }) {
  const boxes = useRef<Record<string, HTMLDivElement | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    const parts = CARD_FIELDS.map(({ type }) => {
      const c = mollie.createComponent(type, CARD_STYLES);
      c.mount(boxes.current[type]!);
      c.addEventListener("change", (e) => setErrors((x) => ({ ...x, [type]: e.touched && e.error ? e.error : "" })));
      return c;
    });
    return () => parts.forEach((c) => c.unmount());
  }, [mollie]);
  return (
    <div className="mt-1.5 grid grid-cols-2 gap-4 rounded-xl bg-studio p-4">
      {CARD_FIELDS.map(({ type, label, span }) => (
        <div key={type} className={span}>
          <p className={LABEL}>{label}</p>
          <div ref={(el) => { boxes.current[type] = el; }} className="mollie-field h-12 rounded-xl border border-line-strong bg-paper px-3.5 py-[14px]" />
          {errors[type] && <p className="mt-1 text-xs" style={{ color: DANGER }}>{errors[type]}</p>}
        </div>
      ))}
    </div>
  );
}

export function Checkout() {
  const { lines, ready, setDrawerOpen } = useStore();
  const [country, setCountry] = useState("NL");
  const [methods, setMethods] = useState<Method[] | null>(null);
  const [methodsError, setMethodsError] = useState("");
  const [method, setMethod] = useState("");
  const [mollie, setMollie] = useState<MollieJs | null>(null);
  const [card, setCard] = useState<{ profileId: string; testmode: boolean } | null>(null);
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Telefoon: het overzicht staat boven het formulier, dus standaard ingeklapt (totaal blijft zichtbaar).
  const [summary, setSummary] = useState(false);
  const order = useMemo(() => buildOrder(lines, country), [lines, country]);
  const total = "error" in order ? 0 : order.total;
  const where = COUNTRIES.find((c) => c.country === country);

  // Welke methodes Mollie aanbiedt hangt af van bedrag en land (Klarna, Bancontact…); opnieuw ophalen als die veranderen.
  useEffect(() => {
    if (!total) return;
    let alive = true;
    fetch(`/api/methods?amount=${total}&country=${country}`).then((r) => r.json()).then((d) => {
      if (!alive) return;
      if (d.error || !Array.isArray(d.methods)) return setMethodsError(d.error || "Betaalmethodes laden lukt nu even niet. Ververs de pagina.");
      setMethodsError("");
      setMethods(d.methods);
      setMethod((m) => (d.methods.some((x: Method) => x.id === m) ? m : d.methods[0]?.id ?? ""));
      if (d.methods.some((x: Method) => x.id === "creditcard")) setCard((c) => c ?? { profileId: d.profileId, testmode: d.testmode });
    }, () => alive && setMethodsError("Betaalmethodes laden lukt nu even niet. Ververs de pagina."));
    return () => { alive = false; };
  }, [total, country]);

  // Mollie's kaartscript één keer laden, los van het ophalen van de methodes (dat gebeurt bij elk ander bedrag of land).
  useEffect(() => {
    if (!card) return;
    let alive = true;
    loadMollie().then(
      () => { if (alive && window.Mollie) setMollie(window.Mollie(card.profileId, { locale: "nl_NL", testmode: card.testmode })); },
      () => { mollieScript = undefined; if (alive) setCardError("De kaartvelden laden nu even niet. Kies een andere betaalmethode of ververs de pagina."); },
    );
    return () => { alive = false; };
  }, [card]);

  async function pay(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setError("");
    setBusy(true);
    // busy blijft aan na een geslaagde aanvraag: tijdens het doorsturen naar de bank mag een tweede klik geen tweede betaling maken.
    const fail = (msg: string) => { setError(msg); setBusy(false); };
    try {
      let cardToken: string | undefined;
      if (method === "creditcard") {
        const t = await mollie?.createToken();
        if (!t?.token) return fail(t?.error?.message ?? "Controleer je kaartgegevens.");
        cardToken = t.token;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), lines, method, cardToken }),
      });
      const data: { error?: string; redirect?: string } = await res.json().catch(() => ({}));
      // Zonder doel-URL (of met een fout zonder tekst) nooit "ergens heen": dan een melding die zegt wat je kunt doen.
      if (!res.ok || !data.redirect) return fail(data.error || "Betalen lukt nu even niet. Probeer het zo opnieuw of stuur ons een bericht.");
      // Naar de bank, PayPal, Klarna of 3-D Secure; daarna stuurt Mollie de klant terug naar /afrekenen/bedankt.
      location.assign(data.redirect);
    } catch {
      fail("Geen verbinding. Controleer je internet en probeer het opnieuw.");
    }
  }

  if (!ready) return <div className="min-h-[60vh]" />;
  if (!lines.length) {
    const pick = products.find((p) => p.kind === "thobe" && !p.soldOut);
    return (
      <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div>
          <p className="display text-2xl">Je winkelwagen is leeg</p>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-taupe">Kies eerst je thobe en je maat. Twijfel je over de maat? Op de maatkaart zie je slank en breed naast elkaar, in centimeters.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#collectie" className="press btn-primary tag flex min-h-12 items-center px-7">Naar de collectie</Link>
            <Link href="/#pasvorm" className="press btn-ghost tag flex min-h-12 items-center px-7">Naar de maatkaart</Link>
          </div>
        </div>
        {pick && <div className="max-w-sm"><ProductCard product={pick} /></div>}
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-20">
      <form onSubmit={pay} className="space-y-10">
        <Step n={1} title="Contact">
          <Field id="email" label="E-mailadres" type="email" required autoComplete="email" inputMode="email" placeholder="naam@voorbeeld.nl" />
          <p className="mt-2 text-xs text-taupe">Hier sturen we je bevestiging en de track &amp; trace naartoe.</p>
        </Step>

        <Step n={2} title="Bezorging">
          <div className="grid grid-cols-2 gap-4">
            <Field id="givenName" label="Voornaam" required autoComplete="given-name" />
            <Field id="familyName" label="Achternaam" required autoComplete="family-name" />
            {/* In Nederland eerst postcode en huisnummer: dan vullen straat en plaats zichzelf. */}
            {country === "NL" ? (
              <>
                <Field key="postalCode" id="postalCode" label="Postcode" required autoComplete="postal-code" autoCapitalize="characters" placeholder="1234 AB" onChange={(e) => fillAddress(e.currentTarget.form)} />
                <Field key="houseNumber" id="houseNumber" label="Huisnummer" required inputMode="text" placeholder="12" onChange={(e) => fillAddress(e.currentTarget.form)} />
                <Field key="streetAndNumber" id="streetAndNumber" label="Straat en huisnummer" required autoComplete="street-address" className="col-span-2" onInput={manual} />
              </>
            ) : (
              <>
                <Field key="streetAndNumber" id="streetAndNumber" label="Straat en huisnummer" required autoComplete="street-address" className="col-span-2" />
                <Field key="postalCode" id="postalCode" label="Postcode" required autoComplete="postal-code" />
              </>
            )}
            <Field id="city" label="Plaats" required autoComplete="address-level2" onInput={manual} />
            <div>
              <label htmlFor="country" className={LABEL}>Land</label>
              <div className="relative">
                <select id="country" name="country" value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country" className={`${FIELD} appearance-none pr-10`}>
                  {COUNTRIES.map((c) => <option key={c.country} value={c.country}>{c.name}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <Field id="phone" label="Telefoon (optioneel)" type="tel" autoComplete="tel" inputMode="tel" />
          </div>
        </Step>

        <Step n={3} title="Betalen">
          {methodsError ? (
            <Alert>{methodsError}</Alert>
          ) : !methods ? (
            <div className="h-[220px] animate-pulse rounded-xl bg-studio" role="status" aria-label="Betaalmethodes laden" />
          ) : (
            <div role="radiogroup" aria-label="Betaalmethode" className="space-y-1.5">
              {methods.map((m) => {
                const on = m.id === method;
                return (
                  <div key={m.id}>
                    <label className={`press flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border px-4 ${on ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]" : "border-line-strong bg-paper hover:border-ink"}`}>
                      <input type="radio" name="method-choice" value={m.id} checked={on} onChange={() => setMethod(m.id)} className="sr-only" />
                      <span aria-hidden className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${on ? "border-ink" : "border-line-strong"}`}>{on && <span className="h-2 w-2 rounded-full bg-ink" />}</span>
                      <span className="tag flex-1">{m.description}</span>
                      {/* Merklogo's van Mollie (externe svg, geen next/image nodig) op een papieren tegel: leesbaar op inkt én op papier. */}
                      <span className="flex h-8 w-12 items-center justify-center rounded-md bg-paper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image} alt="" width={32} height={24} className="h-6 w-8 object-contain" />
                      </span>
                    </label>
                    {on && m.id === "creditcard" && (mollie ? <CardFields mollie={mollie} /> : cardError && <p role="alert" className="mt-1.5 rounded-xl bg-studio px-4 py-3 text-sm" style={{ color: DANGER }}>{cardError}</p>)}
                  </div>
                );
              })}
            </div>
          )}
        </Step>

        <div className="border-t border-line pt-6">
          {error && <Alert>{error}</Alert>}
          {"error" in order && <Alert>{order.error}</Alert>}
          <button type="submit" disabled={busy || !method || "error" in order}
            className="press btn-primary tag flex min-h-14 w-full items-center justify-center gap-2.5 px-7 !text-[0.9375rem] disabled:cursor-not-allowed disabled:opacity-50">
            <Lock size={15} aria-hidden />{busy ? "Bezig…" : `Bestellen en betalen · ${euro(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-taupe">
            Met je bestelling ga je akkoord met de <Link href="/algemene-voorwaarden-privacy-beleid" className="underline underline-offset-2">algemene voorwaarden</Link>. Veilig betalen via Mollie.
          </p>
        </div>
      </form>

      <aside className="order-first lg:order-none">
        <div className="rounded-2xl bg-studio p-5 lg:sticky lg:top-28 lg:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="display text-xl lg:text-2xl">Je bestelling</h2>
            <button type="button" onClick={() => setSummary((v) => !v)} aria-expanded={summary} aria-controls="besteloverzicht"
              className="press flex min-h-11 items-center gap-1.5 text-sm lg:hidden">
              {summary ? "Verberg" : "Toon"} {!("error" in order) && <span className="num font-semibold">{euro(order.total)}</span>}
              <ChevronDown size={16} aria-hidden className={`transition-transform duration-200 ${summary ? "rotate-180" : ""}`} />
            </button>
            <button type="button" onClick={() => setDrawerOpen(true)} className="press hidden min-h-10 text-sm underline decoration-line-strong underline-offset-4 hover:decoration-ink lg:block">Wijzigen</button>
          </div>
          {!("error" in order) && (
            <div id="besteloverzicht" className={summary ? "" : "max-lg:hidden"}>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {order.lines.map((l) => {
                  const p = getProduct(l.slug);
                  return (
                    <li key={`${l.name}${l.detail}`} className="flex items-center gap-4 py-4">
                      <div className="relative h-16 w-12 shrink-0">
                        <span className="absolute inset-0 overflow-hidden rounded-lg bg-paper">{p && <Image src={p.images.primary} alt="" fill sizes="48px" className="object-cover mix-blend-multiply" />}</span>
                        <span className="num absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-paper ring-2 ring-studio">{l.qty}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-tight">{l.name}</p>
                        {l.detail && <p className="mt-0.5 text-xs text-taupe">{l.detail}</p>}
                      </div>
                      <p className="num text-sm">{l.cents ? euro(l.cents * l.qty) : "Gratis"}</p>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-taupe">Subtotaal</dt><dd className="num">{euro(order.subtotal)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-taupe">Verzending naar {where?.name}</dt>
                  <dd className="num">{order.shipping ? euro(order.shipping) : "Gratis"}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="font-medium">Totaal <span className="text-xs font-normal text-taupe">incl. btw</span></dt>
                  <dd className="display text-2xl">{euro(order.total)}</dd>
                </div>
              </dl>
              {where && <p className="mt-3 text-xs text-taupe">Levertijd {where.days}. Vóór 17:00 besteld (ma–za), dezelfde dag verzonden.</p>}
              <button type="button" onClick={() => setDrawerOpen(true)} className="press mt-2 min-h-11 text-sm underline decoration-line-strong underline-offset-4 lg:hidden">Bestelling wijzigen</button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
