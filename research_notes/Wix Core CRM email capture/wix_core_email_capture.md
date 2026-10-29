# Wix Core: getting landing-page signups into Wix Contacts — sourced notes

Researcher notes, 2026-10-29. Requested by pm. Scope: email COLLECTION only (one contact per signup, with
label/name/language/source), usable by Wix Email Marketing. Not a CRM evaluation.

Legend: **[official]** = support.wix.com / dev.wix.com / vendor docs read today. **[3rd-party]** = blog or
review. **[forum]** = anecdotal community thread. **[inference]** = my reasoning, not stated by a source.
Wix help-centre pages carry no "last updated" date; where a page shows one, it's noted.

---

## 0. Does "Wix" vs "Wix Studio" matter?

- "Core" is a plan name of the **classic Wix** line (Free, Light, Core, Business, Business Elite) — the
  wix.com/plans page lists exactly these **[official]** https://www.wix.com/plans. Wix Studio sites use
  different plans: Basic, Standard, Plus, Elite, Enterprise **[official]**
  https://support.wix.com/en/article/wix-studio-upgrading-sites. So "Core" by itself confirms a classic Wix
  site.
- It doesn't matter for any path below. HTTP functions (Velo) can be written in "the editor (Wix Studio and
  Wix Editor)" **[official]**
  https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/integrations/exposing-services/about-custom-site-apis.md.
  REST/API keys, Headless clients, Forms and Automations are dashboard features common to both.
- Only one Studio-only item came up: the Velo `$w` Wix Forms v2 *element* API ("only available in Wix Studio
  and Editor X") **[official]** https://dev.wix.com/docs/velo/apis/wix-forms-v2/submissions/introduction.md.
  Not needed here.

---

## 1. What Core includes today (Q1)

### 1.1 Contacts
- **No documented cap on total contacts.** Searched support.wix.com; nothing states a maximum. Known limits:
  import up to **200,000** contacts; export up to **50,000** at once **[official]**
  https://support.wix.com/en/article/wix-contacts-importing-your-contacts-into-your-contact-list ,
  https://support.wix.com/en/article/about-your-contact-list (and localized export articles).
- Contact list, labels, segments and filters are part of the dashboard on every plan (incl. free) — the
  support articles never mention a plan requirement. **[official, by absence]**

### 1.2 Email Marketing (campaigns)
- **Email marketing plans are separate from the site's Premium plan.** "Premium plans enhance site
  capabilities, while email marketing plans provide advanced email features." **[official]**
  https://support.wix.com/en/article/understanding-the-new-email-marketing-sending-limits (limits in force
  since May 2023).
- Monthly balance by *email* plan **[official]**
  https://support.wix.com/en/article/about-your-monthly-email-marketing-balance :

  | Email plan | Emails / month |
  |---|---|
  | Free (what Faust has unless they bought one) | **200** |
  | Essentials | 500 |
  | Core (name collision with the site plan!) | 5,000 |
  | Advanced | 1,000,000 |

- What counts: campaign sends, resends, **automation emails**; scheduling deducts all recipients up front.
  Test emails and transactional emails don't count. Unlimited number of campaigns within the balance.
  **[official]** same page.
