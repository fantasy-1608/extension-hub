---
name: Trung Anh Extension Hub (Lucian Precision Utility)
colors:
  primary: "#0F172A"
  secondary: "#4E5D73"
  tertiary: "#0369A1"
  neutral: "#F4F6F9"
  surface: "#FFFFFF"
  dark-page: "#080B12"
  dark-surface: "#111622"
  dark-ink: "#F1F5F9"
  mint: "#047857"
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.25rem
    fontWeight: "800"
    lineHeight: "1.1"
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: "800"
    lineHeight: "1.2"
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: "500"
    lineHeight: "1.6"
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: "600"
rounded:
  sm: 10px
  md: 16px
  lg: 24px
  pill: 999px
spacing:
  xs: 6px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 64px
---

## Overview

Precision Clinical & Personal Tooling Portal built on the Lucian UX/UI interactive token and motion system. Replaces generic purple-glow glassmorphism with crisp mineral surfaces, tactile spring physics (`cubic-bezier(0.34, 1.45, 0.64, 1)`), circular-reveal theme switching, and one-click Web Store / clipboard access for hospital workstations and personal browsers.

## Colors

The color system pairs cool mineral neutrals with a single locked Ocean Sky accent (`#0369A1` in Light, `#38BDF8` in Dark) mapped directly to Lucian `--ux-*` variables:

- **Primary (`#0F172A` / `#F1F5F9`):** High-contrast slate ink passing WCAG AA across all surfaces.
- **Secondary (`#4E5D73` / `#94A3B8`):** Supporting descriptions, metadata, and keyboard hints.
- **Tertiary (`#0369A1` / `#38BDF8`):** Singular interactive accent for active tabs, focus rings, progress bars, and highlights.
- **Neutral (`#F4F6F9` / `#080B12`):** Cool mineral canvas in Light mode and deep obsidian slate in Dark mode.
- **Mint (`#047857` / `#34D399`):** Tactile confirmation state for clipboard copy, checkmarks, and verified privacy badges.

## Typography

- **Display & UI (`Plus Jakarta Sans`):** Clean geometric sans-serif with complete Vietnamese diacritic clarity, tight headline tracking (`-0.035em`), and balanced line wrapping.
- **Shortcuts & Metadata (`JetBrains Mono`):** Used strictly for keyboard hints (`⌘K`, `ESC`, `↑↓`) and version tags.

## Layout

- **Split 50/50 Hero (`<= 100dvh`):** Left-aligned value proposition (max 4 stacked elements) paired with an auto-advancing interactive Lucian preview deck on the right.
- **Filterable Extension Directory:** Sliding pill category tabs above 3 spotlight-tilt desktop extension cards with clear browser compatibility footer and one-click Web Store / copy-link actions.
- **Asymmetric Trust & Quick-Start Split:** 2-column composition pairing tap-to-verify privacy cards on the left with a single-open install FAQ accordion on the right.

## Elevation & Depth

- Hairline `1px` borders (`--ux-line`) rather than heavy drop shadows or blurry purple orbs.
- Cursor-tracked radial border spotlight on extension cards (`.u050`).

## Shapes

- Page cards: `24px`
- Interactive inner panels: `16px`
- Primary CTAs, category filter tabs, and status pills: `999px`

## Components

- `#212` Pinned top glass header with reading progress bar
- `#219` Circular-reveal Light/Dark mode toggle
- `#046` Command palette (`⌘K`) for instant install & link copy
- `#216` + `#226` + `#002` Staggered word-reveal hero with subtle grid-beam canvas & magnetic CTA
- `#213` Auto-advancing interactive extension preview tabs
- `#039` + `#050` + `#008` Sliding pill filter, spotlight-tilt extension cards, and check-morph copy button
- `#243` + `#044` Tap-to-verify Zero-PHI security badges & smooth grid-row install accordion
- `#070` + `#076` Stacking swipeable toasts & gliding tooltips (`300ms` enter / `0ms` instant dismiss)

## Do's and Don'ts

- **Do** keep every primary button on a single line with WCAG AA contrast in both Light and Dark themes.
- **Do** enforce `300ms` hover delay and `0ms` instant dismissal on leave, click, or scroll for all tooltips.
- **Don't** use AI-purple background blobs or warm-beige/brass palettes.
- **Don't** leak technical implementation notes or library IDs into visible UI copy.
