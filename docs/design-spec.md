# Landing page v1: design spec

Owner: designer · For: programmer · Date: 2026-10-20 · Requirements: `docs/landing-v1-spec.md`

The page is part of the Faust Studio brand, not a separate product brand. All studio facts come from
fauststudio.net (checked 2026-10-20). All tool facts come from the autotuner at commit `e255279`.

---

## 0. Direction in one paragraph

fauststudio.net is black and cream with rust-red bands. Its type is Futura/DIN-style, it has a
constructivist logo, and its photos are warm (wood, brick, red leather, vintage gear). We keep those parts:
the same cream, ink and rust, a geometric sans close to Futura, square corners and hard rules. The page is
light (cream) so the hero box reads clearly. Black is used for the studio section and the footer, where the
photos are. There are no gradients and no shadows. Borders and 2 px ink rules do the structural work.

Where `webdesign.md` disagrees, the Faust Studio site wins. The Coolors vintage palette and the serif font
options are dropped.

---

## 1. Design tokens

### 1.1 Colors: light theme (required)

| Token | Hex | Source | Use |
|---|---|---|---|
| `--paper` | `#FFFDF4` | Faust cream | Page background |
| `--paper-2` | `#F3EFE2` | derived | Alternate sections, cards, hero box |
| `--ink` | `#151515` | Faust | Body text, headings, focus ring |
| `--ink-2` | `#403F3D` | Faust | Secondary text |
| `--ink-3` | `#6B6A65` | Faust `#807F7A`, darkened for AA | Captions, meta, disabled icons |
| `--rust` | `#BF3C19` | Faust accent | Primary button, eyebrows, link underline |
| `--rust-press` | `#9E3014` | derived | Primary button hover/active |
| `--rust-tint` | `#FBEDE6` | derived | Hero box hover background |
| `--line` | `#BFBEB7` | Faust | Decorative dividers only (not control borders) |
| `--line-strong` | `#807F7A` | Faust | Control/box borders (≥3:1) |

Dark bands (studio section and footer, in both themes):

| Token | Hex | Use |
|---|---|---|
| `--night` | `#151515` | Band background |
| `--night-2` | `#262523` | Cards/placeholders on night |
| `--night-line` | `#6E6D66` | Borders on night (≥3:1) |
| `--mist` | `#BFBEB7` | Secondary text on night |
| `--ember` | `#E5683F` | Rust for *text* on night (eyebrows, link underline). `--rust` fails on black as text. |

Text keeps `--paper` on night. The primary button stays `--rust` with `--paper` text on dark bands.

**Contrast (WCAG 2.x, computed):**

| Pair | Ratio | Passes |
|---|---|---|
| ink / paper | 17.9 | AA, AAA |
| ink / paper-2 | 15.9 | AA, AAA |
| ink-2 / paper | 10.3 | AA, AAA |
| ink-3 / paper | 5.3 | AA |
| ink-3 / paper-2 | 4.7 | AA |
| rust / paper (eyebrow text) | 5.3 | AA |
| rust / paper-2 | 4.7 | AA |
| paper / rust (button label) | 5.3 | AA |
| paper / rust-press | 7.1 | AA, AAA |
| ink / rust-tint | 16.0 | AA, AAA |
| line-strong / paper (box border, UI 3:1) | 3.9 | AA non-text |
| line-strong / paper-2 | 3.5 | AA non-text |
| paper / night | 17.9 | AA, AAA |
| mist / night | 9.8 | AA, AAA |
| ember / night | 5.6 | AA |
| ember / night-2 | 4.7 | AA |
| rust button / night (component edge) | 3.4 | AA non-text |
| night-line / night | 3.5 | AA non-text |
| ink-2 / paper-2 (FAQ answers) | 9.1 | AA, AAA |
| ink-3 / rust-tint (box meta on hover) | 4.7 | AA |
| mist / night-2 (placeholder labels on night) | 8.2 | AA, AAA |

Do not use: `--rust` as text on `--night` (3.4), `#807F7A` as text on paper (3.9), or `--line` for anything
that has to be seen to be used (1.8).

### 1.2 Colors: dark theme (optional, can skip in v1)

If you build it, use `prefers-color-scheme: dark`. It is Faust's own scheme: `--paper` → `#151515`,
`--paper-2` → `#262523`, `--ink` → `#FFFDF4`, `--ink-2` → `#BFBEB7`, `--ink-3` → `#BFBEB7`,
`--rust` (as text) → `#E5683F`, `--line-strong` → `#6E6D66`, `--rust-tint` → `#2E1A13`. The button stays
`#BF3C19` with `#FFFDF4` text. The focus ring becomes `#FFFDF4`. The dark bands look the same in both
themes; that's fine.

### 1.3 Type

| Token | Font | Size (mobile → desktop) | Line height | Weight | Notes |
|---|---|---|---|---|---|
| `--text-display` | Jost | `clamp(2.5rem, 1.6rem + 4vw, 4.5rem)` (40→72) | 1.05 | 600 | Hero h1, `letter-spacing: -0.01em` |
| `--text-h2` | Jost | `clamp(2rem, 1.5rem + 2vw, 3rem)` (32→48) | 1.1 | 600 | Section titles |
| `--text-h3` | Jost | `1.375rem` (22) | 1.25 | 600 | Step / card titles, FAQ questions |
| `--text-lead` | Jost | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` (18→22) | 1.5 | 500 | Intro line under h1/h2 |
| `--text-body` | Jost | `1.0625rem` (17) | 1.6 | 500 | Paragraphs, FAQ answers |
| `--text-small` | Jost | `0.9375rem` (15) | 1.5 | 500 | Meta, captions, footer |
| `--text-label` | Barlow Semi Condensed | `0.8125rem` (13) | 1.2 | 600 | UPPERCASE, `letter-spacing: 0.08em`: eyebrows, step numbers, player labels |
| `--text-stat` | Jost | `clamp(2rem, 1.6rem + 1.5vw, 2.75rem)` | 1 | 600 | Studio facts numbers, `font-variant-numeric: tabular-nums` |

Weights (2026-10-20, for a sharper body text): all running text (body, lead, small, FAQ answers, footer) is
**500**. Anything that was 500 to stand out from the body moves to **600**: h3, stats, FAQ questions and the
hero drop message. h1/h2 and buttons stay 600; size carries their hierarchy. Barlow labels stay 600, and the
Russo One wordmark stays 400. Sizes are unchanged. Don't use Jost `ss01` (it isn't in the Fontsource
subsets). Weight doesn't change WCAG contrast, so the §1.1 ratios still hold.

Paragraphs have `max-width: 65ch`. Use sentence case everywhere except `--text-label`. Times in the player
use `tabular-nums`.

### 1.4 Spacing (4 px base)

`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 ·
`--space-7` 48 · `--space-8` 64 · `--space-9` 96 · `--space-10` 128

- Container: `max-width: 1120px`, centered. Side gutter is 16 px below 640, 24 px at 640+, and 32 px at 1024+.
- Section vertical padding: `--space-8` (64) on mobile, `--space-9` (96) at ≥1024.
- Eyebrow → h2: `--space-3`. h2 → lead: `--space-4`. Lead → content: `--space-7`.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`.

### 1.5 Radii, borders, motion, focus

- Radii: `--radius-sm: 2px` (buttons), `--radius-md: 4px` (cards, hero box, player), and
  `--radius-full: 999px` (round play buttons only). Faust is square-edged, so use nothing larger.
- Rules: `--rule: 2px solid var(--ink)` above each step and as the top edge of the player.
- Brand bar: none. The 6 px `--rust` bar above the header was removed (user decision, 2026-10-20).
- Motion: color, border and background transitions are `150ms ease`. Card image hover is
  `transform: scale(1.02)` over 300 ms. Under `prefers-reduced-motion: reduce`, drop all transforms.
- Focus: `:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }`. On dark bands use
  `--paper`. Never remove the outline without a replacement.
- Minimum touch target: 44 × 44 px.

---

## 2. Fonts

| Font | Role | Why | Load |
|---|---|---|---|
| **Jost** (OFL) | Headings, body, buttons | Open-source Futura revival, originally released as "Renner*". Faust sets nearly all its text in Futura. **Body text uses 500 (Jost "Medium")**, the open equivalent of Architype Renner Medium, which the user asked for. Renner itself is commercial (Monotype), and its language list doesn't include Czech. | `@fontsource-variable/jost` (variable wght axis; uses 500 and 600) |
| **Barlow Semi Condensed** (OFL) | `--text-label` only | DIN-like. Faust uses DIN Next for its technical lists. | `@fontsource/barlow-semi-condensed/600.css` |

- **Self-host via Fontsource. Do not link fonts.googleapis.com.** Faust is in the EU, and German courts have
  held that hotlinking Google Fonts leaks visitor IPs (GDPR). Self-hosting avoids the question.
- Both fonts include `latin-ext`, so Czech diacritics (ě š č ř ž ů ň ť ď) are covered. Check this on the CS
  build.
- Fallback stacks: `Jost, "Futura", "Century Gothic", system-ui, sans-serif` and
  `"Barlow Semi Condensed", "DIN Alternate", "Arial Narrow", sans-serif`.
- Don't imitate the Faust logo with a font. Use the real logo file (see §5).

Icons: Lucide, stroke 2, 24 px (48 px in the hero box). Use `aria-hidden="true"` on any icon next to a text
label.

---

## 3. Components

### 3.1 Buttons and links

| Variant | Spec |
|---|---|
| Primary | `--rust` bg, `--paper` text, Jost 600 17 px, height 52 px, padding 0 28 px, `--radius-sm`. Hover/active: `--rust-press`. Active: `translateY(1px)`. |
| Secondary | Transparent, 2 px `--ink` border, `--ink` text, same size. Hover: `--ink` bg, `--paper` text. On night: `--paper` border/text. |
| Paper (on images) | For a button over a dark image (§4.2 banner). `--paper` bg, `--ink` text, same size. Hover: `--rust` bg, `--paper` text. Active: `--rust-press` and `translateY(1px)` (no transform under reduced motion). Focus: the standard 3 px ring in `--paper`; the 3 px offset shows the dark image between the ring and the button. |
| Text link | Inherits text color. `text-decoration: underline 1px var(--rust)` (on night: `--ember`), `text-underline-offset: 3px`. Hover: thickness 2px. |
| Outbound link | Text link + Lucide `ArrowUpRight` 16 px. Opens in the **same tab**. |

Write button labels as verbs, and don't let them wrap: no fixed widths. Czech strings run 10–20% longer.

### 3.2 Header (all viewports)

Matches the fauststudio.net top banner in size and shape (researcher's measurements, 2026-10-20). Their
wordmark font is a P22 Constructivist Square *demo* copy (not licensed for embedding). **Never self-host or trace
it.** Russo One (OFL) is our stand-in. Their logo is a different file (a JPG on a white square). Ours is the A1
line art, matched to their scale approximately, as the user asked.

| | fauststudio.net | Ours, ≥640 px | Ours, <640 px (incl. 375) |
|---|---|---|---|
| Layout | 1280: emblem left, text right. Mobile: stacked, centered | Row: lockup left, `EN \| CS` right | Stacked, centered lockup. Switch pinned top-right |
| Header height | 89 px (no rust bar) | **88 px** row + 1 px border = **89 px** (no rust bar) | 12 px top, emblem, 12 px gap, text, 16 px bottom + 1 px border ≈ **129 px** (no rust bar) |
| Emblem | 57 × 57 | **56 × 56** | **64 × 64** (theirs ≈ 70 on a 375 screen) |
| Emblem → text gap | 25 px horizontal | **24 px** (`--space-5`) | **12 px** vertical (`--space-3`) |
| Text | "Faust Records", P22 Constructivist Square 400, 22 px, normal tracking, capitals from the font, #403F3D | "Faust Studio", **Russo One 400, 24.8 px** (`1.55rem`), `letter-spacing: 0.04em`, `text-transform: uppercase`, `line-height: 1`, `--ink-2` | Same font and color, **24 px** (`1.5rem`) |
| Vertical align | logo top 8, text lower | Emblem and text centered on the row | — |
| Sticky | yes | **no** (see below) | **no** |

- Russo One at 24.8 px + 0.04em matches the original's width (220 px for "FAUST RECORDS") and cap height
  (17.6 px). Differences: the original A has no crossbar, and its letters are slightly more square.
- Token: `--font-brand: 'Russo One', 'Barlow Semi Condensed', sans-serif`. Load with
  `@fontsource/russo-one/400.css` (OFL; npm 5.3.0). Use it **only** for the wordmark, in the header and footer.
- The lockup is **not a link**: the home page has no off-site first tab stop (unchanged). The emblem is `alt=""`.
  The DOM order stays skip link → lockup → switch, so the tab order is unchanged.
- <640 px: `.header-row` becomes `flex-direction: column; align-items: center` with the padding above. The switch
  is `position: absolute; top: 12px; right: -8px` inside the `position: relative` header row. The row is the
  `.container`, which already sits inside the gutter, so −8 px lines the labels up with the gutter edge. The
  wordmark gets `text-align: center`, so a two-line wrap at 200% text stays centered under the emblem.
- Emblem files: one `<img>` with `srcset` `faust-light-64.webp 1x, faust-light-128.webp 2x` and
  `width`/`height` 64. CSS sets 56 × 56 at ≥640. Generate both from the 512 px original the same way as before,
  and delete the now-unused `faust-light-44`/`-88`.
- **Brand name in one place:** move the "Faust Studio" string into `faust.ts` (`faust.brandName`) and use it in
  the header and footer. Switching to an exact match ("FAUST RECORDS", which is still the naming
  `TODO(verify)`) is then a one-line change.
- **Lockup position, ≥640 px** (user request, 2026-10-20, measured against fauststudio.net at 1280): the emblem
  sits at (70, 8) relative to the header, 10 px left of the container edge; the gap is 25 px; the wordmark
  baseline is at y = 56, so the text sits lower than the emblem's centre, as on their site. This replaces
  "centred on the row" and the 24 px gap above. Below 640 px is unchanged.
- **No rust bar** (user decision, 2026-10-20): the header has no colored strip on top at any width, like
  fauststudio.net. The desktop row grows from 82 to 88 px, so the total stays 89 px.
- **Header wordmark reads "FAUST RECORDS"** (user decision, 2026-10-20): `faust.headerBrandName`, a one-line
  switch used only by the header. The footer wordmark and all copy (meta, alt text, copyright, §5) still say
  "Faust Studio"; naming overall is still the `TODO(verify)`. At 1280 "FAUST RECORDS" is about 221 px wide.
- **Footer:** the footer wordmark uses the same `--font-brand` at 20 px, `--paper`, for consistency.

**Accessibility calls (where we differ from fauststudio.net, and why):**
- **Not sticky:** their header is pinned. At 135 px on a 375 × 667 phone it would cover about 20% of the
  screen for the whole visit, and with 200% text it would cover much more (WCAG 1.4.10 reflow risk). Ours scrolls
  away.
- **No side-by-side at 375:** emblem + text + switch need about 408 px. Stacking (as their own mobile site
  does) keeps the no-horizontal-scroll rule. Cost: the phone header grows from 71 to about 135 px. The hero box
  still starts above the fold on a 375 × 667 screen.
- **Color:** `--ink-2` #403F3D on paper is 10.3:1, the same as their desktop color. Their mobile uses near-black;
  we keep one value.
- **Tap targets:** the language buttons stay 44 × 44. At 200% text the switch must not overlap the emblem; at
  375 the emblem spans x≈155–219 and the switch starts at x≈255 or more.
- The skip link and the 3 px focus ring are unchanged.

### 3.3 Language switch

- Two `<button>`s in a group labeled "Language", showing `EN` and `CS`, with `aria-label`s "EN – English"
  and "CS – Čeština" (the name must contain the visible text: WCAG 2.5.3), and `lang="en"` / `lang="cs"`
  on each.
- The current one gets `aria-pressed="true"`, `--ink` text and a 2 px `--rust` underline. The other gets
  `--ink-3` text. Each button has a 44 × 44 hit area.
- Switching updates `<html lang>` and the text in place.
- Initial language: a stored choice wins. On a first visit, use CS if `navigator.languages` has an entry
  starting with `cs`, otherwise EN. Store the choice only when the user clicks the switch, so that the
  browser default is never treated as a choice.
- The same component goes in the footer, using the night colors.

---

## 4. Sections (in order)

Every section is a `<section aria-labelledby="…">` with one h2. The only h1 is in the hero.

Page order (2026-11-03): Header → Hero (paper) → How it works (paper, ending in the dark tool banner) →
The studio (night) → Next step (paper) → FAQ (paper-2) → **Email signup (paper, §4.8)** → Footer (night).
Before/after (§4.3) was removed 2026-10-25.

### 4.1 Hero

**Layout, desktop (≥1024):** `--paper` background, centered column, max-width 880. Padding is 96 top and 96
bottom. Order:

```
            FREE VOCAL TUNER · BY FAUST STUDIO, PRAGUE        ← label, --rust
          Tune your vocal in your browser. Free.               ← h1, centered, max 18ch
   See every note you sang, tune them in one click or by       ← lead, --ink-2, max 52ch
            hand, and download the result.

 ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
 │                       [audio-lines icon 48]                 │  ← one <a href="tool/">
 │                    ┌──────────────────────┐                 │     min-height 280
 │                    │  Try it free   →     │                 │     2px dashed --line-strong
 │                    └──────────────────────┘                 │     bg --paper-2
 │      Opens the tuner · WAV, MP3, OGG or FLAC · up to 100 MB │
 └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
          ✓ Free    ✓ No account    ✓ Your audio stays on your device
