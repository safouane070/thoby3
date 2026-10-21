// POST /api/checkout: rekent de winkelwagen opnieuw uit met de prijzen uit content/*.json (nooit die van de browser),
// maakt een Mollie-betaling met de gekozen methode en geeft terug waar de klant heen moet (bank, PayPal, 3-D Secure…).
import { buildOrder } from "../../lib/order";
import { amount, json, mollie, type Address, type Ctx, type Payment } from "../_mollie";

const text = (v: unknown, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function onRequestPost({ request, env }: Ctx) {
  const b = ((await request.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const address: Address = {
    givenName: text(b.givenName), familyName: text(b.familyName), email: text(b.email, 254),
    streetAndNumber: text(b.streetAndNumber), postalCode: text(b.postalCode, 20), city: text(b.city), country: text(b.country, 2),
  };
  const method = text(b.method, 40);
  const cardToken = text(b.cardToken, 100);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) return json({ error: "Vul een geldig e-mailadres in." }, 400);
  if (!address.givenName || !address.familyName || !address.streetAndNumber || !address.postalCode || !address.city) return json({ error: "Vul je naam en volledige adres in." }, 400);
  if (!/^[a-z0-9_]+$/.test(method)) return json({ error: "Kies een betaalmethode." }, 400);
  if (method === "creditcard" && !/^tkn_\w+$/.test(cardToken)) return json({ error: "Vul je kaartgegevens in." }, 400);

  const order = buildOrder(b.lines, address.country);
  if ("error" in order) return json(order, 400);

  const origin = new URL(request.url).origin;
  // ponytail: ordernummer uit de tijd (base36); botst alleen bij twee bestellingen in dezelfde milliseconde.
  const number = `T3-${Date.now().toString(36).toUpperCase()}`;
  const lines: Record<string, unknown>[] = order.lines.map((l) => ({
    description: l.detail ? `${l.name} (${l.detail})` : l.name, quantity: l.qty, sku: l.slug,
    unitPrice: amount(l.cents), totalAmount: amount(l.cents * l.qty),
  }));
  if (order.shipping) lines.push({ type: "shipping_fee", description: "Verzending", quantity: 1, unitPrice: amount(order.shipping), totalAmount: amount(order.shipping) });

  try {
    let payment = await mollie<Payment>(env, "payments", "POST", {
      amount: amount(order.total),
      description: `THOBY3 bestelling ${number}`,
      method, ...(cardToken && { cardToken }),
      lines, billingAddress: address, shippingAddress: address,
      locale: "nl_NL",
      redirectUrl: `${origin}/afrekenen/bedankt`,
      cancelUrl: `${origin}/afrekenen`,
      // Mollie kan localhost niet bereiken (en weigert het); lokaal test je de webhook met de hand (zie README).
      ...(!/localhost|127\.0\.0\.1/.test(origin) && { webhookUrl: `${origin}/api/mollie-webhook` }),
      metadata: { order: number, phone: text(b.phone, 30) || undefined },
    });
    const thanks = `${origin}/afrekenen/bedankt?id=${payment.id}`;
    // Mollie zet zelf geen betaal-ID in de terugkeer-URL; pas na het aanmaken weten we het.
    if (payment._links.checkout) payment = await mollie<Payment>(env, `payments/${payment.id}`, "PATCH", { redirectUrl: thanks });
    return json({ redirect: payment._links.checkout?.href ?? thanks });
  } catch (e) {
    console.error(e);
    return json({ error: "Betalen lukt nu even niet. Probeer het zo opnieuw of stuur ons een bericht." }, 502);
  }
}
