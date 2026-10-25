# Can the tuner's green theme be changed to our brand colours?

Read-only investigation, 2026-10-25. The researcher wrote it and the pm spot-checked it. It covers the
autotuner at the pinned commit `e255279` (branch `aidan/pitch-engine`). Paths are relative to the autotuner repo.

**Verdict: yes, with caveats.** No library sets the green. It all lives in the tool's own code: 8 lines in 2
files. But the canvas green also means "in tune", and from our side we could only reach it with a fragile
patch to the built bundle. Recommended route: ask the tool team.

## Where the green comes from

| # | Where | Value | What it is | Brand or meaning |
|---|---|---|---|---|
| G1 | `src/index.css:299` | `#3fbf86` | Play/pause icon (`.transport-buttons .play`, an SVG using `currentColor`) | Brand |
| G2 | `src/index.css:325-327` | `#2fbf7f` → `#1e8a5a`, mint sweep, glow `rgba(63,191,134,.35)` | "Tune Up" button gradient, border and glow. `docs/DECISIONS.md:67-69` calls it "the only coloured control" | Brand |
| G3 | `src/index.css:333-335` | `#3fd08f`, `#23a066`, glow `.55` | Tune Up hover | Brand |
| G4 | `src/editor/edits.ts:99` | `IN_TUNE = [63, 191, 134]` | `tuningColor()` blends from `OFF_PITCH` pink `[224, 86, 155]` (50 cents off) to this green (within 10 cents). Konva draws it at `NoteBlob.tsx:76-77, 86`, so CSS can't reach it | **Meaning** |

- **Also tied to G4:** a unit test, `src/editor/edits.test.ts:123`, asserts the green value.
- **Not involved:** there's no Tailwind, no UI kit and no icon library. Konva only draws colours the tool passes in.
- **CSS:** it has no colour tokens. Every value is raw hex, and `#3fbf86` is duplicated between the CSS and the TS.

## Brand vs meaning

- **G1–G3 are brand colour,** so they're safe to recolour.
- **G4 is the in-tune/off-pitch scale.** The same 10-cent rule drives Tune Up. On a mostly in-tune vocal, the
  note blobs are most of the green on screen, so a brand-only fix still leaves plenty of green.
- **If G4 changes, re-pick both ends of the scale**, not just the green end. A rust/ember "in tune" next to a
  pink "off pitch" is warm on warm, and red reads as "wrong" in tuner UIs. Today's green/pink pair is already
  weak under deuteranopia (ΔE ≈ 20).

## Options

| Option | Reaches | Effort | Risk |
|---|---|---|---|
| **A. The tool team edits the colours** and adds colour tokens (CSS vars plus a TS palette) | Everything | ~1–2 h for them | Low; medium for G4, which needs a designer-picked scale |
| B. Our `build-tool.mjs` injects a `<style>` into `dist/tool/index.html` | G1–G3 only | Small | Medium: it fails silently if class names change |
| C. Our build patches the literal `[63,191,134]` in the built JS | The canvas too | Small | High: it breaks on any upstream change, and the deployed tool would differ from the tool team's code |
| D. CSS `hue-rotate()` filter on the canvas | Everything, wrongly | Small | Not viable: it shifts the pink and blue too |

- **Recommendation: A.** It fits the tool team's planned design pass (`PLAN.md:235-238` and `PLAN.md:320`, "keep
  dark or adopt the light direction?").
- **B and C** sit uneasily with this repo's rule that changes go to the tool team. Use them only as a demo
  stopgap, and only if the user decides so.

## Contrast on the tool's dark backgrounds

- **`--rust` #BF3C19 as an icon or stroke:** fails 3:1 (2.0–3.5). It works only as a fill behind white text
  (5.42 with a white label).
- **`--ember` #E5683F as an icon or stroke:** passes (3.3–5.7). It fails behind a white bold 14 px label (3.29).
- **Takeaway:** the same split as on the landing page. The designer picks the final colours.

## Also off-brand (not green)

- **Blue `#7f9cf5`:** focus ring, selection, marquee and playhead.
- **Blue buttons `#1f6feb` / `#388bfd`:** Export.
- **Dropzone hover:** `#5eb0ef`.
- **Favicon:** Vite's default.
- **Snap checkbox:** browser-default accent.

Recolouring only the green leaves blue as the tool's main accent.

## Open questions for the tool team

1. Is the Phase 6 design pass happening, and can our palette feed it?
2. Will they add colour tokens, so theming becomes config rather than code?
3. Is the in-tune green fixed meaning, or open to a new two-ended scale?
4. While they're in there: a favicon, and a merge or tag of `aidan/pitch-engine` (our pin risk).

## Knock-on effect for this repo

The How it works banner (`src/assets/howto.png`, design-spec A8) is a screenshot of the green UI. Retake it if
the tool is recoloured.

**Status (2026-10-25):** two decisions are waiting on the user. Should the pm send option A to the tool team?
And do we want stopgap B for the client demo?
