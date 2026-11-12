# Export email gate + Ecomail: spec

Owner: pm · Status: in progress (gate front end done on preview with a stubbed backend; backend not built;
nothing committed) · Date: 2026-11-10, progress updated 2026-11-11
Research behind it: `reports/ecomail-email-gate.md` (read its summary first). Supersedes the Wix route in
`docs/email-capture-spec.md`; the landing form from that spec stays, its backend changes.

## Goal

When a visitor clicks Export in the tuner, an overlay offers to subscribe them to Faust Studio's emails. They can
subscribe and download, or download without subscribing. Subscribers land in an Ecomail list with provable
consent. The landing-page form feeds the same list. Nothing in the Berlin team's repo changes.

## Decisions (user, 2026-11-10)

- **Trigger:** the tool's Export button, after the visitor has finished working. Not on page load.
- **Optional gate.** "Download without subscribing" is as visible and as easy as subscribing. A required email
  was considered and dropped: no lawful basis for people who decline (report, Part B).
- **Ecomail replaces Wix Contacts.** The Velo function (`wix/`) is retired once Ecomail is verified end to end.
- **Accounts:** ~~the user's own Ecomail account first, then one Blanka creates.~~ Changed 2026-11-11: the
  account in use (`courses`, list 1) **is the final Faust account**. No swap. Tests use fake addresses and are
  deleted afterwards. Double opt-in is off until a sender domain is verified.
- **No changes to `FAUST-IFSA/autotuner`.** The overlay is injected into the tool's built HTML by
  `scripts/build-tool.mjs`, like the noindex tag.

## Changed 2026-11-11 (user): collect now, send later

Sending is deferred until the client's new domain exists, so double opt-in (which needs a verified sender
domain) is **off at launch**. Subscribers are added as subscribed immediately and no email is sent at signup.
Consequences: every text that promised a confirmation email is rewritten (consent sentences, success texts,
policy v2); the with-confirmation wording is kept in design-spec §5 as a draft for when double opt-in is turned
on (a new consent version then). The Worker calls Ecomail with `skip_confirmation: true`, `resubscribe: false`,
`update_existing: false`. Accepted risk: without the confirmation step a mistyped or someone else's address
becomes a subscriber; Faust should turn double opt-in on before the first campaign. The "Double opt-in on"
default and criterion 9's "unconfirmed" below describe the later state.

## pm defaults (say if wrong)

- **Double opt-in on.** Reverses the old spec's "no double opt-in": Ecomail does it natively, the ÚOOÚ
  recommends it, and it keeps junk addresses out of Blanka's list.
- **An address without consent is never transmitted anywhere.** Skipping sends no request at all.
- **Remembering the answer:** subscribed → never ask again (localStorage, `faust-landing:gate`). Skipped → not
  again in this browser session (sessionStorage), asked again on a later visit. The email is never stored.
- **Export is never blocked by the signup.** If the request fails or times out, the export still proceeds and
  the visitor is told the signup did not go through.
- **Fail open.** If the overlay cannot find the Export button at runtime, the tool works as it does today.
- **Language:** the landing page's rule (saved choice, else `cs` if the browser asks for it, else EN), read from
  the same `faust-landing:*` key. The gate has no language switch of its own.
- **Email only.** No name field.

## How the hook works (built and verified on preview at `72b353a`, headless Chromium only)

`src/components/ExportBar.tsx` renders one button, `.export-menu > button.primary` ("Export ▾"), which opens a
menu with WAV and MP3 items. Our script listens for clicks on that button in the capture phase on `document`,
which runs before React's root listener. If the gate has not been answered: stop the event, show the overlay,
and after either answer click the button again so the tool's own menu opens. Keyboard activation fires the same
click event. The download itself (`saveFile` in `audio/exportFile.ts`) is not touched.

## Transport: decided by task 1

