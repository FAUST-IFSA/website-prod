# CLAUDE.md

Guidance for Claude Code (and humans) working in this repo. Last rewritten 2026-10-20.

## What this is

The **landing page website for a free, browser-based vocal tuner** made for Faust Studio, a recording studio in
Prague (client site: https://www.fauststudio.net/). The site has two parts:

- **Landing page** (this repo's `src/`): sends visitors to the tool and presents Faust Studio (sessions,
  courses) as the paid next step.
- **The tuner itself**: built by a separate team in `FAUST-IFSA/autotuner`. This repo does **not** contain its
  source. It pins one commit and builds it into the site at `/tool/` (see below).

Business goal: free tool → collect users' emails → upsell studio time, courses and other Faust products. Our
team (Paris; the repo is shared with the Berlin team) also owns the competitive review, marketing strategy, an
AI agent/automation built on the email list, QA/UX, and docs. Background: `Team-Docs/PROJ-DESC.md`,
`Team-Docs/MARKET-RESEARCH.md`, `Team-Docs/Proposal.docx`.

**Current status: client demo, NOT production.** It's live at https://faust-ifsa.github.io/website-prod/ (the
tool is at `/website-prod/tool/`) and marked `noindex`. Placeholder images and audio, an unreviewed Czech
draft and unconfirmed prices are expected.

## Commands

Node 22 (Vite 8 needs ≥ 20.19 / 22.12).

```bash
npm install
npm run dev       # landing page only, http://localhost:5173/website-prod/ (the /tool/ link 404s in dev)
npm run build     # tsc + landing build -> dist/, then scripts/build-tool.mjs -> dist/tool/
npm run preview   # serves dist/ at http://localhost:4173/website-prod/, tool included. Use this to test the CTA
npm run lint      # oxlint. 2 known Fast Refresh warnings in src/i18n.tsx, harmless
```

There are no unit tests in this repo. Verification so far has been headless Chromium (Playwright installed in
a scratchpad, not in the repo) plus axe-core: CTA → tool → upload → analysis → MP3 export with no 4xx, 0 axe
violations in EN and CS, and no horizontal scroll at 375 px.

## Layout

```
site.config.json        THE config: base path + pinned autotuner commit (see below)
index.html              landing entry; meta description, title, robots meta
vite.config.ts          reads base from site.config.json
scripts/build-tool.mjs  fetches + builds the pinned autotuner into dist/tool/
src/
  App.tsx               section order: Header, Hero, HowItWorks, BeforeAfter, Studio, NextStep, Faq, Footer
  sections/*.tsx        one file per page section
  components.tsx        SectionHead, Outbound link, LangSwitch, etc.
  copy/en.ts, cs.ts     ALL visible text. cs must have the same shape as en (enforced by tsc)
  i18n.tsx              language context: useCopy(), useLang()
  faust.ts              Faust facts/links that don't vary by language + TOOL_URL
  index.css             design tokens (CSS custom properties) + all styles
docs/
  landing-v1-spec.md    pm spec: requirements, acceptance criteria, out-of-scope list
  design-spec.md        designer spec: tokens, fonts, section layouts, final EN copy, asset list (A1–A7)
.github/workflows/deploy.yml   GitHub Pages deploy on push to main
Team-Docs/              proposal, market research, project description, team diagnostic (not site code)
webdesign.md            early design ideas/inspiration (superseded where design-spec.md disagrees)
TODO.md                 old team todo list (mostly superseded)
```

## How the autotuner repo connects

- **Repo:** https://github.com/FAUST-IFSA/autotuner (public). A local clone may exist at `../autotuner`
  (`/Users/fin/autotuner`), but the build doesn't use it.
- **Pin:** `site.config.json` → `autotuner.commit` (a full SHA). Currently `e255279…` on branch
  **`aidan/pitch-engine`, which is not merged to `main`**. If that branch is deleted or force-pushed, the pinned
  commit may become unfetchable and the build breaks. Ask the tool team to merge or tag it.
