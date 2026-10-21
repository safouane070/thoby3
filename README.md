# THOBY3

Webshop voor THOBY3: Next.js 16 als statische export op Cloudflare Pages, plus drie kleine Cloudflare-functies
(`functions/api/`) voor afrekenen met Mollie. Geen WordPress, geen database: producten, prijzen en voorraad staan in
`content/*.json`, betalingen en bestellingen in het Mollie-dashboard, en elke bestelling komt ook per mail binnen.

## Inhoud aanpassen

Alle teksten, foto's en producten staan in `content/*.json` en zijn te bewerken via [Pages CMS](https://app.pagescms.org)
(configuratie: `.pages.yml`). Elke opslag is een commit; Cloudflare Pages bouwt de site daarna opnieuw (± 2 minuten).

| Bestand | Wat |
|---|---|
| `content/products.json` | Producten: naam, adres, teksten, foto's, prijs, van-prijs, uitverkocht. |
| `content/shop.json` | Verzendkosten per land, drempel gratis verzending, meerprijs cadeaudoos, maten, pasvormen, stof. |
| `content/home.json` | Alle teksten en foto's van de homepage. |
| `content/site.json` | Aankondigingsbalk, contact, juridische links, nieuwsbrief, Google-titel. |

Afrekenen rekent met precies deze prijzen en verzendkosten (`lib/order.ts`, ook op de server): wat de browser stuurt,
wordt nooit vertrouwd. Is iets op, zet dan **Uitverkocht** aan.

## Afrekenen (Mollie)

1. `/afrekenen` toont adres, betaalmethodes en kaartvelden in de eigen stijl. Welke methodes er staan, vraagt
   `GET /api/methods` live aan Mollie (iDEAL, kaart, PayPal, Apple Pay, Klarna, Bancontact… wat in het dashboard aanstaat).
2. `POST /api/checkout` rekent de bestelling opnieuw uit, maakt een Mollie-betaling met de gekozen methode en stuurt de
   klant direct naar de bank, PayPal of Klarna (geen Mollie-keuzescherm). Kaart gaat via Mollie Components (cardToken).
3. Mollie stuurt de klant terug naar `/afrekenen/bedankt?id=tr_…`, die de status opvraagt bij `GET /api/payment`.
4. `POST /api/mollie-webhook` haalt de betaling zelf op bij Mollie en stuurt bij *betaald* één ordermail naar
   info@thoby3.com en één bevestiging naar de klant (via Resend).

Omgevingsvariabelen (Cloudflare Pages → Settings → Variables and secrets, lokaal in `.env.local`):

| Naam | Wat |
|---|---|
| `MOLLIE_API_KEY` | `test_…` om te testen, `live_…` voor echt (Mollie → Developers → API keys) |
| `MOLLIE_PROFILE_ID` | `pfl_…` (zelfde pagina), nodig voor de kaartvelden |
| `RESEND_API_KEY` | `re_…` (resend.com → API Keys) |
| `MAIL_FROM` | optioneel, standaard `THOBY3 <bestellingen@thoby3.com>`; het domein moet in Resend geverifieerd zijn |
| `ORDER_EMAIL` | optioneel, standaard `info@thoby3.com` |

Lokaal testen: `npm run build && npm run preview` (http://localhost:3112, met de functies). Mollie kan localhost niet
bereiken, dus lokaal komt er geen webhook; na een testbetaling stuur je hem zelf:
`curl -d id=tr_… http://localhost:3112/api/mollie-webhook`.

## Bouwen

```bash
npm install
npm run dev      # lokaal ontwikkelen
npm test         # prijs- en verzendberekening (lib/order.ts)
npm run build    # inhoudscontrole → WebP-foto's → statische site in out/
npm run preview  # site + afrekenfuncties lokaal (wrangler)
```

`npm run build` stopt met een Nederlandse foutmelding als de inhoud niet klopt (bijv. een foto die niet bestaat); de
vorige versie blijft dan online.

## Hosting (Cloudflare Pages)

- Build command: `npm run build` · Output directory: `out` · Node: 22 (`.node-version`)
- `SITE_LIVE=true` (omgevingsvariabele) alleen op de echte site; zonder staat de site op noindex (preview op pages.dev).
- `functions/`: de afrekenfuncties; Cloudflare Pages zet ze automatisch mee live onder `/api/…`.
- `public/_headers`: cache (JS/CSS/fonts een jaar, foto's een week) en beveiligingsheaders.
- `public/_redirects`: oude WordPress-adressen naar de nieuwe pagina's.

## Livegang op thoby3.com (draaiboek)

thoby3.com draait nu bij SiteGround (nameservers, de oude WordPress-shop én e-mail). Volgorde:

1. **Mollie live zetten**: in Cloudflare `MOLLIE_API_KEY` op de `live_…`-sleutel zetten (zelfde `MOLLIE_PROFILE_ID`),
   `RESEND_API_KEY` erbij en in Resend het domein thoby3.com verifiëren (DNS-records). Lopende bestellingen in de oude
   shop eerst afhandelen; daarna is WordPress niet meer nodig.
2. **Bedrijfsgegevens invullen** in het CMS (KvK, btw-id, adres). Zonder deze stopt de build bij stap 4.
3. **DNS naar Cloudflare**: domein toevoegen in Cloudflare, gevonden records controleren — vooral de MX-records
   (`mx10/20/30.antispam.mailspamprotection.com`), SPF (`v=spf1 +a +mx include:thoby3.com.spf.auto.dnssmarthost.net ~all`)
   en DMARC — en pas dan de nameservers bij de registrar omzetten. Anders stopt e-mail op info@thoby3.com.
4. **Custom domain** `thoby3.com` (en `www`) koppelen aan het Pages-project en `SITE_LIVE=true` zetten als
   productie-omgevingsvariabele; opnieuw deployen.
5. **Controleren**: een echte bestelling van een paar euro (en terugbetalen in Mollie), ordermail ontvangen,
   redirects, Google Search Console (sitemap indienen).
