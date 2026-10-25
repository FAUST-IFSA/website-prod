# Keep Wix and host the tuner next door

Our site cannot be added to fauststudio.net wholesale. Faust's Wix site is a classic-Editor Premium site, and none of its storage can serve a multi-file build that relies on stable relative paths. Our landing page and tuner are **39 files, including three WebAssembly binaries, a pitch-detection model and two module workers**, and the tuner's workers must load from the same origin as the page that starts them. Wix-managed headless is the only Wix product that hosts static builds, and it either runs the build as a separate site or replaces the editor-built site outright. That breaks the client's one hard constraint. The practical answer is the second half of the question. Keep the Wix site exactly as it is and serve both of our pages, unchanged, from a subdomain such as `tuner.fauststudio.net`. That costs **nothing in money**: one DNS record that the client adds in their Wix dashboard, plus about half a day of our work. A Wix page can also frame the tuner, and in Chrome this works today. It only works because a Wix-controlled flag currently leaves Faust's embeds unsandboxed. If Wix flips that flag, WAV/MP3 export fails silently while the tuner still tells users "Saved to your downloads". The classic Editor's 320-pixel mobile layout also makes the framed editor unusable on phones. Deeper integrations are worse. A Wix Custom Element needs one to three weeks of rework from the tool team, and a reverse proxy would put Faust's whole site behind a setup Wix does not support. **No option requires a Wix plan upgrade.** Only two recurring costs can appear: a paid host, if the team picks Vercel over a free Cloudflare or GitHub Pages tier, and Wix email-sending fees once the list grows past 200 emails a month. Two client items are urgent whichever option is chosen. The domain registration **expires on 21 December 2026**, and every DNS change has to be made by whoever owns the Wix account.

## Wix has nowhere to put a 39-file build with WebAssembly

The live site shows exactly what Faust runs. Its page configuration has these flags:

- `"isStudio":false` and `"isResponsive":false`: a classic Wix Editor site, not Wix Studio
- `"isPremium":true` and `"isPremiumDomain":true`, with `"freemiumBanner":false`: a paid plan, a connected domain and no Wix ads
- `isWixCodeOnSite=false`: no Velo code yet
- `isMultilingualEnabled=false`: Wix Multilingual is off