- **Prices are not published** on support.wix.com ("displayed prices are for yearly subscriptions…
  final pricing appears on the purchase page"; "available plans may differ depending on your geographic
  location"). Third-party reviews quote ≈ **$10 / $24 / $49 per month billed yearly** for
  Essentials / Core / Advanced **[3rd-party, USD, not CZK/EUR]** https://www.omnisend.com/blog/wix-email-marketing ,
  https://eseospace.com/blog/wix-email-marketing/ . Faust can see the CZK price at
  Dashboard → Email Marketing → Monthly balance → Upgrade **[official]**
  https://support.wix.com/en/article/email-marketing-upgrading-your-email-marketing-plan.
  **Could not confirm CZK/EUR prices.**

### 1.3 Automations
- Since 1 May 2023 "automations are no longer capped in number", but automated emails count against the
  email balance above **[official]** understanding-the-new-email-marketing-sending-limits (link above).
- The old "Ascend" tiers (2 / 7 / 20 / unlimited automations) still have a live support page but describe a
  discontinued add-on **[official, stale]**
  https://support.wix.com/en/article/wix-automations-upgrading-automations-with-ascend. Treat as pre-2023.
- Per-action quotas are shown at Automations → Manage Your Quotas **[official]**
  https://support.wix.com/en/article/wix-automations-managing-your-automations. Wix "doesn't enforce action
  quota limits; it only displays them" — this line is from the developer SPI docs and refers to third-party
  action providers, not Wix's own actions **[official, narrow]**
  https://dev.wix.com/docs/rest/business-management/automations/action-spi/displaying-action-quotas.
- "Webhook received" trigger: exists, see §2(e). **Plan gating not stated anywhere I could find.**

### 1.4 Wix Forms
- Per-plan limits **[official]** https://support.wix.com/en/article/wix-forms-upgrading-wix-forms :

  | Plan | Forms | Fields/form | Steps | Conditions | Payments / file upload |
  |---|---|---|---|---|---|
  | Free / Light | 4 | 10 | 3 | 3 | no |
  | **Core** | **10** | **50** | 50 | 50 | yes |
  | Business | 25 | 75 | 75 | 75 | yes |
  | Business Elite | 75 | 100 | 100 | 100 | yes |

- **No monthly submission cap documented.** The only "submission limit" article is a per-form cap you set
  yourself, old Forms only **[official]**
  https://support.wix.com/en/article/wix-forms-adding-submission-limits-to-your-forms. The Form
  Restrictions API confirms limits are on forms/fields/steps/rules/recipients, not submissions **[official]**
  https://dev.wix.com/docs/api-reference/crm/forms/form-restrictions/introduction. An undated page citing
  "5,000 submissions/month on Combo" describes a pre-2023 plan structure — ignore.

### 1.5 Velo (Dev Mode) on Core
- Velo is usable even on **free** sites, with quotas **[official]**
  https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/premium-plans/using-velo-with-a-free-wix-site.md.
  No plan is required to turn on Dev Mode **[official]** https://support.wix.com/en/article/enabling-velo
  (the article mentions no plan). Hence Velo is free on Core. **No source says "Velo costs nothing"
  verbatim; this is by absence of any price or plan requirement in the official docs.**
- Backend request quota: **7,000 requests/min on premium sites**, 14 s max per request (HTTP functions
  included); over quota → HTTP 429 **[official]**
  https://support.wix.com/en/article/velo-about-backend-quotas. **Conflict:** the same page says 5,000 RPM for
  free sites, while the free-site table on dev.wix.com says 60 RPM. Irrelevant for Core (premium) but shows
  the docs aren't perfectly synced.
- Secrets Manager: included, "up to 64 per site", changes apply without publishing **[official]**
  https://support.wix.com/en/article/velo-about-premium-packages ,
  https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/secrets-manager/manage-secrets-in-the-secrets-manager.
- Collaborators: Core = 5 site collaborators **[official]** https://www.wix.com/plans — enough to give one
  of us a seat to paste the code instead of asking Faust to do it.

---

## 2. Inbound paths from a static site into Wix Contacts (Q2)

### Terminology / versions (deprecation flags)
- **REST Contacts v4** (`POST https://www.wixapis.com/contacts/v4/contacts`) — current, no deprecation notice
  on the page **[official]**
  https://dev.wix.com/docs/api-reference/crm/members-contacts/contacts/contacts/contact-v4/create-contact.md.
- **REST Contacts v5** — newer, adds Upsert Contact, Bulk Upsert, subscription-status updates, tags
  **[official]** https://dev.wix.com/docs/api-reference/crm/members-contacts/contacts/contacts-v5/introduction.md.
  Not marked preview on the intro page. Says rate limit = **200 requests/min per app instance**.
- **Velo `wix-crm-backend` → `contacts.createContact()`** — stable; it *replaced* the deprecated
  top-level `wixCrmBackend.createContact()` (which "will continue to work, but will not receive updates")
  **[official]** https://dev.wix.com/docs/velo/apis/wix-crm-backend/contacts/create-contact.md.
- **Velo `wix-crm.v2`** — carries a **"Developer Preview … not intended for use in production"** banner
  **[official]** https://dev.wix.com/docs/velo/apis/wix-crm-v2/contacts/contacts/introduction.md. Its
  createContact requires `elevate()` from `wix-auth`. → For a client's live site, prefer `wix-crm-backend`.
- Email Subscriptions API (`/email-marketing/v1/email-subscriptions`) — Developer Preview per the search
  snippet of its intro page (the intro page itself 404'd for me today in three URL variants; the method page
  loads) **[official but partially unverified]**
  https://dev.wix.com/docs/api-reference/crm/communication/email-subscriptions/upsert-email-subscription.md.

### (a) REST Contacts API with an API key
| | |
|---|---|
| Auth | API key from the account's API Keys Manager, header `Authorization: <key>` + `wix-site-id: <id>` **[official]** https://dev.wix.com/docs/go-headless/authentication/admin/make-rest-api-calls-with-an-api-key.md |
| Scope | `Manage Contacts` (`SCOPE.DC-CONTACTS.MANAGE-CONTACTS`) **[official]** create-contact page |
| Browser-callable from another origin? | **No.** "Store your API keys securely and use them only in server-side code" **[official]** https://dev.wix.com/docs/go-headless/authentication/admin/generate-an-api-key.md. CORS behaviour of wixapis.com is moot: the key would be public. |
| Needs a secret | yes |
| Needs Velo / app | no (API key is account-level, created by the account owner with 2-step verification) |
| Cost | free |
| Rate limit | 200 req/min per app instance (v5 intro); generic 429 guidance **[official]** https://dev.wix.com/docs/rest/articles/getting-started/rate-limits (page dated 2 Sep 2025) |
| Verdict | Only via an intermediary (§3). Confirmed: as expected by pm. |

Minimal request (server side):
```sh
curl -X POST 'https://www.wixapis.com/contacts/v4/contacts' \
  -H 'Authorization: <API_KEY>' -H 'wix-site-id: <SITE_ID>' -H 'Content-Type: application/json' \
  -d '{"info":{"emails":{"items":[{"email":"a@b.cz","primary":true}]},
       "name":{"first":"Jana"},"locale":"cs-CZ",
       "labelKeys":{"items":["custom.tuner"]},
       "extendedFields":{"items":{"custom.tuner-consent-at":"2026-10-29T10:00:00Z"}}},
       "allowDuplicates":false}'
```
Notes: `info` must contain name, phone or email; default `allowDuplicates:false` makes the call **fail** if
the email already exists (so catch that and treat as success). Label must already exist (create
"tuner" in the dashboard → key `custom.tuner`); custom extended fields must exist too (Labels API /
Extended Fields API or dashboard). `locale` is BCP-47. **[official]** create-contact page.

### (b) Velo backend HTTP function on fauststudio.net
| | |
|---|---|
| What | `backend/http-functions.js` exporting `post_<name>` (+ `options_<name>` for CORS preflight). Production URL on a premium site with a custom domain: `https://www.fauststudio.net/_functions/<name>`; test-site URL `…/_functions/<name>?rc=test-site`; editor-latest `…/_functions-dev/<name>` **[official]** https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/integrations/exposing-services/site-api-calls.md , https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/integrations/exposing-services/write-an-http-function.md |
| Auth model | None by default — the URL is public. Wix's own hardening example: compare a header against a value in the Secrets Manager **[official]** write-an-http-function. For a browser form that header would be public too, so it's only obscurity; see abuse notes. |
| Browser-callable from another origin? | **Yes, documented.** The `options()` reference is explicitly about CORS preflight; it tells you to return 204 with `Access-Control-Allow-Origin` set to a single origin (or validate and echo the origin) **[official]** https://dev.wix.com/docs/velo/api-reference/wix-http-functions/options. The POST response must also carry `Access-Control-Allow-Origin` (browser requirement; **[inference]**, not spelled out by Wix; one forum thread hit exactly this **[forum]** https://forum.wixstudio.com/t/cors-issue-when-exposing-api-via-wix-to-the-public/2165). |
| Policy caveat | The module intro says "This API is only intended for use in server-to-server communications. For example, don't use custom site APIs to set a cookie on a site visitor's browser" **[official]** https://dev.wix.com/docs/velo/velo-only-apis/wix-http-functions/introduction.md. Read together with the CORS docs, this is privacy guidance (don't set cookies / track visitors), not a technical block. **Grey area; low risk for a JSON POST that sets no cookies.** |
| Needs a secret | **No** (nothing in our page). The backend uses `suppressAuth:true` (wix-crm-backend) or `elevate()` (wix-crm.v2) to write the contact as the site **[official]** create-contact pages. |
| Needs Velo / Dev Mode | Yes, on Faust's site. Free. Someone has to paste ~40 lines and publish. |
| Cost | €0 |
| Quotas | 7,000 req/min, 14 s/request on premium **[official]** velo-about-backend-quotas |
| Abuse risk | Anyone can POST; consequences: junk contacts in Faust's list and, if an automation emails on new contact, email-balance burn. Mitigations available in Velo: origin allow-list (stops casual browser abuse only), honeypot field, verifying a Cloudflare Turnstile / reCAPTCHA token from the backend with `fetch` (secret in Secrets Manager — free), per-IP throttle in a Velo collection. No built-in rate limiting beyond the 7,000 RPM quota. **[inference]** |

Minimal implementation (uses the **stable** module):
```js
// backend/http-functions.js  (on fauststudio.net, Dev Mode on)
import { ok, badRequest, response } from 'wix-http-functions';
import { contacts } from 'wix-crm-backend';

const ORIGINS = ['https://faust-ifsa.github.io', 'https://tuner.fauststudio.net'];
const cors = (o) => ORIGINS.includes(o) ? {
  'Access-Control-Allow-Origin': o, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' } : {};

export function options_tunerSignup(request) {
  return response({ status: 204, headers: cors(request.headers.origin) });
}

export async function post_tunerSignup(request) {
  const headers = { ...cors(request.headers.origin), 'Content-Type': 'application/json' };
  const b = await request.body.json();
  if (!b.consent || b.website /* honeypot */ || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email || ''))
    return badRequest({ headers, body: { ok: false } });
  try {
    await contacts.createContact({
      emails: [{ email: b.email, primary: true }],
      name: b.name ? { first: b.name } : undefined,
      locale: b.lang === 'cs' ? 'cs-CZ' : 'en-US',
      labelKeys: ['custom.tuner'],                       // label created once in the dashboard
      extendedFields: { 'custom.tuner-consent-at': new Date().toISOString() } // custom field created once
    }, { allowDuplicates: false, suppressAuth: true });
  } catch (e) { /* duplicate email → already a contact; treat as ok */ }
  return ok({ headers, body: { ok: true } });
}
```
```js
// our landing page
await fetch('https://www.fauststudio.net/_functions/tunerSignup', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, name, lang, source: 'tuner', consent: true }) });
```
Field names/shape follow the wix-crm-backend reference (flat arrays, `labelKeys: [...]`,
`extendedFields: {...}`) **[official]**. The wix-crm.v2 / REST shape is different (`emails.items`,
`labelKeys.items`). Not run by me — **untested**.

### (c) Wix Headless visitor token (@wix/sdk, anonymous OAuth client)
- Visitor tokens need only a client ID (no secret); access token 4 h **[official]**
  https://dev.wix.com/docs/go-headless/authentication/visitors/authenticate-visitors-rest.
- But `createContact` requires `Manage Contacts`. In Velo the same method "can only be called by visitors
  with Manage Contacts permissions" unless `suppressAuth`/`elevate()` **[official]** create-contact pages.
  Wix's Headless troubleshooting doc says methods needing higher permissions return **403** for visitor/member
  tokens and the fix is to call them from a backend endpoint with `auth.elevate()` (Wix-managed headless)
  or client credentials / API key (self-managed) **[official]**
  https://dev.wix.com/docs/go-headless/authentication/troubleshooting/fix-403-errors.md.
- **Conclusion [inference, consistent with all docs; not tested]:** an anonymous visitor token cannot create
  a contact from our page. Creating a Headless client doesn't buy anything over (b). Same for Forms "Create
  Submission" over REST: scope `Manage Submissions` (app-level) **[official]**
  https://dev.wix.com/docs/sdk/backend-modules/forms/submissions/create-submission.
- The old "elevate() in a Wix-managed headless project" also means hosting a backend at Wix — that's Velo in
  all but name.

### (d) Wix Forms
- **No official way to embed a Wix form on a non-Wix site.** Wix's own feature-request page: "currently it
  is not possible to save a form on one website and reuse it on another website" (localized versions)
  **[official]** https://support.wix.com/nl/article/wix-forms-aanvraag-formulieren-op-andere-websites-hergebruiken.
  Forum consensus agrees **[forum]** https://forum.wixstudio.com/t/embed-wix-form-in-another-website/56720.
- **Standalone form** (new & classic Forms): a form with its own shareable link/QR, "without embedding a
  form directly on your site"; submissions with name/email are "automatically saved in your contacts"
  **[official]** https://support.wix.com/en/article/wix-forms-adding-and-setting-up-a-standalone-form.
  Whether that page can be iframed from another origin is **not documented**; linking to it (new tab / CTA)
  certainly works. Supports **double opt-in** (new Forms only) → "Subscription Pending" until confirmed
  **[official]** https://support.wix.com/en/article/wix-forms-enabling-double-opt-in-for-subscribers.
- Cost: €0 (Core allows 10 forms). Zero code. Downside: the signup happens on a Wix-styled page, not in our
  UI; language = one form per language or a bilingual form.

### (e) Wix Automations "Webhook received" trigger (inbound)
- Exists: trigger "Webhook received" gives a unique URL per automation; POST JSON only; you paste a sample
  payload to define fields; payload fields become dynamic values in actions **[official]**
  https://support.wix.com/en/article/wix-automations-setting-up-a-webhook-trigger (screenshots dated
  Apr–Jun 2025).
