---
name: THOBY3
description: The shop is the gift box. Sand outside, matte black board with gold foil inside.
colors:
  gold: "#d2b15c"
  gold-hover: "#dcbd6c"
  gold-ink: "#7a5c1e"
  board: "#151516"
  board-raised: "#1e1e20"
  lid: "#3a3b3d"
  ink: "#151516"
  ink-hover: "#2a2a2c"
  sand: "#e8e2da"
  paper: "#f4f1ec"
  studio: "#f2ede6"
  studio-hero: "#d3d7d7"
  pattern-fill: "#efeae0"
  muted: "#5a544c"
  muted-strong: "#47423c"
  muted-dark: "#a09b93"
  placeholder: "#6e6860"
  danger: "#a3341f"
  line: "rgba(21, 21, 22, 0.14)"
  line-strong: "rgba(21, 21, 22, 0.42)"
  line-dark: "rgba(243, 240, 234, 0.16)"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  display-board:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 5.6vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  display-hero:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 6.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "\"ss01\""
  caption:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.35
  label:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  label-cta:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  numeral:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontWeight: 700
    fontFeature: "\"tnum\""
  arabic:
    fontFamily: "Reem Kufi, sans-serif"
    fontSize: "clamp(2.75rem, 5vw, 4.25rem)"
    fontWeight: 500
    lineHeight: 1
rounded:
  none: "0px"
spacing:
  option-gap: "6px"
  gutter: "20px"
  gutter-lg: "40px"
  section: "80px"
  section-lg: "112px"
  container: "1440px"
components:
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.label-cta}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  button-gold-hover:
    backgroundColor: "{colors.gold-hover}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  choice-dark:
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "48px"
  choice-dark-active:
    textColor: "{colors.gold}"
  choice-light:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "56px"
  choice-light-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold}"
  product-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px"
  gift-strip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  review-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  photo-badge:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 10px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 12px"
---

# Design System: THOBY3

## Overview

**Creative North Star: "The Gift Box"**

The site is the THOBY3 box. Sections outside the box sit on sand: the hero with the thobe at full length, the collection, the reviews, the size map, the FAQ. Sections inside the box sit on matte black board with real cardboard grain: the header bar, the hero banderol, the box section, the footer. Gold foil is scarce and literal. It marks the kufi emblem, the hairlines along the banderol and the bar edges, the one gold-filled action in a region, and the choice the visitor has just made.

The forms come from the packaging and the pattern table. Corners are square. Lines are thin. Headings are narrow uppercase stacks like the print inside the lid. Buttons and nav read like hang tags; everything else that labels (legends, field labels, table heads, small print) is a quiet sentence-case caption. Size codes look like woven neck labels. Photography is real product and real box. Studio packshots sit on a pale studio ground and blend into it with multiply; the hero thobe stands in a panel of its own photo's grey with a measured length rule on it. Measurement is drawn, not claimed: rules with end ticks, dimension lines in gold ink, a 10 cm grid. Depth comes from changing ground (sand, paper, board), never from shadow. The one cast shadow belongs to the lid as it lifts off.

**Key Characteristics:**
- Two grounds tell the story: sand is outside the box, grained board is inside it.
- Gold marks the emblem, hairlines, the one primary action and the active choice. Nothing else.
- Every corner is square. No pills, no radius.
- Headings are two-line uppercase Big Shoulders stacks, with no label above them.
- Uppercase is for buttons, nav and photo badges; other labels are sentence-case captions.
- Size codes run S-1 to XL-2 (-1 slim, -2 broad) and are the product's own vocabulary.
- Length and width are shown as drawn measurements (length rule, dimension lines, true-scale figures).

## Colors

The palette has one metallic accent and three paper-and-board neutrals. Sand, paper and board carry the space, and gold is held back.

### Primary
- **Gold Foil** (gold): the kufi emblem (header panel, banderol, lid, footer), the banderol's two 1px hairlines at 60% opacity, the 40% gold bottom rule on the header bar and the mobile sticky bar, the fill of the single primary action per region (`button-gold`), and active choices. Text selection and the input caret use it too. On hover the fill lightens to gold-hover.
- **Gold Ink** (gold-ink): a darker, legible gold for measurement on light ground. It draws the size map's length line, its dashed level lines and each figure's chest dimension line, and sets the shared length figure and the chest value beside each figure. It also marks small notes on paper ("Gratis bij elke thobe" on accessory cards) and the wishlist heart's hover.

