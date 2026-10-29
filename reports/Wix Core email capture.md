# Getting tuner signups into Faust's Wix Contacts (Core plan)

Researcher report, 2026-10-29. Sources and caveats: `research_notes/Wix Core CRM email capture/wix_core_email_capture.md`.
Scope: email collection only — one Wix contact per signup with a label, usable by Wix Email Marketing.

## Recommendation

**Yes, it can be done with zero new paid tools: a ~40-line Velo HTTP function on fauststudio.net.**
Our static page POSTs `{email, name, lang, consent}` to `https://www.fauststudio.net/_functions/tunerSignup`;
the function (running inside Faust's site, free on Core) creates the contact with the label `tuner`, the
locale and a consent timestamp. No secret ships in our page, CORS is officially supported by Velo's
`options_` handler, and the quota (7,000 requests/min) is irrelevant at our scale. Code sketch is in the notes, §2(b).

What it needs from Faust: turn on Dev Mode, paste the file, publish (or give one of us a collaborator seat —
Core includes 5). What it doesn't need: an API key, a Headless client, Zapier/Make, a server of ours.

Three things to settle before building:

1. **Consent flag.** API-created contacts land as "Never subscribed", and Wix says not to send marketing
   email to those. Flipping them to "Subscribed" programmatically uses the Email Subscriptions API (Developer
   Preview); one 2026 forum thread reports it 403s from Velo. **Plan A:** try it in the same function.
   **Plan B (works today, documented):** Faust sets it per contact in the dashboard, or we run a one-off
   bulk update by label with an API key. Either way the campaign recipient list must be "Subscribers".
2. **Double opt-in.** Czech law (480/2004 §7) requires prior, *provable* consent; it doesn't mandate DOI, and
   GDPR explicit consent is a ticked checkbox. Wix only offers DOI on its own new Forms. If Faust/legal wants
   DOI, the cheapest honest route is **option D below** (link to a standalone Wix form) rather than building
   DOI by hand. Otherwise: explicit checkbox + we store text/timestamp/source on the contact.
3. **Email budget.** Faust's email plan is separate from the Core site plan: **200 emails/month free**; paid
   tiers 500 / 5,000 / 1,000,000 at roughly $10 / $24 / $49 per month billed yearly (third-party figures;
   Wix only shows local prices in the dashboard). Automation emails count against the same balance. This is
   the one line item that may cost money once the list grows past a couple of hundred addresses.

Fallback if Faust refuses Dev Mode: a **Cloudflare Worker** (free: 100k requests/day) holding a Wix API key and
calling `POST /contacts/v4/contacts`. Not Vercel's free tier — its Hobby plan is non-commercial only, which
also matters if the landing page moves to Vercel later. Zapier free has no webhooks; Make's Wix app has no
Contacts modules.

## Option comparison

| | Browser-callable cross-origin | Secret in our page? | Needs on Faust's side | Cost | Can set "Subscribed"? | Status |
|---|---|---|---|---|---|---|
| **B. Velo HTTP function** `/_functions/…` | Yes (documented CORS via `options_`) | No | Dev Mode + paste file + publish | €0 | Maybe (Preview API, forum 403) → dashboard/bulk fallback | **Recommended** |
| A. REST Contacts v4/v5 + API key | No — key is server-only per Wix | n/a | Create API key (Manage Contacts) | €0 + an intermediary | Yes via Email Subscriptions API (same key) | Only behind an intermediary |
| C. Headless visitor token (@wix/sdk) | Token yes, but `createContact` needs Manage Contacts → 403 for visitors | — | Headless client | €0 | No | Not viable without a backend (which is B again) |
| D. Wix standalone form (link / new tab) | It's a Wix page, not our UI | No | Create a form, tick DOI | €0 (Core: 10 forms) | **Yes, native double opt-in** | Zero-code fallback; best for DOI |
| D'. Embed Wix form in our page | Not supported (Wix feature request says so) | — | — | — | — | No |
| E. Automations "Webhook received" trigger | Yes (plain POST), no auth | URL only | Build automation | €0 | ? | Plan gating and "create contact" action **unconfirmed**; likely can't create contacts |
| Intermediary: Cloudflare Worker + A | Yes | No (secret in Worker) | API key | €0 (100k req/day) | Yes | Fallback if Dev Mode is refused |
| Intermediary: Vercel / Zapier / Make | Yes / No (webhooks are paid) / Yes | — | API key | $20/mo (commercial) / $19.99 / free 1,000 ops | — | Not worth it |

## Core plan facts used (official unless marked)

- Contacts: no documented cap; import ≤ 200,000, export ≤ 50,000 at a time.
- Email Marketing: separate plan; free 200 emails/month; number of campaigns and automations uncapped since May 2023.
- Forms on Core: 10 forms, 50 fields, payments, file upload; no monthly submission cap documented.
- Velo: free on all plans; premium sites 7,000 backend requests/min, 14 s/request; Secrets Manager (64 secrets) included.
- Wix vs Wix Studio: "Core" is a classic-Wix plan name (Studio uses Basic/Standard/Plus/Elite); nothing above depends on which editor Faust uses.

## Deprecations / version flags

- Use Velo `wix-crm-backend` → `contacts.createContact()` (stable). The top-level `wixCrmBackend.createContact()` is deprecated; `wix-crm.v2` is **Developer Preview, "not intended for production"**.
- REST Contacts v4 is current (no deprecation notice); v5 adds Upsert and subscription updates (v5 bulk-subscription page lists an odd "Manage Events" scope — probably a doc error).
- Email Subscriptions API: Developer Preview (per search snippet; its intro page 404'd today).
- The Ascend automation tiers (2/7/20 automations) are pre-2023 and no longer apply.

## Unconfirmed

CZK/EUR email-plan prices; whether the webhook trigger is on Core and can create a contact; whether the
Email Subscriptions API works from Velo with `elevate()`; whether a standalone form can be iframed; whether
Wix minds browsers calling HTTP functions ("intended for server-to-server", yet CORS is documented). No code
was executed.

Confidence: high on the plan facts and on B being technically feasible; medium on the subscription-status
flip from Velo; low on anything about the Automations webhook trigger.
