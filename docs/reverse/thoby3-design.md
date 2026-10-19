# THOBY3 — design & structuur
Bron: https://thoby3.com · gemeten op 2026-10-17 · viewport 799×609 (desktop pane)

## Stack (observed)
WordPress + WooCommerce (wp-content, `/wp-json/wc/store/v1/products`), GTranslate-plugin voor taal. Geen Shopify/Next.

## Design tokens (observed → vervangen)
- Origineel: wit `#fff`, tekst grijs `#767676`/`#333`, fonts hkgroteskpro/Roboto/Montserrat/Lato, 14px basis, vrijwel geen radius of schaduw, accenten pastelblauw `#aad0eb` / paars.
- Nieuw (zie `app/globals.css`): ivory `#FAF9F6`, sand `#F4F1EA`, ink `#1A1A1A`, goud `#C5A880`; Cormorant Garamond + Inter.

## Structuur (observed)
- Home: hero "De White-Desert Thobe" (foto pexels-tomas-malik), ticker met USP's, "Satijn geweven katoen", "Betaalbare luxe", "WHITE DESERT"-tekst.
- Nav: Home, Over Ons, Collection, Contact, Login/Register, Wishlist, Cart. Shop: 4 producten.
- Product: variaties Maat (S 1.60–1.70 / M 1.70–1.78 / L 1.78–1.87 / XL 1.87–1.95 m) × Postuur (Slank/Breed) × Cadeaudoos (+€5).
- Footer: AVG/voorwaarden, levering & retour, Snapchat, Instagram, +31 6 41344799, info@thoby3.com.

## Data (observed)
Prijzen: White Desert €44,99 (was €74,99), Caramel Sands €44,99 (was €79,99, uitverkocht), Musk €5,99, Siwak €3,99. Verzending: gratis NL, Europa €4,99.

## Onzeker
Betaalmethodes (footer-badges zijn aannames), exacte checkout-/verzendregels, echte vertalingen, voorraadstatus per maat.

## Bouwplan
`lib/products.ts`, `components/*` (Header, Hero, ProductGrid/Card, FitShowcase, FabricSection, USPSection, CraftSection, CartDrawer, Footer, ProductDetail), `app/page.tsx`, `app/product/[slug]/page.tsx`.
