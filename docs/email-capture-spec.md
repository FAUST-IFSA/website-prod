# Email capture v1: spec

Owner: pm · Status: draft, not started · Date: 2026-10-29
Research behind it: `reports/Wix Core email capture.md` (+ notes in `research_notes/Wix Core CRM email capture/`).

## Goal

A visitor can leave their email on our landing page and it appears as a contact in Faust Studio's existing
Wix site (Core plan), labelled `tuner`, with provable consent. Faust emails them from Wix. No new paid tool,
no server of ours, no secret in our page.

## Decisions already made (by the user, 2026-10-29)

- **Route:** a Velo HTTP function on fauststudio.net (`https://www.fauststudio.net/_functions/tunerSignup`).
  Our static page POSTs JSON to it. Fallback only if Faust refuses Dev Mode: Cloudflare Worker + Wix API key.
- **Consent:** explicit unchecked checkbox + stored timestamp. No double opt-in.
- **Subscription status:** left open. Contacts arrive in Wix as "Never subscribed"; how they become
  "Subscribed" is Faust's side (dashboard toggle or a later bulk update). Not in v1.
- **Email sending cost** (200 free emails/month, then a paid Wix email plan) is Faust's to handle. We tell them.

## Assumptions (pm; say if wrong)

- The signup form lives on **our landing page**, not in the tool. The tool's email gate belongs to the tool
  team; we hand them the same endpoint contract so the gate can use it later. One endpoint, two callers.
- Signup is **optional**. The tool stays free with no signup, so the FAQ answer "Do I need an account? Not
  right now" stays true. We don't gate anything.
- v1 collects **email only** (plus language, sent automatically). No name field.
- We do not store IP or user agent. Timestamp + consent-text version + source is our proof of consent.

## Facts the work depends on

- Velo is free on all Wix plans. Core quota: 7,000 backend requests/min. (official, see report)
- CORS from a browser is officially supported by Velo's `options_` handler. The module docs also say HTTP
  functions are "intended for server-to-server" — read as privacy guidance (no cookies), a grey area, low risk.
- The stable backend module is `wix-crm-backend` → `contacts.createContact()`. **Do not** use `wix-crm.v2`
  (Developer Preview, "not for production").
- The researcher's code sketch (notes §2(b)) is **untested**. Nothing has been run against a real Wix site.
- Publishing the Velo file in Wix means **pressing Publish on Faust's whole site**, which also publishes any
  unpublished edits Faust has sitting in the editor. Whoever publishes must check for pending changes first.

## Endpoint contract (shared with the tool team)

```
POST https://www.fauststudio.net/_functions/tunerSignup
Content-Type: application/json
{ "email": "a@b.cz", "lang": "cs" | "en", "source": "landing" | "tool", "consent": true, "consentVersion": "2026-10-v1", "website": "" }
→ 200 { "ok": true }      created, or already a contact (duplicates are a success, not an error)
→ 400 { "ok": false }     invalid email, consent not true, or honeypot ("website") filled
→ 204                     OPTIONS preflight
```
Server behaviour: allow-list origins (`https://faust-ifsa.github.io`, plus the future custom domain);
create the contact with `labelKeys: ['custom.tuner']`, `locale` from `lang`, extended fields
`custom.tuner-consent-at` (ISO timestamp), `custom.tuner-consent-version`, `custom.tuner-source`;
`allowDuplicates: false`, `suppressAuth: true`. The label and the three custom fields are created once in
Faust's Contacts dashboard (or by the function on first run if the API allows; programmer to check).

## Acceptance criteria

Form (landing page):
1. Email field + consent checkbox (unchecked by default) + submit. Submit is disabled until both are valid.
2. Consent text states who emails (Faust Studio), about what (studio sessions, courses, tuner news), and that
   they can unsubscribe any time. Exact wording: designer, in `copy/en.ts` + `cs.ts` (`TODO(cs-review)`).
3. States: idle, submitting (no double submit), success (form replaced by a confirmation), error (message +
   retry, the typed email is kept). All announced to screen readers (`aria-live`).