### Neutral
- **Matte Board** (board): the ground inside the box. It is always paired with the board.webp grain at a 1400 x 280px tile, and its text is paper.
- **Board Raised** (board-raised) and **Lid Anthracite** (lid): tonal steps of the board, reserved for lid surfaces.
- **Ink** (ink): text on light ground, the secondary filled button, the fill of an active choice on light ground, and the hero's length rule. It shares its value with board. On hover it lifts to ink-hover.
- **Sand** (sand): the body ground and every section outside the box.
- **Paper** (paper): panels laid on sand: the product card body, the gift strip, review cards, the size-map worksheet, form fields, the cart drawer and dialogs. Also text on board.
- **Studio Grey** (studio): the photo ground behind packshots and thumbnails. Photos blend into it with `mix-blend-mode: multiply`.
- **Hero Studio** (studio-hero): the hero panel's ground. It is not a free choice: it is the measured background of the hero photo itself, so the photo runs seamlessly into its panel. A different hero photo brings its own measured ground (or falls back to studio and loses the length rule).
- **Pattern Fill** (pattern-fill): the fill of the drawn thobes in the size map, a shade warmer than paper so the figures read as cut pattern pieces on the sheet.
- **Muted / Muted Strong** (muted, muted-strong): body copy, captions and field labels on light ground. **Muted Dark** (muted-dark) does the same on board.
- **Placeholder** (placeholder): placeholder text in fields on light ground (checkout fields, Mollie card fields, the height input), legible at about 5:1 on paper. On board the placeholder is paper at 55%.
- **Lines** (line, line-strong, line-dark): 1px rules. Use line-strong for borders of choices, fields, tables and the worksheet, line for card edges and row dividers, and line-dark for everything on board.

### Semantic
- **Danger** (danger): errors that block an order. It colors the text and the full 1px border of an alert box on paper, and the border of an invalid card field. There is no tinted fill and no side stripe.

### Named Rules
**The One Burning Plane Rule.** Gold lights up only what matters right now: the emblem, the hairlines, the one gold-filled action in a region, and the active choice. It is never used for headings, labels, numerals, prices or table column heads. Those stay in ink, paper or muted. Gold ink is the measuring pen, not the foil: it draws dimensions on light ground and never fills an action.

**The Two Grounds Rule.** Sand means outside the box. Board means inside it. A section takes one ground or the other, with paper as the only layer laid on sand. Board is never shown without its grain. The hero's studio panel is a photograph's own ground, not a third ground.

**The Ground-Aware Choice Rule.** On board, an active choice is a gold outline: gold border plus a 1px inset gold rule (`box-shadow: inset 0 0 0 1px var(--gold)`), with gold text and no fill. On sand or paper, an active choice is an ink fill with gold lettering.

## Typography

**Display Font:** Big Shoulders 600/700/800 (with Arial Narrow, sans-serif)
**Body Font:** Hanken Grotesk (with system-ui, sans-serif), stylistic set ss01 on
**Arabic Font:** Reem Kufi 500, used only for the Arabic greeting

**Character:** A narrow, vertical display face stands upright like the thobe and the kufi mark. Against it sits a quiet, open grotesk for reading and for every label that is not an action.

