---
name: THOBY3
description: Wit, inkt en veel lucht, met filmische beweging. De foto's dragen de pagina; het stofverhaal is het ene donkere vlak.
colors:
  ink: "#0b0b0b"
  paper: "#ffffff"
  sand: "#ffffff"
  studio: "#f3f3f1"
  board: "#0b0b0b"
  muted: "#6b6b6b"
  muted-strong: "#474747"
  muted-dark: "#a3a3a3"
  gold: "#c9a54b"
  danger: "#a3341f"
  line: "rgba(11, 11, 11, 0.08)"
  line-strong: "rgba(11, 11, 11, 0.16)"
  line-dark: "rgba(255, 255, 255, 0.14)"
typography:
  family: "Geist, system-ui, sans-serif"
  display:
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
    sizes: "hero clamp(2.75rem, 5.4vw, 5rem); sections clamp(2.25rem, 4.4vw, 3.75rem); product h1 clamp(2.25rem, 4vw, 3.5rem)"
  body:
    fontSize: "1rem"
    lineHeight: 1.625
  label:
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  button: "9999px"
  choice: "12px (rounded-xl)"
  card: "16px (rounded-2xl)"
  feature: "24-32px (hero photo, worksheet, box section)"
motion:
  ease-out: "cubic-bezier(0.23, 1, 0.32, 1)"
  ease-in-out: "cubic-bezier(0.77, 0, 0.175, 1)"
---

# Design System: THOBY3

## Overview

Modern en clean, maar niet kaal: een witte pagina, één sans (Geist), inkt voor tekst en acties, ronde foto-vlakken op studiogrijs, en beweging die de pagina laat leven. Volgorde op de homepage: hero met lopende band, collectie, het stofverhaal (het ene donkere vlak), reviews als band, de geschenkdoos, de maatkaart, vragen, footer met het woordmerk over de volle breedte. Goud is het embleem: op het deksel van de doos en als scheidingsteken in de lopende band, nooit als knop- of lijnkleur.

## Colors

- **Ink** (`ink`, `#0b0b0b`): tekst, primaire knoppen, actieve keuzes, iconen.
- **Paper / Sand** (wit): de paginagrond, panelen, lades en dialogen.
- **Studio** (`#f3f3f1`): fotogrond achter productfoto's (met `mix-blend-multiply`) en zachte vlakken: reviewkaarten, cadeaustrook, maatkaart-werkblad, samenvatting bij afrekenen, gesegmenteerde keuzes.
- **Board** (`#0b0b0b`, vlak, geen korrel): het stofverhaal, de doos-tegel in de collectie en het deksel.
- **Muted** (`#6b6b6b`, ~5.3:1 op wit): bodytekst, bijschriften en de tweede regel van een kop. **Muted dark** doet hetzelfde op board.
- **Lines**: `line` voor scheidingen, `line-strong` voor randen van keuzes en velden.
- **Gold**: alleen het embleem (deksel, lopende band).

## Typography

Eén familie, Geist. Koppen (`.display`) zijn 600, krap gespatieerd, zinsvormig. Een kop van twee regels zet de tweede regel in muted (`<em>` binnen `.display` is grijs, niet cursief). Knoppen en labels (`.tag`, `.caption`) zijn 14px medium in gewone kast: geen kapitalen, geen ruime letterspatiëring. Cijfers en prijzen krijgen `.num` (tabular).

## Shapes

- Knoppen zijn pillen: `.btn-primary` (inkt), `.btn-light` (wit, op board), `.btn-ghost` (1px rand). `.btn-gold` bestaat nog als alias van de primaire knop.
- Keuzes voor pasvorm en detail zijn een gesegmenteerde pil op studio met een witte actieve pil.
- Maatknoppen zijn `rounded-xl` met een rand; actief is inkt-vlak met witte tekst.
- Foto's en kaarten: `rounded-2xl`; grote vlakken (hero-foto, werkblad, doos-sectie) 24-32px.

## Elevation

Diepte komt uit grondwissel (wit/studio/board), niet uit kaders. Schaduwen alleen op zwevende lagen: header-paneel, maatkiezer op de productkaart, het bijschrift op de hero-foto, dialogen.

## Components

- **Header**: wit, 85% dekkend met backdrop-blur, haarlijn onder. Navigatie in muted; het actieve item krijgt een studio-pil die met een veer meeschuift (`layoutId`). Aankondigingsbalk erboven in inkt.
- **Hero**: Trustpilot-chip, kop die woord voor woord uit een masker omhoog schuift, toelichting, primaire knop met prijs en een ghost-knop naar de maatkaart. Rechts de thobe in het grijs van de foto zelf; de foto opent uit een kleiner venster (clip-path) en zakt bij scrollen trager weg (Parallax). Een rond label draait langzaam over de rand. Daaronder een lopende band met de beloftes en het gouden embleem. Bestellen gebeurt op de productpagina.
- **Productkaart**: foto op studio met ronde hoeken, daaronder naam, prijs, kleur en voorraad in muted. Met een muis: crossfade naar de sfeerfoto en een witte "Kies je maat"-pil; de maatkiezer groeit vanuit die pil (origin onder).
- **Stofverhaal** (`FabricStory`): zwart rond vlak. Desktop: de foto blijft staan (sticky) en wisselt met crossfade en lichte blur zodra de volgende eigenschap in het midden staat; teller 01/04. Telefoon: elke eigenschap met eigen foto.
- **Reviews**: kaarten lopen als band voorbij, staan stil bij hover of focus.
- **Geschenkdoos**: belofte en kenmerken links, rechts het deksel dat bij scrollen wegkantelt, met de dichte doos in de hand als kleinere foto die sneller meeschuift.
- **Maatkaart**: maatknoppen, het werkblad op studio met de schaaltekening (inktlijnen), maattabel met inkt-rij voor de gekozen maat.
- **Footer**: vier beloftetegels op studio, de links, en het THOBY3-woordmerk over de volle breedte als afsluiter.

## Motion

Volgens Emil Kowalski: alleen `transform`, `opacity` (en een korte blur of clip-path), sterke ease-out (`--ease-out`), UI-overgangen onder 300ms, `scale(0.97)` op indrukken (`.press`), hover-effecten alleen achter `(hover: hover) and (pointer: fine)`, uitgang sneller dan ingang, nooit vanaf `scale(0)`. Marketingbeweging mag langer (600-1200ms) omdat je hem één keer ziet. Bouwstenen: `Reveal` (omhoog uit blur, één keer in beeld), `SplitTitle` (woorden uit een masker, 60ms stagger), `Parallax` (scroll-gekoppeld, één transform-string), `Marquee` (CSS, lineair, pauzeert bij hover). De hero-entree is pure CSS zodat de kop (LCP) niet op JavaScript wacht. De header schuift weg bij omlaag scrollen en komt terug bij omhoog. Bij "minder beweging" staan banden en badge stil en vallen de animaties weg.

## Do's and Don'ts

- Do: laat foto's en witruimte het werk doen; één primaire actie per blok.
- Do: gebruik studio voor zachte vlakken in plaats van randen.
- Don't: goud in de UI, korrel/texturen, kapitalen met ruime spatiëring, serif-koppen, vierkante knoppen.
- Don't: meer dan één donker vlak per pagina.