- **No authentication** on the URL (article mentions none) — security by URL secrecy, and the URL would be
  in our page source. **[official by absence]**
- **Plan requirement: not stated.** Not in the article, not in the Automations hub, not on wix.com/plans.
  **Unconfirmed.** Only a 10-minute test in Faust's dashboard settles it.
- **Can it create a contact from the payload?** Not documented. Third-party action lists name "Add a label",
  "Send an email", "Create a task", "Send via webhook"… but no "Create contact" **[3rd-party, Dec 2024]**
  https://www.wixpatriots.com/post/wix-automations-a-complete-guide. "Add a label" presumably needs a
  contact already in the trigger context, which a raw webhook doesn't have **[inference]**. Treat (e) as
  **probably not viable for contact creation**; test if curious.
- Don't confuse with the *outgoing* "Send via webhook"/"Send an HTTP request" action (needs Velo enabled)
  **[official]** https://support.wix.com/en/article/wix-automations-sending-data-via-webhook.

---

## 3. Cheapest intermediary, if a secret must live somewhere (Q3)

Only needed if Faust refuses Dev Mode on their site. Then an intermediary holds an API key (§2a).

| Option | Free tier (checked 2026-10-29) | Verdict |
|---|---|---|
| **Cloudflare Workers** | 100,000 requests/day, 10 ms CPU/request, 100 Workers; page "Last updated Oct 12, 2026" **[official]** https://developers.cloudflare.com/workers/platform/limits/ | **Cheapest viable.** Secret as a Worker env var; ~30 lines; CORS trivial. Commercial use allowed on free. |
| Vercel function | Hobby: 1M invocations, but "**restricts users to non-commercial, personal use only**" (doc last_updated 2026-09-14) **[official]** https://vercel.com/docs/plans/hobby-plan | A studio's lead capture is commercial → Pro $20/mo. Relevant warning if the landing page moves to Vercel at all. |
| Netlify functions | not checked (Cloudflare already wins) | — |
| Zapier | Free = 100 tasks/mo, **webhooks are premium-only** ("Connections via webhooks … starts at Professional", $19.99/mo yearly) **[official]** https://zapier.com/pricing | Not viable: a static page can only reach Zapier via webhook. |
| Make | Free = 1,000 credits/mo **[official]** https://www.make.com/en/pricing ; Make's Wix app has **no Contacts modules** (collections, products, orders, forms…), connection = Wix custom/OAuth app **[official]** https://apps.make.com/wix | Would need Make's generic HTTP module + API key = same as a Worker, with a 1,000/mo cap. No. |

