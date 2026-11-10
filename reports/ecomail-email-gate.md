# Ecomail and the required-email export gate

Researcher, 2026-11-10, for pm. Every URL below was opened on 2026-11-10. No Ecomail account was created and no
Ecomail endpoint was called; everything in Part A is from Ecomail's published docs, so anything about real
behaviour is marked for a hands-on test. **Part B is research, not legal advice.**

Status of each finding:

- **V** = verified on the primary source, text read directly (API docs, the custom-form help article, both EDPB PDFs).
- **V\*** = primary source, but read through a summarising fetch tool. The fact is reliable; re-read the page before
  copying exact wording into the privacy policy.
- **S** = secondary source only. **CNV** = could not verify. **Inference** = my reasoning, not a sourced fact.

## Summary and recommendation

1. **The gate as intended (email required, marketing optional) has no solid lawful basis for the people who do
   not opt in.** A required field is not consent. The email is not needed to deliver a download that happens in
   the visitor's own browser, so "contract" does not fit. Legitimate interest fails its necessity test: an
   unverified email field does not stop bots, less intrusive tools do, and the EDPB says that where such
   alternatives exist "the processing may not be considered to be necessary" (B1, B4).
2. **The bot rationale does not hold for this product.** Export runs in the visitor's browser on a static site.
   A bot clicking Export costs us nothing and reaches no server of ours. The only thing bots can flood is the
   signup endpoint, which exists only because of the gate (Inference, B1).
3. **Recommended gate: optional.** At Export, show the email field with one "Subscribe and download" action and
   an equally visible "Download without subscribing". Only addresses whose owner chose to subscribe go to
   Ecomail, with double opt-in on. This keeps the hero promise ("free, no account") and the current privacy
   policy's "optional" statement true, and needs no lawyer.
4. **If the user still wants a required email**, the only route with real legal support is a different one:
   everyone who gives the address is told plainly it is for Faust's emails, with an opt-out (the "existing
   customer" soft opt-in, widened by the CJEU in C-654/23 in Nov 2025). Whether a free tuner with no account
   creates the "customer" relationship that route needs is unsettled. **That is the question for a Czech lawyer** (B3).
