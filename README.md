# THOBY3

Statische webshop-voorkant (Next.js 16, statische export) voor THOBY3. Afrekenen, betalingen, voorraad en bestellingen
blijven in de bestaande WooCommerce-shop op thoby3.com: de knop **Afrekenen** opent daar de checkout met de hele winkelwagen
(`/checkout-link/?products=ID:aantal,…`).

## Inhoud aanpassen

Alle teksten, foto's en producten staan in `content/*.json` en zijn te bewerken via [Pages CMS](https://app.pagescms.org)
(configuratie: `.pages.yml`). Elke opslag is een commit; Cloudflare Pages bouwt de site daarna opnieuw (± 2 minuten).

| Bestand | Wat |
|---|---|
| `content/products.json` | Producten: naam, adres, teksten, foto's. Prijs, van-prijs, voorraad en variaties komen uit WooCommerce. |
| `content/shop.json` | Cadeaudrempel, meerprijs cadeaudoos, verzendtekst, maten, pasvormen, stof. |
| `content/home.json` | Alle teksten en foto's van de homepage. |
| `content/site.json` | Aankondigingsbalk, contact, juridische links, nieuwsbrief, Google-titel. |

Prijzen en voorraad pas je aan **in WooCommerce**, niet hier: bij elke build worden ze opgehaald (`scripts/sync-woo.mjs`).
Een nieuw product: maak het eerst in WooCommerce, voeg het dan in het CMS toe met het WooCommerce product-ID.

## Bouwen

```bash
npm install
npm run dev      # lokaal ontwikkelen
npm run build    # WooCommerce-sync → inhoudscontrole → WebP-foto's → statische site in out/
```

`npm run build` stopt met een Nederlandse foutmelding als de inhoud niet klopt (bijv. een foto die niet bestaat); de
vorige versie blijft dan online.

## Hosting (Cloudflare Pages)

- Build command: `npm run build` · Output directory: `out` · Node: 22 (`.node-version`)
- `SITE_LIVE=true` (omgevingsvariabele) alleen op de echte site; zonder staat de site op noindex (preview op pages.dev).
- Tip: maak in Cloudflare een *deploy hook* en zet die in WooCommerce als webhook bij "Product bijgewerkt", dan volgt de
  site prijs- en voorraadwijzigingen automatisch.
- `public/_headers`: cache (JS/CSS/fonts een jaar, foto's een week) en beveiligingsheaders.
- `public/_redirects`: oude WordPress-adressen naar de nieuwe pagina's.

## Livegang op thoby3.com (draaiboek)

thoby3.com draait nu bij SiteGround (nameservers, WordPress/WooCommerce én e-mail). Volgorde:

1. **WooCommerce verhuist naar een subdomein**, bijv. `shop.thoby3.com` (SiteGround: subdomein aanmaken, WordPress-adres
   en site-URL aanpassen). Daarna in `content/shop.json` `checkoutLink` op `https://shop.thoby3.com/checkout-link/` zetten,
   `SHOP` in `scripts/sync-woo.mjs` aanpassen en in `public/_redirects` `/cart`, `/checkout` en `/my-account` naar het
   subdomein laten wijzen.
2. **Bedrijfsgegevens invullen** in het CMS (KvK, btw-id, adres). Zonder deze stopt de build bij stap 4.
3. **DNS naar Cloudflare**: domein toevoegen in Cloudflare, gevonden records controleren — vooral de MX-records
   (`mx10/20/30.antispam.mailspamprotection.com`), SPF (`v=spf1 +a +mx include:thoby3.com.spf.auto.dnssmarthost.net ~all`)
   en DMARC — en pas dan de nameservers bij de registrar omzetten. Anders stopt e-mail op info@thoby3.com.
4. **Custom domain** `thoby3.com` (en `www`) koppelen aan het Pages-project en `SITE_LIVE=true` zetten als
   productie-omgevingsvariabele; opnieuw deployen.
5. **Controleren**: afrekenen met een echte testbestelling, redirects, Google Search Console (sitemap indienen).
