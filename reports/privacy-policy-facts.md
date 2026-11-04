# Privacy policy: sourced facts (task 1 of `docs/privacy-policy-spec.md`)

Researcher, 2026-11-04. Facts only, no policy prose. Confidence: **High** = read on the primary source today;
**Medium** = primary source plus one inference; **Low / unconfirmed** = not found, or secondary source only.
Every URL below returned 200 today (EUR-Lex returns 202 to scripts but opens in a browser).

## 1. Faust Studio's legal entity

Neither "Faust Records" nor "Faust Studio" exists as a registered business name in ARES (0 hits for all three
spellings, ARES REST search 2026-11-04). fauststudio.net shows no IČO, VAT ID or legal form anywhere; its
footer reads "© 2025 by Richard Mader jr." and its About page says "founded in 1991 by musician Richard Mader".
Three entities sit at the footer address, Na hutích 665/8, Bubeneč, 160 00 Praha 6:

| Candidate | IČO | Legal form (ARES code) | Active since | Trade-licence scope | Reading | Conf. |
|---|---|---|---|---|---|---|
| **Ing. Richard Mader** | 10170367 | sole trader (101, živnostenský zákon) | 1992-02-12 | free trade incl. production/distribution of sound recordings, courses & teaching, cultural events, software/hosting | the 1991 founder ("Richard 'Faust' Mader", senior); dates match | Medium |
| **Richard Mader** | 01577778 | sole trader (101) | 2013-04-08 | free trade incl. sound recordings, courses & teaching, cultural productions, software/hosting, marketing | "Richard Mader jr." from the site footer; today's site operator | Medium |
| MADERS s.r.o. | 28169760 | s.r.o. (112), share capital 200 000 CZK | 2007-10-11 | retail / wholesale / brokerage only; statutory body Jakub Mader | family company, **not** the studio | High (that it's unrelated) |

Both sole traders are VAT-registered (ARES "DPH: AKTIVNI"; DIČ omitted here because a sole trader's DIČ encodes
their birth number). **Unconfirmed: which of the two is the controller.** The spec's risk is real: the
controller is a natural person either way ("Richard Mader, IČO …, Na hutích 665/8, 160 00 Praha 6"), there is
no s.r.o. behind the studio. Faust must confirm the IČO before publishing.
Sources: ARES REST `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/{ico}` and
`…/ekonomicke-subjekty-rzp/{ico}`; human-readable `https://ares.gov.cz/ekonomicke-subjekty?ico=01577778`
(and `=10170367`, `=28169760`); https://www.fauststudio.net/kopie-about; https://www.fauststudio.net/richard-faust-mader.

## 2. Czech supervisory authority

| Fact | Value | Source | Conf. |
|---|---|---|---|
| Name (CS) | Úřad pro ochranu osobních údajů (ÚOOÚ) | https://uoou.gov.cz/kontakt | High |
| Name (EN, official site) | Office for Personal Data Protection | https://uoou.gov.cz/en | High |
| Postal address | Pplk. Sochora 27, 170 00 Praha 7 (ARES form: Pplk. Sochora 727/27, Holešovice) | https://uoou.gov.cz/kontakt | High |
| Website | https://uoou.gov.cz/ (EN: https://uoou.gov.cz/en) | — | High |
| Email / data box / phone | posta@uoou.gov.cz · datová schránka `qkbaa2n` · +420 234 665 111 | https://uoou.gov.cz/kontakt | High |
| Complaint page (CS) | "Stížnost na správce nebo zpracovatele na porušení předpisů na ochranu osobních údajů": https://uoou.gov.cz/poradna/chci-podat-stiznost-na-spravce-nebo-zpracovatele | same | High |
| Complaint about commercial email | https://uoou.gov.cz/cinnost/obchodni-sdeleni/stiznost-na-zasilani-obchodnich-sdeleni-a-overeni-stavu | same | High |
| English complaint page | none found; EN site has only /en/contact | https://uoou.gov.cz/en | Medium |

Filing: by form, data box or post is free; email counts only with a recognised e-signature
(https://portal.gov.cz/sluzby-vs/stiznost-na-neopravnene-zpracovani-osobnich-udaju-S29682, High).

## 3. Wix as processor

| Fact | Value | Source | Conf. |
|---|---|---|---|
| Processor entity | Wix.com Ltd., 5 Yunitsman St., Tel Aviv, Israel ("together with its affiliated companies") | https://www.wix.com/about/privacy (effective 2026-06-18) | High |
| DPA applies automatically | "This DPA forms part of the Wix Terms of Use, Privacy Policy and any other applicable Wix terms"; "by using the Wix Services, you instruct Wix to process such Users-of-Users Information on your behalf pursuant to this DPA." Nothing to sign. | https://www.wix.com/about/privacy-dpa-users (effective 2025-12-01) | High |
| Contacts are "Users-of-Users" data | DPA defines it as data of "customers or visitors of the Users' site"; a Wix Contact created by our function is exactly that | same, preamble | High |
| First transfer: Israel | DPA §18.1: data "is initially transferred … to Wix.com Ltd. in Israel under the European Commission's adequacy decision 211/61/EU" (sic; the decision is 2011/61/EU) | same | High |
| Israel adequacy decision | Commission Decision 2011/61/EU (CELEX 32011D0061); listed on the Commission's adequacy page; reaffirmed in the 15 Jan 2024 review of the 11 pre-GDPR decisions (COM(2024) 7) | https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en ; https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32011D0061 | High (number) / Medium (date 31 Jan 2011, from memory) |
| Onward transfers | to "Adequate Countries" under the adequacy decision; to others under the 2021/914 SCCs or other Art. 46 safeguards (DPA §18.2–18.3) | DPA | High |
| Where data is stored | Trust Center FAQ: "Wix stores information in our data centers which are located in the United States of America, Ireland"; data "may then be transferred to other Wix entities worldwide for storage". No EU-only option; host server cannot be chosen (support.wix.com "Request: Changing Your Host Server"). | https://www.wix.com/trust-center/faq ; https://support.wix.com/en/article/list-of-wixs-sub-processors | Medium (FAQ is undated; the privacy policy itself is JS-rendered and I could not read its storage section) |
| Infra sub-processors | AWS (US, SCC), Google Ireland (IE), Fastly (US, SCC), Snowflake (US, SCC) | sub-processors list | High |
| Wix DPF certification | Wix states in its policy that it has certified to the EU-U.S. DPF; **not verified on dataprivacyframework.gov** (JS-only site) | third-party archive of Wix policy 2023 | Low |

Honest one-liner for the page: "stored by Wix.com Ltd (Israel, EU adequacy decision) in data centres in the US and
Ireland, under Wix's data-processing addendum and EU standard contractual clauses."

## 4. GitHub Pages hosting

| Fact | Value | Source | Conf. |
|---|---|---|---|
| What is logged | "When a GitHub Pages site is visited, the visitor's IP address is logged and stored for security purposes, regardless of whether the visitor has signed into GitHub or not." | https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages (Data collection) | High |
| General statement | automatically collected "Service Usage Information" incl. IP address, device information, session details, pages viewed, referrer. User agent not named explicitly. | https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement (effective 2026-04-27) | High |
| Retention | **No period stated**: "The retention duration depends on the purpose of data collection and any legal obligations"; "We employ brief retention terms by design." | same, "Security and Retention" | High (that it's unstated) |
| Transfer mechanism | GitHub "has certified to the U.S. Department of Commerce that it adheres to the EU-U.S. Data Privacy Framework Principles" (+UK ext., Swiss-US DPF); otherwise 2021/914 SCCs. Microsoft's DPF page confirms GitHub keeps its own certification. | same, "Data Privacy Framework (DPF)"; https://www.microsoft.com/en-us/privacy/microsoft-data-privacy-framework-covered-entities (Sept 2026) | High (self-statement) / Low (official list not checked) |
| Entity / contact | GitHub, Inc., 88 Colin P. Kelly Jr. St., San Francisco, CA 94107, USA; EU: GitHub B.V., Amsterdam; DPF queries dpo@github.com | same, "Contact Us" | High |

So the page may say: GitHub logs your IP address for security; we neither see nor use those logs; GitHub does not
publish a retention period; transfers rest on the EU-US DPF. Don't invent "30 days".

## 5. Act 480/2004 Sb. §7 (commercial communications)

Current text (version 12, in force since 2023-03-23), https://www.zakonyprolidi.cz/cs/2004-480, High:

> §7 (2) Podrobnosti elektronického kontaktu lze za účelem šíření obchodních sdělení elektronickými prostředky
> využít pouze ve vztahu k uživatelům, kteří k tomu dali předchozí souhlas. … (4) Zaslání elektronické pošty za
> účelem šíření obchodního sdělení je zakázáno, pokud a) tato není zřetelně a jasně označena jako obchodní sdělení,
> b) skrývá nebo utajuje totožnost odesílatele, jehož jménem se komunikace uskutečňuje, nebo c) je zaslána bez
> platné adresy, na kterou by mohl adresát přímo a účinně zaslat informaci o tom, že si nepřeje, aby mu byly
> obchodní informace odesílatelem nadále zasílány.

