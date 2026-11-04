# CLAUDE.md

Guidance for Claude Code (and humans) working in this repo. Last rewritten 2026-10-20, updated 2026-11-04 (privacy policy page).

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
site.config.json        THE config: base path + signup endpoint URL + pinned autotuner commit (see below)
index.html              landing entry; meta description, title, robots meta
privacy/index.html      second Vite entry -> /privacy/ (a static file, not a route: Pages has no SPA fallback)
vite.config.ts          reads base + signupEndpoint from site.config.json (VITE_SIGNUP_ENDPOINT overrides)
scripts/build-tool.mjs  fetches + builds the pinned autotuner into dist/tool/
wix/                    the Velo HTTP function Faust pastes into their Wix site + README + test.sh (see Email capture)
src/
  App.tsx               section order: Header, Hero, HowItWorks, Studio, NextStep, Faq, Signup, Footer
  privacy.tsx           entry for /privacy/: LangProvider (with the page's own title) + pages/Privacy
  pages/Privacy.tsx     the privacy policy page: Header, article from copy privacy.*, Footer (design-spec §4.9)
  sections/*.tsx        one file per page section (Signup.tsx = email form, design-spec §4.8)
  components.tsx        SectionHead, Outbound link, LangSwitch, etc.
  copy/en.ts, cs.ts     ALL visible text. cs must have the same shape as en (enforced by tsc)
  i18n.tsx              language context: useCopy(), useLang()
  faust.ts              Faust facts/links + TOOL_URL, PRIVACY_URL, SIGNUP_ENDPOINT, SIGNUP_CONSENT_VERSION,
                        PRIVACY_POLICY_VERSION. brandName = footer wordmark, headerBrandName = header
  vite-env.d.ts         types for import.meta.env.SIGNUP_ENDPOINT
  index.css             design tokens (CSS custom properties) + all styles
  assets/               logo art (PNG originals + resized WebP), favicon-32/48.png, apple-touch-icon.png,
                        howto.png (tool screenshot original) + cropped howto-1120/2240.webp
docs/
  landing-v1-spec.md    pm spec: requirements, acceptance criteria, out-of-scope list
  design-spec.md        designer spec: tokens, fonts, section layouts, final EN copy, asset list (A1–A8)
  email-capture-spec.md       pm spec for the signup form + Velo endpoint: contract, criteria, task status
  email-capture-migration.md  step-by-step install on Faust's real site, with what failed on the test site
  privacy-policy-spec.md      pm spec for the /privacy/ page: required content (GDPR Art. 13), criteria, tasks
.github/workflows/deploy.yml   GitHub Pages deploy on push to main
Team-Docs/              proposal, market research, project description, team diagnostic (not site code)
reports/                research write-ups (Wix integration options, tool theme-colour findings,
                        privacy-policy-facts.md = sourced facts behind the policy text)
webdesign.md            early design ideas/inspiration (superseded where design-spec.md disagrees)
TODO.md                 old team todo list (mostly superseded)
```

## How the autotuner repo connects

- **Repo:** https://github.com/FAUST-IFSA/autotuner (public). A local clone may exist at `../autotuner`
  (`/Users/fin/autotuner`), but the build doesn't use it.
- **Pin:** `site.config.json` → `autotuner.commit` (a full SHA). Currently `72b353a…`, which is on the tool
  repo's `main` (checked 2026-11-04 via the compare API: 17 behind, 0 ahead), so the old unmerged-branch risk no
  longer applies. If a future pin points at an unmerged branch again, ask the tool team to merge or tag it.
- **Build (`scripts/build-tool.mjs`):** shallow-fetches the SHA into `.autotuner/` (gitignored), runs
  `npm ci` there (required, because its postinstall copies the Basic Pitch model and tfjs WASM files into the
  tool's `public/`), then `vite build --base=<base>tool/ --outDir dist/tool`. The install is cached per commit
  via a stamp file, so rebuilds take ~1 s.
- **To ship a new tool version:** change only `autotuner.commit`, then build and preview. Check that the tool
  still analyses an upload with no 404s. If the tool's look changed, retake the How it works screenshot
  (`src/assets/howto.png`, design-spec A8), which shows the UI at `e255279`.
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
  same build works. No Next.js: the team chose Vite to match the tool. The privacy policy then needs its
  "Visiting this site" (hosting) section back for the launch host: any host logs IPs, so name the processor, the
  legitimate-interest basis and the transfer safeguard (removed 2026-11-04 because GitHub Pages isn't permanent).
- **GitHub Pages limits:** static files only. No server, no custom headers, no SPA fallback. So: no
  client-side routes (the language is state, not a URL), and no backend of ours; email collection POSTs to a
  Velo function on Faust's Wix site instead (see Email capture).

## Email capture (added 2026-11-03)

Spec: `docs/email-capture-spec.md`. Install guide: `docs/email-capture-migration.md`. Research:
`reports/Wix Core email capture.md`.

- **How it works:** `src/sections/Signup.tsx` (between FAQ and Footer) POSTs
  `{email, lang, source:"landing", consent:true, consentVersion, website:""}` to `SIGNUP_ENDPOINT`. The endpoint
  is a Velo HTTP function (`wix/http-functions.js`, ~75 lines) living in Faust's Wix site; it creates a Wix
  Contact with label `tuner` and three custom fields (`tuner-consent-at`, `tuner-consent-version`,
  `tuner-source`). No server of ours, no secret in the page, no cookies, email never stored client-side.
  Responses: 200 ok (incl. duplicates), 400 bad input/honeypot, 500 Wix refused, 204 preflight.
- **Config:** `site.config.json` → `signupEndpoint` (production URL `https://www.fauststudio.net/_functions/tunerSignup`).
  `VITE_SIGNUP_ENDPOINT` (shell or gitignored `.env.local`) overrides it for dev/preview. Read in code as
  `import.meta.env.SIGNUP_ENDPOINT`, never hard-code the URL. `SIGNUP_CONSENT_VERSION` in `src/faust.ts` is
  `2026-11-v1`; bump it whenever the consent sentence changes and keep the old text in the repo.
- **Status:** the function and form are built and tested end to end on our free test site
  (`contactfaux400500.wixsite.com/my-site-3`). **Not yet installed on fauststudio.net**, so the production URL
  404s and a deployed form shows its error state on submit until Faust pastes the file (spec task 0/4).
- **Wix facts learned the hard way** (all handled in the code, don't re-learn them):
  - The backend file must be named exactly `http-functions.js`; create it via Backend → `+` → Expose site API.
    Anything else gives `404` + `x-wix-code-user-error-details {"code":"MODULE_NOT_FOUND"}`, identical to a
    site with no Velo code. `/_functions-dev/` runs the unpublished editor code.
  - Wix **silently drops** unknown extended fields (contact created, HTTP 200, consent proof lost), and refuses
    unknown labels. So the function creates the label/fields itself (`findOrCreateLabel` /
    `findOrCreateExtendedField`, once per cold start). Nothing to create in the dashboard.
  - API-created label/field keys get a **random suffix** (`custom.tuner-WnXAj`). Never hardcode keys; the
    function uses the ones Wix returns, matched by display name. Faust must not rename them.
  - Use `wix-crm-backend` (stable), not `wix-crm.v2` (Developer Preview). `createContact` takes flat
    `labelKeys[]` and flat `extendedFields{}`; duplicates throw `DUPLICATE_CONTACT_EXISTS` (treated as success).
  - Wix's Logs panel is live-only; it shows nothing from before you opened it.
  - Publishing the Velo file publishes Faust's whole site, pending edits included.
- **Form a11y decisions:** submit uses `aria-disabled` (focusable; an incomplete attempt announces a hint and
  moves focus), not `disabled`. One `role="status"` announcer. Honeypot `aria-hidden` + `tabindex=-1`.
  Button says "Subscribe", not "Sign up", so the FAQ's "without signing up" keeps meaning an account. The
  privacy link is a plain link (no ↗) to our own policy page, `PRIVACY_URL`, always rendered.
- **Privacy policy page:** our own, at `/privacy/`. See the Privacy policy section below.
- **Not decided:** the user may later move the form into the tool instead of the landing page. `Signup.tsx`
  and design-spec §4.8 then serve as the tool team's reference. Same endpoint, `source:"tool"`.
- **Test:** `wix/test.sh <site root or endpoint URL>` runs the criterion-10 checks with curl.

## Privacy policy (added 2026-11-04)

Spec: `docs/privacy-policy-spec.md` (required content, criteria, review log of what was cut and why). Layout:
design-spec §4.9. Text: design-spec §5 "Privacy policy page" (the source; `copy/en.ts` → `privacy.*` mirrors it
verbatim, `cs.ts` is the machine draft). Facts behind it: `reports/privacy-policy-facts.md`.

- **What it is:** a second static page, `privacy/index.html` → `src/privacy.tsx` → `src/pages/Privacy.tsx`, built
  as its own Vite entry (`rollupOptions.input`), because GitHub Pages has no SPA fallback and the site has no
  router. It reuses `Header`, `Footer` and `LangProvider` (which takes a `title` prop so the tab title follows the
  switch). The noindex plugin and favicons apply to it like the landing page. URL in code: `PRIVACY_URL`
  (`faust.ts`, base-relative). Linked from the signup consent row (plain link, same tab, always rendered) and the
  footer's bottom row (`aria-current="page"` on the policy page itself).
- **What it says, and why each part is there.** Six sections: what it covers, the tuner, email signup, no
  cookies/no tracking, your rights, changes. GDPR Art. 13 drives the signup and rights sections (purposes,
  consent as legal basis, Wix as processor with the Israel adequacy decision + SCCs, retention, the rights list,
  withdrawal, complaint to the ÚOOÚ, "optional", no automated decisions). The tuner and no-tracking sections
  are **not** required by GDPR: they exist because "your audio never leaves your device" is the hero claim and
  this page is where a visitor checks it.
- **Two Art. 13 items are suspended, not met** (user decisions, 2026-11-04; text kept in design-spec §5, ids
  `who` and `hosting` reserved): the controller's identity, until Faust says which Richard Mader / IČO (see Open
  decisions); and the hosting disclosure, until the launch host is known (see Deploy → Later). Reinstate both
  before the site leaves `noindex`.
- **Honesty rules for this page:** every sentence must be true of the built site at the pinned tool commit.
  "Nothing on this site is loaded from other companies" was verified on preview (landing + `/tool/` through
  upload → analysis → MP3 export, every request same-origin, at `72b353a`), as were recent files living in
  on-device IndexedDB and the tool having no email gate at all. **Re-verify all three when the pin moves.** No
  cookie banner: nothing here needs consent (language choice in localStorage only on a click; the tool's recent
  files), so a banner would misdescribe the site. Promises Faust must keep (delete on request, reply within a
  month, unsubscribe link in every email) are listed in `docs/email-capture-migration.md` → "Faust's obligations".
- **Versioning:** `PRIVACY_POLICY_VERSION` (`faust.ts`, currently `2026-11-v1`) is interpolated into
  `privacy.updated`. Bump it and the date together when the text changes in substance; design-spec §4.9 lists
  every version, like the consent sentences in §4.8.
- **`faust.privacy`** still means Faust's *own* policy URL (empty: fauststudio.net has none, and its Wix cookie
  banner is off, which is worth raising with them). When set, our page shows a "see also" link; it never
  replaces ours.
- **Czech:** `TODO(cs-review)` like the rest, but it is legal text: a native speaker must review it before launch.

## Content and copy rules

- **All visible text lives in `src/copy/en.ts` and `cs.ts`.** Don't put strings in components. The Czech file
  is a machine draft marked `TODO(cs-review)`, for a native speaker to review.
- **Language:** a saved choice (saved only when the user clicks the switch) wins. Otherwise CS if any
  `navigator.languages` entry starts with `cs`, else EN. The switch is in both the header and the footer.
- **Honesty:** never claim the tool does something it doesn't. True today: free, no account, audio never leaves
  the device. The landing-page signup is optional and no copy may imply it's required. If the tool team adds an
  email gate, update every `TODO(email)` string.
- **Trademark:** "Auto-Tune" is an Antares trademark. Visible copy says "vocal tuner"/"the tuner".
  "autotune" appears only in the meta description, pending a decision (`TODO(name)`).
- **Studio facts:** take them only from fauststudio.net (founded 1991 by Richard Mader, per `/kopie-about`).
  Mark anything unconfirmed `TODO(verify)`. The copyright is "© 2026 Faust Studio" (decided by the user).
- **TODO tags in source:** `TODO(verify)` facts/prices/naming, `TODO(email)`, `TODO(name)`, `TODO(cs-review)`. Grep for them before any client
  handover.

## Design

- **Source of truth:** `docs/design-spec.md`. The look follows fauststudio.net: cream `--paper #FFFDF4`, ink
  `#151515`, rust `--rust #BF3C19`, black "night" bands for the studio section and footer. Icons: lucide-react.
- **Fonts** (all self-hosted via Fontsource, no Google Fonts requests):
  - **Body text: Jost Variable at weight 500**, the user's choice. They asked for Architype Renner Medium, which
    is commercial (Monotype/MyFonts, and Czech isn't listed). "Renner*", its free version, *is* Jost, so Jost 500
    is the open equivalent.
  - Emphasis is 600: h3, stats, FAQ questions, drop message, h1 and buttons.
  - Body size is 17 px. fauststudio.net uses 20 px (Futura Book, 400). 18 px was suggested for extra sharpness
    and not applied.
  - Labels: Barlow Semi Condensed.
  - Wordmark: Russo One (`--font-brand`), a stand-in for fauststudio.net's "P22 Constructivist Square". That font
    is a demo copy not licensed for commercial use or embedding, so never self-host or trace it.
- **Header (design-spec §3.2):** matched to fauststudio.net by measurement. No rust bar (the user removed it).
  - **Desktop (≥640 px):** 89 px tall (88 px row + 1 px border). The 56 px emblem sits at x 70 / y 8 from the
    header's top-left, then a 25 px gap. The "FAUST RECORDS" baseline is at y 56, in `--ink-2`. The lockup sits
    10 px left of the page container edge, which is intentional. Not sticky.
  - **Below 640 px:** a stacked, centred lockup, 129 px tall, with the language switch pinned top-right.
- **Favicon:** `index.html` links `src/assets/favicon-32.png`, `favicon-48.png` and `apple-touch-icon.png`, so
  Vite base-paths them. They're cropped from `faust-light.png` (black on transparent). The apple-touch icon is
  opaque on `--paper`, because iOS paints transparency black. `/tool/` keeps the autotuner's own favicon. Known
  gap: the icon is nearly invisible on dark browser tab strips. A `prefers-color-scheme: dark` variant using
  `faust-dark` was offered but not built.
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
  - in the How it works tool banner (design-spec §4.2), only the centred "Open the tuner" button is a link, not
    the image (one link, one tab stop)

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

- **Email collection:** solved in principle (see Email capture): emails go to Faust's Wix Contacts. Waiting on
  Faust: Dev Mode + paste the file (or a collaborator seat) and their custom domain for the origin allow-list.
  The privacy link no longer waits on Faust (it's our page); their own policy URL is optional (`faust.privacy`). Contacts arrive "Never subscribed"; flipping them is Faust's dashboard toggle.
  The tool's own email gate is still a stub; it gets the same endpoint contract once Faust's install is verified.
- **Privacy policy facts:** which Richard Mader / IČO is the controller (founder 10170367 or jr. 01577778, see
  `reports/privacy-policy-facts.md`) is Faust's call. Until they answer, the "Who is responsible" section is
  **removed** from the page (user decision, 2026-11-04); the candidates sit in a comment above `privacy.sections`
  in `en.ts`, and the §5 text is restored once Faust confirms.
  The CS policy is machine-translated **legal** text: a native speaker must review it before the site leaves
  `noindex`. Who does that (Faust or a teammate) is undecided.
- **Naming:** "Faust Studio" vs "Faust Records" (the client site uses both). The user's call so far: only the
  header wordmark reads "FAUST RECORDS", matching fauststudio.net. The footer, copy, title and copyright stay
  "Faust Studio" until this is settled. Also the session/course prices
  (~1,000 / 700 CZK/h) and the number of studios (2 or 3?).
- **The word "autotune"** in copy (a trademark vs search-traffic tradeoff). Put it to the client.
- **Faust's own font licence:** fauststudio.net's wordmark font is an unlicensed P22 demo file. Raise it with
  Faust tactfully. A bought P22 licence, or an official wordmark image, would let us match it exactly.
- **Assets:** from design-spec §6, still missing: the OG image (A7). (A6, the before/after vocal, is no longer
  needed since that section was removed.) Photos A3–A5 are in as `src/assets/BS.avif`, `GS.avif` and `CS.avif` (400–570 px wide, below the
  ≥1200 px spec, so soft on retina). The A1 logo is in `src/assets/` as the Faust building line art (`faust-light.png` for
  paper, `faust-dark.png` for night bands, with resized WebP copies), used in the header, the footer and the
  studio band. It replaces the A2 photo. A ≥1024 px or SVG version of the art would make it sharp on retina.
- **Visual jump:** the tool's dark system-ui look clashes with the landing page. That's for the tool team.
- **Tool theme colour:** investigated 2026-10-25, see `reports/autotuner-theme-colour.md`. Recolouring the
  tool's green is possible without changing libraries (8 lines of the tool's own code), but the canvas green is
  also the "in tune" signal, and blue is off-brand too. The recommended route is asking the tool team (with
  colour tokens). Waiting on the user: whether to send that request, and whether to use a buttons-only CSS
  override from `build-tool.mjs` as a demo stopgap.
- **v2 ideas parked:**
  - a real upload box in the hero that hands the file to the tool (possible via shared-origin IndexedDB, but it
    needs tool-team changes)
  - a full-window drop guard
  - dark theme
  - a before/after audio section (removed from v1 by the user, 2026-10-25; the old design is kept in
    design-spec §4.3)
- **The "autotuner" pin:** see the unmerged-branch risk above.
