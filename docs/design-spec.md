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

Page order (2026-10-25): Header → Hero (paper) → How it works (paper, ending in the dark tool banner) →
The studio (night) → Next step (paper) → FAQ (paper-2) → Footer (night). Before/after (§4.3) was removed.

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
  `TODO(email)`: "No account" must change when the tool adds an email step.
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
2. **Do I need an account?** Not right now. You can use the tuner without signing up.
   `TODO(email)`: placeholder until the tool team decides on email. Don't promise "email only at download".
3. **Does my audio get uploaded?** No. The tuner runs entirely in your browser, and your audio is never sent
   to us or anyone else. Your recent files are kept in this browser, on this device, so you can reopen them.
   You can remove them at any time.
4. **Which files work?** WAV, MP3, OGG and FLAC, up to 100 MB and 10 minutes long. It works best on a solo
   vocal without music behind it.
5. **What do I get when I download?** A full-quality 24-bit WAV, or a smaller 192 kbps MP3.
6. **Does it work on my phone?** You can open it on a phone. Moving notes is much easier with a mouse or
   trackpad, so a laptop or desktop is best.

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
- Copyright: © 2026 Faust Studio. `TODO(verify)`: legal owner name. fauststudio.net shows
  "© 2025 by Richard Mader jr."

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

## 8. Handoff notes

- The tool itself (at `e255279`) is dark and uses system-ui, so moving from the landing page to the tool will
  feel like a jump. That's for the tool team's Phase 6 design pass (autotuner `PLAN.md` §8), not this repo.
  pm may want to share this spec with them.
- Czech copy: pm/programmer drafts it from §5 and marks it for native review, per the pm spec. Keep the
  `TODO(...)` markers in both languages.
- Czech typography: a one-letter preposition or conjunction (k, s, v, z, o, u, a, i) must not end a line.
  Put a non-breaking space (`\u00A0`) after it in `cs.ts`.