```

**The CTA box ("one big box"):**
- The whole box is **one `<a href="tool/">`** (relative to the base path). It is not a drop zone and has no
  `<input type=file>`.
- Inside: icon (`AudioLines`, `--rust`, aria-hidden), then a `<span>` styled as the primary button (not a
  nested `<button>`), then the meta line (`--text-small`, `--ink-3`).
- Box: `--paper-2` background, 2 px dashed `--line-strong` border, `--radius-md`, padding 48 px/24 px. The
  content is centered with a 16 px gap.
- **Hover:** solid `--rust` border, `--rust-tint` background, and the inner button turns `--rust-press`.
- **Focus-visible:** 3 px `--ink` outline, 4 px offset, around the whole box. Same color changes as hover.
- **Active:** the inner button moves down 1 px.
- Opens in the same tab. The accessible name is its text content ("Try it free. Opens the tuner…"), which is
  fine.
- **Drag-and-drop guard (should):** people will drag files onto a box that looks like this. By default
  the browser then opens the file and leaves the page. On the box, `preventDefault()` on `dragover` and
  `drop`. While dragging, show the hover style. On drop, show this message under the box in an
  `aria-live="polite"` region: **"Almost: open the tuner, then drop your file there."** Don't navigate
  automatically.

**Trust line under the box:** three inline items with Lucide `Check` 16 px in `--rust`, `--text-small`,
`--ink-2`, 24 px gap. They wrap freely.

**Mobile (375):** padding 48 top/64 bottom, 16 px gutters. The h1 is 40 px and still centered. The box has
min-height 220 and padding 32/16, and its inner button stretches to the box width. Trust items stack in a
centered column with an 8 px gap. Under the trust line, **visible only below 768 px**:
"Editing works best on a laptop or desktop." (`--text-small`, `--ink-3`). The tool's editor is
desktop-first.

### 4.2 How it works

**Layout:** `--paper` background. Left-aligned eyebrow, h2 and lead, then a 4-column grid (gap 32) at ≥1024,
2×2 at 640–1023, and 1 column below 640 (gap 32). Each step has:
- A 2 px `--ink` rule on top, then 16 px of space.
- A row with the label `01`–`04` in `--rust` and the Lucide icon (24 px, `--ink`) aligned right.
- The h3, then a body paragraph in `--ink-2`.

Use an `<ol>` so screen readers announce the order. The visual numbers are `aria-hidden`.

Icons: `Upload`, `AudioLines`, `WandSparkles`, `Download`. Step 03 is the fastest "wow", so it leads with
Tune Up. Drag-to-fix is the second half of the same step.

**Tool banner (2026-10-25):** 48 px under the grid, a screenshot of the tuner's pitch editor (A8) with the
"Open the tuner" button (→ `tool/`) centred on it. It's the last thing in the section, so the section's own
bottom padding (96, or 64 below 1024) is the cream gap before the night Studio band. That join needs nothing
extra: 48 px above the banner vs 96/64 below groups it with the steps, and a contained, rounded image above
a full-bleed band reads as two different things (checked at 1440 and 375, 2026-10-25).

```
 ┌──────────────────────────────────────────────────────────────┐  container width, --radius-md,
 │ C6 ▒ ░░     ░      ░░     ░            ░                     │  --night behind the image,
 │ B5 ▒   ░░       ┌──────────────────┐        ░░    ░          │  image dimmed to 60%
 │ A5 ▒ ░    ░     │  Open the tuner  │   ░          ░░         │  ← .btn .btn-paper, centred
 │ G5 ▒   ░░       └──────────────────┘      ░            ░     │
 │ D5 ▒  ░      ░░          ░                  ░                │
 └──────────────────────────────────────────────────────────────┘
```

- **Asset:** `howto.png` cropped to rows 0–596 (2956 × 597). This removes the tool's status bar ("41 of 73
  notes changed" and the blue "Export ▾" button), which would read as a second, fake button. Export it as
  WebP at 1120 and 2240 px wide (`srcset`; cwebp rounds them to 1120 × 227 and 2240 × 453), with the
  `<img>` `width`/`height` matching the real files, lazy loaded.
- **Box:** `position: relative`, flex, centred both ways; `width: 100%`, `aspect-ratio: 2956 / 597`,
  `min-height: 200px` (without the explicit width, aspect-ratio turns the min-height into a ~990 px min-width
  and the page scrolls sideways at 375),
  padding 16, `--radius-md`, `--night` background. No border: the dark image against `--paper` defines its own
  edge. No `overflow: hidden` (it would turn off the aspect-ratio box's content-size minimum).
- **Image:** `position: absolute; inset: 0`, `width/height: 100%`, `object-fit: cover`,
  `object-position: left`, `border-radius: inherit`, `filter: brightness(0.6)`. At ≥ ~1050 px viewports the
  box matches the image ratio, so nothing is cropped. Below that, `min-height` wins and the image is cropped
  from the right, so it always starts at the piano keys and the first seconds of notes. The image stays at
  roughly the same scale at every width (about 0.33–0.38).
- **Button:** `.btn .btn-paper` (§3.1), `position: relative` so it paints above the image. Only the button is
  a link. The image is not clickable, so there's one link and one tab stop. Inside the banner,
  `--focus: var(--paper)`.
- **Text zoom / long labels:** inside the banner the button may wrap rather than overflow:
  `white-space: normal; text-align: center; line-height: 1.2; padding-block: var(--space-2)`. At the default
  size it never wraps and looks identical to §3.1 (the 52 px min-height dominates).
- **Mobile (375):** 343 × 200 box. The image keeps its left edge (piano keys) and is cropped on the right. The button keeps its natural width (it doesn't
  stretch like the hero button), with about 74 px of screenshot above and below it.
- **Alt text:** in `copy/en.ts` and `cs.ts` (`TODO(cs-review)`). Describe the editor (notes shown on a
  piano-roll grid), not "screenshot of", and don't say "Auto-Tune".

### 4.3 Before / after (removed)

> **Removed from v1 by the user, 2026-10-25; parked as a v2 idea** (a working player once real, consented
> audio exists, asset A6). The design below is kept so it can be restored. Nothing in it applies to v1.

**Layout:** `--paper-2` section background. The eyebrow, h2 and lead are left-aligned. Then one player card,
max-width 760: `--paper` background, 2 px `--ink` top rule, 1px `--line-strong` on the other three sides,
`--radius-md` on the bottom corners, padding 24.

```
 BEFORE      [▶]  Raw take                ▁▃▅▇▅▃▂▁▃▆▇▆▃▁▂▄▆▅▃   0:00 / 0:18
 ───────────────────────────────────────────────────────────────────────────
 AFTER       [▶]  Tuned in the tuner      ▁▃▅▇▅▃▂▁▃▆▇▆▃▁▂▄▆▅▃   0:00 / 0:18
