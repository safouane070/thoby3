// Kleine Mollie-client op fetch (geen SDK nodig in een Cloudflare-functie). Bestanden met _ zijn geen route.
export type Env = { MOLLIE_API_KEY: string; MOLLIE_PROFILE_ID: string; RESEND_API_KEY: string; MAIL_FROM?: string; ORDER_EMAIL?: string };
export type Ctx = { request: Request; env: Env };

export type Amount = { currency: "EUR"; value: string };
export type Address = { givenName: string; familyName: string; streetAndNumber: string; postalCode: string; city: string; country: string; email: string };
export type Payment = {
  id: string;
  status: "open" | "pending" | "authorized" | "paid" | "canceled" | "expired" | "failed";
  amount: Amount;
  metadata: { order: string; phone?: string; mailed?: boolean } | null;
  lines?: { description: string; quantity: number; totalAmount: Amount }[];
  billingAddress?: Address;
  shippingAddress?: Address;
  _links: { checkout?: { href: string } };
};

export async function mollie<T>(env: Env, path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`https://api.mollie.com/v2/${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.MOLLIE_API_KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json()) as T & { detail?: string; field?: string };
  if (!res.ok) throw new Error(`Mollie ${method} ${path}: ${res.status} ${json.detail ?? ""}${json.field ? ` (${json.field})` : ""}`);
  return json;
}

/** Centen naar Mollie's bedrag ("44.99"). */
export const amount = (cents: number): Amount => ({ currency: "EUR", value: (cents / 100).toFixed(2) });
export const json = (body: unknown, status = 200) => Response.json(body, { status });
