# Privacy policy page v1: spec

Owner: pm · Status: done (tasks 1–5, 2026-11-04; waiting on Faust for the controller name/IČO) · Date: 2026-11-04
Builds on: `docs/email-capture-spec.md` (consent model), `docs/design-spec.md` §4.8 (signup form), CLAUDE.md "Honesty".

## Goal

A privacy policy page on this site, in EN and CS, linked from the footer and from the signup consent row, that
states truthfully what this site and the tuner do with personal data and meets GDPR Art. 13 (information to be
given when data is collected from the data subject) plus the Czech rules on commercial email (Act 480/2004 §7).
It unblocks the "Privacy policy ↗" link under the consent box, which today renders nothing because we were
waiting for a URL from Faust.

## Decisions (pm; say if wrong)

- **Our page, not Faust's.** Faust hasn't sent a policy URL and their site may not have one. Ours covers this
  landing page, the tuner at `/tool/` as hosted by us, and the signup → Wix Contacts flow. If Faust later sends a
  general policy, we link it *from inside* ours ("see also"); it does not replace ours. `faust.privacy` keeps
  meaning "Faust's own policy URL".
- **Controller = Faust Studio** (the signups land in Faust's Wix and the service is offered in Faust's name).
  Legal entity name, IČO and registered address are `TODO(verify)` until the researcher finds them.
- **URL:** `<base>privacy/` (i.e. `/website-prod/privacy/` now, `/privacy/` at a domain root). A second Vite
  HTML entry (`privacy/index.html`), not a client-side route: GitHub Pages has no SPA fallback.
- **Languages:** EN and CS via the existing `useCopy()` mechanism, same switch. The CS text is a machine draft
  marked `TODO(cs-review)` like everything else, but **flag it loudly**: legal text must be reviewed by a native
  speaker before launch. Policies at `noindex` demo stage are fine as drafts.
- **No cookie banner.** Nothing here needs consent under ePrivacy: the only browser storage is the language
  choice (`localStorage`, set only when the visitor clicks the switch) and the tuner's "recent files" in
  IndexedDB, both strictly necessary for a feature the visitor asked for. We disclose them; we don't ask.
- **Plain language.** Short sections, no legalese, 17 px body like the rest of the site. A visitor should be
  able to answer "what do you keep about me?" in under a minute.

## Concepts already decided that the policy must state (nothing new here)

