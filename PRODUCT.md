# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Breed publiek in Nederland en de rest van de EU: moslimmannen van alle leeftijden die een thobe zoeken voor Jumu'ah, Eid, de moskee en dagelijks gebruik, plus mensen die er een als cadeau kopen (Ramadan, Eid). Ze kopen vaak op mobiel, via Instagram, en twijfelen vooral over de maat.

## Product Purpose

De webshop van THOBY3. Bezoekers kiezen een thobe in de juiste maat en pasvorm en rekenen af op de eigen afrekenpagina, in dezelfde stijl als de rest van de site. Succes betekent dat een bezoeker zonder twijfel over de maat bestelt, en dat het merk premium genoeg overkomt om de prijs en het cadeau te dragen.

## Positioning

Elke maat (S t/m XL) bestaat in twee pasvormen met dezelfde lengte: slank (-1) en breed (-2). De meeste thobe-merken verkopen één snit per lengte. Bij elke thobe krijg je gratis Musk en Siwak. Voor €5 extra komt hij in de matzwarte geschenkdoos met het kufi-logo in goudfolie (de optie "In de geschenkdoos" bij het kiezen van de maat).

## Operating Context

- Afrekenen op `/afrekenen` met Mollie (Cloudflare-functies in `functions/api/`); bestellingen staan in het Mollie-dashboard en komen per mail binnen (Resend).
- Teksten, foto's, prijzen, voorraad (uitverkocht) en verzendkosten zijn te bewerken via Pages CMS (`content/*.json`, `.pages.yml`).
- Hosting: Cloudflare Pages, Next.js als statische export.

## Capabilities and Constraints

- Producten: Thobe White Desert (gebroken wit), Thobe Caramel Sands (karamel, nu uitverkocht), Musk (Golden Aura, 5 ml), Siwak met houder.
- Maten op lichaamslengte: S 1.60–1.70, M 1.70–1.78, L 1.78–1.87, XL 1.87–1.95 m.
- Kledingmaten in cm (borst/schouders/mouw/lengte) zijn nog niet bekend: thoby3.com noemt alleen lichaamslengtes. De velden in `content/shop.json` staan leeg tot de echte, gemeten maten via het CMS komen; leeg verbergt de cm-tabel en de tekening op schaal. Verzin geen maten.
- Gratis maatruil binnen 14 dagen; gratis verzending in NL, naar de rest van de EU vanaf €50; vóór 17:00 besteld, dezelfde dag verzonden (ma–za).
- Betalen: iDEAL, Visa, Mastercard, PayPal, Apple Pay.
- Geen klantaccounts op deze voorkant.

## Brand Commitments

- Naam THOBY3, met het vierkante kufi-logo (Arabische tekst in een geometrisch raster, met "THOBY3" eronder).
- Verpakking: een matzwarte doos met goudfolie, een zwarte banderol met het logo, en in de deksel "Assalamu'alaikum" met praktische tips.
- Productnamen komen uit het woestijnlandschap: White Desert, Caramel Sands.
- De taal van de site is Nederlands.

## Evidence on Hand

- Studiofoto's van beide thobes (op model en details) in `public/img/`, en meer op thoby3.com: de doos open en dicht, de doos in het zand, het hangtag, de stofdrapering, de musk in een buidel, de siwak.
- Maatindeling op lichaamslengte (zie hierboven); nog geen gemeten kledingmaten.
- Geen klantreviews. Verzin geen reviews, klantaantallen, persvermeldingen of beoordelingen.
- Het KvK-nummer, btw-id en adres zijn nog leeg in het CMS.

## Product Principles

1. Haal de twijfel over de maat weg voordat je iets anders verkoopt.
2. Laat het product en de verpakking het bewijs zijn: echte foto's, geen stockbeelden.
3. Respectvol en zelfverzekerd: modest, geen hype en geen nep-urgentie.
4. Mobiel eerst, want de meeste bezoekers komen via Instagram.

## Accessibility & Inclusion

WCAG 2.2 AA. Arabische tekst alleen als beeldmerk, nooit als enige drager van informatie.
