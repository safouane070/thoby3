// GET /api/methods?amount=<centen>&country=NL: de betaalmethodes die Mollie voor dit bedrag en land aanbiedt,
// zodat /afrekenen ze in de eigen stijl kan tonen (en niet Mollie's keuzescherm).
import { amount, json, mollie, type Ctx } from "../_mollie";

type Method = { id: string; description: string; image: { svg: string } };

export async function onRequestGet({ request, env }: Ctx) {
  const url = new URL(request.url);
  const cents = Number(url.searchParams.get("amount"));
  const country = url.searchParams.get("country") ?? "NL";
  if (!Number.isInteger(cents) || cents < 100 || !/^[A-Z]{2}$/.test(country)) return json({ error: "Ongeldig bedrag of land." }, 400);
  const q = new URLSearchParams({ "amount[value]": amount(cents).value, "amount[currency]": "EUR", locale: "nl_NL", billingCountry: country, sequenceType: "oneoff" });
  try {
    const res = await mollie<{ _embedded: { methods: Method[] } }>(env, `methods?${q}`);
    return json({
      methods: res._embedded.methods.map((m) => ({ id: m.id, description: m.description, image: m.image.svg })),
      // Nodig voor de kaartvelden (Mollie Components); het profiel-ID is niet geheim.
      profileId: env.MOLLIE_PROFILE_ID,
      testmode: env.MOLLIE_API_KEY.startsWith("test_"),
    });
  } catch (e) {
    console.error(e);
    return json({ error: "Betaalmethodes laden lukt nu even niet. Ververs de pagina of probeer het zo opnieuw." }, 502);
  }
}