---

## 4. Compliance for a Czech/EU audience (Q4)

### 4.1 Law (not legal advice)
- **Czech Act 480/2004 Sb. §7**: commercial e-mail only to users who gave **prior consent**; consent must be
  provable, burden of proof on the sender; every message must identify the sender and offer a free, direct
  way to refuse; exception for existing customers (own similar products/services), who must still be able
  to opt out in each message **[official statute text + ÚOOÚ decisions]**
  https://www.dauc.cz/predpisy/1996/480-2004-sb , https://uoou.gov.cz/media/poskytnute-informace/2019/20112019/uoou-1086517-25.pdf ;
  summary **[3rd-party]** https://pravniprostor.cz/clanky/obchodni-pravo/rozesilani-obchodnich-sdeleni-elektronickou-formou.
  No statutory **form** of consent (double opt-in is not required by law, but DOI is the standard way to make
  consent provable).
- Wix's own guidance distinguishes implied consent (disclaimer near the button) from explicit consent
  (checkbox), says GDPR may require the latter, and disclaims legal advice **[official]**
  https://support.wix.com/en/article/gdpr-and-email-marketing.
- Tuner users are not Faust customers → the existing-customer exception doesn't apply; we need explicit
  consent per signup. **[inference]**

### 4.2 The subscription status field — what Wix actually does
- Every contact has `emailSubscriptions.subscriptionStatus` ∈ `NOT_SET | PENDING | SUBSCRIBED | UNSUBSCRIBED`.
  On the contact object it is **read-only** ("materialized from other systems") **[official]** Contacts v5
  intro; v4 create-contact response schema marks it `read-only`. A contact created by API lands as
  **NOT_SET** ("Never subscribed").
