// POST /api/mollie-webhook (id=tr_…): Mollie meldt alleen dát er iets veranderde. We halen de betaling zelf op
// (de inhoud van de melding vertrouwen we niet) en sturen bij "betaald" de ordermail naar de winkel en de klant.
import { mollie, type Ctx, type Env, type Payment } from "../_mollie";

const esc = (s = "") => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const eur = (value: string) => `€${value.replace(".", ",")}`;

function orderMail(p: Payment, intro: string) {
  const a = p.shippingAddress;
  const row = (l: string, r: string) => `<tr><td style="padding:10px 0;border-bottom:1px solid #dcd5cb">${l}</td><td style="padding:10px 0 10px 16px;border-bottom:1px solid #dcd5cb;text-align:right;white-space:nowrap">${r}</td></tr>`;
  const label = (s: string) => `<p style="margin:24px 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5a544c">${s}</p>`;
  const address = a ? [`${a.givenName} ${a.familyName}`, a.streetAndNumber, `${a.postalCode} ${a.city}`, a.country, a.email, p.metadata?.phone].filter(Boolean).map((x) => esc(x)).join("<br>") : "";
  return `<!doctype html><html lang="nl"><body style="margin:0;background:#e8e2da;color:#151516;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8e2da"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:#151516;color:#f4f1ec;padding:22px 28px;border-bottom:1px solid #d2b15c;font-weight:800;letter-spacing:.2em;font-size:18px">THOBY3</td></tr>
<tr><td style="background:#f4f1ec;padding:28px">
${label(`Bestelling ${esc(p.metadata?.order)}`)}
<p style="margin:0 0 20px">${intro}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${(p.lines ?? []).map((l) => row(`${l.quantity}× ${esc(l.description)}`, l.totalAmount.value === "0.00" ? "gratis" : eur(l.totalAmount.value))).join("")}
<tr><td style="padding:14px 0 0;font-weight:700">Totaal incl. btw</td><td style="padding:14px 0 0;text-align:right;font-weight:700">${eur(p.amount.value)}</td></tr>
</table>
${address ? `${label("Bezorgadres")}<p style="margin:0">${address}</p>` : ""}
</td></tr>
<tr><td style="padding:18px 28px;font-size:13px;color:#5a544c">Vragen? Antwoord op deze mail. Vóór 17:00 besteld (ma–za), dezelfde dag verzonden. Een andere maat ruil je gratis binnen 14 dagen.</td></tr>
</table></td></tr></table></body></html>`;
}

async function send(env: Env, to: string, subject: string, html: string, replyTo: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.MAIL_FROM || "THOBY3 <bestellingen@thoby3.com>", to, subject, html, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function onRequestPost({ request, env }: Ctx) {
  const id = String((await request.formData().catch(() => null))?.get("id") ?? "");
  if (!/^tr_\w+$/.test(id)) return new Response("unknown id", { status: 400 });
  const p = await mollie<Payment>(env, `payments/${id}`);
  // Mollie kan een melding vaker sturen: een bestelling krijgt maar één keer mail.
  if (p.status !== "paid" || p.metadata?.mailed || !p.shippingAddress) return new Response("ok");

  const shop = env.ORDER_EMAIL || "info@thoby3.com";
  const customer = p.shippingAddress;
  try {
    await send(env, shop, `Nieuwe bestelling ${p.metadata?.order} · ${eur(p.amount.value)}`,
      orderMail(p, `Nieuwe bestelling van ${esc(`${customer.givenName} ${customer.familyName}`)}. Betaald en klaar om te versturen.`), customer.email);
    await send(env, customer.email, `Je bestelling ${p.metadata?.order} bij THOBY3`,
      orderMail(p, `Assalamu'alaikum ${esc(customer.givenName)}, dank je voor je bestelling. Je betaling is binnen en we pakken alles voor je in. Zodra je pakket onderweg is, krijg je de track &amp; trace.`), shop);
  } catch (e) {
    console.error(e);
    // 500: Mollie probeert het later opnieuw.
    return new Response("mail failed", { status: 500 });
  }
  await mollie(env, `payments/${id}`, "PATCH", { metadata: { ...p.metadata, mailed: true } });
  return new Response("ok");
}