The site also has Wix Stores, Bookings, Members, Forms and the legacy ShoutOut email app installed ([fauststudio.net](https://www.fauststudio.net/)). Wix is the domain's registrar as well as its DNS host. The nameservers are `ns2/ns3.wixdns.net`, and there are no MX, TXT or CAA records ([dns.google NS](https://dns.google/query?name=fauststudio.net&type=NS); [ICANN lookup](https://lookup.icann.org/en/lookup?name=fauststudio.net)). This profile settles two things early. First, every classic-Editor mechanism is open to us. The plan already meets every Premium, domain and no-ads prerequisite, and none of the restrictions of Wix's new Harmony editor apply: Harmony "doesn't support site code", and "existing sites are not being migrated to Harmony" ([About Wix Harmony](https://dev.wix.com/docs/develop-websites-sdk/get-started/overview/about-wix-harmony)). Second, any DNS change happens in Faust's Wix dashboard, not anywhere we control.

Our side of the problem is just as concrete. The built `dist/` is about **5.85 MB raw in 39 files**:

| Part | Size and files |
|---|---|
| Landing page | 737 KB, 27 files |
| `/tool/` in total | 5.1 MB, 12 files |
| Analysis worker | 2.1 MB |
| Basic Pitch model | 742 KB shard + 175 KB `model.json` |
| tfjs WebAssembly backends | 3 files, 311–436 KB each |

(Local measurement of `dist/`, built from autotuner commit `e255279`.)

The tool starts its workers with `new Worker(new URL(..., import.meta.url))`. A worker script "must be same-origin with the caller's document, or a `blob:` or `data:` URL", otherwise the browser throws `SecurityError` ([MDN: Worker()](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)). Inside the worker, the model and WASM paths are resolved against `self.location.origin`. So the tuner has to be served as a directory tree, from a single origin, with its relative paths intact.

Wix's own storage can't do that. The Media Manager accepts "images, videos, audio, documents, and archives". It stores each file under an opaque ID and serves it from a hashed URL ([Wix Media Manager](https://dev.wix.com/docs/overview/site-features-tools/media-manager)). No source lists `.wasm` as an allowed type, and hashed names break every `index.html → assets/*.js → tfjs-wasm/*.wasm` reference. The Velo `public/` folder holds code modules that site code imports, not servable static files ([Wix CLI for Sites file structure](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/git-hub-repository-file-structure)).

Pasting the tool's HTML into an "Embed HTML" element doesn't help either. Wix saves the snippet as a single HTML file on a separate origin, `www-fauststudio-net.filesusr.com/html/<id>.html` ([fauststudio.net](https://www.fauststudio.net/); [probe of a Wix example site](https://www.wix.com/velo-examples/hello-html-comp)). Relative asset URLs then point at filesusr.com, and the workers become cross-origin. Wix also can't map a domain or subdomain onto a single page of a site. That is an open feature request that is "collecting votes" ([Wix feature request](https://support.wix.com/en/article/request-directing-domains-or-subdomains-to-specific-pages-on-my-wix-site)).

Wix-managed headless is the one Wix product built to host a static frontend, and it fails our case in a different way. The no-terminal "Drop" upload serves files unchanged, but "Wix rejects any other file type, such as WebAssembly", and it caps a site at 20 MB in total ([What You Can Upload](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/your-own-frontend/what-you-can-upload)). The landing page alone would pass. The tuner would not.

The CLI route accepts "any build output" ([About Supported Frameworks](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-supported-frameworks)). Nobody has confirmed that this includes `.wasm`, and the route needs Node ≥ 24.22.1, while our pipeline runs Node 22 ([Deploy with the CLI](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/your-own-frontend/deploy-your-own-frontend-with-the-cli)). Either way, the result goes live on a `*.wix-site-host.com` address ([Upload a Static Site](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/your-own-frontend/upload-a-static-site)). Putting it on fauststudio.net itself means the headless switch, after which "your old site is unpublished" and "you can only have one frontend live at a time" ([Moving Your Site to a Custom Frontend](https://support.wix.com/en/article/wix-headless-moving-your-site-to-a-custom-frontend)). Headless is therefore either one more external host (we didn't research its pricing or whether it can take a subdomain) or the end of Faust's Wix site.

The rest of this report follows from that. **Our files will live on a non-Wix static host in every workable option.** The real decision is how fauststudio.net sends visitors to them: a link, a frame, a rebuilt Wix page, or a mounted web component.

## A framed tuner works in Chrome today, on a flag Wix controls

The simplest way to keep visitors "on fauststudio.net" is a new Wix page with the slug `tuner`, holding one stretched "Embed a site" element pointed at the hosted tool ([Changing Your Page URL](https://support.wix.com/en/article/wix-editor-changing-your-page-url); [Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget)). It is the only embed mode that runs the tuner unmodified. The framed document keeps the tool's own origin, so workers, WASM and `BASE_URL` all resolve correctly. GitHub Pages also sends no `X-Frame-Options` or CSP header that would block framing ([GitHub Pages headers, curl 2026-10-25](https://faust-ifsa.github.io/website-prod/tool/)).

The catch is that Wix, not Faust, decides how that iframe is sandboxed. Wix computes the `sandbox` and `allow` attributes on its servers, per site, from a `useSandboxInHTMLComp` flag. When the flag is on, the iframe gets `sandbox="allow-same-origin allow-forms allow-popups allow-modals allow-scripts allow-pointer-lock"` with **no `allow-downloads`** ([probe: Wix example with the flag on](https://www.wix.com/velo-examples/hello-html-comp)). When it is off, the iframe has no sandbox at all ([probe: Wix example with the flag off](https://www.wix.com/code-examples/v2-embed-chart)). **Faust's site currently has the flag off** ([fauststudio.net](https://www.fauststudio.net/)). Nothing in Wix's docs or component code suggests a site owner can change it, and no public source explains how Wix sets it.

The team ran a Playwright harness on 2026-10-25 to test what each configuration means for users. It wrapped the live tool in iframes carrying Wix's exact attributes, uploaded a 30-second vocal, ran the analysis and exported both formats. Only Chrome 156 was tested ([harness against the live tool](https://faust-ifsa.github.io/website-prod/tool/)):

| Configuration | Analysis | WAV / MP3 export | Storage | Recent files after reload |
|---|---|---|---|---|
| "Embed a site", no sandbox (Faust today) | works, ~3 s | **downloaded** | works | shown |
| "Embed a site", Wix sandbox | works | **silently blocked** | works | shown |
| Pasted code wrapping our iframe, Wix sandbox | works | **silently blocked** | works | shown |
| Pasted code wrapping our iframe, no sandbox | works | downloaded | works | shown |
| Wix tokens minus `allow-same-origin` (hypothetical) | **fails at upload** | n/a | `SecurityError` | n/a |

In the sandboxed cases, Chrome logs "Download is disallowed… the flag 'allow-downloads' is not set" ([Chrome Platform Status](https://www.chromestatus.com/feature/5706745674465280)). Meanwhile the tool shows its "Saved to your downloads" screen, because `saveFile()` clicks a blob link and has no way to detect the block. Nothing inside the frame can work around it. A `target="_blank"` popup inherits the sandbox, since Wix doesn't grant `allow-popups-to-escape-sandbox` ([MDN: iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)), and the harness confirmed that downloads were blocked in the popup too. `target="_top"` navigation was blocked outright.

Wix's direction of travel makes this more than a theoretical risk. Wix has already removed `allow-same-origin` from its **Editor-mode** sandbox for custom elements and iframe extensions ([Handle Sandboxing in the Editor](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/handle-sandboxing-in-the-editor)). The last row of the table shows that this configuration on a live page would stop the tuner at upload. Firefox 82+ and Safari 17+ both implement `allow-downloads` ([MDN browser-compat-data](https://github.com/mdn/browser-compat-data)), so they should behave like Chrome, but neither was tested.

Layout is the second problem, and it is certain rather than conditional. Wix's iframe elements are fixed pixel boxes whose content "won't be responsive, even if it is originally" ([Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget)). The Velo API documents messaging into and out of the frame but no height control ([HtmlComponent introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/html-component/introduction)). Community threads report that resizing the frame through `postMessage` leaves the parent height fixed ([Wix Studio forum](https://forum.wixstudio.com/t/dynamically-adjusting-iframe-height-in-wix-embedding-external-booking-site/67592)), though that evidence comes from forum users, not Wix. Studio's viewport-height sizing would help ([Studio Editor sizing](https://support.wix.com/en/article/studio-editor-setting-the-size-of-your-elements)), but Faust's site isn't a Studio site. We found no Wix article saying whether a classic site can be converted.

On phones, fauststudio.net serves `<meta name="viewport" content="width=320">` ([fauststudio.net, iPhone user agent](https://www.fauststudio.net/)). The tuner's piano-roll editor can't work in a 320-pixel frame. Wix's own advice is to hide desktop embeds on mobile and add a mobile-only alternative ([HTML Code on Mobile](https://support.wix.com/en/article/wix-editor-html-code-on-mobile)), which in practice means a button that links out. On desktop, a frame tall enough for the editor turns into a scroll trap: the Konva canvas calls `preventDefault` on wheel events, and the keyboard shortcuts only fire once the visitor has clicked into the frame.

Smaller costs pile up behind those two. Chrome partitions iframe storage by top-level site ([Privacy Sandbox: storage partitioning](https://privacysandbox.google.com/cookies/storage-partitioning)), and the harness confirmed that recent files saved inside the Wix frame did not appear when the tool was opened directly. Safari gives cross-origin frames a separate partition capped at 10% of the main origin's quota ([WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/)), which matters for a tool that stores 100 MB originals. Wix's HTML component also contains a cookie-consent wrapper that can block the frame until the visitor consents, if Faust enables Wix's cookie banner. That wasn't tested. The frame's accessible name defaults to "Embedded Content", and our skip link and early CTA tab stop stop working once they sit inside a frame. The money cost is zero. Our effort is about **0.5–1.5 days** (a team estimate, not benchmarked).

The landing page itself should never go in the frame. It is currently `noindex`. Google's `indexifembedded` rule only works when combined with `noindex`, and even then Google decides whether to credit the content ([Google Search Central: robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)). Our links carry no `target` attribute, so a framed landing page would open fauststudio.net nested inside its own frame. Wix Analytics would also see a single page view and nothing that happens inside the frame.

## Deeper integrations cost weeks of rework or risk Faust's whole site

A **Wix Custom Element** is the only embedded route that fixes the frame's weaknesses. On the live site it is a real web component in the Wix page's own DOM and origin. Downloads therefore work, recent files get first-party storage, and the element "can alter the page layout by modifying the page height" ([Velo: Custom Element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction)). Faust already meets its prerequisites of "a Premium Plan, connect a domain and have no ads" ([Adding a Custom Element](https://support.wix.com/en/article/wix-editor-adding-a-custom-element-to-your-site)).

The tuner can't run that way as built. In the harness, a cross-origin `new Worker` threw `SecurityError`. A blob-URL shim that imports the worker does load, because GitHub Pages sends `Access-Control-Allow-Origin: *`. But inside that worker `self.location.origin` becomes the Wix origin, so the model and WASM requests would 404 against fauststudio.net. The tool's global CSS (`:root` dark background, `html, body`, `button`) would restyle Faust's page. Its window-level `keydown` handlers would hijack Space, the arrow keys and Backspace across the whole page. Wix's frontend security also locks `fetch`, `URL`, `JSON`, `EventTarget` and other globals for "all code running on the frontend of a Wix site" ([About Frontend Security](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/best-practices/about-frontend-security)), and nobody has tested how tfjs or Konva cope with that. In the Editor and preview, the element runs in a sandbox without `allow-same-origin`, where storage throws ([Handle Sandboxing in the Editor](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/handle-sandboxing-in-the-editor)).

The research lists seven changes the tool would need: a web-component build mounted in a shadow root, shadow-scoped CSS, blob-shim workers, an absolute asset base passed into the worker, an overlay and menu sized to the element, namespaced IndexedDB keys, and guards for Editor-mode storage. All of them belong in `FAUST-IFSA/autotuner`, which this repo's rules forbid us to modify. The estimate is **one to three weeks across both teams**, at no extra money, and it adds about 700 KB of JavaScript plus a 2.1 MB worker to Faust's page.

**Settings → Custom Code, Wix Blocks widgets and Wix CLI site widgets** have the same repackaging problem and add Wix app packaging on top. Wix itself points "complex, dynamic web applications" away from Custom Code and toward Velo ([Embedding Custom Code](https://support.wix.com/en/article/embedding-custom-code-on-your-site)). Blocks business logic is written in Velo. CLI app frontends are served from their own `wix.run` subdomain ([CLI self-hosted backend](https://dev.wix.com/docs/build-apps/develop-your-app/develop-an-app-with-the-cli/project-development/self-hosted-backend/implement-a-self-hosted-backend-for-your-cli-app)). None of them removes the worker and asset-origin problem, so none is a better choice than a Custom Element.

A **reverse proxy serving `fauststudio.net/tuner/`** fails on Wix's side, not ours. Changing `base` to `/tuner/` would serve our build correctly from that path. But `www` would then have to resolve to a proxy we control. That takes one of three things:

- moving the nameservers to Cloudflare, after which "Wix no longer manages your domain's DNS" ([Connecting a Wix Domain to an External Site](https://support.wix.com/en/article/connecting-a-wix-domain-to-an-external-site))
- Cloudflare's partial CNAME setup, which is "only available to customers on a Business or Enterprise plan" ([Cloudflare partial setup](https://developers.cloudflare.com/dns/zone-setups/partial-setup/))
- Vercel or Netlify rewriting every non-tuner request back to Wix

Wix states that it "does not support proxied DNS records for domain connections" ([Request: Cloudflare Proxy Support](https://support.wix.com/en/article/request-cloudflare-proxy-support)). It also warns that proxied records can make the site "appear as unsecure, or may not be accessible at all" ([Verifying your Cloudflare settings](https://support.wix.com/en/article/verifying-your-cloudflare-settings-for-connecting-a-domain-to-wix)). Wix's own `www` edge already runs on Cloudflare ([Cloudflare IPv4 ranges](https://www.cloudflare.com/ips-v4)), and users who tried proxying Wix under a path report broken scripts and links ([Wix Studio forum](https://forum.wixstudio.com/t/masking-wix-website-address-to-my-primary-domain-subdirectory/53844)). The money is trivial: Cloudflare Workers are free up to 100,000 requests a day, or $5 a month ([Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)). The effort is two to five days plus ongoing maintenance. The real price is putting Faust's Bookings and Stores checkout behind an unsupported proxy, for the sake of one small path. Moving the domain off Wix altogether would remove that conflict, but the client has ruled it out, and its only use here would be as a prerequisite for the proxy.

## One CNAME puts both pages on Faust's own domain for $0

Wix documents the subdomain route step by step. The account owner goes to Domains → Domain Actions → Manage DNS Records and adds a CNAME with a host name such as `tuner`. Propagation "may take up to 48 hours", and the subdomain "must be created in the same Wix account as the main domain" ([Connecting a Subdomain to an External Resource](https://support.wix.com/en/article/connecting-a-subdomain-to-an-external-resource)). Those instructions apply because Faust uses Wix nameservers rather than pointing. Nothing on the domain can break:

- There is no MX record, so no email to disrupt.
- There is no CAA record, so nothing restricts which authority issues the certificate.
- Wix's HSTS header has no `includeSubDomains`, so it imposes nothing on the new host.

([dns.google MX](https://dns.google/query?name=fauststudio.net&type=MX); [dns.google CAA](https://dns.google/query?name=fauststudio.net&type=CAA).)

On our side, the move is a one-line change: `base` in `site.config.json` goes from `/website-prod/` to `/`. `TOOL_URL` derives from `BASE_URL`, and the landing page and tool deploy together. The label should be plain ASCII. A Czech word such as `ladicka` would avoid punycode, but a native speaker should pick it.

The host choice decides whether "free" stays free.

**GitHub Pages**, the current host, needs no CNAME file for an Actions workflow. The domain is set in repo Settings → Pages ([GitHub: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)). An org owner should first verify fauststudio.net with a `_github-pages-challenge-faust-ifsa` TXT record. That covers immediate subdomains and prevents takeover ([GitHub: Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)). Let's Encrypt certificates are then automatic, and Enforce HTTPS can take up to 24 hours to become available ([GitHub: Securing with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)). The weak point is GitHub's terms, which say Pages is "not intended for or allowed to be used as a free web-hosting service to run your online business" ([GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)). A studio's lead-generation funnel is a grey area. It's fine for a demo, but it's a poor foundation for production.

**Cloudflare Pages** has no such clause in the pages we fetched. It doesn't need Faust's zone for a subdomain: you add the domain in the Pages dashboard first, then point the CNAME at `<project>.pages.dev` ([Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)). Static requests are "free and unlimited" ([Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)), and the per-file limit is 25 MiB against our largest file of 2.13 MB ([Pages limits](https://developers.cloudflare.com/pages/platform/limits/)).

**Vercel**, the production host our project notes have assumed so far, is the expensive choice. Its Hobby tier is "for personal, non-commercial use", so this client would need **Pro at $20 per seat per month** ([Vercel pricing](https://vercel.com/pricing)).

**Netlify Free** works, but "when credits run out, projects pause until the next billing cycle" ([Netlify Pro vs Free](https://www.netlify.com/pricing/pro-vs-free.md)). By the team's arithmetic, that happens at about 7,000 full visits a month.

Bandwidth isn't a constraint on the other three. A full funnel visit (landing page, tuner, analysis, MP3 export) transfers about **1.4–1.6 MB compressed**, measured live. Even 10,000 such visits a month, about 15 GB, sits well inside GitHub's soft 100 GB limit ([GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)). Traffic at that level is itself an assumption, because the demo has no analytics.

The subdomain also beats its neighbours on trust and search. Staying on `faust-ifsa.github.io/website-prod/` costs nothing and needs only a link from Wix. But visitors leave Faust's brand for a URL that names "FAUST-IFSA" and "website-prod", and they share an origin with every other FAUST-IFSA Pages site. That trust penalty is reasoned, not measured. A new standalone domain costs about **194 Kč a year for .cz or 414 Kč for .com** including VAT at VEDOS ([vedos.cz](https://vedos.cz/domeny)), or about $10.46 for .com at Cloudflare's registrar ([domainoffer.net](https://domainoffer.net/tld/com/cloudflare)). It buys a second brand and a second renewal, and nothing the subdomain doesn't already give.

On SEO, Google's John Mueller has said that "Google Search is fine with using either subdomains or subdirectories" ([Search Engine Journal](https://searchenginejournal.com/google-treats-subdomains-subdirectories-john-mueller-says)), though a subdomain may need its own sitemap and Search Console property. Agencies claim subdirectory lifts of "50% or more" ([Bruce Clay](https://www.bruceclay.com/blog/subdomains-vs-subdirectories-seo/)), but those claims are anecdotal. For this site, three things matter more than the URL shape: removing the `noindex`, linking from fauststudio.net, and registering a Search Console Domain property, which a TXT record in Wix DNS would verify for both hosts at once.

One more point favours the subdomain. If the team later frames the tool on a fauststudio.net page, a tool on `tuner.fauststudio.net` is same-site with `www`. Recent files would then share storage between framed and direct visits. That follows from how browsers key their partitions, but it hasn't been tested.

## Rebuilding the landing page in Wix buys ownership and native email, not fidelity

The hybrid option keeps the tool on its own host and recreates our eight landing sections (Header, Hero, HowItWorks, BeforeAfter, Studio, NextStep, Faq, Footer) as native Wix Editor content, with a button out to the tuner. Its gains are real:

- The page inherits Faust's header, footer, domain and search presence.
- The client can edit it without us.
- A Wix Form drops signups straight into Wix Contacts, next to Faust's existing Bookings and Members data.

Wix Email Marketing sends **200 emails a month free** ([Using Wix Email Marketing for Free](https://support.wix.com/en/article/using-wix-shoutout-for-free)). Paid sending plans run roughly $10–49 a month, according to a secondary source that may be out of date ([Printify](https://printify.com/blog/wix-email-marketing/)).

The costs are just as real. The work is about **two to five days in the Wix Editor**. It throws away the React landing code and the single source of truth in `src/copy/*.ts`. EN/CS would need Wix Multilingual, which is off today and whose cost we didn't research. Our fonts would have to be uploaded through the editor itself ([Wix Media file types](https://support.wix.com/en/article/wix-media-supported-media-file-types-and-file-sizes)). And nothing in the Wix Editor guarantees the accessibility work already verified here: the skip link, the `<details>` FAQ and reflow at 200% text size.

Email capture doesn't depend on that rebuild. A static site on the subdomain can post signups to a Velo HTTP function on fauststudio.net, served at `/_functions/<name>` ([Velo: http-functions post](https://ja.wix.com/velo/reference/wix-http-functions/post)), which calls `appendOrCreateContact()` to match or create a Wix contact ([Velo: appendOrCreateContact](https://dev.wix.com/docs/velo/apis/wix-crm-backend/contacts/append-or-create-contact)). That puts leads in Wix Contacts for **$0 and about 0.5–1 day** of work, including CORS and spam protection. It also resolves the team's open question of where signup emails live, which GitHub Pages alone can't answer. It does mean switching Velo on for a site that has never used code, so the client has to agree. Free-site Velo quotas of 60 backend requests a minute set the floor ([About Code on Free Sites](https://dev.wix.com/docs/develop-websites-sdk/maintain-your-site/scale-your-site/about-code-on-free-sites)).

External senders are the fallback. Brevo Free sends 300 emails a day ([TechRadar](https://www.techradar.com/pro/software-services/brevo-review)). Mailchimp Free stops at 250 contacts ([Mailchimp pricing](https://mailchimp.com/pricing/marketing/)). Formspree Free allows 50 submissions a month and is labelled "for testing and development" ([Formspree plans](https://formspree.io/plans)). GDPR consent wording applies to every option and wasn't costed.

A lighter middle path gets most of the hybrid's value. Add a short native section or page on fauststudio.net with real text and a prominent "Open the free vocal tuner" button pointing at the subdomain. That gives the main domain indexable copy and gives the subdomain the internal link it needs for discovery, without rebuilding the funnel page in Wix.

## Every resolution, priced

The table below covers every resolution the research found. "Effort" is the team's estimate from reading the code and the platform constraints, not a benchmark. **None of the rows needs a Wix plan upgrade.** Wix's 2026 tiers are Light, Core, Business and Business Elite, at about $17, $29, $39 and $159 a month on yearly billing in USD ([WebsiteBuilderExpert](https://www.websitebuilderexpert.com/website-builders/wix/wix-pricing/)), and Faust's existing Premium plan already satisfies every prerequisite. Faust's exact tier and billing currency aren't visible from outside.

| # | Resolution | Keeps Wix site intact | Tuner runs unmodified | Extra money | Our effort | Verdict |
|---|---|---|---|---|---|---|
| 1 | Upload `dist/` into Wix (Media Manager, Velo files) | yes | no: hashed URLs, no `.wasm` | n/a | n/a | **Impossible** |
| 2 | Paste the tool into "Embed HTML" (code mode) | yes | no: cross-origin workers, broken paths | $0 | tool-team rework | Reject |
| 3 | Wix-managed headless as a host | separate `*.wix-site-host.com` site | Drop rejects `.wasm`; CLI unverified | not researched | not estimated | No advantage over #10 |
| 4 | Headless switch for fauststudio.net | **no**: unpublishes the editor site | n/a | n/a | n/a | Fails the client's constraint |
| 5 | Reverse proxy for `fauststudio.net/tuner/` | only via a setup Wix doesn't support | yes | $0–5/mo Workers; partial setup needs Cloudflare Business | 2–5 days, then ongoing | Reject: risks the whole site |
| 6 | Custom Element, Custom Code or Wix app widget | yes | no: seven tool-team changes | $0 | 1–3 weeks, both teams | Only if the client insists on an in-page tool |
| 7 | Wix page with an "Embed a site" frame of the tool | yes | yes, today, in Chrome | $0 | 0.5–1.5 days | Optional desktop extra, after a live test |
| 8 | Landing page inside a Wix frame | yes | n/a | $0 | not estimated | Reject: SEO, links, accessibility |
| 9 | Native Wix rebuild of the landing page, tool linked | yes | yes | $0, plus Multilingual (unknown) and email sends over 200/mo | 2–5 days | Optional later, if the client wants to own the copy |
| 10 | **Subdomain `tuner.fauststudio.net`**, both pages unchanged | yes | yes | **$0** on Cloudflare Pages or GitHub Pages; $20/seat/mo if Vercel | 2–6 hours plus one client DNS edit | **Recommended** |
| 11 | Stay on `faust-ifsa.github.io`, linked from Wix | yes | yes | $0 | minutes (the client adds a link) | Interim only |
| 12 | New standalone domain | yes | yes | ~194 Kč/yr (.cz) or ~414 Kč/yr (.com) | 3–8 hours | Not worth the second brand |
| 13 | Move fauststudio.net off Wix | no | n/a | n/a | n/a | Out of scope (client refuses) |

Three add-ons apply across rows 7 and 9–12:

| Add-on | Effort | Money |
|---|---|---|
| Velo email bridge into Wix Contacts | 0.5–1 day | $0 |
| Paid Wix email sending, once over 200 emails/month | none | roughly $10–24/month (unverified secondary prices) |
| Switching `base` to `/` and removing `noindex` at launch | about an hour | $0 |

## Recommendation: launch on the subdomain, link from Wix, embed only after a live test

**Serve the landing page and tuner, unchanged, from `tuner.fauststudio.net`.** Host it on Cloudflare Pages for production. GitHub Pages is acceptable while the site is still a client demo. Then link to it from the Wix site with a menu item and a short native section or page carrying real text and a button. This keeps Faust's Wix site untouched and puts their brand in the address bar. It costs no money, and it keeps every later option open.

Once the client agrees to enable Velo, add the Velo email bridge so signups land in Wix Contacts. Treat a framed `/tuner` page as an optional desktop extra. Build it only after a live test on fauststudio.net shows the frame unsandboxed, and only after the tool team replaces the false "Saved to your downloads" message with an "open in a full window" fallback when the tool detects it is embedded. Phones should always get the button. Pursue a Custom Element only if the client insists on an in-page tuner and the tool team commits the weeks it needs. Never pursue the proxy or the headless switch. The project's own production note in CLAUDE.md, which currently says "probably Vercel", should be updated to match.

| # | Next step | Owner | Done when |
|---|---|---|---|
| 1 | Confirm that auto-renew is on for fauststudio.net, which expires 2026-12-21. If it lapses, the Wix site and the subdomain go dark together. | Client | Renewal confirmed in Wix → Domains |
| 2 | Name the Wix account owner who will make DNS edits. Whether a collaborator role can edit DNS is unverified. | Client | Named person with access |
| 3 | Agree the subdomain label (`tuner`, or a Czech ASCII word checked by a native speaker) | Client and Czech reviewer | Label chosen |
| 4 | Decide whose account holds the hosting (Faust's or the team's) and how it's handed over | Team and client | Account created |
| 5 | Share the Wix plan tier and billing currency | Client | Tier known |
| 6 | Ask whether the "longstanding" site used another domain before this one was registered in December 2024 (affects SEO redirects) | Client | Answered |
| 7 | Agree whether Velo can be enabled for the email bridge, and the GDPR consent wording | Client | Decision recorded |
| 8 | Register the custom domain on the host: for GitHub, org verification TXT first, then the repo setting; for Cloudflare, add the domain in Pages before the CNAME exists | Team (org owner) | Domain pending on the host |
| 9 | Add the CNAME (and the TXT, if GitHub) in Wix → Manage DNS Records | Client | `dig` resolves to the host |
| 10 | Set `base` to `/` in `site.config.json`, build, preview, deploy | Programmer | Site live on the subdomain |
| 11 | Turn on Enforce HTTPS once the certificate is issued | Repo admin | HTTPS only |
| 12 | Add the Wix menu item and the native teaser with its button | Client, or team as a collaborator | Links live on fauststudio.net |
| 13 | At the real launch: set `noindex` to false, add a Search Console Domain property via TXT, submit a sitemap | Team and client | Pages indexed |
| 14 | Only if embedding: ask the tool team for embedded-context detection and a full-window fallback | Tool team | Merged in autotuner |

| Test | Where | Pass criterion |
|---|---|---|
| Full funnel on the subdomain: CTA → tool → upload → analysis → WAV and MP3 export, then axe in EN and CS, then 375 px reflow | Chrome, Firefox, Safari on macOS and iOS | No 4xx, files land, 0 axe violations, no horizontal scroll |
| Wix DNS accepts an underscore-prefixed TXT host such as `_github-pages-challenge-faust-ifsa` (GitHub route only) | Wix DNS editor | GitHub shows the domain verified |
| Behaviour of the old `faust-ifsa.github.io/website-prod/` URL after the switch (a redirect is unverified) | Browser | Redirect confirmed, or every shared link updated |
| Velo bridge: a cross-origin POST from the subdomain creates a contact | fauststudio.net | Contact appears in Wix Contacts; spam is rejected |
| Only if embedding: a hidden fauststudio.net page with "Embed a site" pointing at the tool. Inspect the iframe for a `sandbox` attribute and a single layer, run both exports, try the cookie banner, check the mobile layout | Chrome, Firefox, Safari on macOS and iOS | No sandbox, downloads land, phones see only the button |
| Only if embedding: recent files are shared between the framed and direct subdomain views | Chrome, Firefox, Safari | The same list appears in both |

Several points remain unverified, and the plan accounts for them:

- No part of this research ran on a real Wix site.
- A live "Embed a site" iframe was never observed. Its single-layer structure is inferred from Wix's component code.
- How Wix sets the sandbox flag is unknown.
- Only Chromium was tested.
- Every effort figure is an estimate.
- Wix's email-plan and Multilingual prices are unconfirmed.
- Whether headless CLI hosting accepts `.wasm` is untested.

None of these gaps touches the recommended path. The only Wix feature it depends on is a DNS record that Wix documents.

## Conclusion

"Can Wix host our site?" turns out to be the wrong question. Wix can link to the tuner, frame it, or, after heavy rework, mount it, but it cannot serve it. Every workable resolution keeps our files on a static host, so the real decisions are which address visitors see and who edits the landing copy. The subdomain answers the first with Faust's own name, at no cost. The second can stay open, because a native Wix landing page can be added later without moving the tuner. It also makes any future framed view on `www` more robust, since the frame would then be same-site. The most important finding is about how things fail. The embed's main failure is invisible: the tool reports a successful download that never happened, on a switch that only Wix controls. A demo would never reveal it, which is the strongest reason not to make the framed tuner the default.

The research also changes two working assumptions in the repo. Vercel, the presumed production host, needs a paid plan for a commercial client, while Cloudflare Pages does the same job for free. And the email-collection blocker has a Wix-native answer that the GitHub-only plan never had. The domain's December 2024 registration date also suggests that fauststudio.net has little search history to protect, which lowers the stakes of the subdomain-versus-subdirectory debate for this site.