In short: prior consent (§7(2)); every message must be clearly marked as a commercial communication, name the
sender, and carry a valid address for opting out (§7(4)). §7(3) is the existing-customer exception (not ours).
"Obchodní sdělení" (§2(f)) covers any message promoting goods, services or a business's image, so a "news about
sessions and courses" email qualifies. ÚOOÚ enforces it and treats the party on whose behalf mail is sent as
liable too; consent needs no particular form but must be provable (ÚOOÚ decisions via
https://www.epravo.cz/top/clanky/kdo-muze-dostat-pokutu-za-spam-111205.html, Medium). Our consent record
(timestamp + consent-text version + source) is the proof.

## 6. GDPR Art. 13 checklist, DPO, EU representative

Art. 13 (https://gdpr-info.eu/art-13-gdpr/, High). Items a notice must contain when data is collected from the person:

- 13(1): (a) controller identity + contact details (and representative, if any); (b) DPO contact, if any;
  (c) purposes and legal basis; (d) the legitimate interests, where 6(1)(f) is used; (e) recipients or categories
  of recipients; (f) third-country transfers, whether an adequacy decision exists or which safeguards, and where
  to get a copy.
- 13(2): (a) retention period or the criteria; (b) rights of access, rectification, erasure, restriction,
  objection, portability; (c) right to withdraw consent at any time, without affecting earlier processing;
  (d) right to lodge a complaint with a supervisory authority; (e) whether providing data is statutory/contractual
  or required, and the consequences of not providing it; (f) automated decision-making/profiling, if any.
- 13(3): tell people before using data for a new purpose. 13(4): not needed where the person already has the info.

Mapping to the spec's "Required content": 1 → 13(1)(a)(b); 4 and 5 → 13(1)(c)(d)(e)(f), 13(2)(a)(e); 6 → 13(2)(f);
7 → 13(2)(b)(c)(d). All covered if "optional, no consequence" (13(2)(e)) is stated explicitly in the signup section.

| Question | Answer | Source | Conf. |
|---|---|---|---|
| DPO required (Art. 37)? | No. Mandatory only for public bodies, core activities of large-scale regular and systematic monitoring, or large-scale special-category/criminal data. A mailing list of a studio is none of these. | https://gdpr-info.eu/art-37-gdpr/ | High |
| Czech extension? | Act 110/2019 Sb. §14 extends the DPO duty only to bodies established by law performing public-interest tasks; nothing for private businesses. | https://www.zakonyprolidi.cz/cs/2019-110 | High |
| EU representative (Art. 27)? | No. Applies only to controllers **not established in the Union**; Faust is established in Czechia. | https://gdpr-info.eu/art-27-gdpr/ | High |

## 7. fauststudio.net today

No privacy policy, cookie notice or terms page: the Wix sitemap (26 pages) has none; `/privacy-policy`, `/privacy`,
`/gdpr`, `/cookies`, `/cookie-policy`, `/zasady-ochrany-osobnich-udaju`, `/terms` all 404; the homepage HTML has
no privacy/GDPR link and Wix's `consentPolicy` config object is empty, i.e. the Wix cookie banner is not enabled.
The only "legal" text is the footer "© 2025 by Richard Mader jr." and the address/phone/email. (High, checked
2026-11-04 by curl; a banner could only appear if Faust turns it on later.) Note the site has a "Book online"
page and "Log In", so Faust's own site collects personal data with no notice at all; worth raising tactfully.

## Open items for Faust

1. Which Richard Mader (IČO 10170367 or 01577778) is the controller. 2. Retention of signup contacts (spec
already flags). 3. Whether they want our page to double as their site's notice (it shouldn't, per spec).