| Concept | Where decided | What the policy says |
|---|---|---|
| Consent is explicit, opt-in, unticked by default | email-capture-spec "Decisions" | Legal basis for emails is consent (Art. 6(1)(a)); you give it by ticking the box |
| Signup is optional; the tool is free without it | CLAUDE.md Honesty, FAQ | Giving an email is never required to use the tuner |
| Proof of consent = timestamp + consent-text version + source | email-capture-spec "Assumptions" | Exactly those three things are stored with the email, in Faust's Wix Contacts |
| No IP, no user agent stored by us | email-capture-spec | Say so. (GitHub's hosting logs are a separate item, below) |
| Unsubscribe any time | consent text `2026-11-v1` | Withdraw consent via the unsubscribe link in any email or by emailing Faust; withdrawal doesn't affect what was sent before |
| No cookies, no localStorage of the email, no third-party scripts | email-capture-spec criterion 7 | State plainly: no cookies, no analytics, no trackers |
| Self-hosted fonts (no Google Fonts IP leak) | design-spec §2 (line ~143) | "Nothing on this page is loaded from third parties" (programmer verifies, criterion 9) |
| Audio never leaves the device | CLAUDE.md Honesty, hero trust line | The tuner decodes, analyses, tunes and exports in your browser; no audio is uploaded |
| Recent files in the browser's IndexedDB | CLAUDE.md "What the tool is" | Stored on your device only; cleared by clearing site data |
| Language choice in localStorage | i18n.tsx | Stored on your device only, only when you click the switch |
| Honeypot field | Signup.tsx | Not personal data; mention only as "a hidden anti-spam field"? **No**: leave it out, it's not data about the visitor |
| Wix is the single store of the list | email-capture-spec "Out of scope" | Wix.com Ltd is the processor hosting Faust's contact list |
| Czech 480/2004 §7: prior provable consent, unsubscribe in every message | Wix report point 2 | Covered by the consent + unsubscribe statements above |
| No double opt-in | email-capture-spec | Nothing to state; just don't claim a confirmation email |

## Required content (GDPR Art. 13 checklist, in page order)

1. **Who** is responsible (controller): Faust Studio, legal entity + IČO + address `TODO(verify)`, contact email
   `faust.email`. No DPO (small business, not required: researcher confirms).
2. **What this page covers**: this landing page, the tuner at `/tool/`, the email signup. Not fauststudio.net
   (link Faust's policy there if/when `faust.privacy` is set).
3. **The tuner**: processes audio in the browser; nothing uploaded; recent files in IndexedDB on the device;
   how to clear them. No account.
4. **Visiting the site** (hosting): the site is served by GitHub Pages, which logs visitors' IP addresses for
   security purposes under GitHub's own privacy statement. Legal basis: legitimate interest (Art. 6(1)(f)) in
   running the site. Retention and transfer mechanism: `TODO(verify)` (researcher). We don't see or use these logs.
5. **Email signup**: what (email, language, timestamp, consent version, source), why (news about sessions,
   courses, the tuner), legal basis (consent), that it's optional, who stores it (Wix, processor), where
   (`TODO(verify)`: EU data centre vs Israel adequacy), how long (until you unsubscribe or ask for deletion;
   Faust to confirm `TODO(verify)`), that each email has an unsubscribe link.
6. **No cookies, no analytics, no profiling, no automated decisions.** Language preference in localStorage.
7. **Your rights**: access, rectification, erasure, restriction, portability, objection, withdrawal of consent
   at any time; how to exercise them (email Faust); right to complain to the Czech supervisory authority
   (Úřad pro ochranu osobních údajů, address + URL `TODO(verify)` researcher).
8. **Changes**: "Last updated" date; policy version string `PRIVACY_POLICY_VERSION` in `faust.ts` next to
   `SIGNUP_CONSENT_VERSION`, interpolated into the copy; every version listed in design-spec §4.9.

## Acceptance criteria

1. `<base>privacy/` loads directly (hard refresh, no landing visit first) on `npm run preview`, in EN and CS, with
   the same header, footer and language switch as the landing page; the switch changes the policy text in place.
2. The footer has a "Privacy policy" link on the landing page and on the policy page itself (both languages).
   Placement: designer.
3. The signup consent row renders its "Privacy policy" link again, pointing at our page. `faust.privacy` stays an
   empty `TODO(verify)` string meaning "Faust's own policy"; a new `PRIVACY_URL` (next to `TOOL_URL` in
   `faust.ts`, base-path relative) is what the form and footer use. The consent-row link is a plain `.link` in the
   same tab, not `Outbound` (designer, §4.8: ↗ means another site).
4. The policy page has a visible link back to the landing page (the header wordmark stays not-a-link, per
   design-spec §3.2).
5. All visible text in `copy/en.ts` + `cs.ts` under `privacy.*`; cs same shape (tsc). CS marked `TODO(cs-review)`
   with an extra note that it's legal text.
6. Every item of the "Required content" list is present. Every unconfirmed **fact** is `TODO(verify)` in the source
   and reads as a bracketed placeholder on the page (e.g. "[registered address]"), never as an invented value.
   **Promises** Faust must keep (delete on request, reply within a month, unsubscribe link in every email) are
   not bracketed: they read as plain sentences, carry `TODO(verify)` in the source, and go into the
   `email-capture-migration.md` handover as Faust's obligations (ruled 2026-11-04).
7. Honesty: no sentence claims something the tool or site doesn't do today. Specifically: no "we never collect
   IP addresses" (GitHub does), no "double opt-in", no "encrypted at rest" claims we can't source.
8. The page is `noindex` while `site.config.json → noindex` is true (the existing `transformIndexHtml` plugin
   must apply to the new entry; programmer checks the built HTML), has its own `<title>` and meta description,
   and the landing favicon.
9. Programmer verifies on preview that the landing page and `/tool/` make **zero requests to other origins**
   (network log: all requests to `localhost:4173`), so the "nothing loaded from third parties" sentence is true.
   If the tool does fetch anything external, report it and the sentence changes.
10. axe: 0 violations EN + CS; no horizontal scroll at 375 px incl. 200% text; headings form a proper outline
    (one h1, h2 per section); lint and build pass.
11. `docs/design-spec.md` gets a §4.9 (policy page layout + footer link) and the copy in §5; CLAUDE.md "Layout",
    "Email capture" and "Open decisions" updated (privacy link no longer waiting on Faust; new page).

## Tasks, in order

| # | Task | Owner | Blocked by |
|---|---|---|---|
| 1 | ✅ 2026-11-04. Facts with sources → `reports/privacy-policy-facts.md`: Faust's legal entity/IČO/address (ARES/justice.cz; site names Richard Mader); ÚOOÚ name/address/URL; Wix as processor (where EU contacts live, transfer basis: Israel adequacy decision / Wix DPA); GitHub Pages visitor logging (what, retention, transfer basis: DPF/SCCs) from GitHub's privacy statement; 480/2004 §7 wording requirements (consent, unsubscribe); whether a DPO or Art. 27 rep applies (expected: no). Confidence per item. | researcher | — |
| 2 | ✅ 2026-11-04. Design-spec §4.9: page layout (text page, header/footer reuse, back link, "last updated"), footer link placement, and the **EN copy** of the policy in §5 following the "Required content" order, plain language, `[placeholders]` where task 1 facts go. | designer | — (fills placeholders after 1) |
| 3 | ✅ 2026-11-04 (89/89 checks; criterion 9: 24 requests, all same-origin, incl. /tool/ at 72b353a). Scaffold: `privacy/index.html` Vite entry + `src/privacy.tsx` + `src/pages/Privacy.tsx` (or similar), `PRIVACY_URL`, footer link, signup link, `privacy.*` copy keys with the designer's text (lorem-free placeholder until 2 lands), noindex check, criteria 1–5, 8–10. CS machine draft mirroring EN. | programmer | 2 for final copy; can scaffold now |
| 4 | ✅ 2026-11-04. Designer: passes §4.9 (one fix to the programmer: privacy/index.html static meta description must equal privacy.meta.description, crawlers read the static HTML). Pm: criteria 6–7 pass, see review log. | designer + pm | 3 |
| 5 | ✅ 2026-11-04. Docs: criterion 11 (CLAUDE.md + email-capture-migration.md "Faust's obligations"). | programmer | 4 |

Tasks 1, 2 and 3 run in parallel today.

## Out of scope for v1 (and why)

- Cookie banner / consent manager: nothing to consent to. Adding one would be a lie about what the site does.
- Terms of service, imprint: not asked for; the tuner has no account or contract. Revisit if the tool gates.
- A policy for fauststudio.net itself: Faust's site, Faust's policy. We link it when they send it.
- A Wix DPA: covered by Faust's existing Wix terms (researcher confirms it exists; we don't sign anything).
- A policy page inside the tool: tool team's code. They get `PRIVACY_URL` and can link it from the gate.
- Double opt-in, data-processing register, DPIA: not required at this scale and not decided (see email spec).

## Risks and open questions

- **Controller identity.** If Faust turns out to be a sole trader (Richard Mader, IČO) rather than an s.r.o., the
  "who" section names a person. Fine legally, but check with Faust before publishing it.
- **Machine-translated legal text.** The CS draft must be reviewed before the site leaves `noindex`. Ask the
  user whether Faust or a native teammate does that.
- **GitHub Pages logs.** We can't turn them off and we don't see them. The honest sentence is "GitHub logs your
  IP address to run the site; see GitHub's statement". If the user finds that too heavy for the client demo,
  the alternative is a hosting move (Vercel has the same issue), not a copy change.
- **Retention of emails** is Faust's decision in their dashboard. The policy promises "until you unsubscribe or
  ask"; Faust has to actually delete on request. Tell them in the handover (add to `email-capture-migration.md`).
- **The tool's "recent files"** claim depends on the pinned autotuner commit. Re-check when bumping the pin.

## Review log

**2026-11-04, pm review of the designer's EN copy (design-spec §5) against criteria 6–7.** Art. 13 coverage:
complete (controller + contact, purposes, both legal bases with the legitimate interest named, processors, transfers,
retention, the rights list incl. withdrawal, complaint to ÚOOÚ, "optional", no automated decisions). Rulings:
- Retention sentence stays unbracketed (promise, not fact); DPO line stays out; "reply within one month" stays.
  All three go to the migration handover as Faust's obligations (task 5).
- Wording fixes requested: (a) §2/intro: "this page" → "this site"/"the landing page" where it means the landing
  page, since the policy is its own page now; (b) §5 list item "which form you used (this page or the tuner)" →
  "which page you signed up from": the tuner has no signup form today (its gate is a stub), and the copy must not
  imply one.
- **Pin mismatch:** the tool facts cite autotuner `e255279`, but `site.config.json` pins `72b353a` (commit e41f6e3
  bumped it; CLAUDE.md still says e255279). The recent-files (IndexedDB) and "nothing uploaded" sentences must be
  re-confirmed at `72b353a`: programmer, during the criterion-9 run. CLAUDE.md's pin note needs the same fix.
- Noted, no change: "only your browser can read them" is true for the visitor; technically any other FAUST-IFSA
  Pages site on the shared origin could read that IndexedDB (CLAUDE.md "Shared origin"). Not worth a sentence
  unless another site appears on the origin.

**2026-11-04, user decision: the "Who is responsible" section is removed** (the controller's name/IČO is unresolved and
bracketed text on the demo isn't wanted). Known gap: GDPR Art. 13(1)(a) requires the controller's identity and contact
details, so the policy is incomplete until Faust names the entity; `faust.email` stays on the page as the contact
(moved into "Your rights"). Reinstate the section (text kept in design-spec §5, marked removed) when Faust answers;
the "Privacy policy facts" item in CLAUDE.md "Open decisions" tracks it. Required-content item 1 is suspended, not
dropped.

**2026-11-04, user decision: the "Visiting this site" (hosting) section is removed.** Reason: GitHub Pages is the demo
host, not the final one, so the section would be rewritten at launch anyway. The "nothing loaded from other companies"
paragraph (the verified same-origin claim, criterion 9) moves into "No cookies, no tracking". Known gap: whichever host
serves the production site will log IP addresses, so a hosting paragraph (processor, legitimate interest, transfer
safeguard) must come back for the launch host; tracked in CLAUDE.md "Later (production)". Required-content item 4 is
suspended, not dropped. `faust.githubPrivacy` is removed with it.
