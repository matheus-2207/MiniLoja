---
name: PowerSupps
description: Dark premium supplement storefront with an interactive product studio.
colors:
  primary: "#c0f65a"
  primary-hover: "#d1ff7c"
  cta-hover: "#d2ff7e"
  neutral-bg: "#0a0c09"
  surface: "#171b14"
  surface-hover: "#343c2c"
  text-main: "#f1f3ec"
  text-muted: "#a0aa94"
  home-muted: "#9c9e97"
  display-white: "#f4f4ee"
  cta-ink: "#17220b"
  border: "#343c2c"
  danger: "#ef4444"
  success: "#22c55e"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(64px, 6.4vw, 91px)"
    fontWeight: 600
    lineHeight: 0.99
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1.13
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Outfit, sans-serif"
    fontSize: "9px"
    letterSpacing: "1.6px"
  button:
    fontFamily: "Outfit, sans-serif"
    fontSize: "14px"
    fontWeight: 600
rounded:
  chip: "4px"
  cta: "6px"
  input: "8px"
  card: "10px"
  feature: "12px"
spacing:
  compact: "8px"
  base: "16px"
  mobile-gutter: "22px"
  tablet-gutter: "32px"
  desktop-gutter: "52px"
  section: "104px"
  section-mobile: "66px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.cta-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.cta}"
    padding: "15px 22px"
  button-primary-hover:
    backgroundColor: "{colors.cta-hover}"
    textColor: "#111"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "#e3e8db"
    rounded: "{rounded.cta}"
    padding: "15px 22px"
  input:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.input}"
    padding: "12px 16px"
  category-chip:
    backgroundColor: "transparent"
    textColor: "#9ea495"
    rounded: "{rounded.chip}"
    padding: "10px 17px"
  category-chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "#1b270d"
  kit-card:
    backgroundColor: "transparent"
    rounded: "{rounded.card}"
    padding: "30px 25px 23px"
  navigation:
    backgroundColor: "#0a0c09ee"
    padding: "21px 0"
---

# Design System: PowerSupps

## Overview

**Creative North Star: "Dark sports-product studio"**

A dark sports-product studio frames PowerSupps through geometric off-white type, electric lime actions and directly inspectable packaging. The atmosphere is premium and restrained: large editorial statements, muted supporting copy and thin rules leave room for the product.

The defining object is a realtime lit creatine jar with a ribbed lid and printed label. Its tactile appearance is an illustrative concept, not evidence of a supplied production package or certified formulation.

**Key Characteristics:**

- Dark olive-black surfaces and off-white Outfit typography.
- Electric lime for product identity, primary actions and selected states.
- Spacious editorial composition with compact controls and thin dividers.
- Direct manipulation with keyboard controls and reduced-motion support.

This document records the implemented system from `frontend/src/index.css`, `frontend/src/pages/Home.css`, `frontend/src/components/Navbar.css`, `Home.jsx` and `ProductScene.jsx`. Frontmatter tokens are normative for extensions of this world. Local declarations and cascade overrides were checked; the obsolete “Orange” comment in the global CSS is not a color specification.

## Colors

Electric lime is the sole brand accent. The neutral background is the implemented olive-black `neutral-bg`, a close interpretation of the requested dark #0A0A0A direction. Use `primary` for purchase/discovery actions, selected filters, brand detail and the product label. `primary-hover` is the shared button hover; the home CTA has its distinct `cta-hover` value.

Use `display-white` for the hero, `text-main` for general content, and `home-muted` for home supporting text. `text-muted` belongs to the shared application shell. Surfaces and borders use the extracted dark neutral tokens. `danger` and `success` are inherited semantic states, not additional brand accents.

## Typography

Outfit is bundled locally at weights 400, 500, 600, 700 and 800 with sans-serif fallback. The home page overrides the inherited bold heading defaults: display is 600, section headlines and product titles are 500. The large display's tight tracking and near-solid line height create the geometric editorial voice. Body copy remains open at 1.75 line height; hero copy is capped at 355px width.