### Hierarchy
- **Display** (800, line-height 0.86, uppercase): section headings, always split over two lines (title / titleSecond). Sections on sand use `display` (clamp 2.5 to 4.25rem), the box section on board uses `display-board` (clamp 2.75 to 5.25rem), the hero h1 uses `display-hero` (clamp 2.5 to 6rem). The product page h1 sits at clamp(3rem, 5vw, 4.75rem).
- **Display numerals in place:** the Trustpilot score (3.5rem, line-height 0.8) and the box section's step numbers (2rem, muted-dark) are display-face figures, not a separate role.
- **Title** (800, 1.5 to 2rem, uppercase): product names on cards, in the banderol (1.75rem, 2rem from xl) and in the drawer; the gift strip heading and gift-box tile (1.75rem); the box section's step names (1.75rem). The feature card scales this up to clamp(2rem, 3.4vw, 3rem), and the size map's fit headings ("M-1 Slank") to clamp(2rem, 3.6vw, 3.25rem).
- **Body** (400, 1rem / 1.125rem in the hero, line-height 1.625): running copy at 30 to 52ch, in muted on light ground and muted-dark on board. Small print and card details step down to 0.875rem and 0.75rem.
- **Caption** (Hanken Grotesk 600, 0.875rem, line-height 1.35, sentence case): legends, field labels, table heads, footer column heads, the hero's length-rule label, figure captions, small link actions ("Los erbij"). Muted on light ground, muted-dark on board. Set font-weight 400 for a quieter caption under a figure.
- **Label** (Big Shoulders 600, 0.8125rem, 0.14em tracking, uppercase): the hang-tag voice, only for buttons, nav links and photo badges (badges at 0.6875rem).
- **Label CTA** (as label, 0.9375rem): every gold button (add to cart, checkout, box CTA). In the banderol it drops to 0.875rem and 0.08em tracking below sm so the price fits.
- **Numeral** (Big Shoulders, tabular figures, bold): prices, size codes, measurements, the size table and the height input (3rem).

### Named Rules
**The Lid Print Rule.** A section heading is a two-line uppercase display stack and starts its section. There is no eyebrow, kicker or category label above it.

**The Hang Tag Is for Actions Rule.** Uppercase tracked Big Shoulders labels mark things you press or navigate to: buttons, nav links, photo badges. Everything else that names a field, a column, a legend or a footer group is a sentence-case caption in the body face.

**The Neck Label Rule.** Sizes are written as codes (S-1, S-2, M-1 to XL-2), where -1 means slim and -2 means broad. They are set in numerals, never spelled out as words.

## Layout

The container is 1440px wide with gutters of 20px on mobile and 40px from lg up. Sections use 80px vertical padding on mobile and 112px from lg up. The box section goes to 128px. Two-column sections use asymmetric fractions (5fr/6fr, 6fr/5fr) with an 80px gap. Section headers on sand put the heading and its companion (intro text, the size picker, the Trustpilot summary, the WhatsApp button) on one row, aligned to the bottom, and stack on mobile.

Homepage order: hero, collection, reviews, box section (board), size map, FAQ. The fabric story lives only in the "Over de stof" dialog on the product page.

The hero fills 100svh on sand. The two-line heading sits left; the thobe stands right in its studio panel, 3:4 on desktop (up to min(64svh, 42rem) tall) and full width on phones, where the photo centres in the panel and the panel's grey continues to the edges. The intro paragraph shows from sm up. The full-width banderol sits along the bottom.

The collection is a 12-column grid (2 columns on mobile). The feature card spans 6 columns and 2 rows; the other thobes and the gift-box board tile span 3 columns each; the gift strip spans 6 columns under them (full width on mobile).

The size map is one worksheet: a paper panel with a 1px line-strong border. On desktop it has three columns (1fr / 2.2fr / 1fr): the slim fit's measurements right-aligned on the left, the drawn pair in the middle, the broad fit's measurements on the right. On mobile the drawing comes first and the two fit columns sit side by side under it. Below it, the full size table (in a details element) and the height helper share a 6fr/5fr row.

The FAQ runs full width in two accordion columns from lg up. Reviews flow in CSS columns (2 from md, 3 from lg) so uneven quotes pack without gaps; phones show three.

Groups of choices sit on a tight 6px gap in 2- or 4-column grids. Tap targets are at least 48px, and primary actions are 56px tall.

## Elevation & Depth

The system is flat. Depth comes from ground changes: paper on sand, the board grain, 1px rules. No surface has a resting shadow.

### Shadow Vocabulary
- **Lid cast** (`box-shadow: 0 24px 48px -12px rgba(0,0,0,0.6)`): only on the lifting lid in the scroll-linked lid reveal.
- **Inset gold rule** (`box-shadow: inset 0 0 0 1px var(--gold)`, 1.5px on the gift-box option): this is a second hairline, not elevation. It marks an active choice on board.
- **Inset ink rule** (`box-shadow: inset 0 0 0 1px var(--ink)`): the focused field's second hairline on light ground (checkout and card fields), paired with an ink border.

### Named Rules
**The Only Shadow Is the Box's Rule.** The lid's cast shadow is the system's only drop shadow. Everything else stays flat.