```

- Each row has a label (`--text-label`, `--ink-2`, 64 px wide), a round 48 px play button (`--ink` bg,
  `--paper` icon) and a track title (`--text-body`) in a shared `minmax(0, 11rem)` column, so both waveforms start at the
  same x. Then comes the waveform: a static SVG of about 48 bars,
  1 px wide and spread evenly across the column, `--line-strong`. Played bars fill `--rust`. Last is the time (`--text-small`,
  tabular). Rows are separated by a 1 px `--line` divider.
- Behavior: one native `<audio>` per row, without built-in controls. Playing one pauses the other. The button
  toggles Play/Pause, changing the icon and `aria-label` ("Play before sample" / "Pause before sample").
  The waveform is decorative (`aria-hidden`), so there is no seeking in v1.
- **Placeholder state (ships in v1):** there's no audio yet (`TODO(audio)` in source). Buttons are
  `disabled` with a `--line-strong` border, transparent background and `--ink-3` icon. The waveform uses
  `--line`, and the time reads "–:––". A tag sits in the card's top-right corner: **"Samples coming soon"**
  (`--text-label`, `--ink-2`, 1 px `--line-strong` border, padding 4/8).
- Below the card, 24 px down, there's a text link: "Try it with your own vocal" + `ArrowRight` → `tool/`.

**Mobile:** in each row, the label, play button and title share the first line. The waveform takes the full
width on the second line, and the time sits right-aligned on the third. Card padding is 16.

### 4.4 The studio (dark band)

**Layout, desktop:** `--night` background, `--paper` text, and a 2-column grid of 6 and 6 columns with a
64 px gap, vertically centered.
- Left: the building illustration (A1, `faust-dark`, white line art), 1:1, `width: min(100%, 360px)`,
  centered in its column. It is **bottom-anchored**: `align-self: end` plus a negative bottom margin equal to
  the section's bottom padding (`calc(-1 * var(--space-9))` at ≥1024), so the building's cut-off base sits
  on the band's bottom edge and the building appears to rise out of it. This matches the art's street-level
  view. No radius and no border.
- Right: eyebrow (`--ember`), h2, two body paragraphs (`--paper`, second one `--mist`).
- Below them, a 3-up stats row: number in `--text-stat`, label in `--text-label` `--mist`, separated by
  1 px `--night-line` vertical rules.
- Below the stats, a "Recorded here" line, then two outbound links.

**Below 1024 (one column):** the text comes first and the illustration last, centered at `width: 240px` with
48 px above it. It's bottom-anchored the same way (`margin-bottom: calc(-1 * var(--space-8))`). Stats become a 1-column list: each row is
the number on the left and the label on the right, divided by a 1 px `--night-line` line.

### 4.5 Next step

**Layout:** `--paper` background. Left-aligned eyebrow, h2 and lead, then three cards in a grid
(`repeat(auto-fit, minmax(280px, 1fr))`, gap 24): 3 columns at ≥1024, 1 column at 375. Below the cards is a
closing row with a primary button and a text link.

The cards are modeled on Abbey Road's rooms pages. Each one has:
- A 4:3 image on top.
- Padding 24, with the h3, a body paragraph (`--ink-2`) and a meta line (`--text-small`, `--ink-3`,
  tabular numbers).
- An outbound link at the bottom.

Card style: `--paper` background, 1px `--line-strong` border, `--radius-md`, with the image clipped to the
top corners.

- **One link per card:** the bottom "See the Blue Studio ↗" line is the card's only `<a>`, and its `::after`
  overlay covers the whole card. The h3 is plain text. (The link text makes sense out of context; "Blue
  Studio" alone wouldn't.)
- Hover: border turns `--ink` and the image scales to 1.02. Focus: `.card:has(.card-link:focus-visible)` draws
  the 3 px `--ink` outline (keyboard only, not on click). The link's own outline is suppressed only inside the card.

Closing row (48 px below the cards, left-aligned, wrapping): primary button **"Book a session"** →
`https://www.fauststudio.net/contact`, then the text link **"See all rates"** →
`https://www.fauststudio.net/rates`.

### 4.6 FAQ

**Layout:** `--paper-2` background. Left-aligned h2. The list has max-width 760 and uses **native
`<details>/<summary>`** (keyboard and screen-reader support with no JS).
- Each item has a 1 px `--line-strong` top border; the last item also gets a bottom border.
- Summary: min-height 64, padding 20/0, h3 styling, with a Lucide `Plus` icon (24, `--rust`) on the right.
  It rotates 45° when open (no rotation under reduced motion). Hide the default marker.
- Answer: `--text-body`, `--ink-2`, padding-bottom 24, max-width 65ch.
- All items start closed. Mobile is the same layout with 16 px gutters.

### 4.7 Footer (dark band)

**Layout:** `--night` background, `--paper`/`--mist` text, padding 64 top/32 bottom. At ≥768 it's a
3-column grid; at 375 it's 1 column with a 32 px gap.
1. The building emblem (A1, `faust-dark`) at **96 × 96 px**, `alt=""`, not a link. Then 16 px of space, the
   wordmark text "Faust Studio" in `--paper` (not a link), the one-line description in `--mist`, and the
   outbound link "fauststudio.net ↗" → `https://www.fauststudio.net/`. At 375 px it's the same size,
   left-aligned.
2. Contact: the "Contact and booking" link, email (`mailto:`), phone (`tel:`) and address.
3. Language switch (night variant), then Instagram and Facebook links.

Bottom row: 1 px `--night-line` top border, 24 px above. Copyright in `--text-small` `--mist`.

### 4.8 Email signup (2026-11-03)

Requirements: `docs/email-capture-spec.md` (acceptance criteria 1–8). The form POSTs to the Velo endpoint in
`site.config.json`; this section covers only what the visitor sees. Signup is **optional** and secondary: the
hero CTA → tool stays the primary action, and nothing here gates the tool.

**Placement: its own section, between the FAQ and the footer.** In `App.tsx`: Header, Hero, HowItWorks, Studio,
NextStep, Faq, **Signup**, Footer. Why there:
- It is the last ask on the page. A visitor who has scrolled past the tool, the studio and the FAQ without
  acting is the one who wants a "keep me posted" option, and that is where people expect a newsletter form.
  Higher up, it would compete with the hero CTA and with "Book a session".
- Band rhythm: FAQ (`--paper-2`) → signup (`--paper`) → footer (`--night`). Each band keeps a visible edge
  without extra rules.
- Decided against the **footer**: the night band is a utility zone (contact, language, social) and a form
  there would double its height at 375 and need new error/disabled colours on night. Against **inside Next
  step**: that section already has two calls to action, and a third would dilute "Book a session". Against a
  **popup/modal** of any kind: never.

**Layout, desktop (≥1024):** `--paper` section (standard padding). A 2-column grid, `minmax(0, 5fr)
minmax(0, 7fr)`, gap 64, `align-items: start`. Left: the standard section head (eyebrow, h2, lead) with its
bottom margin set to 0 inside the grid. Right: the form, `max-width: 560px` (the cap applies at every width,
so the input never runs the full container between 640 and 1023; review 2026-11-03).

```
 STAY IN TOUCH                          EMAIL                                   ← .label, --ink-2
 Hear from the studio                   ┌────────────────────────────────────┐
 Leave your email for news about        │                                    │  52 px, 2 px --line-strong
 studio sessions, courses and the       └────────────────────────────────────┘
 tuner. The tuner stays free, with      [ ] Faust Studio may email me about studio sessions, courses and
 or without it.                             tuner news, and I can unsubscribe at any time. Privacy policy ↗
                                        ┌─────────────┐
                                        │  Subscribe  │                          ← .btn .btn-primary
                                        └─────────────┘
                                        (status line appears here)
```

**Below 1024:** one column, section head first (its normal 48 px bottom margin), then the form at full
container width. **At 375:** the input and the button stretch to the container width (the button like the
hero's, `white-space: normal` so a long Czech label or 200% text wraps instead of overflowing, as in the §4.2
banner). Nothing has a fixed width, so there is no horizontal scroll at 375, including at 200% text.

**Form structure (DOM order = tab order):**
1. `<label for="signup-email">` Email, styled `.label` in `--ink-2`, 8 px above the input. A real label,
   not a placeholder. No placeholder text at all.
2. `<input type="email" id="signup-email" name="email" autocomplete="email" inputmode="email"
   spellcheck="false">`. Height 52 (matches the button), `width: 100%`, padding 0 16, 2 px solid
   `--line-strong` border, `--radius-sm`, `--paper` background, Jost 500 17 px, `--ink` text. Hover: border
   `--ink`. Focus: the global 3 px `--focus` ring, border unchanged. Invalid (`aria-invalid="true"`): border
   `--rust`.
3. Field error, shown only when needed, 8 px under the input: Lucide `CircleAlert` 20 in `--rust`
   (aria-hidden) + the message in `--text-small` `--rust`. Its `id` is in the input's `aria-describedby`.
