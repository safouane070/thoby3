// GET /api/payment?id=tr_…: alleen de status, voor de bedankpagina. Geen persoonsgegevens terug.
import { json, mollie, type Ctx, type Payment } from "../_mollie";

export async function onRequestGet({ request, env }: Ctx) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^tr_\w+$/.test(id)) return json({ error: "Onbekende betaling." }, 400);
  try {
    const p = await mollie<Payment>(env, `payments/${id}`);
    return json({ status: p.status, order: p.metadata?.order });
  } catch {
    return json({ error: "Onbekende betaling." }, 404);
  }
}