**Result, 2026-11-11: Cloudflare Worker.** The public form URL fails the rule: every POST is redirected to an
Ecomail robot-check page with Google reCAPTCHA that must run in a visible tab, it refuses to be framed, and
`fetch` creates no contact (report, "Spike results"). Custom field names for the list: `consent_at`,
`consent_version`, `consent_source`, `lang`. Pending the user's Cloudflare account.

Two candidates. The page-side code must keep the endpoint and list details in `site.config.json` either way.

| | Ecomail public form URL | Cloudflare Worker + Ecomail API |
|---|---|---|
| Secret | none | API key as a Worker secret |
| Page can show a truthful error | no (redirect, unreadable response) | yes (JSON, same contract as today) |
| Bot control | Ecomail's reCAPTCHA, cannot be turned off | our honeypot + origin check + rate limit |
| Consent fields | `custom_fields[...]`, auto-create untested | auto-created (documented) |
| Extra for Faust to own | nothing | a Cloudflare account; named in the policy |
| Open risk | must not navigate away from `/tool/`; must not load Google scripts into our page | none known |

Rule: use the public form URL only if all six tests in the report (A2) pass **and** it works from a hidden
iframe or `fetch` without the visitor leaving the tool or seeing an Ecomail/Google page. Otherwise the Worker.
If the Worker: keep today's JSON contract (`email, lang, source, consent, consentVersion, website`), so
`Signup.tsx` changes only its URL and success text.

## Acceptance criteria

Gate (tool overlay):
1. Clicking Export with no stored answer shows the overlay and does not open the export menu. With a stored
   answer the tool behaves exactly as it does today.
2. Two actions of equal visibility: subscribe-and-download (needs a valid email) and download-without-
   subscribing. Nothing is pre-ticked. The consent sentence says who emails, about what, that it is optional,
   that a confirmation email follows, and links to `/privacy/` (new tab, so the audio work is not lost).
3. Skipping closes the overlay and opens the tool's export menu in one press, with no network request. After
   Subscribe the card shows the result (confirm your email, or the signup did not go through) with one
   "Continue to export" button, which closes the overlay and opens the menu. (Designer's call, accepted by pm
   2026-11-10: those two messages need a place where they are certain to be seen and announced.)
   Button labels say "export", not "download", matching the tool's own button.
4. A failed or slow (10 s) signup never blocks the export; the visitor gets a plain message. No double submit.
5. A proper modal: focus moves in, is trapped, returns to the Export button on close; the tool behind is inert;
   Escape closes without exporting. Keyboard-only works. axe 0 violations in EN and CS. No horizontal scroll at
   375 px, including at 200% text size.
6. The build fails with a clear message if the pinned tool's built files no longer contain the hook's selector.
7. All text in `src/copy/en.ts` / `cs.ts` (`gate.*`, CS marked `TODO(cs-review)`). Storage keys namespaced
   `faust-landing:*`. No email in storage, no cookies.
8. Still true after the change, re-verified on preview through upload → analysis → gate → MP3 export: every
   request made by our pages is same-origin except the one signup POST. No script, font or image from another
   company loads on `/` , `/privacy/` or `/tool/`.

Backend (both forms):
9. A subscribe from the landing form and one from the gate each create a contact in the Ecomail list with
   status unconfirmed, and custom fields for consent time, consent-text version, source (`landing` / `tool`)
   and language. Clicking the confirmation link makes the contact active.
10. A repeat signup with the same address is a success to the visitor and does not create a duplicate. A filled
    honeypot or invalid email creates nothing.
11. Swapping accounts is a config change only: the values that change are listed in one place
    (`site.config.json`, plus Worker secrets if used) and documented in a short runbook.
12. No Ecomail API key in the repo, the page, the built files or any chat message.

Copy and policy:
13. Landing copy stays true: "free", "no account" and the FAQ's "without signing up" survive; every
    `TODO(email)` string is re-read against the optional gate. The landing form's success text mentions the
    confirmation email.
