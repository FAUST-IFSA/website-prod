# Costs of combining the static landing page + browser tuner with Faust Studio's Wix site

All web sources were fetched or searched on 2026-10-25 unless a different date is given. All local measurements were taken the same day, read-only, from `/Users/fin/website-prod/dist` (built from autotuner commit `e255279…`), from the live GitHub Pages deploy, and from the live https://www.fauststudio.net/. Prices are in the currency the source gave. I have not converted currencies, because I found no sourced exchange rate for October 2026.

## 1. Wix Premium plans in 2026: names, prices, and which tier unlocks each feature we need

### Takeaway
The 2026 lineup is **Light / Core / Business / Business Elite**. In USD that is about $17 / $29 / $39 / $159 per month on yearly billing, or $24 / $36 / $46 / $172 billed monthly. Italian EUR prices are €14 / €25 / €34 / €149 excluding tax. I found no CZK price. Every integration feature we need works on **any** Premium plan with a connected domain and no ads:
- HTML/iframe embed
- Settings → Custom Code
- Custom Elements
- Velo/Dev Mode, which also works on free sites, with quotas

None of the six approaches needs a higher tier. The only paid Wix add-on we might hit is Email Marketing volume.

### Cited Findings
- **The lineup is Light, Core, Business, Business Elite.** Wix restructured its plans in 2025, so the old Combo, Unlimited and VIP tiers are gone. — [WebsiteBuilderExpert, "Wix Pricing 2026", updated 2026-09-15](https://www.websitebuilderexpert.com/website-builders/wix/wix-pricing/)
- **USD prices, yearly vs monthly billing** (same source, updated 2026-09-15). A "TAKE10" code takes 10% off yearly prices. — [WebsiteBuilderExpert](https://www.websitebuilderexpert.com/website-builders/wix/wix-pricing/)

  | Plan | Per month, billed yearly | Per year | Per month, billed monthly |
  |---|---|---|---|
  | Light | $17 | $204 | $24 |
  | Core | $29 | $348 | $36 |
  | Business | $39 | $468 | $46 |
  | Business Elite | $159 | $1,908 | $172 |

  Other 2026 aggregators agree on the yearly prices. They differ slightly on monthly-billed Business ($43 vs $46). — [WebSearch summary of several 2026 guides](https://www.websitebuilderexpert.com/website-builders/wix-pricing)
- **wix.com/plans** (fetched 2026-10-25) showed Light $17.77, Core $29.77, Business $39.77 and Business Elite $159.77 per month on yearly billing. It labels them "Price includes GST", says "Prices and currency vary by location. USD prices displayed for reference only", and the page footer reads "© 2006-2026". **These are regional prices for wherever the fetcher was, not US or CZ prices.** — [wix.com/plans](https://www.wix.com/plans); [wix.com/upgrade/website](https://www.wix.com/upgrade/website)
- **Tier differences on wix.com/plans:**
  - Storage: 2 GB / 50 GB / 100 GB / unlimited
  - Site collaborators: 2 / 5 / 10 / 100
  - "Accept payments" and eCommerce: Core and above only
  - Marketing suite: Light / Basic / Standard / Advanced
  - "Advanced developer platform": listed only on Business Elite
  - Every plan: "Free domain for 1 year"

  — [wix.com/upgrade/website](https://www.wix.com/upgrade/website)
- **EUR prices for Italy**, yearly billing, excluding tax, verified 2026-03-23: Light €14, Core €25, Business €34, Business Elite €149 per month. This is a single secondary source covering Italy only. — [finom.co (IT)](https://finom.co/it-it/blog/wix-prezzi/)
- **No CZK prices found.** `cs.wix.com/plans` returned HTTP 404, and a Czech-language search found no koruna figures. — [search: playcode.io and others](https://playcode.io/blog/wix-website-cost)
- **Custom Code** (Settings → Custom Code): "Make sure that your site is published and has a connected domain." Code can go in the Head, Body-start or Body-end. Connecting a domain needs a Premium plan. — [Wix Help: Embedding Custom Code](https://support.wix.com/en/article/embedding-custom-code-on-your-site)
- **Custom Element:** "you must upgrade your site with a Premium Plan, connect a domain and have no ads on it."
  - The script is either hosted by you at an HTTPS "Server URL" or stored as a "Velo File".
  - In the Editor and preview, the element renders inside an iframe.

  — [Wix Help: Adding a Custom Element](https://support.wix.com/en/article/wix-editor-adding-a-custom-element-to-your-site)
- **Velo on a free site:** "You can try out most Velo and Data features with a free site." Free-site quotas:

  | Resource | Free-site quota |
  |---|---|
  | Data storage | 1,000 items |
  | Data requests per minute | 1,000 reads / 60 writes |
  | Backend containers | 1 micro (1 vCPU, 400 MB RAM) |
  | Backend requests per minute | 60 |
  | Backend request timeout | 14 s |
  | Scheduled jobs | 20 |

  Paid plans raise these limits. — [Wix Dev docs: Using Velo with a Free Wix Site](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/premium-plans/using-velo-with-a-free-wix-site.md)
- **Legacy plans:** "Premium plans added to sites before September 2023 are now considered legacy plans… your site's resource limits won't change." — [Wix Dev docs: About Premium Plans](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/premium-plans/about-premium-plans)
- **HTML embed / Embed a Site:**
  - "The HTML and URL elements in our editor are iFrames."
  - "Only HTTPS codes and URLs are displayed."
  - Embedded content "won't be responsive, even if it is originally."
  - Sites with security policies that block embedding can't be shown.
  - The article does not say that a Premium plan is required.

  — [Wix Help: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget)
- **Paid plans connect a domain and remove Wix ads.** The older "Connect Domain" plan did *not* remove ads. — [Wix Help search results: connect-domain plan / premium overview](https://support.wix.com/en/article/business-vip-premium-plan-overview); [websiteplanet upgrade guide 2026](https://www.websiteplanet.com/guides/wix-elements/how-to-upgrade-to-premium-on-wix/)

### Inferences
- Faust already has a Premium plan with a connected domain and no ads (see §2). So Custom Code, Custom Elements, Velo and embeds should cost **€0 extra on the Wix side** for every approach. A plan upgrade would only be needed for Velo quotas above their plan's level, which is unlikely for an email-signup endpoint, or for the Business Elite "advanced developer platform", which none of our approaches needs.
- For a Czech customer, Wix likely bills in EUR or CZK at roughly the Italian levels plus 21% Czech VAT. This is unverified, so check it in Faust's Wix dashboard under Subscriptions.

### Gaps
- No official CZK or EUR price list. Wix localises prices by IP, and `cs.wix.com/plans` returned 404.
- No official per-plan table for bandwidth, video hours, Velo quotas on paid plans, or Email Marketing quotas. The plans page lists "Marketing suite: Light/Basic/Standard/Advanced" without numbers.
- A search summary said free sites get 1 GB of bandwidth and upgraded sites get unlimited. I could not tie that to a specific Wix page I fetched, so treat it as unconfirmed.
- I did not confirm whether the HTML/iframe element is restricted on free sites. It doesn't matter here, because Faust is Premium.

## 2. What plan is fauststudio.net on? (live-site inspection)

### Takeaway
The live HTML confirms a **paid Wix Premium site** with its own domain and **no Wix ad banner**: `"isPremium":true`, `"isPremiumDomain":true`, `"freemiumBanner":false`. It is a classic Wix Editor site, not Wix Studio, with no Velo code yet. The exact tier (Light, Core, etc.) is not exposed. The installed Bookings, Checkout and Gift Cards apps hint at Core or above, but only if Faust takes payments online. The domain is registered *at Wix*, uses Wix nameservers, and **expires 2026-12-21**.

### Cited Findings
- **Response headers** from `curl -sSL https://www.fauststudio.net/` (2026-10-25): `x-wix-request-id`, `server: cloudflare`, `cf-ray … PRG`, and preconnects to `static.parastorage.com` and `static.wixstatic.com`. These confirm Wix hosting, served through Wix's Cloudflare CDN. — [fauststudio.net (live, curl)](https://www.fauststudio.net/)
- **Plan flags embedded in the page HTML:**
  - `"isPremium":true`
  - `isPremiumDomain=true`
  - `"freemiumBanner":false`
  - `"coBrandingBanner":false`
  - `"isWixSite":false`
  - `isWixCodeOnSite=false` (no Velo yet)
  - `"isStudio":false`
  - `"siteType":"UGC"`
  - `locale=cs-cz`, `isMultilingualEnabled=false`, page `lang="en"`

  `#WIX_ADS` appears only in generic CSS rules, not as a rendered banner. — [fauststudio.net (live HTML)](https://www.fauststudio.net/)
- **Installed apps** (from `appDefinitionName` in the HTML):
  - Wix Bookings, Checkout & Orders, Wix Gift Cards
  - Wix Members Area, My Subscriptions, My Wallet
  - Wix Forms, "Old Wix Forms and Payments"
  - "ShoutOut (Legacy)", which is the old Wix email-marketing app
  - Wix Music, Wix Video, Wix Portfolio, Wix Pro Gallery, Google Reviews

  — [fauststudio.net (live HTML)](https://www.fauststudio.net/)
- **DNS and WHOIS** (`dig` / `whois`, 2026-10-25):
  - NS: `ns2.wixdns.net`, `ns3.wixdns.net`
  - Apex A records: 185.230.63.x (Wix). `www` CNAMEs to `cdn3.wixdns.net`.
  - Registrar: "Wix.com Ltd." Created 2024-12-21T18:01:00Z. Registry expiry 2026-12-21.
  - No MX records.

  — [WHOIS/DNS for fauststudio.net](https://www.fauststudio.net/)
- **Only Core and above can "Accept payments".** — [wix.com/upgrade/website](https://www.wix.com/upgrade/website)

### Inferences
- `freemiumBanner:false` plus a connected premium domain means Faust meets the "Premium plan + connected domain + no ads" requirement for Custom Elements and Custom Code today.
- The tier is probably Core or higher if they take Bookings or Gift Card payments online. Light is possible if bookings are paid in person. Ask Faust or check the dashboard.
- The domain record was created in December 2024, even though the site is "longstanding". That fits a domain bought (or re-registered) through Wix's "free domain for 1 year" plan voucher. It is now a paid Wix domain renewal, due 2026-12-21.
- There are no MX records, so there is no email on @fauststudio.net. Sending marketing email "from" fauststudio.net through an external service would also need SPF/DKIM records added in Wix DNS. Wix's own Email Marketing sends from Wix.

### Gaps
- The exact tier, billing cycle and price Faust pays can't be seen from outside. Faust needs to share their Wix → Subscriptions page.
- The Wix price to renew a .net domain was not researched.

## 3. External static hosting for a commercial client site: terms and limits, and whether our files fit

### Takeaway
**Cloudflare Pages or Workers static assets is the best free fit.**
- Static asset requests are free and unlimited.
- Its limits are 25 MiB per file and 20,000 files on the free plan. Our largest file is 2.13 MB and the whole build is 39 files.
- I found no non-commercial restriction in the pages I fetched.

The other options:
- **GitHub Pages** (current): its terms say it isn't "allowed to be used as a free web-hosting service to run your online business". A client's marketing funnel is a grey area, so it's acceptable for the demo but risky for production.
- **Vercel Hobby** is "for personal, non-commercial use", so production needs **Pro at $20/seat/month**.
- **Netlify Free** (300 credits) works, but "When credits run out, projects pause until the next billing cycle."

### Cited Findings
- **Our build** (measured from `/Users/fin/website-prod/dist`): 39 files, about 5.85 MB raw in total.
  - Landing: 737,307 B in 27 files.
  - `/tool/`: 5,116,155 B in 12 files.
  - Largest files: `tool/assets/analysis.worker-*.js` 2,129,215 B; `tool/models/basic-pitch/group1-shard1of1.bin` 742,392 B; `tool/assets/index-*.js` 707,248 B.
  - The three tfjs `.wasm` files are 311,123 B, 424,594 B and 435,643 B. `model.json` is 174,537 B.

  — local measurement (`stat` on `/Users/fin/website-prod/dist`)
- **GitHub Pages limits:**
  - "Published GitHub Pages sites may be no larger than 1 GB."
  - A *soft* bandwidth limit of 100 GB per month.
  - A soft limit of 10 builds per hour, which doesn't apply to custom Actions workflows.
  - "rate limits may apply" (HTTP 429).

  — [GitHub Docs: GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- **GitHub Pages prohibited uses:** GitHub Pages is "not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS)." It also says Pages "shouldn't be used for sensitive transactions like sending passwords or credit card numbers." — [GitHub Docs: GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- **Cloudflare Pages limits** (page updated 2026-09-05):
  - "The maximum file size for a single Cloudflare Pages site asset is 25 MiB."
  - Files per site: 20,000 on Free, 100,000 on paid plans.
  - Builds: 500 per month on Free, with 1 concurrent build.
  - Custom domains: 100 per project on Free.
  - Pages Functions requests count toward the Workers quota.
  - The page states no bandwidth limit.

  — [Cloudflare Docs: Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- **Cloudflare Workers limits** (page updated 2026-10-12):
  - Static asset files per Worker version: 20,000 on Free, 100,000 on Paid.
  - Individual asset size: 25 MiB on both.
  - Free Worker requests: 100,000 per day, resetting at midnight UTC. Over the cap, requests return Error 1027.

  — [Cloudflare Docs: Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- **Cloudflare Workers pricing** (updated 2026-10-02):
  - "Requests to static assets are free and unlimited."
  - "Only requests that hit a Worker will count against your limits and your bill."
  - The Paid plan has a $5 per month minimum, includes 10M requests per month, then $0.30 per million.

  — [Cloudflare Docs: Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- **Netlify plans** (all prices USD):

  | Plan | Price | Credits per month |
  |---|---|---|
  | Free | $0 | 300 |
  | Personal | $9/month | 1,000 |
  | Pro | $20/month, unlimited members | 3,000 |

  Usage costs:
  - Bandwidth: 20 credits per GB (about $0.13/GB)
  - Web requests: 2 credits per 10,000
  - Production deploys: 15 credits each
  - Compute: 10 credits per GB-hour
  - Credit packs: 500 for $5 (Personal), 1,500 for $10 (Pro)

  — [Netlify pricing](https://www.netlify.com/pricing/)
- **Netlify Free when credits run out:** "When credits run out, projects pause until the next billing cycle." "Free is designed for individual developers." Form submissions are listed as "Free" on both Free and Pro. — [Netlify: Pro vs Free](https://www.netlify.com/pricing/pro-vs-free.md)
- **What a paused Netlify project means:** it "can no longer receive web requests, form submissions, or other types of traffic." — [Netlify Docs: resume paused projects (via search)](https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/)
- **Netlify forum reports (Jul–Sep 2026)** describe a bug where Free teams stayed paused or deploy-blocked even with credits remaining. These are user reports, not official. — [Netlify forum thread](https://answers.netlify.com/t/free-plan-production-deploys-paused-despite-29-4-30-credits-remaining/166927)
- **Vercel:**
  - Hobby is $0 with 1 developer seat, 100 GB Fast Data Transfer and 1M CDN requests per month. It "can't buy additional usage".
  - "Our Hobby plan is for personal, non-commercial use."
  - Pro is $20 per developer seat per month, with 1 TB transfer and 10M CDN requests included, a $20 usage credit, then from $0.15/GB.

  — [Vercel pricing](https://vercel.com/pricing)

### Inferences
- **File-size fit:** every file is at least 10x under Cloudflare's 25 MiB per-asset cap, and the file count is 0.2% of the 20,000 cap. GitHub Pages' 1 GB cap is not a concern either.
- **GitHub Pages for production:** a free tool that collects emails to upsell studio time is plausibly "run[ning] your online business", even though it isn't e-commerce or a paid SaaS. Enforcement against small sites seems rare (no source), but the wording is risky for a client's production funnel. GitHub Pages also can't run any form backend.
- **Original Vercel plan:** the "Vercel + custom domain" plan means **Pro at $20 per seat per month (about $240 per seat per year)**, because Hobby forbids commercial use. Cloudflare covers the same need for $0.
- **Netlify Free** is usable at low traffic. But an auto-pause would break the funnel without warning, so the $9 Personal plan (auto-recharge) is the safe Netlify choice.
- **Cloudflare Workers vs Pages:** Workers static assets are equally free. A Worker is only needed for logic like an email endpoint (100k requests per day free).

### Gaps
- I didn't find an explicit statement allowing or forbidding commercial use on the Netlify Free or Cloudflare Free plans in the pages I fetched. I found no prohibition.
- I didn't fetch each host's docs to confirm free TLS for custom domains. In practice all four issue certificates automatically, but this wasn't re-verified this session.

## 4. Bandwidth: one visit's transfer size × plausible monthly visitors vs free-tier limits

### Takeaway
A first-time visitor who views the landing page, opens the tool, analyses a file and exports an MP3 downloads about **1.4–1.6 MB compressed**. The tool alone is about 1.2 MB. Even at 10,000 such visits a month (about 15 GB), every free tier copes except Netlify Free, which runs out at about 7,000 visits a month.

### Cited Findings
- **Live compressed transfer from GitHub Pages** (2026-10-25, `curl -H 'Accept-Encoding: gzip, br'`; every response came back `content-encoding: gzip`, including `.bin` and `.wasm`):

  | File | Bytes |
  |---|---|
  | `/tool/` HTML | 326 |
  | `index-*.js` | 233,039 |
  | `analysis.worker-*.js` | 331,285 |
  | `model.json` | 9,631 |
  | `group1-shard1of1.bin` | 427,981 |
  | `tfjs-backend-wasm-simd.wasm` | 137,633 |
  | `mp3.worker-*.js` (MP3 export only) | 56,715 |

  Tool total: about 1.20 MB, plus a small CSS file and the 9.5 KB favicon.svg. — [faust-ifsa.github.io/website-prod/tool/](https://faust-ifsa.github.io/website-prod/tool/) (live measurement)
- **Live landing page:** HTML 612 B, JS 77,913 B, CSS 4,120 B, a favicon of 3–7 KB, and an apple-touch icon of 39,292 B (iOS only).
  - The CSS references 9 font files, and the browser fetches only the subsets it needs. Local raw woff2 sizes: Jost latin 26,576 B, latin-ext 17,104 B; Barlow 600 latin 22,984 B; Russo One 10,128 B (woff).
  - The JS references 6 WebP logo sizes. The raw sizes of the larger ones are 15,998 B (light-128), 28,768 B, 80,038 B and 109,318 B (dark-192, 360, 512).

  Total: about 0.2–0.4 MB, depending on screen and fonts. — [faust-ifsa.github.io/website-prod/](https://faust-ifsa.github.io/website-prod/) (live measurement); local `dist/assets`
- **Free-tier transfer allowances** (from §3):

  | Host | Free allowance |
  |---|---|
  | GitHub Pages | soft 100 GB/month |
  | Vercel Hobby | 100 GB/month (non-commercial only) |
  | Cloudflare static assets | "free and unlimited" requests |
  | Netlify Free | 300 credits/month, at 20 credits/GB, 2 credits per 10k requests, 15 credits per deploy |

  — [GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits); [Vercel](https://vercel.com/pricing); [Cloudflare](https://developers.cloudflare.com/workers/platform/pricing/); [Netlify](https://www.netlify.com/pricing/)

### Inferences
- **Arithmetic:** at about 1.5 MB per full funnel visit, 1,000 visits a month is about 1.5 GB, 10,000 is about 15 GB, and 50,000 is about 75 GB. Repeat visitors cost less because of caching. Visitors who don't run the tool cost about 0.3 MB.
- **Capacity of each host:**
  - GitHub Pages and Vercel Hobby (100 GB): about 65,000 full visits a month.
  - Cloudflare: no stated cap.
  - Netlify Free: each visit is about 20 requests, so it costs about 0.034 credits. With about 4 deploys a month (60 credits), the remaining 240 credits cover **about 7,000 full visits a month** before projects pause. Netlify Personal (1,000 credits) covers about 27,000.
- **Plausible traffic** for a single Prague studio's free tool is in the low thousands of visits a month. That is an assumption with no source, and it would only be exceeded by a viral or paid campaign. Bandwidth cost is effectively **$0 on Cloudflare, GitHub Pages or Vercel**. Netlify Free is fine unless a campaign spikes traffic.
- Only the SIMD `.wasm` file was counted. In practice tfjs fetches one of the three backends, and the threaded build needs cross-origin isolation, which GitHub Pages can't provide.

### Gaps
- No analytics on real visitor numbers, since the demo has no analytics. The traffic figures are assumptions.
- I didn't measure the exact font subset or image choice per device with a real browser.

## 5. Domain, subdomain, DNS and proxy costs (options D, E and F)

### Takeaway
- **D (subdomain):** $0. Add a CNAME or A record in Wix's DNS panel, and the static host supplies free TLS.
- **F (separate domain):** about **194 Kč/yr (.cz)** or **414 Kč/yr (.com)** at VEDOS including VAT, or about **$10.46/yr** for .com at Cloudflare Registrar.
- **E (reverse proxy on fauststudio.net/tuner/):** effectively **not supported**. A Cloudflare Worker in front of the domain needs proxied DNS records, and Wix says its records "must be set to DNS only". The Cloudflare fees themselves would be $0–5 a month.

### Cited Findings
- **Adding a subdomain record in Wix:** Domains → Domain Actions → Manage DNS Records → add an A or CNAME record with Host Name "tuner" and the external host's value.
  - This applies when the main domain is connected to Wix by nameservers, not by pointing.
  - The subdomain must be in the same Wix account as the main domain.
  - Propagation "may take up to 48 hours".
  - No fee or plan requirement is mentioned.

  — [Wix Help: Connecting a Subdomain to an External Resource](https://support.wix.com/en/article/connecting-a-subdomain-to-an-external-resource)
- **fauststudio.net uses Wix nameservers**, so it is nameserver-connected and the Wix DNS panel applies (§2). — [WHOIS/DNS (local `dig`)](https://www.fauststudio.net/)
- **Switching a Wix domain to custom nameservers:** "If your host requires you to use its nameservers instead of pointing, you can change your NS records." "When you switch to custom nameservers, your domain stays registered with Wix, but Wix no longer manages your domain's DNS." — [Wix Help: Connecting a Wix domain to an external site](https://support.wix.com/en/article/connecting-a-wix-domain-to-an-external-site)
- **Wix with Cloudflare:**
  - "Your DNS records in Cloudflare must be set to DNS only for your domain connection to function properly." "If your records are Proxied, you must update this to DNS Only."
  - Otherwise the site may "appear as unsecure, or may not be accessible at all."
  - Localised versions of the same help topic say proxy support is an open feature request.

  — [Wix Help: Verifying your Cloudflare settings](https://support.wix.com/en/article/verifying-your-cloudflare-settings-for-connecting-a-domain-to-wix); [Wix Help (ES): Cloudflare proxy request](https://support.wix.com/es/article/solicitud-asistencia-de-proxy-de-cloudflare)
- **The general subpath pattern:** a Worker attached to a route on the live domain forwards `/path/*` to another host. One vendor says its Cloudflare reverse-proxy setup requires Enterprise; that is a vendor-specific claim. — [Cloudflare blog: subdomains vs subdirectories](https://blog.cloudflare.com/subdomains-vs-subdirectories-improved-seo-part-2); [PathFactory guide](https://support.pathfactory.com/kb/setting-up-reverse-proxy-on-cloudflare/)
- **Cloudflare Workers costs:** Free gives 100,000 requests per day. Paid starts at $5 per month for 10M requests. — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- **VEDOS (Czech registrar, formerly WEDOS) prices:**

  | Domain | Excl. DPH | Incl. DPH | Renewal |
  |---|---|---|---|
  | .cz | 160 Kč | 193,60 Kč | same ("Ceny aktualizovány k 19. 7. 2026") |
  | .com | 342 Kč | 413,82 Kč (1st year) | 413,82 Kč s DPH |

  — [vedos.cz/domeny](https://vedos.cz/domeny)
- **CZ.NIC wholesale price** for .cz rose to 160 Kč excluding DPH from 2025-03-01. Some registrars charged close to 300 Kč. — [svetandroida.cz (Nov 2024)](https://www.svetandroida.cz/ceska-domena-cz-zdrazeni/)
- **Cloudflare Registrar .com:** $10.46 per year to register, renew or transfer, "stable since … November 28, 2025". This comes from a third-party price tracker (May 2026 snapshot), not Cloudflare's own page. — [domainoffer.net](https://domainoffer.net/tld/com/cloudflare)

### Inferences
- **Option D** costs nothing beyond the hosting choice.
  - Subdomain: free, because it's a DNS record under the existing domain.
  - TLS: free, issued by the static host.
  - Wix: no charge was found for adding records.
- **Option E** would require one of two things, both of which put Faust's main site outside Wix's supported configuration:
  - Moving fauststudio.net to Cloudflare nameservers *and* proxying the Wix records so a Worker route can intercept `/tuner/*`. Wix says those records must be DNS only.
  - Running a self-hosted proxy for the whole domain, which has the same TLS problem.

  The site already sits behind Wix's own Cloudflare CDN (`server: cloudflare`), which may add Cloudflare-to-Cloudflare routing complications. That is unverified. The money cost is small (Cloudflare Free, or the $5/mo Workers Paid plan), but the risk to the client's main site is high. **Not recommended.**
- **Option F:** a .cz domain costs about 194 Kč a year; a .com costs about 414 Kč a year at VEDOS or about $10.46 at Cloudflare. That money buys a second brand and a second renewal to manage.

### Gaps
- No primary Cloudflare page was fetched confirming that Worker routes need proxied ("orange-cloud") records, or the Registrar's at-cost .com price. I'm fairly confident about the first, but it wasn't re-verified.
- No Wix price for buying a second domain through Wix.
- Whether Wix ever supports proxied or Enterprise setups on custom request (the feature request is open).

## 6. Email collection costs per option (Wix-native vs external)

### Takeaway
- **Option C (Wix-native landing page):** Wix becomes the email store for free. Wix Forms feed Wix Contacts, and Faust already has Forms and the legacy ShoutOut email app. Wix Email Marketing sends **200 emails a month free**, and more volume needs a paid Wix email plan.
- **Options D and F (static site on another host):**
  - Post to a **Velo HTTP function on fauststudio.net** that calls `appendOrCreateContact`. This keeps Wix as the store, with Velo free-site quotas of 60 backend requests per minute or more.
  - Or use a free external tier: Brevo (300 emails a day), Mailchimp (250 contacts, 500 sends a month) or Formspree (50 submissions a month, "for testing and development").

### Cited Findings
- **Wix Forms:** free sites get 4 forms, and Premium plans add more forms and payment collection. — [Wix Help: Upgrading Wix Forms with a Premium Plan (via search)](https://support.wix.com/en/article/upgrading-wix-forms-with-a-premium-plan)
- **Wix Forms submission caps (conflicting sources):** a third-party blog from August 2026 says Wix Forms has no monthly submission cap, only limits on the number of forms and fields. An older guide claims 5,000 to 50,000 submissions a month on old plans. — [fomr.io (Aug 2026)](https://fomr.io/blog/wix-form-builder); contradicted by [websitebuilderinsider (older)](https://www.websitebuilderinsider.com/how-much-does-wix-forms-cost/)
- **Wix Email Marketing:**
  - Free: "200 emails a month", with Wix branding.
  - Every send counts against the quota, including automated emails.
  - Pre-2023 sources quoting "3 campaigns / 5,000 emails" are outdated.

  — [Wix Help: Using Wix Email Marketing for Free (via search)](https://support.wix.com/en/article/using-wix-shoutout-for-free); [TechRadar review 2025](https://www.techradar.com/pro/software-services/wix-email-marketing-review)
- **Paid Wix email-marketing plans** (secondary source, possibly dated): Essentials $10/month for 500 emails, Core $24/month for 5,000, Advanced $49/month for 1,000,000. These are bought separately from site plans. — [Printify blog](https://printify.com/blog/wix-email-marketing/)
- **Velo HTTP functions:** you define `post_<name>(request)` in `backend/http-functions.js`, and it is served at `/_functions/<name>`. Production endpoints change only when the site is published. `wix-crm-backend` `appendOrCreateContact()` matches a contact by email or phone, or creates a new one. — [Velo: http-functions post](https://ja.wix.com/velo/reference/wix-http-functions/post); [Velo: appendOrCreateContact](https://dev.wix.com/docs/velo/apis/wix-crm-backend/contacts/append-or-create-contact)
- **Velo free-site quotas:** 60 backend requests per minute, a 14 s timeout, and 60 data writes per minute. — [Wix Dev docs](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/premium-plans/using-velo-with-a-free-wix-site.md)
- **Brevo Free:** 300 emails a day with no rollover. Contacts: most sources say 100,000, one says unlimited. "Sent by Brevo" branding, one user, and paid plans from about $9/month (Starter). These are all secondary 2026 sources; the official pricing page did not render. — [TechRadar Brevo review 2026](https://www.techradar.com/pro/software-services/brevo-review); [sender.net](https://www.sender.net/reviews/brevo/pricing/free-plan)
- **Mailchimp Free:** 250 contacts, a maximum of 500 sends a month or 250 a day, Mailchimp branding, popup forms included, no automations. Essentials starts at €11.68/month. — [Mailchimp pricing](https://mailchimp.com/pricing/marketing/)
- **Formspree:**
  - Free: 50 submissions a month, unlimited forms, a 30-day archive, described as "For testing and development".
  - Personal: $10/month billed yearly ($120/yr) or $15 billed monthly, with 200 submissions a month.

  — [Formspree plans](https://formspree.io/plans)
- **Netlify Forms:** listed as "Free" on the Free and Pro plans. Paused projects stop accepting form submissions. — [Netlify Pro vs Free](https://www.netlify.com/pricing/pro-vs-free.md); [Netlify Docs](https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/)

### Inferences
- **Business goal:** the funnel is email → upsell studio time and courses, and Faust already runs Wix Bookings, Members and Contacts. Storing signups in **Wix Contacts** puts leads next to bookings and needs no new vendor or extra data processor. Cost: €0 to capture. Sending is €0 up to 200 emails a month, then roughly $10–24/month (unverified prices).
  - **Option C:** a plain Wix Form.
  - **Options A, D, F:** a Velo `post_signup` endpoint, about 0.5–1 day of work including CORS handling and spam protection.
- **Option A (iframe)** can't directly use a Wix Form inside the iframed static tool. You could put a Wix Form *next to* the iframe on the Wix page, or the iframe can call the Velo endpoint.
- **External tools:**
  - Brevo Free is the most generous free sender (300/day).
  - Mailchimp Free caps at 250 contacts, which is too small for a growing list.
  - Formspree Free (50 a month, "testing") is too small for production. Its paid plan is $10/month yearly.
- GDPR consent wording and double opt-in apply to every option. Not costed.

### Gaps
- No official Wix page for current paid Email Marketing plan prices or quotas, or for what the "Marketing suite: Light/Basic/Standard/Advanced" tiers include in emails a month.
- Buttondown's free tier was not researched.
- No official Brevo numbers, because the pricing page did not render for the fetcher.

## 7. Developer effort per approach (A–F) and the overall extra-cost table

### Takeaway
The cheapest and lowest-risk route is **D (tuner.fauststudio.net → Cloudflare Pages)**: $0 a year and about half a day of work, plus 0.5–1 day for a Velo email bridge into Wix Contacts.
- **C** (rebuild the landing page in Wix, link or iframe the tool) costs a few days of Wix editing, but makes Wix the native email store.
- **A** (iframe) is quick, but may break MP3 download and responsiveness.
- **F** is D plus about 194–414 Kč a year.
- **B** (Custom Element) is high effort and needs tool-team changes, because workers can't load cross-origin.
- **E** (reverse proxy) goes against Wix's own DNS requirements. Avoid it.

### Cited Findings
- **The tool's code assumes it runs on its own origin:**
  - It starts its workers with `new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' })` (and the same for `mp3.worker.ts`).
  - Inside the worker, it resolves the model and WASM paths from `new URL(import.meta.env.BASE_URL, self.location.origin)`.

  — local source `/Users/fin/website-prod/.autotuner/src/audio/decode.ts:47`, `exportFile.ts:20`, `analysis.worker.ts:23–29`
- **Workers must be same-origin:** the worker URL "must be same-origin with the caller's document, or a `blob:` or `data:` URL… If a cross-origin worker is required, users must load it from an intermediate same-origin worker or a blob." Otherwise a `SecurityError` is thrown. — [MDN: Worker() constructor](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)
- **Wix embeds:** "The HTML and URL elements in our editor are iFrames" and won't be responsive. Custom Elements render in an iframe in the Editor and preview, but in the page itself on the live site. — [Wix Help: Embedding a Site](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget); [Wix Help: Custom Element](https://support.wix.com/en/article/wix-editor-adding-a-custom-element-to-your-site)
- **Downloads in sandboxed iframes:** Chrome blocks downloads from a sandboxed iframe that lacks `allow-downloads`.
  - Wix forum users report failed downloads from Wix HTML iframes and recommend a Custom Element instead.
  - These are anecdotal reports; no official Wix doc covers the embed's sandbox attributes.
  - The tool exports MP3 or WAV through an `<a download>` link (`download =` appears in `src`).

  — [Wix Studio forum](https://forum.wixstudio.com/t/how-do-i-enable-downloading-of-a-file-with-iframe/4962); [Wix Studio forum (CSV)](https://forum.wixstudio.com/t/has-anybody-been-able-to-get-wix-html-element-to-download-a-csv-file/8086)
- **Faust's site setup:** no Velo yet (`isWixCodeOnSite=false`), Wix Multilingual is off (`isMultilingualEnabled=false`), and it is the Wix Editor, not Studio (`"isStudio":false`). — [fauststudio.net live HTML](https://www.fauststudio.net/)
- **Repo deploy config:** the site's base path and noindex switch live in `site.config.json` (`"base": "/website-prod/"`, `"noindex": true`). The CLAUDE.md production note says to set `base` to `/` and remove the noindex. — local `/Users/fin/website-prod/site.config.json`, `/Users/fin/website-prod/CLAUDE.md`

### Inferences

**Extra cost on top of Faust's current Wix plan**, assuming Faust stays on its current Premium tier, which already meets every Wix prerequisite. Effort is in developer hours or days. These are my estimates, not sourced.

| Option | Wix plan needed | Hosting / domain extra | Email capture extra | Dev effort | Main risks |
|---|---|---|---|---|---|
| **A. iframe or HTML embed** of the tool (and/or landing) on a Wix page | Any Premium (Faust OK). Embed itself has no stated plan requirement | Static host: Cloudflare Pages **$0** (GitHub Pages $0 but a ToS grey area; Vercel Pro $20/seat/mo; Netlify Free $0 with auto-pause risk) | Wix Form beside the iframe, or the Velo endpoint: **$0** (200 emails/mo free) | **Low–medium, ~0.5–1.5 days**: deploy at `/`, add Embed a Site, fixed heights for desktop and mobile, test upload, analysis, export and IndexedDB inside the iframe | MP3/WAV download may be blocked by the iframe sandbox (forum reports); non-responsive iframe; third-party storage partitioning for "recent files" (inferred); the landing page inside an iframe has poor SEO |
| **B. Custom Element / Velo** (tool mounted into the Wix page DOM) | Premium + connected domain + no ads (Faust OK). Velo itself free | Asset host with CORS for model/WASM/JS: Cloudflare **$0** | Velo endpoint or Wix Form: **$0** | **High, ~1–3 weeks across both teams**: wrap React as a web component; configurable absolute asset base (today it uses `self.location.origin`); load workers via a blob or same-origin shim (MDN); CORS; isolate CSS from Wix (shadow DOM); test the Wix Editor iframe vs live | Needs autotuner changes (our repo rule: changes go to the tool team); fragile against Wix updates; Wix "cannot provide support for external codes" |
| **C. Rebuild the landing page natively in Wix**, then link or iframe the tool | Any Premium (Faust OK). Wix Multilingual for CS/EN (currently off; cost not researched) | Tool host: Cloudflare **$0** (via D's subdomain or A's iframe) | **Native Wix Forms → Contacts → Email Marketing: $0** to 200 emails/mo, then paid Wix email plan (~$10–24/mo, unverified) | **Medium, ~2–5 days** of Wix Editor work for 8 sections plus CS/EN, reusing `src/copy/*.ts` text; design parity with our spec is limited by Wix | Our React landing code gets thrown away; Faust edits it themselves (a plus); needs a Wix collaborator seat (Light has 2, Core 5) |
| **D. Subdomain `tuner.fauststudio.net`** → external static host | None beyond the current plan. Just a DNS record in Wix | **$0**: subdomain and TLS free; Cloudflare Pages/Workers static assets free and unlimited | Velo `post_signup` into Wix Contacts **$0** (+0.5–1 day), or Brevo Free $0 | **Low, ~2–6 h**: set `base` `/`, `noindex` false, create a Cloudflare project and CI deploy, add the custom domain, add a CNAME in Wix DNS, wait up to 48 h, smoke test | Separate origin from the Wix site (fine; no shared storage needed); visual jump between the Wix and static sites |
| **E. Reverse proxy** `fauststudio.net/tuner/` | Current plan, but **Wix requires DNS-only records**, so proxying is unsupported | Cloudflare Free (Workers 100k req/day) or Paid $5/mo; possibly moving DNS off Wix | As D | **High, ~2–5 days plus ongoing risk**: move nameservers, proxy the Wix records, Worker route for `/tuner/*`, path rewriting, TLS debugging | Wix says proxied records may make the site "appear as unsecure, or … not accessible at all"; **puts the client's main site at risk**. Not recommended |
| **F. Separate domain** (e.g. a new .cz or .com) linked from Wix | None | Domain: **.cz ~194 Kč/yr, .com ~414 Kč/yr** incl. VAT (VEDOS, Jul 2026), or .com ~$10.46/yr (Cloudflare Registrar, aggregator); hosting $0 on Cloudflare | As D | **Low, ~3–8 h**: D plus registration and DNS at the registrar | Brand split; one more domain to renew and own (who holds it, Faust or the team?) |

- **Recurring money, worst sensible case:** Vercel Pro at $240 per seat per year, or Netlify Personal at $108 a year, if Cloudflare is ruled out. Add a paid Wix email plan (~$120–290 a year, unverified) once the list sends more than 200 emails a month. Add a .com at about 414 Kč a year for F. Everything else can be **€0 on top of Faust's existing Wix subscription**.
- **Shared extra work for A, D and F:**
  - Moving off `faust-ifsa.github.io` (base `/`, noindex removed): about 1 h.
  - Re-checking that the tool loads model and WASM under the new base, as CLAUDE.md requires.
- **Choosing between C and D:** C is better if Faust wants to own and edit the landing page in Wix and have emails land natively in Wix. D is better if the team wants to keep the React landing page and its design-spec fidelity.

### Gaps
- Effort figures are my estimates from the code and the platform constraints above. They are not benchmarked.
- I didn't test an actual Wix embed or Custom Element, because I have no Wix sandbox. The download-in-iframe behaviour on Wix specifically is unconfirmed.
- No cost found for Wix Multilingual, and no Wix collaborator-seat pricing beyond the per-plan counts.
- Faust's actual tier and billing currency are unknown (§2).