The display becomes 70px at the 1050px breakpoint and `clamp(56px, 12vw, 80px)` with 1.02 line height at 760px. Section headings become 35px then 32px. Small uppercase-like metadata uses tracked labels; do not apply that treatment to paragraphs.

## Layout

The home and navigation container are at most 1320px wide, with 52px horizontal padding, reducing to 32px at 1050px and 22px at 760px. Other application routes retain their 1200px container. Desktop hero columns are `1fr 1.08fr`, becoming equal at 1050px and one column at 760px. Hero minimum height is 650px, 630px on tablet and automatic on mobile; screens from 1500px use 700px.

Section spacing is 104px desktop and 66px mobile. Catalog and kit grids use three columns, with respective 22px and 18px gaps; they stack on mobile. Formula and FAQ use asymmetric two-column compositions and also stack. The mobile product stage remains 470px tall. The desktop navigation links hide at 760px while account/cart remain available. Anchor sections reserve 105px for the sticky header.

## Elevation & Depth

Depth comes mainly from tonal separation, thin borders and the realtime product lighting. The product stage has a restrained radial lime halo, not a page-wide gradient. Benefit panels use a very faint white gradient and 8px backdrop blur. The sticky header uses 16px blur. The cart overlay uses black at 60% with 2px blur; its drawer shadow is `-10px 0 30px rgba(0, 0, 0, 0.5)`. Primary button hover shadows are explicitly removed by the final global override.

## Shapes

Controls are compact rounded rectangles: chips 4px, primary CTAs 6px and shared inputs 8px. Product images and kit cards use 10px; benefit and formula panels use 12px. Circular dots indicate product or live-scene context, not general container styling. The recommended kit's lime strip joins the card with squared upper card corners.

## Components

- **Primary CTA:** lime with dark text, 52px minimum height, 15px 22px padding and a 32px content gap. Hover brightens and lifts 2px. Kit buttons adapt to full width and 46px minimum height.
- **Secondary CTA:** transparent with a muted outline; hover uses a dark green surface. Keep it visually subordinate to the primary CTA.
- **Input and catalog search:** shared fields have an 8px radius, dark fill and lime focus treatment. Catalog search is the compact underline variant with a borderless 12px input.
- **Category chips:** outlined neutral buttons; the selected category has a lime fill and dark text. Do not communicate selected state through color alone in markup.
- **Navigation:** sticky dark translucent header, wordmark with lime detail, small links and outlined cart control. Cart opens a 400px drawer capped to viewport width.
- **Product and kit cards:** product imagery carries the emphasis, with unboxed text below. Kits use restrained outlines and one highlighted recommendation. Quantity prices derive from live catalog prices.
- **Product studio:** realtime Three.js geometry, canvas label, drag rotation, bounded zoom and reset. Keyboard left/right rotate, plus/minus zoom and 0 resets. Rendering pauses offscreen/when hidden; reduced motion disables damping. A local image fallback covers unavailable WebGL or context loss. The sidecar does not pretend to render this WebGL scene as a static HTML primitive.
- **Disclosure and evidence:** formula/FAQ disclosures expose supporting information. The review region is an honest pending state, not a testimonial. No verified reviews, laboratory documents or full ingredient label were supplied. Preserve this distinction when extending content.

Global keyboard focus is a 2px lime outline with 5px offset. Inputs also have a subtle lime focus ring. Home transitions are removed for reduced motion; disabled controls lower opacity to 0.45 and prevent hover transforms. The sidecar snippets preserve visual states and use static sample content, not a second commerce implementation.

## Do's and Don'ts

- Do preserve Portuguese storefront language and clear product identity.
- Do use actual API prices and visibly label any offline preview with purchasing disabled.
- Do keep the conceptual packaging disclosure visible near the 3D scene.
- Do preserve search, category filters, cart, account routes, focus indicators and reduced-motion behavior.
- Don't invent verified testimonials, lab reports, ingredient claims, scarcity or free-shipping benefits.
- Don't treat conceptual packaging as the final ingredient label.
- Don't replace the current restrained studio palette with unrelated accent families or decorative UI gradients.
- Don't imply that the demonstration checkout processes payment.
