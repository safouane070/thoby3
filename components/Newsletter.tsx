"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    // Demo: geen backend. Koppel hier je mailprovider (bijv. Klaviyo/Mailchimp).
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
  };
  return state === "done" ? (
    <p className="flex items-center gap-3 border border-gold/60 px-5 py-4 text-sm text-ivory"><Check size={16} aria-hidden /> Welkom bij THOBY3. Je hoort als eerste van onze nieuwe drops.</p>
  ) : (
    <form onSubmit={submit} noValidate className="max-w-md">
      <label htmlFor="nl-email" className="sr-only">E-mailadres</label>
      <div className={`flex border-b ${state === "error" ? "border-red-400" : "border-ivory/40 focus-within:border-gold"} transition-colors`}>
        <input id="nl-email" name="email" type="email" autoComplete="email" placeholder="Je e-mailadres" aria-invalid={state === "error"} aria-describedby={state === "error" ? "nl-err" : undefined}
          className="min-w-0 flex-1 bg-transparent py-4 text-sm placeholder:text-ivory/60 focus:outline-none" />
        <button type="submit" className="press flex items-center gap-2 pl-4 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:text-ivory/70">Aanmelden <ArrowRight size={14} aria-hidden /></button>
      </div>
      {state === "error" && <p id="nl-err" role="alert" className="mt-2 text-xs text-red-300">Vul een geldig e-mailadres in.</p>}
    </form>
  );
}