14. Privacy policy v2 (see below) is live in EN and CS, version and date bumped; consent sentence versions
    bumped and the old texts kept in design-spec §4.8.

## Privacy policy v2: required changes (designer writes the text in design-spec §5)

- **Email signup section:** processor is ECOMAIL.CZ, s.r.o. (Prague), data on servers in Frankfurt, some of its
  suppliers may process data in the US under the EU-US Data Privacy Framework or standard contractual clauses.
  Re-read Ecomail's pages before fixing the wording (report A9 is marked V\*). The Wix / Israel text goes.
  Describe the confirmation email: no emails until the link is clicked.
- **Where we ask:** the landing form and the prompt at Export. Both optional; declining sends us nothing and
  changes nothing about the tool.
- **Tuner section:** remove any statement that the tool never asks for an email.
- **Storage section:** add the gate's remembered answer (set only when the visitor answers; no email in it).
- **If task 1 picks the Worker:** name Cloudflare as a processor for the signup request (IP address in transit).
  If it picks the form URL and reCAPTCHA is involved in any visible way, describe that instead. Draft this
  sentence last.
- **Unchanged:** the controller section stays suspended until Faust names the controller. Rights, retention,
  ÚOOÚ complaint, withdrawal stay. Faust's obligations (unsubscribe link in every email, delete on request,
  reply within a month) move to the new runbook.
- `PRIVACY_POLICY_VERSION` → `2026-11-v2`; `SIGNUP_CONSENT_VERSION` → `2026-11-v2`.

## Tasks, in order

