"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "./StoreProvider";

type State = "loading" | "paid" | "pending" | "failed";

// Mollie stuurt de klant hierheen met ?id=tr_…; de status vragen we zelf op, de URL alleen zegt niets.
export function OrderStatus() {
  const { clear } = useStore();
  const [state, setState] = useState<State>("loading");
  const [order, setOrder] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    fetch(`/api/payment?id=${encodeURIComponent(id ?? "")}`).then((r) => r.json()).then((d: { status?: string; order?: string }) => {
      const paid = d.status === "paid" || d.status === "authorized";
      // "open" = nog niets betaald (bijv. teruggekomen zonder af te ronden): winkelwagen blijven bewaren, geen bedankpagina.
      const pending = d.status === "pending";
      if (paid || pending) clear();
      setOrder(d.order ?? "");
      setState(paid ? "paid" : pending ? "pending" : "failed");
    }, () => setState("failed"));
  }, [clear]);

  if (state === "loading") return <p className="text-taupe" aria-live="polite">Even je betaling controleren…</p>;
  if (state === "failed") {
    return (
      <>
        <h1 className="display text-4xl md:text-5xl">Betaling<br />niet gelukt</h1>
        <p className="mt-6 max-w-[46ch] text-taupe">Er is niets afgeschreven. Je winkelwagen staat nog klaar, dus je kunt het meteen opnieuw proberen.</p>
        <Link href="/afrekenen" className="press btn-primary tag mt-8 inline-flex min-h-12 items-center px-7">Opnieuw afrekenen</Link>
      </>
    );
  }
  return (
    <>
      <h1 className="display text-4xl md:text-5xl">Dank je wel,<br />{state === "paid" ? "je bestelling is binnen" : "we wachten op je bank"}</h1>
      {order && <p className="caption mt-6 text-taupe-strong">Bestelling <span className="num text-base font-bold text-ink">{order}</span></p>}
      <p className="mt-4 max-w-[46ch] text-taupe">
        {state === "paid"
          ? "Je krijgt zo een bevestiging per mail. Vóór 17:00 besteld (ma–za)? Dan gaat je pakket vandaag nog op weg."
          : "Je betaling wordt nog verwerkt. Zodra die rond is, krijg je een bevestiging per mail."}
      </p>
      <Link href="/" className="press btn-primary tag mt-8 inline-flex min-h-12 items-center px-7">Terug naar de winkel</Link>
    </>
  );
}
