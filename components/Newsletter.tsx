"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import site from "@/content/site.json";

const { action, field } = site.newsletter;

// Zonder gekoppelde maildienst (CMS: Nieuwsbrief → Formulier-adres) tonen we geen formulier: een "Welkom!" zonder
// dat het adres ergens wordt opgeslagen, is een belofte die we niet nakomen. Dan wijzen we naar Instagram.
export function Newsletter() {
  const [error, setError] = useState(false);

  if (!action) {
    return (
      <a href={site.contact.instagram} target="_blank" rel="noopener noreferrer" className="press inline-flex min-h-12 items-center gap-2 border-b border-ivory/40 py-3 text-xs font-medium uppercase tracking-[0.14em] hover:border-gold">
        Volg ons op Instagram <ArrowRight size={14} aria-hidden />
      </a>
    );
  }

  // Het formulier post rechtstreeks naar de maildienst (Mailchimp, Brevo, …); die toont zelf de bevestiging.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    const email = String(new FormData(e.currentTarget).get(field) ?? "").trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError(!ok);
    if (!ok) e.preventDefault();
  };
  return (
    <form action={action} method="post" target="_blank" onSubmit={submit} noValidate className="max-w-md">
      <label htmlFor="nl-email" className="sr-only">E-mailadres</label>
      <div className={`flex border-b ${error ? "border-red-400" : "border-ivory/40 focus-within:border-gold"} transition-colors`}>
        <input id="nl-email" name={field} type="email" autoComplete="email" placeholder="Je e-mailadres" aria-invalid={error} aria-describedby={error ? "nl-err" : undefined}
          className="field-input min-w-0 flex-1 bg-transparent py-4 text-sm placeholder:text-ivory/60" />
        <button type="submit" className="press flex items-center gap-2 pl-4 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:text-ivory/70">Aanmelden <ArrowRight size={14} aria-hidden /></button>
      </div>
      {error && <p id="nl-err" role="alert" className="mt-2 text-xs text-red-300">Vul een geldig e-mailadres in.</p>}
    </form>
  );
}
