"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { COUNTRIES, buildOrder } from "@/lib/order";
import { eur, getProduct } from "@/lib/products";
import { useStore } from "./StoreProvider";

type Method = { id: string; description: string; image: string };
type MollieComponent = { mount: (el: HTMLElement) => void; unmount: () => void; addEventListener: (e: "change", cb: (ev: { error?: string; touched: boolean }) => void) => void };
type MollieJs = { createComponent: (type: string, opts?: object) => MollieComponent; createToken: () => Promise<{ token?: string; error?: { message: string } }> };
declare global { interface Window { Mollie?: (profileId: string, opts: { locale: string; testmode: boolean }) => MollieJs } }

const euro = (cents: number) => eur(cents / 100);
const DANGER = "#a3341f";
// Velden in de huisstijl: vierkant, papier op zand, 1px lijn, focus als tweede inktlijn (geen omlijning eromheen).
const FIELD = "field-input block w-full border border-line-strong bg-paper px-3 py-[14px] text-[15px] leading-[18px] placeholder:text-[#8a847b] focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--ink)]";
const LABEL = "tag mb-2 block text-taupe-strong";
// Mollie's kaartvelden zijn iframes: tekst via styles, rand en achtergrond via onze eigen container (.mollie-component).
const CARD_STYLES = { styles: { base: { color: "#151516", fontSize: "15px", lineHeight: "18px", "::placeholder": { color: "#8a847b" } }, invalid: { color: DANGER } } };
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
        <span className="display text-3xl">{title}</span>
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

function Alert({ children }: { children: ReactNode }) {
  return <p role="alert" className="mb-4 border-l-2 bg-paper px-4 py-3 text-sm" style={{ borderColor: DANGER }}>{children}</p>;
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
    <div className="grid grid-cols-2 gap-4 border border-t-0 border-line bg-paper/60 p-4">
      {CARD_FIELDS.map(({ type, label, span }) => (
        <div key={type} className={span}>
          <p className={LABEL}>{label}</p>
          <div ref={(el) => { boxes.current[type] = el; }} className="mollie-field h-12 border border-line-strong bg-paper px-3 py-[14px]" />
          {errors[type] && <p className="mt-1 text-xs" style={{ color: DANGER }}>{errors[type]}</p>}
        </div>
      ))}
    </div>
  );
}