4. Consent row, 24 px below: a native `<input type="checkbox" id="signup-consent">` (20 × 20,
   `accent-color: var(--rust)`, unchecked by default) in a `20px 1fr` grid with a 12 px gap, and the consent
   sentence as its `<label>` in `--text-small` `--ink-2`. The row has `padding-block: 12px`, so the tap target
   is ≥ 44 px tall and clicking anywhere on the sentence toggles the box. The **Privacy policy ↗** link is an
   Outbound link placed *after* the `</label>`, inline with the sentence, not inside it (a link inside a label
   toggles the box in some browsers and gives the checkbox a confusing name). The link renders only when
   `faust.privacy` is set; until Faust sends the URL it is an empty string marked `TODO(verify)`, and nothing
   is rendered. A "Privacy policy" link that goes to the wrong page under a consent box is worse than none.
   **Update 2026-11-04 (privacy page, §4.9):** the link now points at our own policy page (`PRIVACY_URL`)
   and is always rendered; `faust.privacy` keeps meaning Faust's own policy and the form no longer reads it.
   It is a plain `.link`, **not** `Outbound`: the ↗ icon means "another site" (§3.1) and this one is ours.
   It opens in the **same tab**, like every link on the site (`Outbound` already does; there is no
   `target="_blank"` anywhere to match). Cost: the typed email isn't kept if the visitor opens the policy
   mid-form (React state; Back doesn't restore it). Accepted: it's one field, most people read the policy
   before typing, and Back returns to the form's scroll position. A new tab would need an "opens in a new
   tab" announcement and break Back for everyone, to save one field for a few.
5. Honeypot: an extra text field named `website`, in a wrapper that is `aria-hidden="true"`, with
   `tabindex="-1"` and `autocomplete="off"`, moved off-screen (not `display: none`, which some bots skip).
   Invisible to people and to assistive tech. Sent as `"website"` in the JSON; the server rejects any value.
6. Submit button, 24 px below the consent row: `<button type="submit" class="btn btn-primary">`. Active:
   `translateY(1px)` like `a.btn-primary` (none under reduced motion).
7. Status line, 16 px under the button, only when there is something to say (see states).

Plus one **visually-hidden announcer**: a `<p role="status" aria-live="polite">` that lives in the section
*outside* the `<form>`, mounted for the whole life of the section, so it survives the swap to the success view
and screen readers register it before it ever changes. The programmer adds an `.sr-only` utility (there isn't
one yet). Its text per state is in the table below. The visible messages are plain text; only this element
announces.

**Submit gating (criterion 1):** the button is inactive until the email is valid and the box is ticked.
Implement with `aria-disabled="true"`, **not** the `disabled` attribute, so it stays in the tab order and a
keyboard or screen-reader user can find out why nothing happens: activating it while incomplete (click, Enter
on the button, or Enter in the email field) shows the *incomplete* hint on the status line, announces it, and
moves focus to the first incomplete control. The form has `noValidate`; we show our own messages, never the
browser's bubbles. Email validity = non-empty and the browser's `type="email"` check. Validate the email on
blur (only if non-empty) and on an attempted submit, never while typing.

**Inactive button look:** `--paper-2` background, `--ink-3` text (4.7:1, still readable), 2 px `--line-strong`
border, `cursor: not-allowed`. It turns `--rust`/`--paper` the moment both inputs are valid, which is the
visible "you can go" signal.

**States:**

| State | What the visitor sees | Button | Announcer (`role="status"`) text |
|---|---|---|---|
| Idle | The form as drawn. No messages. | Inactive look until valid, then primary | (empty) |
| Incomplete submit attempt | Status line: *Enter your email and tick the box first.* Focus moves to the first incomplete control. | Inactive | Enter your email and tick the box first. |
| Invalid email (on blur / attempt) | Field error under the input: *Enter an email address like name@example.com.* Border `--rust`, `aria-invalid`. Clears as soon as the value becomes valid. | Inactive | (the field error is read via `aria-describedby`; no announcement) |
| Submitting | Fields unchanged, no spinner. Form `aria-busy="true"`. Further submits are ignored. If no response in 10 s, treat as a generic error (so the button never sticks on "Sending…"). | Label **Sending…**, `aria-disabled`, `--rust-press` background, `--paper` text (7.1:1) | Sending… |
| Success | The `<form>` is replaced by a confirmation block in the same column: Lucide `MailCheck` 24 in `--rust` (aria-hidden) beside *Thanks, you're on the list.* (`--text-h3`, 600) and under it *Faust Studio will email you about studio sessions, courses and tuner news.* (`--text-body`, `--ink-2`). The block has `tabindex="-1"` and receives focus, because the focused button has just been removed. After a keyboard submit it shows the global 3 px `--ink` ring (`:focus-visible`); keep it, it tells keyboard users where they landed. After a mouse click the browser shows no ring. The section head stays. | gone | Thanks, you're on the list. |
| Error, 400 | Status line (`CircleAlert` 20 `--rust` + `--text-small` `--rust`): *That email address wasn't accepted. Check it and try again.* Email and checkbox keep their values. Focus stays on the button. | Label **Try again**, primary look | That email address wasn't accepted. Check it and try again. |
| Error, anything else (500, network, CORS, timeout) | Same treatment: *Something went wrong and your email wasn't saved. Please try again.* Values kept. | Label **Try again**, primary look | Something went wrong and your email wasn't saved. Please try again. |

The announcer text is cleared when the form returns to idle (for example when the visitor edits the email
after an error). Nothing here is stored: no cookie, no localStorage, no prefill (criterion 7). The request body
uses the current UI language as `lang` and `"source": "landing"`.

**Honesty (criterion 8):** the lead says the tuner stays free with or without signup; no string says "sign up to
use", "required" or "unlock". The hero trust line ("No account") and FAQ 2 ("You can use the tuner without
signing up") stay true because signup is on the landing page and optional; their `TODO(email)` markers stay
(they still depend on the tool team's gate). The confirmation does not say "check your inbox": there is no
welcome email (email-capture spec, out of scope). The button says "Subscribe", not "Sign up", so "signing up"
keeps meaning an account in the FAQ.

**Consent text versions** (keep every version here; bump the constant whenever the sentence changes, in
either language):

| Version | EN sentence | Since |
|---|---|---|
| `2026-11-v1` | Faust Studio may email me about studio sessions, courses and tuner news, and I can unsubscribe at any time. | 2026-11-03 |
| `2026-11-v2` | Two sentences share the version; `source` says which one the person saw. **Landing form (`source: "landing"`, tick box):** Faust Studio may email me about studio sessions, courses and tuner news, and may see whether I open the emails and which links I click. I can unsubscribe at any time. **Export gate (`source: "tool"`, the Subscribe action, §4.10):** By choosing "Subscribe and export", you agree that Faust Studio may email you about studio sessions, courses and tuner news, and may see whether you open the emails and which links you click. This is optional, and you can unsubscribe at any time. | 2026-11-11 (ships now, no double opt-in) |
| *draft, not shipped: the version after v2, for when double opt-in is switched on* | Landing: same as v2. Gate: By choosing "Subscribe and export", you agree that Faust Studio may email you about studio sessions, courses and tuner news, and may see whether you open the emails and which links you click. This is optional. We'll first send one email asking you to confirm your address, and you can unsubscribe at any time. | — |

What v2 adds to both sentences: the clause "may see whether I/you open the emails and which links I/you
click". Ecomail measures opens (a pixel) and clicks (rewritten links) by default, with no documented
account-wide switch (`reports/ecomail-email-gate.md` F1), so it is part of what the person agrees to and has
to be said where they agree. The detail (time, IP address, approximate location, device) is in the privacy
policy, not here. The gate sentence is otherwise new; the landing sentence is otherwise v1. Both languages
must carry the clause.

**Update 2026-11-11 (Ecomail, no double opt-in for now; user decision, `docs/email-gate-spec.md`).** The form
now feeds Ecomail, not the Velo endpoint. A subscriber is added to the list straight away as subscribed, and
**no email is sent at signup**: Ecomail will not send anything, a confirmation email included, until Faust
has a verified sender domain. Changes to this section, everything else stands:
- **Success state: unchanged from v1.** "Thanks, you're on the list." and its body are true again and stay.
  Nothing on the form may say "check your inbox" or imply an email is on its way.
- **Honesty paragraph above:** "The confirmation does not say 'check your inbox'" stands, for the new reason
  above. The `TODO(email)` markers are reworded, see §5 "Copy review for the export gate".
- **When double opt-in is switched on later:** it is a new consent version and a new policy version. The
  drafted wording is kept: the consent row above, the success text in §5 "Draft for double opt-in".
- **Consent sentence:** the checkbox label gains the open-and-click clause (table above, §5). It is about one
  line longer at 375 px; the row's layout already wraps. This is the form's only copy change.
- No layout, state or colour change. The consent row keeps its tick box.

Send it as `consentVersion`. Suggested home: `SIGNUP_CONSENT_VERSION` in `src/faust.ts`, next to
`SIGNUP_ENDPOINT`. The Czech sentence (`TODO(cs-review)`) must say the same things (who, about what, that opens and clicks are seen (v2),
unsubscribe any time) and shares the version.

**Colour pairs used** (all already in §1.1): ink/paper, ink-2/paper (labels, consent), rust/paper (errors,
icons, eyebrow), paper/rust and paper/rust-press (button), ink-3/paper-2 (inactive button),
line-strong/paper (input and inactive-button border, 3.9:1 non-text), paper on rust for the checkbox tick.
No new tokens.

**Copy:** §5 "Email signup". Keys: `signup.*` in `copy/en.ts` / `cs.ts`.

### 4.9 Privacy policy page (2026-11-04)

Requirements: `docs/privacy-policy-spec.md` (its "Required content" list is the content contract; acceptance
criteria 1–10). This is a text page, not a new section system: it reuses the header, footer, tokens and type
scale, and adds one article style.

**URL and shell.** `<base>privacy/`, a second Vite HTML entry (no client route). DOM: `Header` as-is (not
sticky, wordmark not a link, skip link → `#main`), then `<main id="main">` holding one
`<article class="section privacy">` inside a `.container`, then `Footer` as-is. Own `<title>`
(`privacy.meta.title`) and meta description; the language switch changes the title too, like `meta.title` on
the landing page. Landing favicon. `noindex` follows `site.config.json` (programmer, criterion 8).

**Measure.** The article is left-aligned in the standard container (so the h1 lines up with the header lockup
and the footer columns) and capped at `max-width: 65ch`, the cap paragraphs already have everywhere (≈ 600 px
at 17 px Jost). Headings, lists and paragraphs share that one measure; nothing is centred. No sidebar and no
table of contents: six short sections (eight once "Who is responsible" and "Visiting this site" return) scan in
under a minute, and a ToC would be a second navigation to keep
in two languages.

**Vertical rhythm, top to bottom:**
1. **Back link** (`privacy.back`): a text link, Lucide `ArrowLeft` 16 (`aria-hidden`) before "Back to the
   tuner page", `--text-small`, `--ink-2`, the standard rust underline. `href` = the base path
   (`import.meta.env.BASE_URL`; the programmer may add a `LANDING_URL` next to `TOOL_URL`). It is the first
   thing in `main`, so it's the first tab stop after the skip link and the language switch, and it's where the
   eye lands under the header. This is the page's way home, because the header wordmark stays not-a-link
   (§3.2). 32 px below it, the head.
2. **Eyebrow** "Faust Studio · vocal tuner" (`.eyebrow`), then 12 px.
3. **h1** "Privacy policy" at the `--text-h2` size (32→48, 600), **not** `--text-display`: a legal page, not a
   hero. Then 12 px.
4. **Updated line** "Last updated 4 November 2026 · Version 2026-11-v1", `--text-small`, `--ink-2`. The date
   is copy (`privacy.updated`); the version is interpolated from `PRIVACY_POLICY_VERSION` so the copy can't
   drift from the constant. Then 24 px.
5. **Intro** paragraph (`privacy.intro`), `--text-body`, `--ink`. Then 48 px.
6. **Sections**, in the order of the spec's "Required content" list (six since 2026-11-04: "Who is
   responsible" is off until Faust names the controller, "Visiting this site" until the launch host is known; see §5). Each is a `<section>` with an
   `h2` (`id` = the section id, so `privacy/#signup` can be deep-linked later) at the **`--text-h3`** size
   (22 / 1.25 / 600): the global h2 size is for landing-page bands and would shout eight times on a text page.
   48 px above each h2, 12 px below. Inside, in copy order: paragraphs (`p + p`: 16 px), bullet lists
   (`ul` with `list-style: disc`, `padding-left: 1.4em`, `li + li`: 8 px, 16 px above and below the list) and
   standalone link lines (a `<p>` holding one link). Links to other sites (GitHub, Wix, ÚOOÚ,
   fauststudio.net) use `Outbound` (↗, same tab, §3.1); `mailto:` and our own pages use the plain `.link`.
7. **Back link again** after the last section, 48 px above, identical to item 1 (same key, same href). A
   reader who finishes at the bottom shouldn't scroll back up, and the footer has no landing link.

Below the bottom back link is the section's standard bottom padding (64 / 96), then the footer.

**Placeholders.** Unconfirmed facts render as bracketed text inline, e.g. "[Richard Mader]", with no extra
styling (no highlight, nothing to clean up later). Each is `TODO(verify)` in the copy file. Since 2026-11-04 none are
on the page: everything was filled from `reports/privacy-policy-facts.md` except the controller's name and IČO,
whose section is removed until Faust answers (§5).

**States.** None: static text, no data, so no loading, empty or error state. The language switch swaps the
text in place. If `faust.privacy` is set (Faust's own policy URL), section 2 gains one "see also" link line;
until then that line is not rendered (the same rule the consent-row link used to follow).

**Responsive.** Nothing has a fixed width; the measure shrinks with the container, so there is no horizontal
scroll at 375 px, including at 200% text size and in Czech. `overflow-wrap: anywhere` on the article so a long
placeholder or URL can't widen the page.

**Accessibility.** One h1, one h2 per section (six today), `header`/`main`/`footer` landmarks (criterion 10). Both back
links read the same and make sense out of context. Every interactive element gets the global 3 px ring.
Colour pairs: ink/paper and ink-2/paper only, plus the footer's night pairs. No new tokens.

**Footer "Privacy policy" link (both pages, criterion 2).** It goes in the **bottom row next to the
copyright**, not in the contact column: legal links belong with the copyright by convention, the contact
column stays about reaching Faust, and the 3-column grid is untouched. The row keeps its 1 px `--night-line`
top border and 24 px padding and becomes a flex row, `justify-content: space-between; flex-wrap: wrap;
gap: 8px 24px`: copyright left (`--text-small`, `--mist`, as now), "Privacy policy" link right
(`--text-small`, `--paper` text, `--ember` underline: the night text link). Below 640 px the row becomes a
column (`flex-direction: column`, both left-aligned, 8 px apart; the two items are short, so wrapping alone
would never trigger at 375). `href` = `PRIVACY_URL`. On the policy page itself the link still renders
(criterion 2) with `aria-current="page"`: a footer that changes shape per page is more confusing than a
self-link.

```
 ──────────────────────────────────────────────────────────────  1 px night-line
 © 2026 Faust Studio                                Privacy policy
```

**Consent-row link.** Updated in §4.8 item 4: plain `.link`, no ↗, same tab, always rendered.

**Policy versions** (keep every version here, like the consent sentences in §4.8). Bump
`PRIVACY_POLICY_VERSION` in `src/faust.ts` and the date in `privacy.updated` (both languages) whenever the
policy changes in substance; a typo fix doesn't bump.

| Version | Last updated | What |
|---|---|---|
| `2026-11-v1` | 2026-11-04 | First policy: this page, the tuner at `/tool/`, email signup → Wix. Facts still `TODO(verify)`. |
| `2026-11-v2` | 2026-11-11 (set to the day it ships) | Ecomail replaces Wix as processor, reached through a Cloudflare relay; **no confirmation email** (double opt-in is off until Faust has a sender domain); the export prompt in the tuner as a second place we ask; the prompt's remembered answer added to browser storage; open and click tracking inside the emails disclosed. v1 text: commit `c74d599`. |
| *draft, not shipped: the version after v2* | — | Adds the confirmation email when double opt-in is switched on. Wording kept in §5 "Draft for double opt-in". |

**Copy:** §5 "Privacy policy page". Keys: `privacy.*`, `footer.privacy`.

### 4.10 Export gate (2026-11-10)

Requirements: `docs/email-gate-spec.md` (criteria 1–8). Research: `reports/ecomail-email-gate.md` (B5 checklist).
A modal that appears over the tuner at `/tool/` when the visitor clicks the tool's **Export ▾** button and has
not answered before. It offers Faust Studio's emails and has two answers of equal weight: subscribe and export,
or export without subscribing. It is our HTML/CSS/JS injected into the Berlin team's built page; their code is
not touched. This section covers what the visitor sees. When it appears, what is stored and the transport are
the pm spec's.

**Look: our cream card, not the tool's dark UI.** Reasons:
- It says who is asking. The request comes from Faust Studio, not from the tool, and consent has to be informed
  about who will email. A card in the landing page's cream, ink and rust is recognisably the page the visitor
  came from.
- Every text pair we need already passes AA on `--paper` (§1.1). A dark variant would need new input, error and
  button colours and a fresh contrast table.
- The tool's look belongs to the Berlin team and can change with any pin bump. Matching it would make our
  overlay depend on their CSS; a self-contained card does not.
- Cream on a dimmed dark page has an unmistakable edge with no border and no shadow (§0: no shadows).

Cost: it is a visual jump inside the tool. Accepted: the jump is the point (a different party is speaking), and
it lasts one decision.

**Fonts: our self-hosted Jost, one family.** The tool page has no fonts of ours, so the gate's CSS declares its
own `@font-face` for Jost Variable (the same Fontsource `latin` and `latin-ext` woff2 files the landing page
ships, about 27 + 17 KB, served from our origin; `unicode-range` means English fetches only `latin`).
`font-display: swap`, fallback stack as `--font-sans`. So the card doesn't reflow on first open, start the load
early: call `document.fonts.load('600 17px "Jost Variable"')` when the script first sees the Export button.
Barlow Semi Condensed is **not** loaded: the gate has no eyebrow, and the email label is set in Jost instead
(below), which saves a second font for one word. No Russo One, no logo image. Nothing comes from another
company.

**Style isolation (programmer's choice of how).** The tool has global rules that would restyle our controls:
`button { background: #22252c; border; border-radius: 6px; padding }`, `button:hover`, `button.primary`,
`button:disabled { opacity: .5 }` and `button:focus-visible, input:focus-visible { outline: 2px solid #7f9cf5 }`.
None of them may reach the gate, and none of ours may reach the tool. Either a shadow root (with the
`@font-face` in the document, where it has to be) or a `faust-gate-` class namespace with explicit resets works.
Our tokens are defined on the gate's root, not on `:root`. The tool does not set a root font size, so `rem` is
16 px as on the landing page.

**Tokens.** All existing, copied into the gate's stylesheet from `src/index.css`: `--paper`, `--ink`, `--ink-2`,
`--rust`, `--rust-press`, `--line-strong`, `--radius-sm`, `--radius-md`, the spacing scale, `--font-sans`,
`--text-h3`, `--text-body`, `--text-small`. One new token:

| Token | Value | Use |
|---|---|---|
| `--scrim` | `rgb(21 21 21 / 0.7)` (`--night` at 70%) | The `<dialog>`'s `::backdrop`. No blur. |

**Element.** A native `<dialog>` opened with `showModal()`: top layer (above the tool's `z-index: 20`
downloaded screen), the page behind inert, focus trapped, Escape handled. `lang` on the dialog is the gate's
language (the tool's page is `<html lang="en">`, so Czech text needs `lang="cs"` here to be read correctly).
`aria-labelledby` = the heading, `aria-describedby` = the pitch.

**Layout (one layout at every width).** The card is centred in the viewport both ways.

```
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ← --scrim over the tool
 ░░░░  ┌────────────────────────────────────────────────┐  ░░░░
 ░░░░  │ Want to hear from Faust Studio?            [×] │  ░░░░   ← h2, --text-h3, 600
 ░░░░  │ Leave your email for news from Faust Studio,   │  ░░░░   ← pitch, --text-body, --ink-2
 ░░░░  │ the Prague recording studio behind this free … │  ░░░░
 ░░░░  │                                                │  ░░░░
 ░░░░  │ Email (optional)                               │  ░░░░   ← label, Jost 600, --text-small
 ░░░░  │ ┌────────────────────────────────────────────┐ │  ░░░░
 ░░░░  │ │                                            │ │  ░░░░   ← 52 px input, as §4.8
 ░░░░  │ └────────────────────────────────────────────┘ │  ░░░░
 ░░░░  │ By choosing "Subscribe and export", you agree  │  ░░░░   ← consent, --text-small, --ink-2
 ░░░░  │ that Faust Studio may email you about … Privacy│  ░░░░
 ░░░░  │ policy (opens in a new tab)                    │  ░░░░
 ░░░░  │ ┌────────────────────────────────────────────┐ │  ░░░░
 ░░░░  │ │           Subscribe and export             │ │  ░░░░   ← --rust / --paper
 ░░░░  │ └────────────────────────────────────────────┘ │  ░░░░
 ░░░░  │ ┌────────────────────────────────────────────┐ │  ░░░░
 ░░░░  │ │        Export without subscribing          │ │  ░░░░   ← --ink / --paper
 ░░░░  │ └────────────────────────────────────────────┘ │  ░░░░
 ░░░░  └────────────────────────────────────────────────┘  ░░░░
```

- **Card:** `--paper` background, `--ink` text, `--radius-md`, no border, no shadow.
  `width: min(560px, 100vw - 32px)`, `max-height: calc(100dvh - 32px)`, `overflow-y: auto` (so 200% text or a
  phone keyboard scrolls inside the card, never the page sideways). Padding 32; below 640 px, 20.
- **At 1280:** a 560 px card in the middle of the tool. **At 375:** 343 px wide, 16 px from each edge, same
  order, same stacked buttons. Nothing has a fixed width and every label may wrap.
- **Both answers stay in view (added after the build review, 2026-11-10).** On a 375 × 667 phone the card is
  taller than the screen (689 px of content in EN, 740 in CS, against 635 available), and the first build cut
  the Skip button off at the card's edge while Subscribe was fully visible; in Czech both were cut. That breaks
  equal visibility exactly where it matters. So the two buttons sit in one wrapper that is
  `position: sticky; bottom: 0` inside the scrolling card: `--paper` background, 16 px padding above the
  Subscribe button, the card's own padding below the Skip button (so the pair ends where the card ends), a
  1 px `--line-strong` top border only while content is scrolled underneath it (a permanent border is fine if
  detecting that costs code). The text above scrolls behind the pair. Give the card `scroll-padding-bottom`
  equal to the pair's height so a focused field or link is never hidden under it. Apply the sticky rule only
  under `@media (min-height: 560px)`: on a shorter viewport (browser zoom at 200%, or a landscape phone) the
  pair would eat most of the card, and plain scrolling as built is right there. The result views are short
  and need none of this.
  - **Text-only 200% on a small phone (decided 2026-11-11): leave as built.** With text scaled to 200% at
    375 × 667 the heading and pitch alone are taller than the card, and the pair cannot stick above the top of
    its own container (the form). So when the gate opens neither button is visible; once the form scrolls into
    view the pair pins and both appear together, and stay. That meets the requirement, which is that the two
    answers are never *unequally* visible. The alternative, pinning the pair from the start by moving the
    heading and pitch into the form, would cover 38% of the card with buttons while someone reading at double
    size works through the text, and would show the two answers before the question they answer. Not worth it.
  - **The whole consent sentence is on screen before the buttons (2026-11-11).** With the first build's text,
    the last lines of the consent sentence and the privacy link started out under the pair at 375 × 667. The
    shorter v2 consent sentence (no confirmation clause) plus a pitch trimmed from five lines to four fixes
    that in English: measured in the browser with the §5 strings, the privacy link ends at y 493 and the pair
    starts at 499, so nothing a person agrees to is hidden when the gate opens. 3 px of empty bottom margin
    still scroll, which shows nothing new. **Not measured for Czech**, whose strings run longer; if the Czech
    consent sentence still ends under the pair, shorten the Czech pitch first, never the consent sentence.
    The invalid-email error adds lines and makes the card scroll again, which is fine: the error and the
    field are above the pair.
  - **Checked on the build, 2026-11-11** (headless Chromium, 375 × 667, EN and CS): Subscribe at y 515–567,
    Skip at 579–631, card ends at 651, in both languages, at the top and at the end of the scroll.
- **Vertical rhythm:** heading (with `padding-right: 44px` to clear the close button) → 8 → pitch → 24 → label
  → 8 → input → (8 → field error, when shown) → 16 → consent → 24 → Subscribe button → 12 → Skip button.
- **Heading:** `<h2>`, `--text-h3` (22 / 1.25 / 600). **Pitch:** one `<p>`, `--text-body`, `--ink-2`.
- **Label:** a real `<label>`, Jost 600 at `--text-small`, `--ink-2`, sentence case (not the uppercase Barlow
  `.label` of §4.8; see Fonts). It reads "Email (optional)". No placeholder.
- **Input:** as §4.8 item 2 (`type="email"`, `autocomplete="email"`, `inputmode="email"`,
  `spellcheck="false"`, 52 px, 2 px `--line-strong`, `--radius-sm`, hover border `--ink`, invalid border
  `--rust`). **Not** `required`: an empty field is a valid way to leave. `aria-describedby` = the consent
  sentence's id, plus the error's id while it is shown.
- **Consent:** one `<p>` in `--text-small`, `--ink-2`, with the privacy link at its end, inline. **No tick
  box** (see below).
- **Privacy link:** plain `.link` to `PRIVACY_URL` with `target="_blank"` and `rel="noopener"`. This is the one
  new-tab link on the site: leaving `/tool/` in the same tab would destroy the visitor's unsaved audio work.
  The link text itself says "(opens in a new tab)", visibly, so nobody is surprised and screen readers hear it.
  No ↗ icon (§3.1: that means another site).
- **Honeypot:** as §4.8 item 5, if the transport from spec task 1 uses one.
- **Close button:** `<button type="button">`, 44 × 44, `position: absolute; top: 8px; right: 8px`, Lucide `X`
  24 (inline SVG, `aria-hidden`) in `--ink-2`, transparent background, hover `--ink`; `aria-label` = `gate.close`.
  It is **last in the DOM** (so Tab reaches the two answers first) and drawn top-right.

**The two actions and their weight.** Both are full-width `<button>`s, stacked, identical in size (min-height
52, padding 8 / 28), type (Jost 600 17 px, `line-height: 1.2`, `white-space: normal`, centred) and radius.
They differ only in fill, and both fills are solid and high-contrast:

| Action | Fill / text | Hover | Active |
|---|---|---|---|
| **Subscribe and export** (`type="submit"`) | `--rust` / `--paper` (5.3) | `--rust-press` (7.1) | `translateY(1px)` |
| **Export without subscribing** (`type="button"`) | `--ink` / `--paper` (17.9) | `--ink-2` (10.3) | `translateY(1px)` |

- Why two solid buttons and not primary + outline: an outline button next to a filled one reads as the lesser
  choice, and the spec's legal point is that declining must not be the lesser choice. Ink on paper is the
  strongest pair we have, so the skip is never the faint one. Why stacked at every width: side by side in a
  560 px card each gets 240 px, and "Export without subscribing" (longer in Czech) would wrap while "Subscribe
  and export" would not, which makes them unequal again.
- Subscribe is first because it belongs to the field and the consent sentence directly above it.
- **No inactive look.** Unlike §4.8, the Subscribe button always looks active. A greyed-out button beside a
  solid one would tilt the weight the other way, and pressing it with an empty or invalid email simply shows
  the field error. Neither button ever uses the `disabled` attribute (`aria-disabled` while submitting).
- No transforms under `prefers-reduced-motion: reduce`.

**Consent: the labelled action, not a tick box** (report B5 allows either). The gate already asks one
either/or question with two explicit buttons. A box would add a third state (email typed, box unticked,
Subscribe pressed) that needs its own error and helps nobody. So the sentence names the button, and pressing
that button is the opt-in. Nothing is pre-selected, Enter in the email field submits (the same act as pressing
Subscribe), and nothing else is bundled into the action. The landing form keeps its tick box (§4.8): it has one
button, and it is already built and tested. The sentence takes the button's label by interpolation
(`{subscribe}`), so the two cannot drift apart.

**Focus and keyboard.**
- **Initial focus:** the heading (`tabindex="-1"`, `outline: none` on it). Not the email field: focusing it
  favours one answer, and on a phone it opens the keyboard over the Skip button. A screen reader then reads
  the heading and the pitch (`aria-describedby`) first.
- **Tab order:** email → privacy link → Subscribe and export → Export without subscribing → Close. Focus is
  trapped (native `showModal()`).
- **Focus ring:** ours, `3px solid var(--ink)`, offset 3, on every control in the card (on the ink button the
  3 px paper gap keeps the ring visible). The tool's blue ring must not show.
- **Escape and Close:** close the gate and do **not** export. Nothing is stored, nothing is sent, a typed email
  is discarded, and the next Export click shows the gate again. Both are ignored while submitting (at most 10 s).
- **Clicking the scrim:** does nothing. A stray click must not throw away a typed email, and Close and Escape
  are right there.
- **On close**, focus returns to the tool's Export button. After an answer the script then clicks that button,
  so the tool's own menu opens with focus where the tool expects it.
- **Keys stay in the dialog.** The tool listens for shortcuts on `window` (Space = play, Cmd/Ctrl-Z, Delete,
  Escape), so while the gate is open every `keydown` is stopped from reaching the tool. Consequence: any key
  handling the gate needs must be attached inside the dialog. The gate needs none of its own: Tab, Shift-Tab,
  Enter in the email field (form submit), Space/Enter on buttons and Escape (the dialog's `cancel` event) are
  all native. Typing a space or pressing Delete in the email field must edit the field and nothing else.
- **Motion:** the card and scrim fade in over 150 ms (opacity only). None under reduced motion.

**States.** One visually-hidden `<p role="status">` lives in the dialog from the moment it opens (`.sr-only`,
§4.8); only it announces.

| State | What the visitor sees | Buttons | Announcer |
|---|---|---|---|
| Idle | The card as drawn. No messages. | Both active | (empty) |
| Invalid email (Subscribe pressed, or Enter, with an empty or malformed address) | Field error 8 px under the input: Lucide `CircleAlert` 20 + `gate.invalidEmail` in `--text-small` `--rust`. Border `--rust`, `aria-invalid="true"`, focus moves to the input (the error is read through `aria-describedby`). Clears as soon as the value is valid. Validation runs **only** on a Subscribe attempt, never on blur: blur is what happens when someone reaches for Skip. | Both active | (none; the field error is read on focus) |
| Submitting | Fields unchanged, no spinner, `<form aria-busy="true">`. Further presses, Close and Escape are ignored. Ends on a response or after 10 s. | Subscribe: label `gate.sending`, `--rust-press` / `--paper`, `aria-disabled`. Skip: `aria-disabled`, unchanged look (it is 10 s at most, and greying it would flicker on a fast response) | Subscribing… |
| Subscribed (result) | The form is replaced, inside the same card, by: Lucide `MailCheck` 24 in `--rust` beside `gate.successTitle` (`<h2>`, `--text-h3`), under it `gate.successBody` (`--text-body`, `--ink-2`), then 24 px and one full-width `--ink` button, `gate.continue`. The dialog's `aria-labelledby` now points at this heading; it has `tabindex="-1"` and takes focus. | Continue to export | `gate.successTitle` |
| Signup failed, export continues (any error, or 10 s with no answer) | Same result layout: Lucide `CircleAlert` 24 in `--rust` beside `gate.failedTitle`, `gate.failedBody`, the same Continue button. No retry: the export must not wait on a second attempt, and the visitor is asked again on a later visit. | Continue to export | `gate.failedTitle` |
| Closed | The dialog is removed and the tool is exactly as before. | — | — |

- **What each exit does:** *Export without subscribing* and *Continue to export* close the gate and open the
  tool's export menu. *Close* and *Escape* close it without opening the menu; on a result view the answer is
  already recorded, so the next Export click goes straight to the menu.
- **What is remembered** (pm spec, repeated so the states are complete): subscribed → `localStorage`, never
  asked again. Skipped, or signup failed → `sessionStorage`, not asked again in this session. Closed without
  an answer → nothing. Never the email.
- **Why a result view, when the pm brief has the gate close straight after either action:** a subscriber
  should see that the subscription went through (and, once double opt-in is on, be told to confirm by
  email), and a failed signup must be reported. The only
  other place for either message is a floating notice over an interface we don't control, which nobody is
  focused on and which would cover the tool at 375 px. One extra press, for subscribers only, buys a message
  that is certain to be seen and read out. Skipping stays one press. (Flagged to pm.)
- **Button wording, "export" not "download":** the visitor has just pressed the tool's **Export ▾**, and what
  opens next is a menu reading "Export as WAV / MP3", not a download. The labels promise what happens.
  (Flagged to pm; the tool's label was read at `72b353a`. If the tool renames the button, update `gate.*`.)
- **If spec task 1 picks Ecomail's public form URL**, the page cannot read the response, so the failed state is
  reachable only by a network error or the timeout. `gate.successBody` is worded to stay true then: it says
  to look for the email, not that one was sent.

**Honesty.** No string says or implies the email is needed to export: the heading is a question, the pitch
says the export is the same either way, the label says "(optional)", and the consent sentence says "This is
optional". **Since 2026-11-11 there is no double opt-in:** a subscriber is on the list at once and no email is
sent at signup, so the success text says "you're on the list" and nothing in the gate may mention a
confirmation email, an inbox or anything "on its way". It stays true for a repeat signup (the endpoint treats
a repeat as success). When double opt-in is switched on, the drafted texts in §5 "Draft for double opt-in"
replace these, and the confirmation email's sender name in Ecomail must then read "Faust Studio" (pm runbook).

**Colour pairs used** (all in §1.1, or the same two colours reversed): ink/paper, ink-2/paper (pitch, label,
consent, close icon), rust/paper (error text, icons), paper/rust and paper/rust-press (Subscribe), paper/ink
17.9 and paper/ink-2 10.3 (Skip and Continue, and hover), line-strong/paper (input border, 3.9 non-text). No
text sits on the scrim.

**Copy:** §5 "Export gate". Keys: `gate.*` (the separate `gate` export in `copy/en.ts` / `cs.ts`).


---

## 5. Copy (English, final unless marked)

The tool's name lives in the copy strings (`en.ts`, `cs.ts`), not a constant: Czech declension means it
can't be dropped into sentences. A rename is a find-and-replace in both files. The tool currently calls
itself "Faust Studio Autotuner".
`TODO(name)`: "Auto-Tune" is an Antares trademark, and the tool team flagged this (autotuner `PLAN.md` §12).
Until pm decides, visible copy says "the tuner" / "vocal tuner" and never "Auto-Tune". The lowercase generic
word appears only in the meta description, for search.

**Meta**
- `<title>`: Free vocal tuner in your browser · Faust Studio
- `description`: Fix the pitch of your vocals for free, right in your browser. No account, nothing uploaded.
  A free autotune tool from Faust Studio, a recording studio in Prague. `TODO(name)`

**Header**
- Skip link: Skip to main content
- Emblem alt (header and footer): "" (decorative; the wordmark text next to it names the brand)

**Hero**
- Eyebrow: Free vocal tuner · by Faust Studio, Prague
- H1: Tune your vocal in your browser, for free! (Changed by the user on 2026-10-20, commit `49f1013`; was
  "Tune your vocal in your browser. Free." The CS h1 follows: "Nalaďte svůj zpěv v prohlížeči, zdarma!")
- Lead: See every note you sang, tune them in one click or by hand, and download the result.
- Box button: Try it free
- Box meta: Opens the tuner · WAV, MP3, OGG or FLAC · up to 100 MB
- Trust line: Free · No account · Your audio stays on your device
  `TODO(email)`: true while the export prompt is optional (§4.10). "No account" and "Free" must change if an
  email ever becomes required to export. (Reworded 2026-11-10; the visible text is unchanged.)
- Mobile note: Editing works best on a laptop or desktop.
- Drop message: Almost: open the tuner, then drop your file there.

**How it works**
- Eyebrow: How it works
- H2: Four steps, a few minutes
- Lead: No plugins and no DAW. It all happens in the browser tab.
- 01 · **Upload a vocal**: Drop in a solo vocal recording, without the backing track. WAV, MP3, OGG or FLAC,
  up to 10 minutes.
- 02 · **See your notes**: The tuner finds every note you sang and lays them out against a piano keyboard,
  colored by how far each one is from true pitch.
- 03 · **Tune Up, or drag to fix**: Press Tune Up to move every off-pitch note to the nearest semitone in
  one click. Want more control? Drag any note up or down yourself. Undo is always there.
  ("Tune Up" is the tool's button label at `e255279`. If the tool renames it, update this.)
- 04 · **Download**: Export a full-quality 24-bit WAV, or a smaller 192 kbps MP3.
- Button: Open the tuner

**Before / after** (removed 2026-10-25, see §4.3; kept for v2, not in v1 copy)
- Eyebrow: Listen
- H2: Hear the difference
- Lead: The same take, straight from the mic and after a few minutes in the tuner.
- Row labels: Before / After
- Track titles: Raw take / Tuned in the tuner
- Placeholder tag: Samples coming soon `TODO(audio)`
- Button aria-labels: Play before sample / Pause before sample / Play after sample / Pause after sample
- Link: Try it with your own vocal

**The studio**
- Eyebrow: The studio behind the tool
- H2: Made at Faust Studio, Prague
- P1 (source for 1991: `/kopie-about`, "It was founded in 1991 by musician Richard Mader, two years after
  the Velvet Revolution." Home page says "35 years of music", which is consistent.): Studio Faust Records was founded in 1991 by musician Richard Mader, two years after the Velvet
  Revolution. It sits in a functionalist building near Prague Castle and has two studios. Underneath them
  runs a 300 m² concrete labyrinth where whole bands record live.
- Building illustration alt: Line drawing of the Faust Studio building, a curved functionalist corner
  building, seen from the street. (The art's sign reads "FAUST RECORDS"; the alt says "Faust Studio" per the
  naming `TODO(verify)`.)
- P2: The Blue Studio is built around an SSL 4000E console with a Neve front end and a Steinway grand. The
  Green Studio has 80-year-old hardwood floors and a 1935 Hofmann grand piano.
- Stats: **1991** Founded · **2** Studios · **300 m²** Underground live space
  `TODO(verify)`: the Green Studio page mentions gear "shared with studio BLUE and BROWN". Confirm that 2 is
  the right count.
- Recorded here: Killing Joke, Skunk Anansie, Damian Marley, Tindersticks, OneRepublic, Iva Bittová
- Links: About the studio ↗ (`https://www.fauststudio.net/kopie-about`) · All references ↗
  (`https://www.fauststudio.net/references`)
- `TODO(verify)`: The client site uses both "Faust Records" and "Faust Studio". Confirm with the client which
  name to lead with. The `/kopie-about` slug looks auto-generated by Wix, so confirm it's stable.

**Next step**
- Eyebrow: Next step
- H2: Ready for a real room?
- Lead: When a take deserves more than a quick fix, record it with an engineer or learn to do it yourself.
- Card 1, image: Blue Studio control room
  - H3: Blue Studio
  - Body: The heart of Faust: SSL 4000E console, Neve front end, a Steinway grand and access to the
    underground live rooms. For full tracking and mixing sessions.
  - Meta: From 1,000 CZK (€45) per hour, with engineer `TODO(verify)`: confirm price with the studio before launch
  - Link: See the Blue Studio ↗ → `https://www.fauststudio.net/blue-studio`
- Card 2, image: Green Studio
  - H3: Green Studio
  - Body: 80-year-old hardwood floors, a 1935 Hofmann grand and movable curtains to shape the sound. Used
    mainly for smaller sessions, mastering and budget projects.
  - Meta: From 700 CZK (€30) per hour, with engineer `TODO(verify)`: confirm price with the studio before launch
  - Link: See the Green Studio ↗ → `https://www.fauststudio.net/green-studio`
- Card 3, image: a course or session in progress
  - H3: Courses
  - Body: Short and long courses in recording, beat-making, synths, and analogue, tape and digital
    recording, for groups or individuals. Led by the studio's engineers and producers.
  - Meta: Groups or one-to-one
  - Link: See courses ↗ → `https://www.fauststudio.net/courses`
- Closing: **Book a session** (button) · See all rates ↗

**FAQ** (H2: Questions)
1. **Is it free?** Yes. You can upload, tune and download for free.
2. **Do I need an account?** No. There is no account and nothing to sign up for. When you export, the tuner
   asks whether you'd like emails from Faust Studio. You can say no and export just the same.
   `TODO(email)`: true while the export prompt is optional (§4.10); rewrite if an email ever becomes required.
   (2026-11-10; was "Not right now. You can use the tuner without signing up.", a placeholder.)
3. **Does my audio get uploaded?** No. The tuner runs entirely in your browser, and your audio is never sent
   to us or anyone else. Your recent files are kept in this browser, on this device, so you can reopen them.
   You can remove them at any time.
4. **Which files work?** WAV, MP3, OGG and FLAC, up to 100 MB and 10 minutes long. It works best on a solo
   vocal without music behind it.
5. **What do I get when I download?** A full-quality 24-bit WAV, or a smaller 192 kbps MP3.
6. **Does it work on my phone?** You can open it on a phone. Moving notes is much easier with a mouse or
   trackpad, so a laptop or desktop is best.

**Email signup** (§4.8; keys `signup.*`)
- Eyebrow: Stay in touch
- H2: Hear from the studio
- Lead: Leave your email for news about studio sessions, courses and the tuner. The tuner stays free, with
  or without it.
- Email label: Email
- Consent (checkbox label, version `2026-11-v2`, 2026-11-10): Faust Studio may email me about studio
  sessions, courses and tuner news, and may see whether I open the emails and which links I click. I can
  unsubscribe at any time.
  (v1, until 2026-11-10: "Faust Studio may email me about studio sessions, courses and tuner news, and I can
  unsubscribe at any time." Kept in the §4.8 table.)
- Privacy link: Privacy policy → `PRIVACY_URL`, our own page (§4.9). Plain link, no ↗, same tab, always
  rendered (2026-11-04; was `faust.privacy`, not rendered until set).
- Button: Subscribe · while sending: Sending… · after an error: Try again
- Incomplete hint: Enter your email and tick the box first.
- Invalid email: Enter an email address like name@example.com.
- Error (400): That email address wasn't accepted. Check it and try again.
- Error (other): Something went wrong and your email wasn't saved. Please try again.
- Success title (`signup.successTitle`): Thanks, you're on the list.
- Success body (`signup.successBody`): Faust Studio will email you about studio sessions, courses and tuner
  news.
  (Both unchanged from v1, 2026-11-11: with no double opt-in they are true as written, and no email is sent
  at signup, so nothing here may say "check your inbox". The with-confirmation wording is under "Draft for
  double opt-in" below.)
- Honeypot: no visible text; `name="website"`, `aria-hidden`.

**Export gate** (§4.10; keys `gate.*`, the separate `gate` export; written 2026-11-10)
- Heading (`gate.heading`): Want to hear from Faust Studio?
- Pitch (`gate.lead`, trimmed 2026-11-11): Leave your email for news from Faust Studio, the Prague recording
  studio behind this free tuner, or skip this. Your export is the same either way.
  (Was: "This free tuner is made by Faust Studio, a recording studio in Prague. Leave your email for news
  about studio sessions, courses and the tuner, or skip this. Your export is the same either way." One line
  shorter at 375 px, so the whole consent sentence shows above the pinned buttons, §4.10. The topics it
  dropped are in the consent sentence directly below.)
- Email label (`gate.emailLabel`): Email (optional)
- Consent (`gate.consent`, version `2026-11-v2`, §4.8 table): By choosing "{subscribe}", you agree that Faust
  Studio may email you about studio sessions, courses and tuner news, and may see whether you open the emails
  and which links you click. This is optional, and you can unsubscribe at any time.
  (2026-11-11: the confirmation clause is out, because no email is sent at signup. `{subscribe}` = `gate.subscribe`, interpolated. Use typographic quotes: “ ” in EN, „ “ in CS.)
- Privacy link (`gate.privacy`): Privacy policy (opens in a new tab) → `PRIVACY_URL`, `target="_blank"`
- Subscribe button (`gate.subscribe`): Subscribe and export
- While submitting (`gate.sending`, button label and announcer): Subscribing…
- Skip button (`gate.skip`): Export without subscribing
- Invalid email (`gate.invalidEmail`): Enter an email address like name@example.com, or choose "{skip}".
  (`{skip}` = `gate.skip`.)
- Close button name (`gate.close`): Close
- Success title (`gate.successTitle`, 2026-11-11): Thanks, you're on the list.
- Success body (`gate.successBody`, 2026-11-11): Faust Studio will email you about studio sessions, courses
  and tuner news.
  (The same two strings as the landing form's success state.)
- Failed title (`gate.failedTitle`): Your subscription didn't go through.
- Failed body (`gate.failedBody`): We couldn't save your email, so you're not subscribed. Your export isn't
  affected.
- Result button (`gate.continue`): Continue to export
- The programmer's placeholder key `gate.failed` splits into `failedTitle` / `failedBody`. Every other
  placeholder key keeps its name.

**Draft for double opt-in** (NOT shipped; kept for the day Faust has a verified sender domain and the list's
double opt-in is switched on. Using any of it means a new consent version and a new policy version.)
- Gate consent: By choosing "{subscribe}", you agree that Faust Studio may email you about studio sessions,
  courses and tuner news, and may see whether you open the emails and which links you click. This is
  optional. We'll first send one email asking you to confirm your address, and you can unsubscribe at any
  time.
- Success title (gate and landing): One more step: confirm your email.
- Success body (gate and landing): Look for an email from Faust Studio and click the link in it. You won't
  get any other emails until you do. If you confirmed earlier, you're already on the list.
- Policy, section 5, after the "We don't ask for anything else" line: After you subscribe, you get one email
  asking you to confirm your address. Until you click the link in it, you are not on the list and you receive
  nothing else from us.
- Policy, section 5, tracking paragraph: "Each email, including the confirmation email, contains …".
- Policy, section 5, retention: We keep your email address until you unsubscribe or ask us to delete it. That
  includes an address that was never confirmed: it receives no emails, and you can ask us to delete it like
  any other.
- Policy, section 8: add "you now get an email to confirm your address before anything else is sent".
- Check then: the confirmation email's sender name reads "Faust Studio"; whether unconfirmed addresses are
  purged after a fixed time (pm asked the user, 2026-11-10); the pinned-buttons fit at 375 px with the longer
  consent sentence (§4.10).

**Copy review for the export gate** (2026-11-10, gate-spec criterion 13). Everything on the landing page that
touches "free", "account", "sign up" or email, read against an optional prompt at Export:

| String | Verdict |
|---|---|
| Meta description: "No account, nothing uploaded." | Stays. Both still true. |
| Hero trust line: Free · No account · Your audio stays on your device | Stays. The `TODO(email)` comment is reworded (Hero, above). |
| How it works 04: "Export a full-quality 24-bit WAV, or a smaller 192 kbps MP3." | Stays. It doesn't mention the prompt and doesn't need to: nothing in it becomes untrue, and FAQ 2 covers it. |
| FAQ 1: "Yes. You can upload, tune and download for free." | Stays. |
| FAQ 2: "Not right now. You can use the tuner without signing up." | **New wording** (FAQ, above). "Not right now" was a placeholder, and a visitor who meets an email prompt after reading "without signing up" deserves to have been told. |
| FAQ 3: "your audio is never sent to us or anyone else" | Stays. The only thing the prompt can send is an email address, and only on Subscribe. |
| Signup lead: "The tuner stays free, with or without it." | Stays. |
| Signup consent sentence | **New wording**: gains the open-and-click clause; version `2026-11-v2` (§4.8). |
| Signup success title and body | Stay as v1 (2026-11-11: no confirmation email is sent, so "you're on the list" is true). |
| Signup errors, hint, button labels | Stay. |
| Privacy policy | **v2** (below). |

**Footer**
- Description: Recording studio, residential and creative space near Prague Castle. Since 1991.
- Studio site link: fauststudio.net ↗
- Contact heading (label): Contact
- Contact and booking ↗ → `https://www.fauststudio.net/contact`
- faustrecords@gmail.com
- +420 603 170 135 (Czech and English)
- Na hutích 665/8, Prague, Czechia
- Language heading (label): Language
- Social: Instagram ↗ (`https://www.instagram.com/fauststudios/`) · Facebook ↗
  (`https://www.facebook.com/FaustRecordsStudio/`)
- Privacy policy → `PRIVACY_URL` (bottom row, next to the copyright, §4.9)
- Copyright: © 2026 Faust Studio. `TODO(verify)`: legal owner name. fauststudio.net shows
  "© 2025 by Richard Mader jr."

**Privacy policy page** (§4.9; keys `privacy.*`; written 2026-11-04; **now version `2026-11-v2`, 2026-11-11**)

**v2 in one paragraph** (`docs/email-gate-spec.md` → "Privacy policy v2"). Changed: the updated line, section
2 (scope), section 3 (one paragraph added), section 5 (rewritten), section 6 (storage list and the last
paragraph), section 8 (version + what changed). Unchanged: intro, meta, sections 7, and the two suspended
sections (1 and 4). The text below **is** v2; v1 is in git (`c74d599`). The Ecomail facts come from
`reports/ecomail-email-gate.md`, "Follow-up, 2026-11-10" (F1 tracking, F2 the processor facts re-read from
Ecomail's terms, DPA and data register as raw text), so the Ecomail paragraphs carry no `TODO(verify)`. Two
rules from that follow-up: the transfer sentence does not use the name "Data Privacy Framework" (Ecomail's DPA
says "Framework US/EU") and does not say "EU only" (the register says data may also be present in the US);
and for our subscribers the governing document is the DPA with its Annex C, not Ecomail's privacy policy. **Revised 2026-11-11 (user decision: collect now, without double opt-in).** v2 as it ships promises **no
confirmation email**: a subscriber is on the list at once and nothing is sent at signup. The with-confirmation
sentences are kept under "Draft for double opt-in" above, for a later version. The pending block in section 5
is resolved: the spike chose the Cloudflare Worker, so that paragraph is final apart from one `TODO(verify)`.
"On Faust Studio's behalf" and "Faust Studio runs" are literally true only when the Ecomail and Cloudflare
accounts are Faust's; pm tracks which they are (the spike notes the Ecomail account is the one Faust will
use).

Plain language, second person, short paragraphs, no legalese. Nothing here claims more than the site does
today (spec criterion 7): GitHub does log IPs, there is no confirmation email, no encryption claim. Bracketed
text is `TODO(verify)`. Filled 2026-11-04 from `reports/privacy-policy-facts.md`. The only brackets left were the
controller's name and IČO in section 1, so **section 1 was removed from the page the same day (user decision: no
brackets on the demo)**; its text stays below for reinstatement once Faust names the controller. Until then the
page has six sections and the Art. 13(1)(a) gap is logged in the pm spec. Section 4 ("Visiting this site",
GitHub Pages hosting) was also removed 2026-11-04 (user decision: GitHub Pages isn't the permanent host); its text
stays below for the launch host, and its last paragraph moved to the end of "No cookies, no tracking". Never
replace a bracket with a guess. The CS draft is machine-translated **legal** text: mark it `TODO(cs-review)` with a note that a
native speaker must review it before the site leaves `noindex`. Keys are given as `privacy.sections[n]` with
the section `id`; a block is a paragraph unless marked *list* or *link*.

- Meta title (`privacy.meta.title`): Privacy policy · Faust Studio
- Meta description (`privacy.meta.description`): How this site and the free vocal tuner handle your data. The
  tuner runs in your browser and uploads nothing; your email is stored only if you subscribe.
- Back link (`privacy.back`, top and bottom): Back to the tuner page
- Eyebrow (`privacy.eyebrow`): Faust Studio · vocal tuner
- H1 (`privacy.heading`): Privacy policy
- Updated line (`privacy.updated`): Last updated 11 November 2026 · Version 2026-11-v2 (use the date v2
  actually ships)
- Intro (`privacy.intro`): This page explains what happens to your data when you use the free vocal tuner
  and the site around it, and what Faust Studio keeps if you leave your email. The short version: the tuner works
  entirely in your browser and your audio never leaves your device. We store your email address only if you
  subscribe, and you can unsubscribe at any time.

**1 · `who` · Who is responsible** — REMOVED from the page 2026-11-04, kept here for reinstatement. Not in the
`sections` array; the id stays reserved.
- Faust Studio is run by [Richard Mader], a sole trader, IČO [number], Na hutích 665/8, 160 00 Praha 6,
  Czechia. He is responsible for the personal data described on this page (the "controller", in the words of
  the GDPR).
- Questions and requests about your data go to Faust Studio by email:
- *link (mailto, plain):* faustrecords@gmail.com (`faust.email`)
- ("Faust Studio" is not a registered entity (ARES, 2026-11-04). Two sole traders at that address are the
  candidates, and Faust must say which: **Ing. Richard Mader, IČO 10170367** (the 1991 founder) or **Richard
  Mader, IČO 01577778** ("Richard Mader jr." in the site footer). Keep both in the `en.ts` source comment; the
  address is the same either way, so it is filled. No DPO line: neither a DPO nor an Art. 27 representative
  applies, researcher-confirmed.)

**2 · `scope` · What this page covers**
- This policy covers the tuner's landing page, the tuner itself at /tool/, and the two places where you can
  leave your email: the form on the landing page and the prompt that appears when you export from the tuner.
- It does not cover fauststudio.net, Faust Studio's main site, which is run separately. Sites we link to
  (Ecomail, Instagram, Facebook) have their own privacy policies.
- (v2: the prompt added; "Wix" → "Ecomail", because the Wix policy link is gone from section 5.)
- (GitHub dropped from the list 2026-11-04 with the hosting section: the page no longer links to GitHub.)
- *link (Outbound, rendered only when `faust.privacy` is set):* See also: Faust Studio's privacy policy

**3 · `tuner` · The tuner**
- The tuner runs entirely in your browser. When you open an audio file, your browser decodes it, finds the
  notes, applies your changes and creates the download, all on your device. Nothing is uploaded: not the
  audio, not the file name, not what you changed. There is no account and no login.
- So that you can reopen a file later, the tuner keeps the files you have opened in your browser's own storage
  (IndexedDB) on your device. Only your browser can read them, and they are never sent anywhere.
- To remove them, clear this site's data in your browser's privacy settings (usually under "Cookies and site
  data" or "Website data"). Do the same if you used the tuner on a shared computer.
- When you export, the tuner asks whether you would like emails from Faust Studio. That is optional. It is the
  only point at which the tuner can send anything anywhere, and what it sends is your email address, only if
  you choose to subscribe (see "Email signup" below). Your audio is never part of it.
- (v2: the paragraph above is new. Nothing in this section said the tuner never asks for an email, so nothing
  was removed; "There is no account and no login" stays true.)
- (The recent-files and nothing-uploaded sentences were checked at autotuner `e255279`, `storage/recent.ts`.
  `site.config.json` now pins `72b353a`; the programmer re-confirms both at that commit during the criterion-9
  run. Hold the text unless they report a difference.)

**4 · `hosting` · Visiting this site** — REMOVED from the page 2026-11-04, kept here for the launch host. Not in
the `sections` array; the id stays reserved. Its last paragraph ("Nothing on this site…") moved to section 6.
- This site, including the tuner, is hosted on GitHub Pages, a service of GitHub, Inc. Like almost every web
  host, GitHub records the IP address of each visitor in its server logs, to keep the service secure and
  running. We don't see these logs and don't use them. GitHub handles them under its own privacy statement.
- The legal basis is our legitimate interest in running the site (GDPR Article 6(1)(f)). GitHub keeps these
  logs only as long as it needs them for security and publishes no fixed period. GitHub is based in the
  United States; the transfer rests on its certification under the EU-US Data Privacy Framework.
- *link (Outbound):* GitHub's privacy statement → `faust.githubPrivacy` (constant deleted with the section;
  re-add it, `https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement`, on
  reinstatement, and put GitHub back in section 2's list)

**5 · `signup` · Email signup**
- Leaving your email is optional. The tuner is free and works exactly the same with or without it.
- We ask in two places: the form on the landing page, and a prompt that appears when you export from the
  tuner. If you close the prompt or export without subscribing, nothing is sent to us, and anything you typed
  into the email field is discarded.
- If you subscribe, Faust Studio stores:
- *list:*
  - your email address
  - the language you were using (English or Czech)
  - the date and time you subscribed
  - the version of the consent text you agreed to
  - where you subscribed (the landing page or the tuner)
- We don't ask for anything else: no name, no account, no password.
- When you subscribe, your address is added to the list straight away. We don't send a confirmation email.
- (2026-11-11: replaces the confirmation-email paragraph, which is kept under "Draft for double opt-in".
  It says plainly that nothing is sent at signup, so nobody waits for an email that isn't coming.)
- We use your address to email you news about studio sessions, courses and the tuner. The legal basis is your
  consent (GDPR Article 6(1)(a)). You give it by ticking the box on the landing page form, or by choosing
  "Subscribe and export" in the tuner's prompt. Nothing is ticked or chosen for you.
- Faust Studio's mailing list is kept in Ecomail, an email service run by ECOMAIL.CZ, s.r.o., Prague, Czechia.
  Ecomail processes the list on Faust Studio's behalf. Its main servers are in Frankfurt, Germany. Ecomail
  states that the data is kept in the EU and that some of its suppliers may also send data to the United
  States under EU-approved transfer arrangements.
- *link (Outbound):* Ecomail's terms and data-processing agreement (in Czech) → `faust.ecomailTerms`
  (`https://ecomail.cz/obchodni-podminky/`; replaces `faust.wixPrivacy`, which is deleted. Not Ecomail's
  privacy policy: that one describes Ecomail's handling of its own customers, report F2 correction 2.)
- When Faust Studio emails you, the emails go out through Ecomail, which measures how they are read. Each
  email contains a small invisible image that tells Ecomail when the email is opened, and its links pass
  through Ecomail so that clicks are counted. Faust Studio can therefore see whether you opened an
  email, which links you clicked, and when. When an email is opened or a link is clicked, Ecomail also
  receives your IP address, an approximate location worked out from it, and details of your device and mail
  program. This is part of what you agree to when you subscribe.
- (Tracking paragraph: report F1. No emails are being sent yet (2026-11-11), so it is worded as what happens
  "when Faust Studio emails you"; it is what the person consents to now. It makes no promise that tracking can
  be switched off, because none is documented. If Faust later finds a way and uses it, the paragraph and both consent sentences change and the
  versions bump.)
- Your signup reaches Ecomail through a small relay that Faust Studio runs on Cloudflare (Cloudflare, Inc.,
  United States). Cloudflare processes the request, including your IP address, on its worldwide network, so
  it may be handled outside the EU. The relay passes your signup on to Ecomail and stores nothing itself.
  Transfers to the United States rest on the EU-US Data Privacy Framework. `TODO(verify)`
- *link (Outbound):* Cloudflare's privacy policy → `faust.cloudflarePrivacy`
  (`https://www.cloudflare.com/privacypolicy/`)
- (Cloudflare paragraph: final since 2026-11-11, when the spike chose the Worker (report "Spike results":
  Ecomail's public form URL sends the visitor to an Ecomail page with Google reCAPTCHA, so it cannot be used;
  the reCAPTCHA variant drafted here on 2026-11-10 is deleted). Three conditions:
  the `TODO(verify)` stays until someone opens Cloudflare, Inc.'s entry on the official DPF list in a browser
  (`https://www.dataprivacyframework.gov/participant/5666`, seen only in secondary copies, report F3);
  "stores nothing itself" is a build requirement on the Worker, which must not log the email address or the
  IP, and the clause goes if it does; and Cloudflare's DPA promises no processing location, so never write
  "in the EU" here. While the Cloudflare account is the user's, "Faust Studio runs" has the same caveat as
  "on Faust Studio's behalf" for Ecomail.)
- (No sentence about the signup's IP address. v1's "We don't record your IP address or browser details with
  your signup" stays out: Ecomail's API record has no IP field (spike), but the dashboard's contact detail has
  not been checked. If it shows none, add: "The signup itself is stored without your IP address or browser
  details." If it shows one, add "the IP address the signup came from" to the stored list.)
- We keep your email address until you unsubscribe or ask us to delete it.
- Every email we send has an unsubscribe link. You can also withdraw your consent at any time by writing to
  the email address under "Your rights". Withdrawing stops future emails; it doesn't affect what was sent while
  your consent was valid.
- (The "until you unsubscribe or ask" sentence is the spec's promise, not a fact slot, so it isn't bracketed.
  Mark it `TODO(verify)` in the source: Faust has to confirm they will delete on request, and the handover
  in `email-capture-migration.md` must say so.)

**6 · `cookies` · No cookies, no tracking**
- This site sets no cookies, runs no analytics and has no trackers or embedded social media buttons. We don't
  build profiles of you and make no automated decisions about you.
- Three things are stored in your browser, and only there:
- *list:*
  - your language choice (English or Czech), saved in your browser's local storage only when you click the
    EN/CS switch
  - the tuner's recent files (see "The tuner" above)
  - your answer to the tuner's email prompt, saved only when you answer it, so that you aren't asked again:
    if you subscribed, in local storage; if you chose not to, in session storage, which your browser clears
    when you close the tab. It records only which answer you gave, never your email address.
- All of these stay on your device and go away when you clear this site's data.
- Nothing on this site is loaded from other companies. The fonts, scripts and images all come from the site
  itself, so no third party learns that you visited. The one time your browser contacts another company from
  this site is when you subscribe: it then sends your signup to the service described under "Email signup".
- This section is about the site. The emails you get if you subscribe are measured differently; "Email
  signup" above explains how.
- (v2: third list item, "Two" → "Three", "Both" → "All of these", and the last sentence, which is worded to
  hold for either transport. Re-verify with gate-spec criterion 8. The storage item follows the pm spec's
  defaults (`faust-landing:gate`); if those change, this item changes.)
- (The last paragraph was section 4's closing paragraph until that section was removed, 2026-11-04. It depends
  on spec criterion 9, the programmer's zero-other-origin check of the landing page **and** `/tool/`
  (verified at pin `72b353a`). If the tool ever fetches anything external, this paragraph changes; tell the
  designer.)

**7 · `rights` · Your rights**
- Under the GDPR you can ask Faust Studio to:
- *list:*
  - tell you what data it holds about you and give you a copy (access)
  - correct it (rectification)
  - delete it (erasure)
  - limit how it is used (restriction)
  - send it to you or to another provider in a common file format (portability)
  - stop using it (objection)
- You can also withdraw your consent at any time.
- To do any of this, email Faust Studio:
- *link (mailto, plain):* faustrecords@gmail.com (`faust.email`)
- You'll get a reply within one month, as the GDPR requires.
- (Was "email the address in section 1" until section 1 was removed, 2026-11-04.)
- If you think your data has been handled wrongly, you can complain to the Czech data protection authority,
  the Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7.
- *link (Outbound):* uoou.gov.cz → `faust.uoou`

**8 · `changes` · Changes to this policy**
- When this policy changes, the date and version number at the top of the page change with it. The current
  version is 2026-11-v2.
- Version 2026-11-v2 changed three things: signups now go to Ecomail instead of Wix, the tuner now offers the
  signup when you export, and this page now explains how the emails record opens and clicks.
- If you subscribed, the version of the consent text you agreed to is stored with your email, so we can
  always tell which wording you saw.
- (v2: version number, the "changed three things" paragraph, and "consent sentence" → "consent text".)

Language-independent values (`src/faust.ts`, not copy): `PRIVACY_URL`, `PRIVACY_POLICY_VERSION`,
`faust.ecomailTerms` (v2; replaces `faust.wixPrivacy`), `faust.cloudflarePrivacy` (v2), `faust.uoou` (confirmed by the researcher 2026-11-04; `faust.githubPrivacy` was deleted with
the hosting section),
`faust.email`, `faust.privacy`.

**Sources** (for the `TODO(verify)` review): fauststudio.net home, `/kopie-about`, `/blue-studio`,
`/green-studio`, `/rates`, `/courses`, `/references`, `/contact`, all read 2026-10-20. Tool facts come from
autotuner `e255279`: `UploadScreen.tsx` (100 MB, formats), `decode.ts` (10 min, solo vocal),
`EditorScreen.tsx` / `edits.ts` (Tune Up, snap), `ExportBar.tsx` (24-bit WAV, 192 kbps MP3) and
`storage/recent.ts` (stored on device only).

---

## 6. Imagery and assets

**Don't hotlink or copy from fauststudio.net / wixstatic.com.** The user must get every item below from
Faust Studio (or approve it) with permission to use it.

| # | Asset | Where | Spec | Alt text |
|---|---|---|---|---|
| A1 ✅ | Building emblem: `src/assets/faust-light.png` (black, for paper) and `faust-dark.png` (white, for night), 512 × 512 PNG | Header 44 px, footer 96 px, studio section 360 px (240 px below 1024) | Received 2026-10-20. Nice to have: an SVG or ≥1024 px export, since 360 px at 2× needs 720 px and 512 is slightly soft | Header/footer `""`; studio: see §5 |
| A2 | Blue Studio control room photo | Optional now: the studio slot uses the A1 illustration. Use it for A7 if supplied | ≥1600 × 1200, landscape | n/a |
| A3 | Blue Studio photo (different angle or the live room) | Next step card 1 | ≥1200 × 900 | "" (decorative; the card title names it) |
| A4 | Green Studio photo | Next step card 2 | ≥1200 × 900 | "" |
| A5 | Course or session in progress (people, synth lab) | Next step card 3 | ≥1200 × 900 | "" |
| A6 (parked, v2) | Before/after audio: the same vocal take, raw and tuned. Not needed for v1: §4.3 was removed 2026-10-25 | Before/after (v2) | 15–30 s each, MP3 192 kbps, loudness-matched, signed singer consent | n/a (labelled by row) |
| A8 ✅ | Tool screenshot: `src/assets/howto.png`, 2956 × 688 | How it works banner (§4.2) | Crop to rows 0–596 (drops the status bar), WebP 1120 + 2240 w | Programmer's, in `copy/*.ts` |
| A7 | Social share image (optional) | `og:image` | 1200 × 630, A2 cropped with the emblem, or the A1 illustration on `--paper` with the wordmark | n/a |

Export photos as AVIF/WebP with a JPEG fallback and set `width`/`height`. Images below the hero are lazy
loaded. Photos are not filtered or tinted. The warmth comes from the photography itself.

**Placeholder treatment (use until assets arrive):**
- Images: a `<div>` with the same aspect ratio, `--paper-2` background (`--night-2` on night) and a 1 px
  dashed `--line-strong` border (`--night-line` on night). Center the label (e.g. `PHOTO: BLUE STUDIO`) in
  `--text-label` `--ink-3` (`--mist` on night). Mark it `aria-hidden="true"` and add a `TODO(asset A3/A4/A5)`
  comment.
- Logo: done (A1). Remove the `TODO(asset A1)` markers.
- **A1 display copies:** keep the 512 px originals and generate them once (committed, no build-time image
  pipeline). Use WebP lossless with alpha: header `light` at 44 and 88 px (1x/2x), footer `dark` at 96 and
  192 px, studio `dark` at 360 and the original 512 px (`srcset` 1x/2x). Set `width`/`height` on every `<img>`.
  The header emblem is eager-loaded; the footer and studio art use `loading="lazy"`.
- Audio: none in v1. (Was the disabled player state in §4.3, removed 2026-10-25.)

---

## 7. Accessibility checklist (designer will review against this)

- [ ] Every text/background pair is in the §1.1 table, and no other pairs are used.
- [ ] One h1. Each section has an h2 linked by `aria-labelledby`. The `header`, `main` and `footer`
      landmarks are present.
- [ ] The hero CTA is the first tab stop after the skip link and language switch. Enter opens `tool/`.
- [ ] Focus is visible on every interactive element, on both paper and night.
- [ ] ~~Play buttons have changing `aria-label`s and are `disabled` while there are no samples.~~ n/a in v1
      (Before/after removed 2026-10-25).
- [ ] FAQ uses `<details>/<summary>`.
- [ ] Outbound links make sense out of context (no "click here").
- [ ] `<html lang>` follows the language switch.
- [ ] No horizontal scroll at 375 px in EN *and* CS. Text zoom to 200% doesn't clip anything.
- [ ] Reduced motion: no transforms or rotations.
- [ ] Signup form (§4.8): the email input has a `<label>`; the submit uses `aria-disabled`, not `disabled`, and
      an incomplete attempt explains itself; every state in the §4.8 table is announced through the one
      `role="status"` element; focus lands on the confirmation after success; the honeypot is `aria-hidden`
      with `tabindex="-1"`; the whole form completes keyboard-only in EN and CS.
- [ ] Export gate (§4.10): opens as a modal over `/tool/` with focus on the heading; Tab cycles email → privacy
      link → Subscribe → Skip → Close and never reaches the tool; Escape and Close leave without exporting and
      return focus to Export; the two answers are the same size and both solid; no `disabled` attributes; the
      dialog carries its own `lang`; the tool's blue focus ring and button styles don't appear inside it;
      every state in the §4.10 table is announced; no horizontal scroll at 375 px or at 200% text, EN and CS.
- [ ] Privacy page (§4.9): one h1 and one h2 per section (six while "Who" and "Visiting this site" are removed) in spec order; both back links work; the language switch
      changes the `<title>`; the footer legal row wraps at 375 without horizontal scroll, in CS too.

## 8. Handoff notes

- The tool itself (at `e255279`) is dark and uses system-ui, so moving from the landing page to the tool will
  feel like a jump. That's for the tool team's Phase 6 design pass (autotuner `PLAN.md` §8), not this repo.
  pm may want to share this spec with them.
- Czech copy: pm/programmer drafts it from §5 and marks it for native review, per the pm spec. Keep the
  `TODO(...)` markers in both languages.
- Czech typography: a one-letter preposition or conjunction (k, s, v, z, o, u, a, i) must not end a line.
  Put a non-breaking space (`\u00A0`) after it in `cs.ts`.
