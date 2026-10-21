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
  muted: "#5a544c"
  muted-strong: "#47423c"
  muted-dark: "#a09b93"
  line: "rgba(21, 21, 22, 0.14)"
  line-strong: "rgba(21, 21, 22, 0.42)"
  line-dark: "rgba(243, 240, 234, 0.16)"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  display-hero:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(3.25rem, 5.1vw, 4.75rem)"
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
  label:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "0.8125rem"
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
    typography: "{typography.label}"
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
    padding: "0 28px"
    height: "56px"
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
    height: "48px"
  choice-light-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold}"
  size-code-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "36px"
  product-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px"
  photo-badge:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 10px"
---

# Design System: THOBY3

## Overview

**Creative North Star: "The Gift Box"**

The site is the THOBY3 box. Sections outside the box sit on sand: the hero photo of the box in the sand, the collection, the size map, the FAQ. Sections inside the box sit on matte black board with real cardboard grain: the header bar, the hero banderol, the box section, the fabric section, the footer. Gold foil is scarce and literal. It marks the kufi emblem, the hairlines along the banderol and the bar edges, the one gold-filled action in a region, and the choice the visitor has just made.

The forms come from the packaging. Corners are square. Lines are thin. Headings are narrow uppercase stacks like the print inside the lid. Labels look like hang tags, and size codes look like woven neck labels. Photography is real product and real box. Studio packshots sit on a pale grey studio ground and blend into it with multiply. Depth comes from changing ground (sand, paper, board), never from shadow. The one cast shadow belongs to the lid as it lifts off.

**Key Characteristics:**
- Two grounds tell the story: sand is outside the box, grained board is inside it.
- Gold marks the emblem, hairlines, the one primary action and the active choice. Nothing else.
- Every corner is square. No pills, no radius.
- Headings are two-line uppercase Big Shoulders stacks, with no label above them.
- Size codes run S-1 to XL-2 (-1 slim, -2 broad) and are the product's own vocabulary.

## Colors

The palette has one metallic accent and three paper-and-board neutrals. Sand, paper and board carry the space, and gold is held back.

### Primary
- **Gold Foil** (gold): the kufi emblem (header panel, banderol, lid, footer), the banderol's two 1px hairlines at 60% opacity, the 40% gold bottom rule on the header bar and the mobile sticky bar, the fill of the single primary action per region (`button-gold`), and active choices. Text selection and the input caret use it too. On hover the fill lightens to gold-hover.
- **Gold Ink** (gold-ink): a darker, legible gold for small marks on light ground. It is used for the dimension lines and figures in the scale diagram and for small line icons on sand or paper (announcement bar, gift note).

### Neutral
- **Matte Board** (board): the ground inside the box. It is always paired with the board.webp grain at a 1400 x 280px tile, and its text is paper.
- **Board Raised** (board-raised) and **Lid Anthracite** (lid): tonal steps of the board, reserved for lid surfaces.
- **Ink** (ink): text on light ground, the secondary filled button, and the fill of an active choice on light ground. It shares its value with board. On hover it lifts to ink-hover.
- **Sand** (sand): the body ground and every section outside the box.
- **Paper** (paper): cards and panels laid on sand (the product card body, the diagram panel, the cart drawer), and text on board.
- **Studio Grey** (studio): the photo ground behind packshots. Photos blend into it with `mix-blend-mode: multiply`.
- **Muted / Muted Strong** (muted, muted-strong): body copy and field labels on light ground. **Muted Dark** (muted-dark) does the same on board.
- **Lines** (line, line-strong, line-dark): 1px rules. Use line-strong for borders of choices and tables, line for card edges and row dividers, and line-dark for everything on board.

### Named Rules
**The One Burning Plane Rule.** Gold lights up only what matters right now: the emblem, the hairlines, the one gold-filled action in a region, and the active choice. It is never used for headings, labels, numerals, prices or table column heads. Those stay in ink, paper or muted.

**The Two Grounds Rule.** Sand means outside the box. Board means inside it. A section takes one ground or the other, with paper as the only layer laid on sand. Board is never shown without its grain.