4. Honeypot field is invisible to users and ignored by assistive tech (`aria-hidden`, `tabindex=-1`).
5. Keyboard-only completion works; axe reports 0 violations in EN and CS; no horizontal scroll at 375 px.
6. The endpoint URL lives in `site.config.json` (next to `base`), not in a component. A dev-only value lets
   `npm run dev` hit a test site or a local stub.
7. No cookies, no localStorage of the email, no third-party scripts added.
8. Honesty: no copy says signup is required, and `TODO(email)` strings are reviewed, not promised away.

Endpoint (Velo):
9. The file lives in this repo at `wix/http-functions.js` (the deliverable Faust pastes), with a 10-line
   README on how to install it.
10. Tested end to end on a **free throwaway Wix site of ours** before Faust sees it: preflight 204, valid POST
    creates a labelled contact with the three fields, duplicate POST returns 200, bad email / no consent /
    honeypot return 400, request from a non-listed origin is rejected by the browser.
11. Then on Faust's site: one real signup from the live landing page appears in Faust's Contacts with label
    `tuner`. Verified by Faust or by us with a collaborator seat.

## Tasks, in order

| # | Task | Owner | Blocked by |
|---|---|---|---|
| 0 | Email Faust: ask for Dev Mode + a collaborator seat (or that they paste the file), tell them about the email-plan cost, ask for their privacy policy URL. Draft below. | pm | — |
| 1 | Write `wix/http-functions.js` from the sketch, create a free Wix test site, test criteria 10. | programmer | — |
| 2 | Design the form: placement on the page, states, consent wording EN. Add to `docs/design-spec.md`. | designer | — |
| 3 | Build the form per the design spec, wired to the test-site URL via `site.config.json`. Verify 1–8 on `npm run preview`. | programmer | 1, 2 |
| 4 | Install the function on Faust's site (or hand it over), switch the URL, verify criterion 11. | programmer + Faust | 0, 3 |
| 5 | Send the endpoint contract to the tool team for their gate. | pm | 4 |

Tasks 1 and 2 run in parallel today. Nothing else can start until Faust answers.

## Out of scope for v1 (and why)

- Double opt-in: not legally required; halves signups; only Wix's own forms do it natively.
- Flipping contacts to "Subscribed" from code: Developer-Preview API with a reported 403; user deferred it.
- Welcome/auto-reply email: a Wix Automation Faust can add in the dashboard; it spends their email balance.
- CAPTCHA/Turnstile: honeypot + origin allow-list first. Add Turnstile only if junk contacts appear.
- Name field, phone, free-text: more fields, fewer signups, more personal data.
- The tool's email gate: tool team's code. They get the contract, not a task from us.
- Our own copy of the list (database, CSV): Wix is the single store.

## Risks and open questions

- **Faust says no to Dev Mode / a seat.** Fallback: Cloudflare Worker (free) holding a Wix API key; same
  page-side contract, so the form doesn't change. Adds one account for Faust to own.
- **Untested sketch.** Field shapes for `extendedFields`/`labelKeys` on `wix-crm-backend` may differ from the
  notes; task 1 exists to find out before anyone touches Faust's site.
- **Wix policy grey area** on browser-called HTTP functions. If Wix ever blocks it, the Worker fallback applies.
- **Spam signups** burn Faust's email balance only if they add a "new contact → send email" automation. Tell them.
- **Privacy policy:** we must link one next to the form. Does fauststudio.net have one? `TODO(verify)`.
- **Consent-text version:** bump `consentVersion` whenever the wording changes; keep old texts in the repo.

## Draft email to Faust (pm sends, task 0)

> We'd like the free tuner page to feed email signups straight into your Wix Contacts, so you can email
> those people from Wix with nothing new to pay for. It needs a ~40-line file added to your Wix site under
> Dev Mode (Velo, free on your plan). Two ways: you paste it and publish (we send instructions), or you give
> one of us a collaborator seat (your plan includes 5) and we do it. Which do you prefer?
> Two things to know: (1) Wix lets you send 200 marketing emails a month free; beyond that it's a separate
> Wix email plan, priced in your dashboard. (2) Signups arrive as "Never subscribed" contacts, labelled
> `tuner`, with the date they ticked the consent box. Marking them as subscribers is a toggle in your
> Contacts list. Also: could you send the link to your privacy policy, so we can link it under the form?