- Wix's definition: *Never subscribed* contacts "may receive occasional notifications, but you should not
  send them any marketing emails"; *Subscribed* = opted in **[official, localized copies of the same
  article]** https://support.wix.com/pl/article/zmiana-statusu-subskrypcji-kontaktu ,
  https://support.wix.com/en/article/contacts-vs-subscribers. When sending a campaign, choose the
  **Subscribers** group rather than "all contacts" **[official]** contacts-vs-subscribers.
- Ways to set SUBSCRIBED:
  1. **Dashboard, per contact**: Contacts → Edit → dropdown next to Primary Email → Subscribed **[official]**
     https://support.wix.com/en/article/changing-the-subscription-status-of-a-contact. Works, doesn't scale.
  2. **Email Subscriptions API** `POST /email-marketing/v1/email-subscriptions`
     `{subscription:{email, subscriptionStatus:'SUBSCRIBED'}}`, scope `Manage Email Subscriptions`
     (`SCOPE.DC-MANAGE.EMAIL-SUBSCRIPTIONS`); SDK `@wix/email-subscriptions`, has an `auth.elevate` example
     **[official]** upsert-email-subscription page. Search snippet of the intro says Developer Preview and
     "app or Wix user identity" — so from a Worker with an API key it should work; from Velo with
     `elevate()` one 2026 thread reports a **403 with no resolution** (thread not retrievable today; snippet
     only) **[forum]** https://forum.wixstudio.com/t/changing-the-email-subscription-status-in-the-crm-comes-with-error-403/78182.
     Older threads (2024) say status is "SYSTEM only, not editable via Velo" **[forum]**
     https://forum.wixstudio.com/t/writing-to-contacts-to-change-subscriptionstatus/55009. **Unverified either way.**
  3. **Contacts v5 Bulk Update Contact Subscriptions** by filter (e.g. label), async job; the page lists the
     scope as "Manage Events" — looks like a documentation error, flag it **[official]**
     https://dev.wix.com/docs/api-reference/crm/members-contacts/contacts/contacts-v5/bulk-update-contact-subscriptions.md.
     Usable as a one-off script from a laptop with an API key (filter `labelKeys` = tuner, status SUBSCRIBED)
     — only legitimate if every such contact ticked the consent box.
  4. **New Wix Forms with double opt-in** does it natively (PENDING → SUBSCRIBED on click) **[official]**.