## Shapes

All corners are square (0px). That covers buttons, choices, cards, panels, badges, fields, the checkbox, the accordion's plus box, dialogs and drawers. Borders are 1px (2px for the height input's underline). Icons are Lucide at 1.5px stroke. Measurement marks are drawn as rules with short perpendicular end ticks: the hero's 1px ink length rule, and the size map's gold-ink length and chest lines. The size map is drawn on a 10 cm grid like pattern paper, with stitch lines dashed.

## Components

### Buttons
- **Shape:** square (0px), 56px tall for the main action and 48px for secondary actions.
- **Gold:** gold fill with ink text in the label-cta size, one per region. It is the add-to-cart action in the banderol and on the product page, the box CTA in the box section, and checkout in the drawer and on the checkout page. On hover it moves to gold-hover. When pressed it scales to 0.97 over 100ms.
- **Primary (ink):** ink fill with paper text in the label size. It is the main action on sand or paper when gold is not in play: "Shop M-1" / "Shop M-2" under each fit in the size map, the quick-add bar on product cards.
- **Outline:** a 1px ink border that fills ink with paper text on hover on light ground (FAQ WhatsApp, size advisor pick). On board the advisor pick is a gold border with gold text that fills gold on hover.
- **Text action:** a caption with a line-strong underline that darkens to ink on hover ("Los erbij", "Over de stof", the Trustpilot link).

### Choices (fit, size)
- **Dark (banderol, card size picker, sticky bar):** a line-dark border with paper text. Active is gold border, inset gold rule and gold text.
- **Light (size map, product page):** a line-strong border with ink text that turns to an ink border on hover. Active is an ink fill with gold text. In the size map each choice is 56px tall and stacks the size in display type over its body height in small numerals (paper/70 when active). Fit choices carry their -1 or -2 suffix at reduced opacity.

### Badges
- **Photo badge:** a square ink block with paper text at 0.6875rem in the label face, for discount and back-in-stock notes on photos. Product cards carry no size chips; sizes live in the banderol, the card's size picker and the size map.

### Cards / Containers
- **Product card:** a hang tag. It has a studio-grey photo ground with multiply-blended packshots, and a borderless paper body (paper on sand is enough) holding the name, price and a colour swatch line. A hover crossfade to the second photo runs over 400ms, on fine pointers only. The quick-add bar is an ink fill that slides up on hover. The feature card swaps the order: it shows the lifestyle/detail photo and crossfades to the full-length packshot.
- **Board tile:** a grained board panel with a photo under a board gradient, used for the gift box in the collection grid (the box-in-sand photo) with a title and a caption line.
- **Gift strip:** a borderless paper panel titled "Bij elke thobe gratis". Musk and siwak appear at their true scale: 96px studio thumbnails, the name in title type, the price in numerals and a "Los erbij" text action.
- **Review card:** a borderless paper card with 24–28px padding: ink stars, the quote in body type, then name and month in small print.
- **Dialog:** a paper panel with a line border over a board/50 overlay, popping in from 0.97 scale.

### Inputs / Fields
- **Text field (checkout):** paper ground, 1px line-strong border, 15px text, placeholder in placeholder grey, caption label above in muted-strong. Focus turns the border ink and adds the inset ink rule.
- **Height input:** a borderless field with a 2px bottom rule, 3rem bold numerals and a gold caret. Its focus moves the rule to ink (or to gold on board), with no outline box.
- **Checkbox:** a 20px square with a paper/50 border that turns gold when checked.
- **Error:** an alert on paper in danger with a full 1px danger border; inline errors on board are paper text.
- **Focus:** a 2px ink outline at 3px offset, gold on board.

### Navigation
- **Header bar:** grained board with a gold/40 bottom rule. It shows the paper wordmark on the left and centered label-voice links in paper/80 (Collectie, De doos, Maatkaart, Vragen, Contact). The active link turns gold and gets a 1px gold underline that slides between items on a spring. The sand announcement bar above it scrolls away.
- **Footer:** board, opening with the gold emblem at min(17rem, 56vw) over the caption "Uit Nederland", then link columns headed by muted-dark captions.