**The Ground-Aware Choice Rule.** On board, an active choice is a gold outline: gold border plus a 1px inset gold rule (`box-shadow: inset 0 0 0 1px var(--gold)`), with gold text and no fill. On sand or paper, an active choice is an ink fill with gold lettering.

## Typography

**Display Font:** Big Shoulders 600/700/800 (with Arial Narrow, sans-serif)
**Body Font:** Hanken Grotesk (with system-ui, sans-serif), stylistic set ss01 on
**Arabic Font:** Reem Kufi 500, used only for the Arabic greeting

**Character:** A narrow, vertical display face stands upright like the thobe and the kufi mark. Against it sits a quiet, open grotesk for reading.

### Hierarchy
- **Display** (800, clamp 2.75 to 5.25rem, line-height 0.86, uppercase): section headings, always split over two lines (title / titleSecond). The hero uses the display-hero size.
- **Title** (800, 1.5 to 2rem, uppercase): product names on cards, in the banderol and in the drawer. The feature card scales this up to clamp(2rem, 3.4vw, 3rem).
- **Body** (400, 1rem / 1.125rem in the hero, line-height 1.625): running copy at 34 to 52ch, in muted on light ground and muted-dark on board.
- **Label** (600, 0.8125rem, 0.14em tracking, uppercase): the hang-tag voice. It is used for buttons, legends, nav, captions, small print and table heads. The 0.75rem step is used for dense rows.
- **Numeral** (Big Shoulders, tabular figures, bold): prices, size codes, measurements and the height input (3rem).

### Named Rules
**The Lid Print Rule.** A section heading is a two-line uppercase display stack and starts its section. There is no eyebrow, kicker or category label above it.

**The Neck Label Rule.** Sizes are written as codes (S-1, S-2, M-1 to XL-2), where -1 means slim and -2 means broad. They are set in numerals, never spelled out as words.

## Layout

The container is 1440px wide with gutters of 20px on mobile and 40px from lg up. Sections use 80px vertical padding on mobile and 112px from lg up. The box section goes to 128px. Two-column sections use asymmetric fractions (5fr/6fr, 6fr/5fr, 5fr/7fr) with an 80px gap. The column holding a heading or diagram is sticky at top 7rem.

The collection is a 12-column grid. The feature card spans 6 columns and 2 rows, and the other cards span 3 columns each. Groups of choices sit on a tight 6px gap in 2- or 4-column grids. Tap targets are at least 48px, and primary actions are 56px tall.

The hero fills 100svh. Its photo bleeds off the right 64% behind a left-edge mask that fades into the sand, and the full-width banderol sits along the bottom.

## Elevation & Depth

The system is flat. Depth comes from ground changes: paper on sand, the board grain, 1px rules. No surface has a resting shadow.

### Shadow Vocabulary
- **Lid cast** (`box-shadow: 0 24px 48px -12px rgba(0,0,0,0.6)`): only on the lifting lid in the scroll-linked lid reveal.
- **Inset gold rule** (`box-shadow: inset 0 0 0 1px var(--gold)`, 1.5px on the gift-box option): this is a second hairline, not elevation. It marks an active choice on board.

### Named Rules
**The Only Shadow Is the Box's Rule.** The lid's cast shadow is the system's only drop shadow. Everything else stays flat.

## Shapes

All corners are square (0px). That covers buttons, choices, cards, badges, chips, the checkbox, the accordion's plus box and drawers. Borders are 1px (2px for the height input's underline). Icons are Lucide at 1.5px stroke. The ritual icons are custom 1.5px line drawings with square joins, drawn after the white illustrations in the lid. The scale diagram is drawn on a 10cm grid like pattern paper.

## Components

