# Landing page v1: spec

Owner: pm · Status: built on branch `landing-v1`, not committed or deployed · Date: 2026-10-20

## Goal

Ship one static site to GitHub Pages: the landing page at `/website-prod/` and the autotuner at
`/website-prod/tool/` (scheme B). The landing page gets visitors into the tool within seconds and shows them
Faust Studio as the next step.

## Decisions already made (by the user)

- **Stack:** Vite + React + TypeScript, the same as the tool. Not Next.js.
- **Scheme B:** this repo pins the autotuner to a specific commit and builds it into `dist/tool/`. The tool's
  source is not copied in here.
- **Style:** the principles in `webdesign.md`, biased toward the look of https://www.fauststudio.net/. Where the
  two disagree, the Faust Studio site wins.

## Facts the work depends on

- Autotuner repo: `FAUST-IFSA/autotuner`, branch `main`, commit `72b353a`. Pin the commit, not `main`.
- The tool is already base-path safe. `vite build --base=/website-prod/tool/` builds correctly (tested,
  about 5 MB including the model and WASM files). `npm ci` runs a postinstall script that copies those files
  into `public/`, so the tool must be built with `npm ci`, not with an existing `node_modules`.
- The tool has **no email gate yet**, and nothing is stored. Today you can use it free with no signup.
- Both GitHub repos are public (checked 2026-10-20), so Actions fetches the autotuner without a token.

## Page sections (in order)

1. **Hero:** headline, one line of value proposition, and a dominant "Try it free" CTA linking to `tool/`.
   Visually it can read as the remove.bg-style "one big box", but it is a link. A real drop zone that hands
   the file to the tool is out of scope (it needs tool-team changes).
2. **How it works:** 3–4 steps: upload, see your notes, drag to fix, export WAV/MP3. Must match what the
   tool actually does today. Under the steps: a banner screenshot of the tool's pitch editor with the
   "Open the tuner" button centred on it (one link, one tab stop). Added 2026-10-25.
3. **The studio:** Faust Studio, Prague, recording since 1991. Take facts only from fauststudio.net. Anything
   unverified gets a visible `TODO(verify)` comment in the source, not invented copy.
4. **Next step:** book a session / take a course, modeled on Abbey Road's rooms and services. Links go to the
   relevant fauststudio.net pages.
5. **FAQ:** including "Is it free?", "Does my audio get uploaded?" (no, it runs in your browser), "Which files
   work?" (WAV, MP3, OGG, FLAC, up to 100 MB / 10 min), and "Do I need an account?"
6. **Footer:** Faust Studio contact link, language switch.

A "Before / after" two-track player section was in v1 with placeholder audio. The user removed it on
2026-10-25 as unnecessary for the page.

## Honesty rules for copy

- Never claim something the tool doesn't do. Today: free, no account, audio stays on your device.
- The email answer in the FAQ is a placeholder until the tool team decides (`TODO(email)` in the source). Do
  not promise "email only at download".

## Language

English and Czech from the start, with a visible switch and a remembered preference. The Czech copy can be a
draft, marked for native review in the source. No client-side routes that need a server fallback: GitHub Pages
has none.

## Acceptance criteria

- [ ] `npm run build` in this repo produces `dist/` containing the landing page and `dist/tool/` containing the
      pinned autotuner.
- [ ] When served locally under `/website-prod/` (e.g. `vite preview`), the landing page loads and its CTA opens
      `/website-prod/tool/`.
- [ ] On the tool page, uploading an audio file completes analysis with no 404s (`model.json`, `.wasm`, both
      workers).
- [ ] The base path is set in exactly one place, so moving to Vercel (`/`) is a one-line change.
- [ ] Shipping a new tool version means changing only the pinned commit.
- [ ] `.github/workflows/deploy.yml` builds and deploys to Pages on push to `main` (no token needed: both
      repos are public). Written but **not triggered**: no push and no repo-settings changes.
- [ ] All sections are present in EN and CS. The layout works at 375 px width with no horizontal scroll.
- [ ] Text contrast passes WCAG AA. The CTA is reachable and usable by keyboard.
- [ ] `.gitignore` covers `dist`, `node_modules` and the tool checkout's build output.

## Out of scope for v1

A working upload box in the hero, email collection/storage, a before/after audio section, analytics, custom domain,
Vercel deployment, and any changes to the autotuner repo.

## Who does what

- **designer:** the visual direction and per-section layout spec in `docs/design-spec.md` (tokens, fonts,
  spacing, components, section layouts, CTA treatment), plus English copy. Message programmer when ready.
- **programmer:** project setup, autotuner pin and build, deploy workflow, i18n, and then the build-out of the
  designer's spec. Work on branch `landing-v1`. Don't commit or push unless the user asks.