### Banderol (signature)
- The black band from the box, built as a working size picker. It is a full-width board strip with two gold hairlines 6px inside its top and bottom edges. It holds the gold emblem, the product name in the title face, fit and size choices under caption legends, the gift-box checkbox and the gold add-to-cart button with its tabular price. The header bar and the mobile sticky bar reuse its gold edge rule.

### Measured Hero (signature)
- The thobe at full length, always 3:4, multiply-blended onto the studio paper so the cool studio grey turns warm. A 1px ink length rule with 16px end ticks runs on the photo from shoulder to hem (positions measured per file); the rule breaks open around the vertical caption "Zelfde lengte, slank en breed", like a dimension on a sewing pattern, with no patch behind it. On load the photo settles from scale 1.06 over 1600ms, then the rule draws itself once from the caption outward (scaleY, 900ms, `cubic-bezier(0.77,0,0.175,1)`, 450ms delay) and the end ticks fade in.

### Size Worksheet (signature)
- Slim and broad of one size drawn side by side at true scale (1 unit = 1 cm) on one 10 cm grid, in pattern fill with an ink outline and dashed stitch lines. A single gold-ink length line runs between them with dashed level lines to collar and hem, labelled with the shared length in gold-ink numerals. Each figure carries a gold-ink chest dimension line. Beside each figure: its code and fit name in display type, chest, shoulders and sleeve in numerals (chest in gold ink), and its ink "Shop" button. Shapes morph between sizes on a spring (stiffness 260, damping 32).

### Lid Reveal (signature motion)
- The open box sits under a board lid that carries the gold emblem. As the visitor scrolls, the lid tilts back (one transform string: translateY to -118%, rotateX to 26 degrees, compositor-only) and fades out over the last 15% so no edge is left above the box, casting the system's only shadow. It mounts after first paint and never under reduced motion. Beside it the three lid steps are a numbered list in display type on line-dark rules, and the promises close the section as one line of sentence-case small print.

### Remembered size (comfort)
- Size and fit chosen anywhere (banderol, size map, table row, height helper, product page, quick add) are stored once in the cart store and preselected everywhere else; on the product page the URL wins, then the remembered size. With a remembered size the product CTA reads "In winkelwagen" straight away.

### Feedback
- **Missing size:** the "Maat" legend itself turns into "Kies eerst je maat" (gold on board) and the size buttons nudge sideways once (320ms); nothing is inserted, so the band never jumps.
- **Just added:** the new line in the cart drawer flashes a 22% gold wash that fades over 1400ms, after the drawer has slid in.
- **Size helper on the product page:** collapsed to one underlined line until the visitor asks for it.

### Reviews
- A Trustpilot summary (the score in display type, ink stars, a linked count) replaces any self-computed average when a score is set; without it the section shows stars and a count of the reviews present. Product pages fall back to three general reviews when the product has none.

## Do's and Don'ts

### Do:
- **Do** set every section on either sand (outside the box) or grained board (inside it), with paper as the only layer on sand.
- **Do** keep one gold-filled action per region, and make active choices a gold outline on board or an ink fill with gold text on light ground.
- **Do** write section headings as two-line uppercase display stacks and start the section with them.
- **Do** use the uppercase label only for buttons, nav links and photo badges, and the sentence-case caption for every other label.
- **Do** write sizes as codes (S-1 to XL-2) in tabular Big Shoulders numerals.
- **Do** show measurement as drawn rules with end ticks, in ink on photos and gold ink on the pattern sheet.
- **Do** blend studio packshots into the studio grey with multiply, and give a hero photo its own measured ground.
- **Do** limit entrance motion to the hero's rise/settle and the one-time rule draw, keep the lid reveal as the one scroll-linked moment, gate hover effects behind `(hover: hover) and (pointer: fine)`, and gate all motion behind prefers-reduced-motion.
- **Do** leave borders off paper on sand; use rules only where they separate data (tables, lists).

### Don't:
- **Don't** use gold foil for headings, labels, numerals, prices or column heads.
- **Don't** round a corner or use a pill shape.
- **Don't** add drop shadows. The lid's cast shadow is the only one.
- **Don't** put an eyebrow, kicker or category label above a heading.
- **Don't** set legends, field labels, table heads or footer column heads in uppercase tracked type.
- **Don't** show board without its grain, or put board text in anything but paper, muted-dark or gold.
- **Don't** mark errors with a coloured side stripe or tinted fill; use a full 1px danger border.