### Buttons
- **Shape:** square (0px), 56px tall for the main action and 48px for secondary actions, using the label face.
- **Gold:** gold fill with ink text, one per region. It is the add-to-cart action in the banderol and on the product page, and the box CTA in the box section. On hover it moves to gold-hover. When pressed it scales to 0.97 over 100ms.
- **Primary (ink):** ink fill with paper text. It is the main action on sand when gold is not in play (shop from the size map, size advisor on light ground).
- **Outline:** a 1px ink border that fills ink on hover on light ground (FAQ WhatsApp, advisor pick). On board it is a paper/40 border that turns gold on hover.

### Choices (fit, size, detail)
- **Dark (banderol, fabric viewer, sticky bar):** a line-dark border with paper text. Active is gold border, inset gold rule and gold text.
- **Light (size map, product page):** a line-strong border with ink text that turns to an ink border on hover. Active is an ink fill with gold text. Fit choices carry their -1 or -2 suffix at reduced opacity.

### Chips
- **Size-code chip:** square, a 1px ink/70 border on a near-white ground, bold tabular numerals. All eight codes appear only on the feature card. Elsewhere sizes show as a label-voice line ("8 maten · S-1 t/m XL-2").
- **Photo badge:** a square ink block with paper text at 0.6875rem in the label face, for discount and back-in-stock notes.

### Cards / Containers
- **Product card:** a hang tag. It has a studio-grey photo ground with multiply-blended packshots, and a paper body edged with a line border on three sides. A hover crossfade to the lifestyle photo runs over 400ms, on fine pointers only. The quick-add bar is an ink fill that slides up on hover.
- **Board tile:** a grained board panel with a photo under a board gradient, used for the gift box in the collection grid.

### Inputs / Fields
- **Height input:** a borderless field with a 2px bottom rule, 3rem bold numerals and a gold caret. Its focus moves the rule to ink (or to gold on board), with no outline box.
- **Checkbox:** a 20px square with a paper/50 border that turns gold when checked.
- **Focus:** a 2px ink outline at 3px offset, gold on board.

### Navigation
- **Header bar:** grained board with a gold/40 bottom rule. It shows the paper wordmark on the left and centered label-voice links in paper/80. The active link turns gold and gets a 1px gold underline that slides between items on a spring. The sand announcement bar above it scrolls away.

### Banderol (signature)
- The black band from the box, built as a working size picker. It is a full-width board strip with two gold hairlines 6px inside its top and bottom edges. It holds the gold emblem, the product name in the title face, fit and size choices, the gift-box checkbox and the gold add-to-cart button with its tabular price. The header bar and the mobile sticky bar reuse its gold edge rule.

### Lid Reveal (signature motion)
- The open box sits under a board lid that carries the gold emblem. As the visitor scrolls, the lid tilts back (rotateX 0 to 32 degrees) and slides off, casting the system's only shadow. It mounts after first paint and never under reduced motion.

### Scale Diagram
- A flat thobe drawn at 1 unit = 1 cm on a 10cm grid. It has an ink outline and the other fit dashed at 35% behind it. Dimension lines and figures are in gold-ink. The shape morphs between sizes on a spring (stiffness 260, damping 32).

## Do's and Don'ts

### Do:
- **Do** set every section on either sand (outside the box) or grained board (inside it), with paper as the only layer on sand.
- **Do** keep one gold-filled action per region, and make active choices a gold outline on board or an ink fill with gold text on light ground.
- **Do** write section headings as two-line uppercase display stacks and start the section with them.
- **Do** write sizes as codes (S-1 to XL-2) in tabular Big Shoulders numerals.
- **Do** blend studio packshots into the studio grey with multiply.
- **Do** limit entrance motion to the hero's rise/settle (500ms and 1600ms, `cubic-bezier(0.16,1,0.3,1)`), keep the lid reveal as the one scroll-linked moment, and gate all motion behind prefers-reduced-motion.

### Don't:
- **Don't** use gold for headings, labels, numerals, prices or column heads.
- **Don't** round a corner or use a pill shape.
- **Don't** add drop shadows. The lid's cast shadow is the only one.
- **Don't** put an eyebrow, kicker or category label above a heading.
- **Don't** show board without its grain, or put board text in anything but paper, muted-dark or gold.