| # | Task | Owner | Status |
|---|---|---|---|
| 0 | Ecomail account + list; form URL and API key to the programmer. | user | ✅ 2026-11-11. Account `courses`, list 1, the **final Faust account**. Key in gitignored `.env.local` as `ECOMAIL_API_KEY`. Double opt-in still off: Ecomail requires a verified sender domain first (the list's sender is a Gmail address). Domain verification in progress (user). |
| 1 | Spike: the report's six A2 tests; apply the transport rule. | programmer | ✅ 2026-11-11. Public form URL rejected → Cloudflare Worker. Results in the report, "Spike results". No contact was created; the list is untouched. Test 4 (custom fields) unanswered, moves to task 5. |
| 2 | Gate design: design-spec §4.10 + §5 copy `gate.*`, `signup.*` success text, consent sentences v2, privacy policy v2 text. | designer | ✅ 2026-11-10, revised after the tracking finding. One policy paragraph drafted two ways; the Cloudflare variant now applies and keeps a `TODO(verify)` on Cloudflare's DPF status. |
| 3 | Hook + injection: `src/gate.ts`, build step and build check in `scripts/build-tool.mjs`, answer storage, transport stubbed. | programmer | ✅ 2026-11-10. Criteria 1, 3, 6, 7 verified on preview. |
| 4 | Gate UI to the design, EN + CS. | programmer | ✅ 2026-11-11. Criteria 2, 4, 5 verified; designer review passed after three fixes (sticky button pair at 375 px, no hover on `aria-disabled`, result-heading padding). |
| 5 | Backend: a relay holding the key → Ecomail API; point `Signup.tsx` and the gate at it; honeypot in the gate (criteria 9–12). | programmer | ✅ built and tested locally 2026-11-11 against the real list (see "Relay" below). **Not deployed: where it runs is undecided** (see "Hosting of the relay"). `site.config.json` `signupEndpoint` is the placeholder `https://signup-worker-not-deployed.invalid/`, so both forms show their failed state until a real URL is set. |
| 6 | Privacy policy v2 + landing copy (FAQ 2, consent sentence, success text) in `en.ts` / `cs.ts`; bump `SIGNUP_CONSENT_VERSION` and `PRIVACY_POLICY_VERSION`; re-verify criteria 8 and 13. | programmer | **Applied 2026-11-12, verification incomplete, work paused by the user.** `en.ts` / `cs.ts` carry the final gate copy, FAQ 2, the v2 consent sentence and privacy policy v2; `faust.ts` has both versions at `2026-11-v2`, `ecomailTerms` and `cloudflarePrivacy` added, `wixPrivacy` removed. The Cloudflare paragraph is marked `TODO(host)` PROVISIONAL and must follow the hosting decision. It builds (tsc, lint, `npm run build`). Verified before the stop: EN landing and privacy pages at 1280 and 375, EN landing form, EN gate fit at 375 × 667 (consent ends 5 px above the pinned pair). **Not run:** everything Czech (including the 375 × 667 gate fit), the EN gate's subscribe and skip paths with MP3 export on the final copy, the failure case, the sticky/keyboard suites. Known wording gap: policy section 6 does not mention that a failed signup stores "failed" in session storage. |
| 7 | Runbook `docs/ecomail-runbook.md`: account setup (domain DNS records, double opt-in email in EN + CS, fields, plan), Worker ownership, Faust's obligations. Retire the Wix docs. | pm | **Not started** (waits on 5). `CLAUDE.md` updated 2026-11-11 with progress so far. |
| 8 | Tell the Berlin team (draft below; add that `/tool/` scrolls sideways at 375 px). | user | Open. |

**Do not push the working tree as it is.** The gate's Subscribe is a stub that reports success and sends
nothing, the landing form still posts to the Wix URL (404), and `/privacy/` is still v1 (names Wix, says the
tool never asks for an email). Tasks 5 and 6 must land in the same push as the gate.

### Relay (task 5), as built

- `worker/src/signup.js`: all logic in one host-neutral function, `handleSignup(request, { apiKey, listId,
  allowedOrigins })`, standard Request in / Response out. `worker/src/index.js` is a thin Cloudflare wrapper,
  `worker/wrangler.jsonc` holds `ALLOWED_ORIGINS` and `ECOMAIL_LIST_ID` (observability off),
  `worker/README.md` has the contract, local run, deploy steps and how to move it to another host.
- Contract: same JSON as before. 200 (including an address already on the list), 400, 500, 204 preflight, and
  **403 with no CORS headers for an Origin not on the allow-list** (never reaches Ecomail).
- Ecomail call: `skip_confirmation: true`, `trigger_autoresponders: false`, `resubscribe: false`,
  `update_existing: false`. Custom fields now exist on list 1: `consent_at` (Ecomail typed it "date"),
  `consent_version`, `consent_source`, `lang`.
- Confirmed on the real list with fake addresses, all deleted afterwards (list back to its 1 original contact):
  both forms create a subscribed contact with the four fields; a repeat signup returns 200 with no duplicate
  and the original consent record untouched; bad input and a filled honeypot create nothing; a wrong key gives
  500 and the gate still exports; skip makes no off-origin request.
- No sign of any email at signup (status subscribed at once, `doi_date` null, `last_delivery` null, no
  automations or campaigns). The API cannot show Ecomail's outgoing mail log: **the user should check the
  dashboard's sent-emails counter.**
- Known behaviour: someone who unsubscribed and signs up again sees success but stays unsubscribed (pm
  decision while double opt-in is off, so a third party cannot re-add them; revisit when it is on). Ecomail sets
  `country: "CZ"` on API-created contacts although we send none (probably an account default, unconfirmed).
  Ecomail's own `source` is always `api`; landing vs tool lives only in `consent_source`.
- The relay must not log or store the email or IP (the policy says it stores nothing): it has no bindings and
  logs only a fixed text plus Ecomail's status code on failure.
- **Missing before launch:** a rate limit. Anyone with curl can forge the Origin header and add junk addresses
  (no email goes out; the cost is junk contacts against the plan limit).

### Hosting of the relay: undecided (2026-11-12)

The user wants as few external accounts and pipelines as possible and has not approved Cloudflare. The client is
setting up a new domain; Active24 webhosting (https://www.active24.cz/webhosting) is being considered.
Nothing below is decided or built.

| Option | Extra account | Notes |
|---|---|---|
| Cloudflare Worker (as built) | Cloudflare | Ready to deploy; steps in `worker/README.md`. |
| Function on the site's own host | none | Needs a host that runs functions (not GitHub Pages). Only a new wrapper around `signup.js`. |
| PHP relay on Active24 → Ecomail | none | Plans page confirms PHP 8.4 and unlimited databases on all plans. Outgoing HTTPS from PHP is not stated. The relay logic would be rewritten in PHP; the site must be served from Active24 too (FTP deploy instead of GitHub Pages). |
| PHP + database on Active24, no Ecomail at signup | none | Emails and consent records in the host's database. Needs an export for Blanka, endpoint and database security, backups, deletion handling; unsubscribes only once imported into a sending tool. More to build, more responsibility on Faust. |
| Ecomail's hosted page in a new tab | none | No relay. The visitor finishes on an Ecomail page with Google reCAPTCHA; our page cannot know the result; consent fields untested. Stopgap only. |
| Velo function on Faust's Wix site → Ecomail | none | Brings back the wait for Faust's install and ties signups to a site the client may leave. |

Unverified about Active24: outgoing requests from PHP, database engine, data-centre location (needed for the
policy), SSH, cron. Whatever is chosen, the privacy policy names that host as the processor in place of
Cloudflare, and criterion 8 is re-verified.

### Waiting on the user (2026-11-12)

1. **Where the relay runs** (table above), and whether Active24 is confirmed as the host for the new domain.
   Everything else that is built waits on this.
2. Check the Ecomail dashboard: sent-emails counter unchanged after the tests, and whether a contact's detail
   page shows an IP address or location.
3. Yes/no: Faust deleting unconfirmed contacts once double opt-in exists; whether a skip should be remembered
   across tabs (today: per tab). The new FAQ 2 wording ships with task 6 unless the user objects.
4. Later, before the first campaign: sender domain verified in Ecomail (3rd-level recommended, with a reply-to
   mailbox), double opt-in on, sender name "Faust Studio", confirmation email in EN + CS containing
   `*|SUBCONFIRM|*`; then the with-confirmation texts in design-spec §5 "Draft for double opt-in" ship as a
   new consent version.
5. Account holder details in Ecomail = Faust's legal entity (same open question as the policy's controller).
6. A paid Ecomail plan before real traffic (free tier: about 200 contacts).

Settled since 2026-11-11: with the shorter no-confirmation consent sentence and a one-line pitch trim, the whole
English consent sentence and privacy link show above the pinned buttons at 375 × 667. Czech is not yet measured
(rule: shorten the Czech pitch, never the consent sentence).

### What was built (files, all uncommitted)

`src/gate.ts`, `src/gate.css` (new), `src/lang.ts` (new; the language rule moved out of `i18n.tsx` so the gate
shares it), `src/i18n.tsx`, `src/copy/en.ts`, `src/copy/cs.ts` (`gate.*`), `src/vite-env.d.ts`,
`scripts/build-tool.mjs`, `docs/design-spec.md`, `docs/email-gate-spec.md`, `reports/ecomail-email-gate.md`;
from task 5 also `worker/` (new), `site.config.json`, `.gitignore` (`.wrangler/`, `.dev.vars`).

Details worth keeping:
- The gate is plain DOM in a native `<dialog>`, no React. Built by a separate small Vite step at the end of
  `build-tool.mjs` into `dist/assets/gate-<hash>.js` (CSS inlined, about 14 KB) and injected as one
  `<script defer>` before the tool's `</head>`.
- The selector lives only in `build-tool.mjs` (`EXPORT_BUTTON`) and reaches `gate.ts` as a define, so the build
  check and the hook cannot drift. The check is static: it proves the class names exist in the tool's bundle,
  not that they are still on the Export button. Only a preview run proves the gate appears.
- While open, the gate stops all `keydown` from reaching the tool, which listens on `window` (space, cmd-Z,
  Delete). `inert` alone was not enough.
- Style isolation is a `faust-gate-` class namespace (a `<dialog>` cannot host a shadow root).
- Storage: subscribed → localStorage; skipped and signup-failed → sessionStorage (per tab).
- Transport is one function, `subscribe(email, lang) → 'ok' | 'failed'`, raced against 10 s. Since task 5 it
  posts the signup JSON (`source: "tool"`, with a honeypot) to `signupEndpoint`.
- Known limits: Chromium only (no Safari, Firefox, real phone or screen reader). `/tool/` itself scrolls
  sideways at 375 px (the editor is 481 px wide); that is the tool team's. At 375 × 667 the end of the consent
  sentence and the privacy link start under the pinned buttons. At text-only 200% on that phone the buttons
  appear only after scrolling, both together (designer's call, §4.10).

## Out of scope (and why)

- Required email, or any variant that sends an address without consent: no lawful basis without a lawyer.
- Changes to the tool's code or a request to Berlin for an export hook: the user wants zero dependency on them.
  Worth asking for later (a stable `data-` attribute on the button would remove the fragile selector).
- Ecomail's own embeddable form script or Turnstile: both load another company's code into our pages.
- Welcome email / automations, campaign templates, sender-domain verification: Blanka's account, in the runbook.
- Migrating contacts between accounts: the first account holds test addresses only.
- Deleting `wix/` and the Wix docs: kept until Ecomail is verified, then a separate cleanup.
- The hosting question raised by the report (Vercel's free plan forbids commercial use): separate decision.

## Risks and open questions

- **Fragile hook.** A pin bump can rename the button's classes. Mitigated by criterion 6 and fail-open; add
  "export gate still appears" to the pin-bump checklist in `CLAUDE.md`.
- **Free plan ceiling.** About 200 contacts or 200 emails a month, and it is unclear whether confirmation emails
  count. Ecomail blocks the account when exceeded. Fine for the demo; Blanka's account needs a paid plan sized
  to the list.
- **Confirmation email language.** One template per list and no documented language handling. Default: one
  bilingual email. Test in the account.
- **Unconfirmed addresses.** Someone who never clicks the confirmation link stays in the list as "unconfirmed".
  Designer recommends Faust deletes these after about 30 days so the policy can say so. Needs the user's yes
  and an owner at Faust (runbook, task 7). Until then the policy says "kept until you unsubscribe or ask".
- **Tracking inside emails.** Confirmed 2026-11-10 (report, Follow-up): Ecomail tracks clicks and opens by
  default, including in the confirmation email, with no documented account-wide off switch. Policy v2 says so
  and both consent sentences mention it (pm decision). Email pixels likely fall under ePrivacy Art. 5(3):
  one more item for a lawyer. Check the account's campaign settings for a toggle during task 1.
- **Signup IP.** Whether Ecomail stores it is unverified; task 1 checks a test contact's detail page. The
  policy's "we don't record your IP" sentence is out of v2 until then.
- **"On Faust Studio's behalf"** in the policy is not literally true while the account is the user's own.
  Acceptable on `noindex` with test addresses only.
- **Controller identity** is still missing from the policy while we start actively asking for emails. Must be
  resolved before the site leaves `noindex`.
- **Czech legal text** remains a machine draft until a native speaker reviews it.
- **This is research, not legal advice.** The optional gate is the conservative reading; no lawyer has seen it.

## Draft note to the Berlin team (user sends, task 8)

> Heads-up from Paris: on the website build we are adding an optional email prompt that appears when a visitor
> clicks Export in the tuner. It is injected into the built HTML on our side; nothing changes in your repo and
> the export itself is untouched. It finds the button by `.export-menu button.primary`, so if you rename those
> classes our build will tell us and we will adapt. If you ever want to make it sturdier, a `data-export`
> attribute on that button would do it. No action needed from you.