export function Checkout() {
  const { lines, ready } = useStore();
  const [country, setCountry] = useState("NL");
  const [methods, setMethods] = useState<Method[] | null>(null);
  const [method, setMethod] = useState("");
  const [mollie, setMollie] = useState<MollieJs | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const order = useMemo(() => buildOrder(lines, country), [lines, country]);
  const total = "error" in order ? 0 : order.total;
  const where = COUNTRIES.find((c) => c.country === country);

  // Welke methodes Mollie aanbiedt hangt af van bedrag en land (Klarna, Bancontact…); opnieuw ophalen als die veranderen.
  useEffect(() => {
    if (!total) return;
    let alive = true;
    fetch(`/api/methods?amount=${total}&country=${country}`).then((r) => r.json()).then(async (d) => {
      if (!alive) return;
      if (d.error) return setError(d.error);
      setMethods(d.methods);
      setMethod((m) => (d.methods.some((x: Method) => x.id === m) ? m : d.methods[0]?.id ?? ""));
      if (!mollie && d.methods.some((x: Method) => x.id === "creditcard")) {
        await loadMollie();
        if (alive && window.Mollie) setMollie(window.Mollie(d.profileId, { locale: "nl_NL", testmode: d.testmode }));
      }
    }, () => alive && setError("Betaalmethodes laden lukt nu even niet. Ververs de pagina."));
    return () => { alive = false; };
  }, [total, country, mollie]);

  async function pay(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setError("");
    setBusy(true);
    try {
      let cardToken: string | undefined;
      if (method === "creditcard") {
        const t = await mollie?.createToken();
        if (!t?.token) return setError(t?.error?.message ?? "Controleer je kaartgegevens.");
        cardToken = t.token;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), lines, method, cardToken }),
      });
      const data = await res.json().catch(() => ({ error: "Betalen lukt nu even niet. Probeer het zo opnieuw." }));
      if (!res.ok) return setError(data.error);
      // Naar de bank, PayPal, Klarna of 3-D Secure; daarna stuurt Mollie de klant terug naar /afrekenen/bedankt.
      location.assign(data.redirect);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <div className="min-h-[60vh]" />;
  if (!lines.length) {
    return (
      <div className="flex min-h-[40vh] flex-col items-start gap-6">
        <p className="text-taupe">Je winkelwagen is leeg.</p>
        <Link href="/#collectie" className="press btn-primary tag flex min-h-12 items-center px-7">Naar de collectie</Link>
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
            <Field id="streetAndNumber" label="Straat en huisnummer" required autoComplete="street-address" className="col-span-2" />
            <Field id="postalCode" label="Postcode" required autoComplete="postal-code" />
            <Field id="city" label="Plaats" required autoComplete="address-level2" />
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
          {!methods ? (
            <div className="h-[220px] animate-pulse border border-line bg-paper/60" aria-label="Betaalmethodes laden" />
          ) : (
            <div role="radiogroup" aria-label="Betaalmethode" className="space-y-1.5">
              {methods.map((m) => {
                const on = m.id === method;
                return (
                  <div key={m.id}>
                    <label className={`press flex min-h-14 cursor-pointer items-center gap-4 border px-4 ${on ? "border-ink bg-ink text-gold" : "border-line-strong bg-paper hover:border-ink"}`}>
                      <input type="radio" name="method-choice" value={m.id} checked={on} onChange={() => setMethod(m.id)} className="sr-only" />
                      <span aria-hidden className={`flex h-4 w-4 shrink-0 items-center justify-center border ${on ? "border-gold" : "border-line-strong"}`}>{on && <span className="h-2 w-2 bg-gold" />}</span>
                      <span className="tag flex-1">{m.description}</span>
                      {/* Merklogo's van Mollie (externe svg, geen next/image nodig) op een papieren tegel: leesbaar op inkt én op papier. */}
                      <span className="flex h-8 w-12 items-center justify-center bg-paper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image} alt="" width={32} height={24} className="h-6 w-8 object-contain" />
                      </span>
                    </label>
                    {on && m.id === "creditcard" && mollie && <CardFields mollie={mollie} />}
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
            className="press btn-gold tag flex min-h-14 w-full items-center justify-center gap-2.5 px-7 !text-[0.9375rem] disabled:cursor-not-allowed disabled:opacity-50">
            <Lock size={15} aria-hidden />{busy ? "Bezig…" : `Bestellen en betalen · ${euro(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-taupe">
            Met je bestelling ga je akkoord met de <Link href="/algemene-voorwaarden-privacy-beleid" className="underline underline-offset-2">algemene voorwaarden</Link>. Veilig betalen via Mollie.
          </p>
        </div>
      </form>

      <aside className="order-first lg:order-none">
        <div className="border border-line bg-paper p-5 lg:sticky lg:top-28 lg:p-7">
          <h2 className="display text-3xl">Je bestelling</h2>
          {!("error" in order) && (
            <>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {order.lines.map((l) => {
                  const p = getProduct(l.slug);
                  return (
                    <li key={`${l.name}${l.detail}`} className="flex items-center gap-4 py-4">
                      <div className="relative h-16 w-12 shrink-0 border border-line bg-studio">
                        {p && <Image src={p.images.primary} alt="" fill sizes="48px" className="object-cover mix-blend-multiply" />}
                        <span className="num absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[11px] text-paper">{l.qty}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="display text-lg leading-tight">{l.name}</p>
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
                  <dd className="display text-3xl">{euro(order.total)}</dd>
                </div>
              </dl>
              {where && <p className="mt-3 text-xs text-taupe">Levertijd {where.days}. Vóór 17:00 besteld (ma–za), dezelfde dag verzonden.</p>}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