- **Build (`scripts/build-tool.mjs`):** shallow-fetches the SHA into `.autotuner/` (gitignored), runs
  `npm ci` there (required, because its postinstall copies the Basic Pitch model and tfjs WASM files into the
  tool's `public/`), then `vite build --base=<base>tool/ --outDir dist/tool`. The install is cached per commit
  via a stamp file, so rebuilds take ~1 s.
- **To ship a new tool version:** change only `autotuner.commit`, then build and preview. Check that the tool
  still analyses an upload with no 404s.
- **Why sub-path hosting works:** the tool loads its model/WASM from `import.meta.env.BASE_URL` and its workers
  via `new URL(..., import.meta.url)`. If the tool team ever hard-codes `/models/...`-style absolute paths, it
  breaks under `/website-prod/tool/`. Re-check this when bumping the pin.
- **What the tool is:** Vite + React + TS single-page app with no router and no server. Everything runs in the
  browser: Web Audio decode, a Basic Pitch (tfjs WASM) + pitchy analysis worker, a Konva pitch editor,
  Signalsmith pitch shifting, WAV/MP3 export (lamejs worker), and recent files in IndexedDB. Single-threaded
  WASM, because GitHub Pages can't send the COOP/COEP headers threads need. Its docs: `PLAN.md` and
  `docs/DECISIONS.md` in that repo.
- **Rules:** never modify the autotuner repo from here. Changes go to the tool team. Landing → tool is a plain
  link (`TOOL_URL` in `src/faust.ts`). There is no file hand-off between the two pages.
- **Shared origin:** both pages (and any other FAUST-IFSA Pages site) share `faust-ifsa.github.io`, so they
  share localStorage/IndexedDB. Namespace keys (the landing page uses `faust-landing:*`).

## Deploy

- **GitHub Pages via Actions:** `.github/workflows/deploy.yml` runs on every push to `main` (or manually via
  workflow_dispatch). Steps: Node 22, `npm ci`, `npm run build`, upload `dist/`, deploy-pages. Repo Settings →
  Pages → Source must be "GitHub Actions" (already set). No secrets needed now that both repos are public.
- **Base path:** `site.config.json` → `base` (`/website-prod/`). It's the only place it lives. `vite.config.ts`
  and `build-tool.mjs` read it, and code uses `import.meta.env.BASE_URL`. Never hard-code `/website-prod/`.
- **noindex (demo only):** `site.config.json` → `"noindex": true` is the single switch. It injects
  `<meta name="robots" content="noindex, nofollow">` into the landing page (a `transformIndexHtml` plugin in
  `vite.config.ts`) and into `dist/tool/index.html` (`build-tool.mjs`, which fails the build unless the tool's
  HTML has exactly one `<head>`). Set it to `false` for a real launch. Don't use a robots.txt Disallow: it would
  hide the noindex from crawlers.
- **Later (production):** probably Vercel + a custom domain. Set `base` to `/`, remove the noindex, and the
  same build works. No Next.js: the team chose Vite to match the tool.
- **GitHub Pages limits:** static files only. No server, no custom headers, no SPA fallback. So: no
  client-side routes (the language is state, not a URL), and no backend for email collection.

## Content and copy rules

- **All visible text lives in `src/copy/en.ts` and `cs.ts`.** Don't put strings in components. The Czech file
  is a machine draft marked `TODO(cs-review)`, for a native speaker to review.
- **Language:** a saved choice (saved only when the user clicks the switch) wins. Otherwise CS if any
  `navigator.languages` entry starts with `cs`, else EN. The switch is in both the header and the footer.
- **Honesty:** never claim the tool does something it doesn't. True today: free, no account, audio never leaves
  the device. If the tool team adds an email gate, update every `TODO(email)` string.
- **Trademark:** "Auto-Tune" is an Antares trademark. Visible copy says "vocal tuner"/"the tuner".
  "autotune" appears only in the meta description, pending a decision (`TODO(name)`).
- **Studio facts:** take them only from fauststudio.net (founded 1991 by Richard Mader, per `/kopie-about`).
  Mark anything unconfirmed `TODO(verify)`. The copyright is "© 2026 Faust Studio" (decided by the user).
- **TODO tags in source:** `TODO(verify)` facts/prices/naming, `TODO(email)`, `TODO(name)`, `TODO(audio)`
  before/after samples, `TODO(asset A3–A5)` photos, `TODO(cs-review)`. Grep for them before any client
  handover.

## Design

- **Source of truth:** `docs/design-spec.md`. The look follows fauststudio.net: cream `--paper #FFFDF4`, ink
  `#151515`, rust `--rust #BF3C19`, black "night" bands for the studio section and footer. Fonts are Jost
  Variable + Barlow Semi Condensed, self-hosted via Fontsource (no Google Fonts requests). The header/footer
  wordmark uses Russo One (`--font-brand`), a stand-in for fauststudio.net's "P22 Constructivist Square". That
  font is a demo copy not licensed for commercial use or embedding, so never self-host or trace it. The header
  matches fauststudio.net's proportions on desktop (89 px tall) and stacks on mobile (design-spec §3.2). Icons: lucide-react.
- **Tokens:** use the CSS custom properties in `src/index.css`, not raw values. Light theme only. All text pairs
  pass WCAG AA. Keep them that way.
- **Accessibility:**
  - skip link
  - the CTA as an early tab stop
  - FAQ as `<details>`
  - language buttons with names that include the visible text (WCAG 2.5.3)
  - no horizontal scroll at 375 px, including at 200% text size
- **Decided against:**
  - the header wordmark is not a link (it would leak visitors off the funnel); fauststudio.net is linked in the
    footer
  - the hero CTA is a link, not a real drop zone

## Team workflow

- **Roles:** four Claude sessions (pm, programmer, researcher, designer), each in its own terminal. The pm
  writes specs and acceptance criteria and delegates. Code goes to the programmer, and visual/UX decisions go to
  the designer. Use the existing sessions; don't spawn subagents for role work.
- **Git:** commit or push only when the user asks. Fast-forward only, no force-push. Stage files by explicit
  path. Commit messages end with the Co-Authored-By line the session provides.
- **This file is tracked and shared** with both teams. Keep it current when the setup changes. Office lock files
  (`~$*`) are gitignored.
- **The user pushes:** prepare changes in the working tree and hand the user an explicit `git add` path list.
  Don't commit or push unless the user says so for that change.

## Open decisions / known gaps

- **Email collection:** where signup emails are stored. The tool's email gate is still a client-side stub with
  no backend, and GitHub Pages can't host one. This blocks the automation deliverable.
- **Naming:** "Faust Studio" vs "Faust Records" (the client site uses both). The user's call so far: only the
  header wordmark reads "FAUST RECORDS", matching fauststudio.net. The footer, copy, title and copyright stay
  "Faust Studio" until this is settled. Also the session/course prices
  (~1,000 / 700 CZK/h) and the number of studios (2 or 3?).
- **The word "autotune"** in copy (a trademark vs search-traffic tradeoff). Put it to the client.
- **Assets:** from design-spec §6, still missing: photos A3–A5, the before/after vocal with singer consent (A6),
  and the OG image (A7). The A1 logo is in `src/assets/` as the Faust building line art (`faust-light.png` for
  paper, `faust-dark.png` for night bands, with resized WebP copies), used in the header, the footer and the
  studio band. It replaces the A2 photo. A ≥1024 px or SVG version of the art would make it sharp on retina.
- **Visual jump:** the tool's dark system-ui look clashes with the landing page. That's for the tool team.
- **v2 ideas parked:**
  - a real upload box in the hero that hands the file to the tool (possible via shared-origin IndexedDB, but it
    needs tool-team changes)
  - a full-window drop guard
  - dark theme
  - a working before/after player once real audio exists
- **The "autotuner" pin:** see the unmerged-branch risk above.