5. **Ecomail can be fed without a secret in the page.** Each list has a public form URL
   (`https://<account>.ecomailapp.cz/public/subscribe/<listId>/<hash>`) that takes a plain HTML form POST. It has
   a reCAPTCHA check that cannot be switched off and it redirects after submit, so it is built for a normal form
   submit, not for `fetch`. Whether it works from an overlay without navigating away from `/tool/` (which would
   lose the visitor's audio) needs a hands-on test (A2). Fallback: a Cloudflare Worker holding the API key (A10).
6. **Ecomail is simpler for the privacy policy than Wix:** Czech company, data on AWS Frankfurt, DPA concluded
   automatically at registration (A9).

## Part A: Ecomail

### A1. How Ecomail is organised

| Concept | What it is | Source | Status |
|---|---|---|---|
| Account | Has a name that appears in its URLs (`<account>.ecomailapp.cz`) and one API key under Manage your account → For developers | https://docs.ecomail.cz/api-reference/introduction.md | V |
| List (seznam kontaktů) | The container for contacts. Double opt-in, custom fields, the public form URL, redirect pages and status are all **per list**. Ecomail's own advice is to keep one list and segment it. | https://intercom.help/ecomail/cs/articles/2637705-nastaveni-double-opt-in | V\* |
| Contact / subscriber | An email address in a list, plus name, source, custom fields, tags, groups | https://docs.ecomail.cz/api-reference/lists/subscribe.md | V |
| Status (per list) | `1` subscribed, `2` unsubscribed, `4` hard bounce, `5` spam complaint, `6` unconfirmed | same | V |
| Custom fields | Per-list key/value data (string, date, json, int, float, url). Addressed by a "merge tag" name | same | V |
| Tags (štítky) | Free labels on a contact, usable for segments and automation triggers | same; https://intercom.help/ecomail/cs/articles/2409519-stitky-ke-kontaktum-a-jejich-pouziti | V / S (not opened) |
| Campaign | A one-off email sent to a list or segment | https://docs.ecomail.cz/llms.txt (API index) | V |
| Automation | A flow started by a trigger (joins list, gets tag, API call) that sends emails over time | same; https://docs.ecomail.cz/api-reference/automations/trigger.md | V (existence) |
| Transactional email | Separate channel for one-to-one messages. **Not in the free plan.** | https://ecomail.cz/cenik | V\* |

### A2. Adding a contact from a static page with no secret

| Finding | Detail | Source | Status |
|---|---|---|---|
| A public POST endpoint exists | Contacts → (list) → Forms shows a URL unique to the list. Pattern from Ecomail's own example: `https://nazevuctu.ecomailapp.cz/public/subscribe/idseznamu/hash`. Use it as `<form method="post" action="...">`. No key. | https://support.ecomail.cz/cs/articles/66568-pouziti-a-nastaveni-vlastniho-formulare (dated 10 Mar 2026) | V |
| Field names | `email`, `name`; custom fields as `custom_fields[mergetag]`; preference groups as `groups[listId][groupId][]`; hidden `updateExisting=1` to update an existing contact; `?source=...` on the URL sets the contact's source | same | V |
| Tags | Not offered on this endpoint | same (absent) | CNV |
| Bot protection | "Na webhooku ze seznamu kontaktů je nastavená automatická kontrola e-mailových adres (reCaptcha) … není možné ji vypnout." If you don't want it, Ecomail says use the API and secure the form yourself. | same, FAQ | V |
| After submit | The visitor is redirected, to a page set in the list's Settings → "Přesměrování po registraci ve formuláři", otherwise to an Ecomail page with editable messages | same | V |
| Double opt-in | Applies if the list has it on | same, FAQ | V |
| Use from `fetch`/XHR | Not documented. The article's CORS answer blames the site's own headers and offers the API as the fix, which suggests cross-origin script calls are not a supported use. Response format for scripts: none documented (it is a redirect). | same | CNV |
| Rate limits on this endpoint | Not documented | — | CNV |
| The REST API from a browser | Refused: "the API does not accept direct HTTP requests from JavaScript/AJAX in a browser", it returns a CORS error | https://docs.ecomail.cz/api-reference/introduction.md | V |
| Ecomail's own embeddable forms | Inline, pop-up, mobile pop-up and slide-in forms are added with a `<script>` snippet, or linked as a hosted page. This loads Ecomail's script on our page. | https://intercom.help/ecomail/cs/articles/2376851-sber-kontaktu-pomoci-formularu | V\* |

**What this means for the design (Inference).** The endpoint is made for a full-page form submit. In the tool
overlay a full-page submit would navigate away from `/tool/` and destroy the visitor's unsaved audio work, so
the form must post into a new tab (`target="_blank"`) or a hidden iframe. Three things decide whether that
works and none is documented: how the reCAPTCHA check appears (silently, or as an interstitial page the visitor
must see), whether the response may be framed, and whether a `fetch` with `mode: "no-cors"` gets through (even
if it does, the page cannot read the result, so it cannot show a truthful error state).

**Hands-on tests needed with the user's account:** (1) plain form POST from `npm run preview`: what does the
visitor see, where do they land; (2) the same into a hidden iframe and into `_blank`; (3) `fetch` with
`no-cors`: does the contact appear; (4) does `custom_fields[x]` create a missing field or drop it silently (the
API creates it; the form endpoint is not documented); (5) the response headers (`Access-Control-*`,
`X-Frame-Options`/CSP); (6) does the reCAPTCHA load Google scripts into our page or only on Ecomail's.

### A3. The REST API

| Item | Value | Source | Status |
|---|---|---|---|
| Base URL | `https://api2.ecomailapp.cz/` | https://docs.ecomail.cz/api-reference/introduction.md | V |
| Auth | Header `key: <API key>`, plus `Content-Type: application/json` | same | V |
| Subscribe call | `POST /lists/{list_id}/subscribe` with a `subscriber_data` object (`email` required; `name`, `surname`, `source`, `custom_fields`, `tags`, `status`, …) | https://docs.ecomail.cz/api-reference/lists/subscribe.md | V |
| `skip_confirmation` | Default `false`: "the system sends a double opt-in email and the subscriber is added with status 6 (unconfirmed)" | same | V |
| `update_existing` | Default `false`. If the contact exists the response carries `already_subscribed: true` | same | V |
| `resubscribe` | Default `false`. Forces a previously unsubscribed contact back to subscribed | same | V |
| `trigger_autoresponders` | Default `false`. Set `true` to start automations on add | same | V |
| Tags behaviour | "Content overwrites current tags. Only updates if the parameter is present and `update_existing` is `true`." | same | V |
| Custom fields behaviour | "If a field doesn't exist, a new field is created." Max 5,000 characters in total; keys are lowercased | same | V |
| Rate limit | 1,000 requests/minute per key; `429` with `Retry-After` | introduction.md | V |
| Free plan | API access is listed as included | https://ecomail.cz/cenik | V\* |
| Key scope | The docs describe a single key ("Copy API Key") and no scopes, roles or IP restrictions. The same key can read, delete and send (subscriber delete, campaign send are in the API index). | introduction.md; https://docs.ecomail.cz/llms.txt | V that nothing is documented; **CNV** whether scoped keys exist in the app |

Treat the key as full account access (Inference). It must never be in the page or the repo.

### A4. Double opt-in (DOI)

| Finding | Source | Status |
|---|---|---|
| Set per list (list settings, or when creating the list) | https://intercom.help/ecomail/cs/articles/2637705-nastaveni-double-opt-in (dated 1 Oct 2026) | V\* |
| Sent to new contacts from forms, the API, Facebook Lead Ads and some integrations. **Not** on bulk import ("potvrzení odběru je ošetřeno před samotným importem") | same | V\* |
| Before confirming: status `6`, shown under "Nepotvrzené", receives no campaigns and no automation emails. On click: moves to Active | same; subscribe.md | V\* / V |
| The email: own subject and text, plain or a template from the editor, must contain the merge tag `*\|SUBCONFIRM\|*` (the confirmation link) | same | V\* |
| After the click: a redirect URL can be set; otherwise an Ecomail-hosted page | same | V\* |
| Language: nothing documented for the DOI email or page. One template per list. | same (absent) | CNV |
| Whether unconfirmed contacts are ever purged, and whether they or DOI emails count against plan limits | — | CNV |
| The ÚOOÚ recommends exactly this confirmation step so that consent can be proven | https://uoou.gov.cz/cinnost/obchodni-sdeleni/casto-kladene-otazky-k-zakonu-c-4802004-sb (Q15) | V\* |

EN + CS options (Inference): one bilingual confirmation email and a redirect to our own confirmation page (which
already has the language switch), or two lists, which goes against Ecomail's one-list advice. Test in the account.

### A5. Consent records

| Finding | Source | Status |
|---|---|---|
| We can store our own: `custom_fields` (e.g. `consent_at`, `consent_version`, `consent_source`) via the API, created on first use; via the form endpoint as `custom_fields[...]` | subscribe.md; custom-form article | V (API) / test (form) |
| Ecomail records: creation date; date and time of each subscribe/unsubscribe status; exact date and time of DOI confirmation (also a `doi_date` column in exports); source | https://support.ecomail.cz/cs/articles/2433751-detail-kontaktu (30 Sep 2026); http://support.ecomail.cz/cs/articles/4884432-obchodni-sdeleni-newsletter-z-pohledu-pravnika-a-souvisejici-navody | V\* |
| Source is "zdroj posledního přihlášení", so it changes on each new signup. Do not rely on it as the landing-vs-tool record; keep that in a custom field too. | detail-kontaktu | V\* |
| IP address of the signup: not mentioned in any article read | — | CNV |
| `inserted_at` is returned by the API in UTC | subscribe.md | V |

### A6. Holding a contact who did not opt in

Possible in a narrow technical sense, not advisable. The API accepts `status: 2` (unsubscribed) on creation
(V, subscribe.md), unsubscribed contacts receive nothing from that list and are not counted in the plan limit
(S: Ecomail help article 66824, seen as a search excerpt only). But: the status says something untrue (they never
subscribed), it is per list, `resubscribe` or a careless import can flip it, and Ecomail's terms assume
subscribers consented (V\*, https://ecomail.cz/obchodni-podminky/). There is no documented "do not mail"
status for people who never agreed. Unconfirmed (`6`) is not a parking place either: the confirmation click makes
them a subscriber. **Recommendation: an address without marketing consent is never sent to Ecomail** (Inference;
it also follows from B2).

### A7. Pricing (https://ecomail.cz/cenik, V\*)

| Plan | Lowest tier, excl. VAT | Notes |
|---|---|---|
| Free | 0 | "Do 200 odeslaných e‑mailů měsíčně"; the comparison table says "Do 200 kontaktů". No time limit. Includes API, forms, double opt-in, automations, webhooks. Excludes transactional emails and SMS. |
| Profi | 150 CZK/month billed yearly, 250 monthly | 3-month minimum on paid plans. Price rises with active contacts; the per-tier table was not readable. |
| Marketer+ | 200 / 300 CZK | |
| CDP | 2,000 / 2,400 CZK | |

- Over the free band: "tak Vám Váš Uživatelský účet dočasně zablokujeme" (V\*, terms). After 2 years without a
  login Ecomail may delete the account and its database (V\*, terms).
- Whether the page's "200" limits emails, contacts or both: the page is inconsistent. **CNV**; a secondary
  review says both (https://mailujeme.cz/navody/ecomail-recenze-2025-co-ukazala-nase-praxe/, S).
- Ecomail branding in free-plan emails: **CNV**. Whether DOI emails count toward the 200: **CNV**.

### A8. Moving from the user's account to Blanka's

| Item | Carries over? | Source | Status |
|---|---|---|---|
| Contacts | Export per category (active, unsubscribed, bounced), import with "import as unsubscribed / bounced" ticked; custom fields can be created during import; tags can be applied on import | https://intercom.help/ecomail/cs/articles/2459023-slucovani-seznamu-kontaktu ; https://intercom.help/ecomail/cs/articles/2413451-vlastni-pole-u-kontaktu | S (search excerpts of Ecomail help) |
| Native consent evidence | Import does not trigger DOI and a new account sets its own creation dates, so Ecomail's own timestamps do not transfer as such. Our custom fields do. | DOI article; Inference | V\* / Inference |
| Templates | No in-app copy between accounts found. The API can read a template from one account and create it in another. | https://docs.ecomail.cz/llms.txt | V (endpoints exist) / CNV (in-app) |
| Automations, forms | The API only lists and triggers automations; rebuild by hand. Ecomail's own Mailchimp migration guide says templates, forms and automations "must be recreated". | llms.txt; https://intercom.help/ecomail/cs/articles/6419768-prechod-z-platformy-mailchimp | V / V\* (by analogy) |
| Public form URL, list ID, API key | All change (account name, list id and hash are in the URL). Keep them in `site.config.json`, like `signupEndpoint` today. | custom-form article | V / Inference |
| Sender domain | A domain can be in **one Ecomail account at a time**. Needs DKIM (`TXT ecomail._domainkey`), DMARC (`TXT _dmarc`, at least `v=DMARC1; p=none;`), and for a subdomain a `CNAME` to `sparkpostmail.com`. SPF is handled by Ecomail (optionally add `include:sparkpostmail.com`). Verification is required before the first campaign, free-mail senders (gmail, seznam) are not allowed, and the domain needs a working website. | https://intercom.help/ecomail/cs/articles/2433064-overeni-domeny (13 Aug 2026) | V\* |

With only test addresses in the first account, the cheapest move is to migrate nothing and rebuild the list,
fields, DOI email and automation in Blanka's account from a written checklist (Inference). The user should not
verify Faust's domain in their own account, or must remove it before Blanka adds it. Who controls
fauststudio.net's DNS (it is a Wix site) is **CNV** and decides how easy the three records are.

### A9. GDPR paperwork

| Fact | Value | Source | Status |
|---|---|---|---|
| Entity | ECOMAIL.CZ, s.r.o., IČO 027 62 943, Na příkopě 388/1, Staré Město, 110 00 Praha 1; Městský soud v Praze, C 223183 | https://ecomail.cz/obchodni-podminky/ (effective 16 Jun 2026); https://ecomail.cz/zasady-zpracovani-osobnich-udaju/ (effective 11 Dec 2025) | V\* |
| Role | Processor for recipients' data: "činíme Vaším jménem pouze jako zpracovatel" | privacy policy | V\* |
| DPA | Annex 1 of the terms. "Zpracovatelská smlouva je uzavřena v okamžiku dokončení registrace". Nothing to sign. | terms | V\* |
| Hosting | "Primární servery jsou umístěny v rámci cloudové infrastruktury AWS (region EU‑Central ‑ Frankfurt)." Terms: "Exportovatelná data uchováváme a zpracováváme v EU, případně EHP." The register also says data may be present in the US. | https://ecomail.cz/datovy-rejstrik/ (v1.0, 29 Jan 2026) | V\* |
| Sub-processors (DPA Annex C) | AWS EMEA SARL (EU; US under DPF), Google Ireland, MessageBird B.V. (NL; email sending), Twilio Ireland (SCC, UK IDTA, DPF), CyberPanda (SK), Recombee (CZ), ZooControl (CZ), OpenAI Ireland (SCC), Anthropic PBC (US, SCC) | terms, Annex C | V\* |
| Transfers outside the EU | Possible via those sub-processors, under the EU-US Data Privacy Framework or 2021/914 SCCs | same | V\* |
| New sub-processors | Notified by email or in the app; 5 days to object | terms | V\* |
| After termination | Exportable data available 30 more days, then full deletion | terms | V\* |

Honest one-liner for the policy (re-check wording against the pages first): "stored for us by ECOMAIL.CZ, s.r.o.
(Prague) on servers in Frankfurt, Germany; some of its suppliers may process data in the US under the EU-US Data
Privacy Framework or standard contractual clauses." The Wix/Israel paragraph goes. The controller question
(which Richard Mader) is unchanged, and whoever owns the Ecomail account is the party to the DPA: while it is the
user's own account, the user, not Faust, is Ecomail's customer. Use test addresses only until the swap.

### A10. If the public endpoint is not usable

A Cloudflare Worker (free plan: 100,000 requests/day, 10 ms CPU per request, 64 secrets;
https://developers.cloudflare.com/workers/platform/limits/, updated 29 Oct 2026, V\*) holds the Ecomail key as a
secret, accepts the same JSON our form sends today, checks the origin and a honeypot, and calls
`POST /lists/{id}/subscribe`. It would replace the Velo function one for one and gives real JSON responses, tags
and custom fields. Costs: one more account to hand to Faust and Cloudflare named in the privacy policy as a
processor. A Vercel function is the same idea, but **Vercel's free Hobby plan is "restricted to non-commercial
personal use only"** and lists "advertising the sale of a product or service" as commercial
(https://vercel.com/docs/limits/fair-use-guidelines, updated 14 Sep 2026, V). That affects the planned Vercel
launch as a whole, not only this function: Faust's site would need a paid plan.

## Part B: is the required-email gate lawful?

Research, not legal advice. Sources read directly: EDPB Guidelines 05/2020 on consent, v1.1
(https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_en.pdf) and EDPB
Guidelines 1/2024 on Art. 6(1)(f), v1.0 adopted 8 Oct 2024 for public consultation
(https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202401_legitimateinterest_en.pdf). I could not
confirm that a final version of 1/2024 has been adopted; the necessity test it states comes from CJEU case law
and is unlikely to change. GDPR text: https://gdpr-info.eu/.

### B1. Lawful basis for the email of someone who does not opt in

| Basis | Assessment | Source | Status |
|---|---|---|---|
| Consent, Art. 6(1)(a) | Not available. A required field is a condition, not a choice. Art. 7(4) and Recital 43 presume consent is not free when a service depends on consent to data "not necessary" for it; the EDPB calls valid cases "highly exceptional" (§35) and puts the burden of proof on the controller (§36). | Consent guidelines §26–36 | V |
| Contract, Art. 6(1)(b) | Not available. "Necessary for the performance of a contract" is read strictly and needs "a direct and objective link" (§30). The export is produced in the visitor's browser; nothing is delivered by email. | Consent guidelines §30–32 | V (rule) / Inference (application) |
| Legitimate interest, Art. 6(1)(f) | Fails, see below. | LI guidelines §29, §104–106 | V (rule) / Inference (application) |

The legitimate-interest test has three cumulative steps (LI guidelines, executive summary):

1. **A legitimate interest that is "lawful, precisely articulated and present".** Preventing abuse can qualify
   (Recital 47, 49). But the abuse must be real. Export on a static, in-browser tool uses no resource of ours, so
   there is nothing for bots to flood. "A generic reference to the purpose of 'combating fraud' … is not
   sufficient" (§106).
2. **Necessity.** "If there are reasonable, just as effective, but less intrusive alternatives, the processing
   may not be considered to be 'necessary'" (§29), read together with data minimisation, Art. 5(1)(c). An
   unverified email field is not an effective bot control at all (a script types any string), and effective
   controls that collect no identity exist (B4). The test fails here.
3. **Balancing.** Not reached. If it were: a visitor told "free, no account, your audio never leaves your device"
   does not reasonably expect to hand over an identifier to press Export.

Two further problems. First, purpose honesty: if the real reason for the field is lead generation, stating
"anti-bot" as the purpose breaches Art. 5(1)(a)/(b) regardless of basis (Inference). Second, the bases cannot be
swapped later: "it is not allowed to retrospectively utilise the legitimate interest basis in order to justify
processing, where problems have been encountered with the validity of consent" (consent guidelines §123, V).

### B2. Does it change if the non-opt-in address is…

| Variant | Assessment (Inference from the rules in B1) |
|---|---|
| (a) never stored or sent anywhere | The least harmful, since no data reaches us. But then the field does nothing: it stops no bot, and a mandatory field whose content is thrown away misleads the visitor about why it is asked (fairness, Art. 5(1)(a)). A lawyer may also say that reading the field in our script is already processing. Not recommended. |
| (b) stored only until verified | Verification means sending an email, so a basis is still needed and necessity still fails. Practical blockers too: Ecomail's double opt-in turns the person into a subscriber on click, which is the opposite of what they chose; a neutral verification mail is a transactional email, which the free plan lacks (A7); and with no file to send, the visitor would have to leave the tool, find the mail and come back. |
| (c) stored in Ecomail untagged | The worst option. Data kept with no purpose (Art. 5(1)(b), (c), (e)), sitting in a marketing tool one click from being mailed, counting toward the plan, and against the premise of Ecomail's terms. |

### B3. How regulators treat "email for a free download"

- **EDPB.** No guidance names lead magnets. The governing text is the conditionality section above, plus the
  cookie-wall example (consent guidelines §39–41): access to content may not be made conditional on consent.
  One example shows the lawful shape of an incentive: an exclusive preview in return for joining a mailing list
  is acceptable because "there is no detriment, as the products will be available to them anyway" (Example 10,
  §51–54). Applied here: an optional signup with a perk is fine; a wall is not. (V rule / Inference application)
- **Czech ÚOOÚ.** I found no ÚOOÚ position or decision on gated downloads. Its FAQ on Act 480/2004 says consent
  must be "svobodný, konkrétní, informovaný a jednoznačný" and given beforehand, the sender carries the burden of
  proof, and it recommends a confirmation email (Q14, Q15). It also says an email *asking* for consent is itself
  a commercial communication and may not be sent (Q13), so we cannot email non-subscribers to "invite" them
  later. A "customer" under the existing-customer exception can have a free relationship, but "potenciálního
  zákazníka nebo účastníka různých soutěží" does not count (Q8).
  (https://uoou.gov.cz/cinnost/obchodni-sdeleni/casto-kladene-otazky-k-zakonu-c-4802004-sb, V\*)
- **Enforcement.** ÚOOÚ fines for commercial email without provable consent run from tens of thousands to
  several million CZK (S: https://www.pravniprostor.cz/clanky/pravo-it/za-spam-padaji-milionove-pokuty-znate-vsechna-pravidla,
  not opened in full). No case specific to gated content found, Czech or elsewhere: **CNV**.
- **CJEU C-654/23, Inteligo Media, 13 Nov 2025.** A free account that came with a daily newsletter counted as
  obtaining the address "in the context of the sale of a product or service", so the soft opt-in (Art. 13(2)
  ePrivacy; in Czech law §7(3) of Act 480/2004) applied with an opt-out, and no separate GDPR consent was needed
  for the sending. Commentators stress the ruling is tied to a freemium model that drives paid subscriptions.
  (S: https://www.taylorwessing.com/en/insights-and-events/insights/2025/11/european-court-of-justice-backs-the-advocate-general ;
  https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/consent-required-cjeu-issues-landmark-ruling-on-requirements-for-marketing-email-102mgiz ;
  judgment text not read.) This is the only route under which "email required" could be defended, and it is a
  different gate from the one intended: everyone is told the address will be used for Faust's emails and can
  untick. It still needs a basis for requiring the address in the first place, which Inteligo had (an account)
  and we do not. **Lawyer needed.**

### B4. Less data-hungry bot controls

| Control | Personal data | Third party loaded | Note |
|---|---|---|---|
| Honeypot field (already in `Signup.tsx`) | none | none | Stops simple form bots |
| Time trap / requiring a real click | none | none | Same class |
| Proof-of-work in the page | none | none | Raises cost per submit; no account needed |
| Cloudflare Turnstile | device signals, IP, processed by Cloudflare | yes, script from Cloudflare | Free plan: unlimited challenges, 20 widgets (https://developers.cloudflare.com/turnstile/plans/, V\*). Would make "nothing on this site is loaded from other companies" false, so the policy and that claim would change. |
| Ecomail's built-in reCAPTCHA on the public form URL | handled by Google/Ecomail | to be tested (A2) | Comes free with the keyless route |
| Double opt-in | none extra | none | Stops fake or mistyped addresses becoming subscribers and protects the sender reputation |
| Rate limit in a Worker | IP, transient | Cloudflare | Only if A10 is used |

Their existence is exactly what defeats the legitimate-interest argument (§29, B1). And the place that needs
protecting is the signup endpoint, not the Export button.

### B5. Checklist for a compliant gate

Assumes the recommended optional gate.

- [ ] **Skippable.** "Download without subscribing" is as visible and as easy as subscribing; export works
      identically either way (no detriment, consent guidelines §46–48).
- [ ] **One purpose, stated at the field:** who will send what (Faust Studio; news about sessions and courses),
      roughly how often, that it is optional, link to `/privacy/`. Consent text versioned as today
      (`SIGNUP_CONSENT_VERSION`), old texts kept.
- [ ] **Active opt-in.** Submitting the email for that stated purpose, or a box the visitor ticks. Never
      pre-ticked ("The use of pre-ticked opt-in boxes is invalid", consent guidelines §79; ÚOOÚ FAQ Q14).
- [ ] **Nothing else bundled** into the same action (no "and accept terms") (§26, granularity §42–45).
- [ ] **Double opt-in on** for the list; the confirmation email contains only the confirmation, no promotion.
- [ ] **Record per contact:** timestamp, consent-text version, source (`landing` / `tool`), language, in custom
      fields; plus Ecomail's own DOI date. "Controllers should have enough data to show … consent was obtained
      but they shouldn't be collecting any more information than necessary" (§106).
- [ ] **Withdrawal as easy as giving:** working unsubscribe link in every email (Act 480/2004 §7(4)(c)), and
      deletion on request.
- [ ] **Every email** marked as a commercial communication and naming the sender (§7(4)(a), (b)).
- [ ] **Privacy policy updated (Art. 13):** Ecomail replaces Wix as processor (A9); the tool section no longer
      says the tool has no email prompt; any new third party (Turnstile, Cloudflare Worker) named; version and
      date bumped. Controller identity still open.
- [ ] **Copy still true:** "free, no account" and the FAQ's "without signing up" hold only if the gate is
      skippable. Every `TODO(email)` string re-checked.
- [ ] **No address without consent is transmitted** anywhere, including to Ecomail as unconfirmed/unsubscribed.
- [ ] **DPA in place** with the account's real owner; test addresses only while the account is the user's.

If the user chooses a required email instead, add before building: a written legitimate-interest or soft-opt-in
assessment, and a Czech lawyer's sign-off on it. I would not build that variant without the sign-off.

## Where a Czech lawyer is needed

1. Whether requiring an email for a free in-browser export can rest on any Art. 6 basis (my reading: no).
2. Whether a free tuner user is a "zákazník" under §7(3) of Act 480/2004 after C-654/23, which would allow
   opt-out emails to everyone who gave an address.
3. The Czech privacy policy text, already flagged for native legal review.

## Could not verify (open list)

Behaviour of the public form endpoint under `fetch`, iframe and new-tab posts, and how its reCAPTCHA shows;
whether the form endpoint auto-creates custom fields; rate limits on it; whether Ecomail stores the signup IP;
language handling of the DOI email and page; whether unconfirmed contacts and DOI emails count against the free
plan, and whether the free limit is contacts, sends or both; Ecomail branding on free-plan emails; whether API
keys can be scoped; export column list beyond `doi_date`; who controls fauststudio.net's DNS; any regulator
decision on gated downloads; whether EDPB Guidelines 1/2024 have a final version.

## Confidence

High on the Ecomail API and custom-form facts (read directly), and on the EDPB rules quoted. Medium on Ecomail
pricing, terms and hosting details (correct source, read through a summariser). Medium on the Part B conclusion:
the rules are clear and point one way, but applying them to this gate is my reasoning, not a regulator's or a
lawyer's.