- Double opt-in is **only available with new Wix Forms** **[official]** DOI article. There is no Wix switch
  that sends a confirmation email for API-created contacts. Rolling our own DOI in Velo (create as NOT_SET →
  triggered/automation email with a confirm link → second HTTP function → upsert SUBSCRIBED) is possible but
  depends on item 2 working and burns email balance (automation emails count) **[inference]**.

### 4.3 Unsubscribe
- Every Wix campaign carries an automatic, non-removable unsubscribe / "change email preferences" link;
  adding your own can get the campaign declined; after confirming, the contact's status becomes
  **Unsubscribed** and they stop receiving campaigns **[official]**
  https://support.wix.com/en/article/about-the-unsubscribe-link-in-emails. Wix's email ToS require the link to
  work ≥ 60 days **[official]** https://www.wix.com/shoutout/terms-of-use. Nothing for us to build.

### 4.4 What we must record on our side (to carry the burden of proof)
- Consent checkbox text (CS/EN), timestamp, source (`tuner`), and ideally IP/user-agent, stored on the
  contact (extended fields) or in a Velo collection. Wix stores consent evidence automatically only for its
  own forms **[3rd-party claim, unverified]** https://profiletree.com/?p=53307. **[inference]**

---

## 5. Things I could not confirm
1. CZK/EUR prices of Wix email-marketing plans (dashboard-only).
2. Whether the Automations "Webhook received" trigger is on Core, and whether any action can create a
   contact from webhook data.
3. Whether `@wix/email-subscriptions` / Email Subscriptions API works from Velo with `elevate()` (forum says
   403 in 2026), and the Developer-Preview status of that API (intro page 404'd; snippet only).
4. Whether a Wix standalone-form page can be iframed cross-origin.
5. Whether Wix would object to a browser (not server) calling an HTTP function. Docs say "intended for
   server-to-server" yet document CORS for browsers.
6. Nothing above was executed; all code is untested.

## 6. Pages that 404'd today (so the pm doesn't retry them)
`…/contacts/contacts/contacts-v4/create-contact(.md)`, `…/crm/communication/email-subscriptions/introduction(.md)`
on three hosts, `…/getting-started/access-types-and-permissions(.md)`, `…/wix-crm-v2/contacts/create-contact.md`
(the working path has an extra `/contacts/`). Both forum.wixstudio.com threads failed to fetch.
