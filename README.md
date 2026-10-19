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
