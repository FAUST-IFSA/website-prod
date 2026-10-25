# Domain, DNS, subdomain and reverse-proxy options for serving the landing page + tuner alongside Faust Studio's Wix site (fauststudio.net)

Research date: 2026-10-25. Direct checks (curl, dig, whois, nc) were run from the researcher's machine on that date. The `dns.google` links reproduce the DNS queries. Wix Help Center articles show no publish or update date (only "© 2006-2026 Wix.com"), so how current they are can't be confirmed. The Vercel docs carry `last_updated` dates (2026-08-11 and 2026-09-16). The GitHub docs fetched are the live versions as of the research date.

## 1. Is fauststudio.net really on Wix? Nameservers, registrar, www, email

### Takeaway
Yes, and fully. Wix is the **registrar** (Wix.com Ltd., IANA 3817) and the **DNS host** (ns2/ns3.wixdns.net). It also serves the apex, which 301-redirects to www, and **www**, a CNAME into Wix's CDN, whose edge is Cloudflare. The site is a Wix Website Builder site running Wix Stores. There are **no MX, TXT (SPF/DMARC) or CAA records**, so there is no email on @fauststudio.net to break. The registration **expires 2026-12-21**, about 8 weeks from now, so confirm that auto-renew is on.

### Cited Findings
- **Nameservers.** NS for fauststudio.net are `ns2.wixdns.net` and `ns3.wixdns.net`. The .net TLD servers (`a.gtld-servers.net`) delegate to the same two hosts, so this is the authoritative delegation and not a cache artefact. The SOA is `ns2.wixdns.net. support.wix.com. 2024122118`. — [dns.google NS query](https://dns.google/query?name=fauststudio.net&type=NS) (direct `dig` check, 2026-10-25)
- **Registration (WHOIS):**
  - Registrar "Wix.com Ltd.", IANA ID 3817, registrar WHOIS `whois.wix.com`.
  - Created **2024-12-21T18:01:00Z**, updated 2025-11-21, **expires 2026-12-21T18:01:00Z**.
  - Status `clientTransferProhibited` and `clientUpdateProhibited` (the normal registrar locks). DNSSEC unsigned.
  - Registrant details are masked ("Statutory Masking Enabled"), with country CZ, state "PR", and the relay email `fauststudio.net@wix-domains.com`.
  
  — [ICANN lookup for fauststudio.net](https://lookup.icann.org/en/lookup?name=fauststudio.net) (direct `whois` against Verisign and whois.wix.com, 2026-10-25)
- **Apex.** The A records are `185.230.63.107`, `185.230.63.171` and `185.230.63.186`, with no AAAA. `https://fauststudio.net/` returns `HTTP/2 301`, `location: https://www.fauststudio.net/`, `server: Pepyaka`, `x-wix-request-id`, `x-meta-site-id: 820b2168-…`. `http://fauststudio.net/` 301s to https. — [dns.google A query](https://dns.google/query?name=fauststudio.net&type=A); direct `curl -sI` against [https://fauststudio.net/](https://fauststudio.net/), 2026-10-25
- **www.** It is a CNAME chain, `www.fauststudio.net → cdn3.wixdns.net → cfd.wixdns.net`, which resolves to A `162.159.143.12` and `172.66.3.8`. The response headers include `server: cloudflare`, `cf-ray: …-PRG`, `cf-cache-status: HIT`, `x-wix-request-id`, and `link:` preconnects to `static.parastorage.com` / `static.wixstatic.com`. — [dns.google CNAME query](https://dns.google/query?name=www.fauststudio.net&type=CNAME); direct `curl -sI` against [https://www.fauststudio.net/](https://www.fauststudio.net/), 2026-10-25
- **Wix's www edge is Cloudflare.** Both IPs fall in Cloudflare's published ranges, `162.158.0.0/15` and `172.64.0.0/13`. — [Cloudflare IPv4 ranges](https://www.cloudflare.com/ips-v4)
- **HSTS.** Both hosts send `strict-transport-security: max-age=31556952`, with **no `includeSubDomains` and no `preload`**. — direct `curl -sI` against [https://www.fauststudio.net/](https://www.fauststudio.net/), 2026-10-25
- **HTML markers.** The homepage HTML (~984 KB) contains:
  - `<meta name="generator" content="Wix.com Website Builder"/>`
  - many `wix-thunderbolt` (Wix's renderer), `WixCodeSdk` (Velo) and `wixstores-client-cart-ooi` / `wixstores-client-gallery` references, which means the **Wix Stores** apps are installed
  
  robots.txt is the standard Wix default (it disallows `*?lightbox=` and blocks PetalBot). — direct fetch of [https://www.fauststudio.net/](https://www.fauststudio.net/) and [robots.txt](https://www.fauststudio.net/robots.txt), 2026-10-25
- **Email.** fauststudio.net has **no MX**, no TXT (so no SPF or verification records), no `_dmarc` TXT, and no CAA. A random-label lookup (`zz-nonexistent-test.fauststudio.net`) returns nothing, so there is **no wildcard record**. — [dns.google MX query](https://dns.google/query?name=fauststudio.net&type=MX), [TXT query](https://dns.google/query?name=fauststudio.net&type=TXT), [CAA query](https://dns.google/query?name=fauststudio.net&type=CAA) (direct `dig`, 2026-10-25)
- **Implicit MX.** With no MX, SMTP falls back to the domain's A record (the "implicit MX" rule). TCP port 25 on `185.230.63.107` was closed or filtered when tested. — [RFC 5321 §5.1](https://www.rfc-editor.org/rfc/rfc5321#section-5.1); direct `nc -z` test, 2026-10-25
- **Wayback history.** The earliest Wayback Machine capture of fauststudio.net is 2025-01-01, and it returned 404. — [Wayback CDX API](https://web.archive.org/cdx/search/cdx?url=fauststudio.net&limit=3&output=json)

### Inferences
- The domain is **"Wix-registered + Wix DNS" (Wix nameservers)**, not "connected by pointing". So any DNS change, such as a new subdomain CNAME or a GitHub verification TXT, is made **inside the Wix account's Domains → Manage DNS Records screen**. Whoever holds that Wix login (the client) has to do it or grant access.
- No email currently runs on @fauststudio.net, so adding a subdomain record can't break email. Faust's contact mail must live on another domain or a free mailbox. Moving nameservers would still mean recreating every record by hand.
- **The domain itself is young.** It was created on 2024-12-21 and the first capture is a Jan-2025 404. The "longstanding website" may have lived on a different domain before, or the name was re-registered. That matters for SEO expectations (little accumulated authority) and is worth asking the client about.
- **Expiry risk.** The "Updated 2025-11-21" date fits an automatic one-year renewal, but that's unconfirmed. If auto-renew is off or the card fails before 2026-12-21, both the Wix site and any subdomain we add go dark.
- HSTS has no `includeSubDomains`, so Wix's policy imposes nothing on a new subdomain. Our host will serve that subdomain over HTTPS anyway.
- `server: cloudflare` + `cf-ray` on www means Wix itself fronts sites with Cloudflare. That matters for the reverse-proxy discussion in section 4: our own Cloudflare zone in front would be "orange-to-orange".

### Gaps
- Whether auto-renew is enabled, and which Wix account/plan owns the domain. These are only visible inside the client's Wix dashboard.
- Where Faust's email actually lives. There is no public DNS evidence, so ask the client.
- Why the registration date (Dec 2024) doesn't match "longstanding". WHOIS can't explain it.

## 2. Subdomain option (e.g. tuner.fauststudio.net) via CNAME to GitHub Pages / Netlify / Cloudflare Pages / Vercel

### Takeaway
This is the cleanest option, and Wix explicitly documents it. Because the domain uses Wix nameservers, the client adds one CNAME (Host Name e.g. `tuner`) in Wix → Domains → Manage DNS Records. Root and www stay on Wix, untouched. Every candidate host supports an externally-DNS'd subdomain via CNAME and issues the TLS certificate itself, and no CAA record exists to block issuance.

### Cited Findings
- **Wix's documented steps**, for a domain whose DNS is hosted by Wix:
  1. Get the required records from the external host.
  2. Go to **Domains** in the Wix account and click the **Domain Actions** icon next to the main domain.
  3. Click **Manage DNS Records**.
  4. In **A (Host)** or **CNAME (Aliases)**, click **Add Record**, enter the subdomain name (e.g. "blog") as the **Host Name** plus the value, then click **Save** and **Save Changes**.
  
  "It may take up to 48 hours for your subdomain to propagate." — [Wix: Connecting a Subdomain to an External Resource](https://support.wix.com/en/article/connecting-a-subdomain-to-an-external-resource)
- **Wix restrictions:** "If your main domain is connected to Wix via pointing, these directions do not apply" (that doesn't apply here: section 1 shows Wix nameservers). "You must create the subdomain in the same Wix account as the main domain." The article lists no forbidden host names and doesn't mention SSL for the subdomain. — [Wix: Connecting a Subdomain to an External Resource](https://support.wix.com/en/article/connecting-a-subdomain-to-an-external-resource)
- **Wix TXT records** are added in the same Manage DNS Records screen, TXT section. "For domains connected by pointing … you must add or update TXT records with your domain host (not Wix)." The article doesn't state host-name character rules. — [Wix: Adding or Updating TXT Records](https://support.wix.com/en/article/adding-or-updating-txt-records-in-your-wix-account)
- **Conflicting Wix features:** Wix separately offers connecting a subdomain *to a Wix site*, a different article linked from the external-resource page. Wix cannot attach a domain or subdomain to a specific Wix page; that's an open feature request "collecting votes". — [Wix: Connecting a Subdomain to an External Resource](https://support.wix.com/en/article/connecting-a-subdomain-to-an-external-resource); [Wix feature request: directing domains/subdomains to specific pages](https://support.wix.com/en/article/request-directing-domains-or-subdomains-to-specific-pages-on-my-wix-site)
- **GitHub Pages target:** a CNAME from the subdomain to `<organization>.github.io` (here `faust-ifsa.github.io`). "The `CNAME` record should always point to `<user>.github.io` or `<organization>.github.io`, excluding the repository name." "Do not point the `CNAME` record to the unique `*.pages.github.io` subdomain." — [GitHub Docs: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- **Cloudflare Pages:**
  - For a subdomain it's "not necessary for your site to be a Cloudflare zone". You CNAME the subdomain to `<YOUR_SITE>.pages.dev`, but you **must add the custom domain in the Pages dashboard first**, or it can fail with a 522.
  - An apex domain requires the zone (nameservers) on Cloudflare.
  - CAA records that don't allow Cloudflare's CAs (letsencrypt.org, pki.goog, ssl.com) block issuance.
  
  — [Cloudflare Pages: Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- **Netlify:** "you must first add the domain to your site on Netlify and then create a CNAME record with your DNS provider", pointing to `<site>.netlify.app`. Netlify "recommend[s] using a subdomain for your primary domain when using external DNS". — [Netlify: Configure external DNS](https://docs.netlify.com/domains/configure-domains/configure-external-dns/)
- **Vercel** (docs updated 2026-09-16): "Each project has a unique CNAME record e.g. `d1d4fc829fe7bc7c.vercel-dns-017.com`". A TXT at `_vercel.<apex>` is needed only if the domain is in use by another Vercel account or team ("subdomain delegation"). Changing only one CNAME at the current DNS provider "does not require moving the rest of your DNS records." — [Vercel: Adding & Configuring a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- **TLS on GitHub Pages:** GitHub "queues a job to request a TLS certificate from Let's Encrypt" after the DNS check succeeds. Enforce HTTPS can take "up to 24 hours" to become available. — [GitHub Docs: Securing your site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https); [GitHub Docs: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- **No CAA records** on fauststudio.net, so no CA is restricted. — [dns.google CAA query](https://dns.google/query?name=fauststudio.net&type=CAA)
- **Shared origin today.** On github.io the landing page and tool share the `faust-ifsa.github.io` origin, and its localStorage/IndexedDB, with every other FAUST-IFSA Pages site. That's why keys are namespaced. — [local repo CLAUDE.md](/Users/fin/website-prod/CLAUDE.md)

### Inferences
- **The concrete record** for GitHub Pages: in Wix DNS → CNAME (Aliases) → Host Name `tuner` (or a Czech label), Value `faust-ifsa.github.io`. The landing page (`/`) and tool (`/tool/`) both move together, because they're one Pages deployment.
- **A dedicated subdomain improves isolation.** The landing page and tool get their own origin (`https://tuner.fauststudio.net`), separate from other FAUST-IFSA Pages sites and from Wix's `www` origin. The existing `faust-landing:*` key namespacing stays harmless.
- **Czech-named subdomain:** prefer plain ASCII (e.g. `ladicka` for "ladička", tuner/tuning fork). A label with diacritics would be an IDN (punycode `xn--…`), which is awkward to type and to configure. This is unverified: Wix's DNS UI support for IDN labels wasn't checked, and the word choice should be confirmed by a Czech speaker.
- Wix's warning against Cloudflare-proxied records (section 4) doesn't affect this option. Wix keeps DNS, and the external host only receives traffic for its own subdomain.
- The only coordination cost is a client action in Wix (one CNAME, plus one TXT for GitHub verification, see section 3), and possibly giving the team access to the Wix domain settings.

### Gaps
- Whether Wix's DNS editor accepts underscore-prefixed host names like `_github-pages-challenge-faust-ifsa` (needed for GitHub org verification) or `_vercel`. Wix's TXT article doesn't say. Underscore DKIM-style records are common on Wix, but that wasn't verified this session.
- Whether a Wix *site collaborator* role can edit DNS, or only the account owner. Not checked.
- Netlify's own docs page doesn't state its certificate issuer. Only the general fact that Netlify provisions HTTPS was confirmed.

## 3. GitHub Pages custom domain for an org project site (FAUST-IFSA/website-prod)

### Takeaway
Our deploy uses a custom Actions workflow (`actions/deploy-pages@v5`), so **no CNAME file is needed**: the custom domain is set in repo Settings → Pages. Before that, an **org owner** should verify `fauststudio.net` in the org's Pages settings via a TXT record in Wix DNS. That also covers `tuner.fauststudio.net` and prevents takeover. Then enable **Enforce HTTPS** and change `site.config.json` → `base` from `/website-prod/` to `/`.

### Cited Findings
- **CNAME file:** "If you are publishing from a custom GitHub Actions workflow, no `CNAME` file is created", and "any existing `CNAME` file is ignored and is not required". Steps: repo **Settings → Pages → Custom domain**, enter the subdomain, Save. Then add a CNAME at the DNS provider pointing to the default domain, check it with `dig`, and optionally select **Enforce HTTPS**. — [GitHub Docs: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- **Our workflow** is a custom Actions deploy: `actions/upload-pages-artifact@v5` plus `actions/deploy-pages@v5`, triggered on push to main. — [local .github/workflows/deploy.yml](/Users/fin/website-prod/.github/workflows/deploy.yml)
- **Conflicting docs:** an older GitHub Docs version said Actions users must create a CNAME file manually. The current docs say it's ignored. — search-result summary of [GitHub Docs (Korean mirror)](https://docs.github.com/ko/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) vs. the current [English docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Follow the current English page.
- **Org domain verification:**
  - "Organization owners can verify custom domains for their organization." The path is Org **Settings → Pages → Add a domain**, then add the TXT record shown, at `_github-pages-challenge-ORGANIZATION.<domain>`, and click Verify.
  - Propagation can take up to 24 h.
  - "When you verify a domain, any immediate subdomains are also included in the verification."
  - "To make sure your custom domain remains verified, keep the TXT record in your domain's DNS configuration."
  - Verification "stops other GitHub users from taking over your custom domain".
  
  — [GitHub Docs: Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- **Takeover warnings:** "We strongly recommend that you do not use wildcard DNS records, such as `*.example.com`", since they "put you at an immediate risk of domain takeovers, even if you verify the domain". "Having a custom domain configured with your DNS provider while your site is disabled could result in someone else hosting a site on one of your subdomains." — [GitHub Docs: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- **HTTPS:**
  - The certificate comes from Let's Encrypt after the DNS check.
  - Only repo admins can tick **Enforce HTTPS**, which needs a completed certificate first.
  - If provisioning stalls, remove and re-add the domain.
  - Extra A/AAAA/ALIAS records, or CNAMEs pointing at other custom subdomains, "may prevent the HTTPS certificate from generating".
  - Mixed `http://` assets must be fixed.
  
  — [GitHub Docs: Securing your site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- **Base path:** it lives only in `site.config.json` → `"base": "/website-prod/"`, read by `vite.config.ts` and `scripts/build-tool.mjs`, so switching to `/` for a custom domain is a one-line change. The same file holds `"noindex": true`, the demo-only robots switch. — [local site.config.json](/Users/fin/website-prod/site.config.json); [local CLAUDE.md](/Users/fin/website-prod/CLAUDE.md)
- **Pages limits:** static files only, no custom headers, no server-side redirects or SPA fallback. — [local CLAUDE.md](/Users/fin/website-prod/CLAUDE.md)

### Inferences
- **Order of operations:**
  1. An org owner adds the domain in FAUST-IFSA org Settings → Pages.
  2. The client adds the TXT `_github-pages-challenge-faust-ifsa` (Wix Host Name field, value from GitHub) in Wix DNS, and the owner clicks Verify.
  3. The client adds the CNAME `tuner` → `faust-ifsa.github.io`.
  4. In repo Settings → Pages, set Custom domain `tuner.fauststudio.net`.
  5. Change `base` to `/`, then build and deploy.
  6. When the certificate is issued, tick Enforce HTTPS.
  7. For the real launch, also set `noindex` to `false`.
- DNS names are case-insensitive, so the uppercase org name "FAUST-IFSA" in the TXT host shouldn't matter. Copy exactly what GitHub displays.
- **Teardown risk.** If the Pages site is ever disabled or the repo deleted, remove the `tuner` CNAME in Wix (or keep the org verification). Otherwise the takeover scenario GitHub describes applies.
- **Changing `base` breaks the old github.io/website-prod/ paths.** Assets would be built for `/`. Don't rely on the old URL after the switch. GitHub's general behaviour is to redirect a project's github.io URL to its custom domain, but that wasn't verified in this session.
- A project-site custom domain is set per repo. It doesn't require the org's own `faust-ifsa.github.io` user/org site to have one.

### Gaps
- Whether the github.io/website-prod/ URL redirects to the custom domain once it's set. The relevant GitHub page ("About custom domains") wasn't fetched.
- How the FAUST-IFSA org is administered (who is an org owner able to verify domains). `gh` wasn't authenticated, so the Pages API couldn't be queried.

## 4. Path option: fauststudio.net/tuner/ served by us while Wix serves everything else

### Takeaway
It's technically possible only by putting **a reverse proxy we control in front of www**. Choices: a Cloudflare zone plus a Worker (nameservers moved off Wix, or Cloudflare's Business-plan partial setup), or Vercel/Netlify rewrites proxying all non-/tuner/ traffic to Wix. **Wix explicitly does not support proxied DNS records for domain connections**, its www edge is already Cloudflare (so it would be orange-to-orange), and community attempts to proxy Wix under paths report broken links and assets. The site also runs Wix Stores. **Not recommended.** A Wix page that iframes the tool is a weaker "same URL" alternative with its own problems.

### Cited Findings
- **Wix on proxies:** "Currently, Wix does not support proxied DNS records for domain connections." Cloudflare proxies records by default. The workaround is to "ask Cloudflare to disable any active proxies or record masking for your domain". The page is a "Feature Request" marked "We are collecting votes for this issue." It has no date. — [Wix: Request: Cloudflare Proxy Support](https://support.wix.com/en/article/request-cloudflare-proxy-support)
- **No sub-path hosting on Wix:** Wix can't serve a site from a sub-path of another domain, or map a domain or subdomain to a specific page (an open feature request). — [Wix feature request: directing domains/subdomains to specific pages](https://support.wix.com/en/article/request-directing-domains-or-subdomains-to-specific-pages-on-my-wix-site)
- **Community attempts (all unofficial, user-reported):**
  - A Wix Studio forum user hosting a Wix site under a subdirectory of their own domain via Apache found that the Wix pages' scripts and resources failed to load, and domain masking didn't fix it. — [Wix Studio forum: Masking Wix website address to my primary domain subdirectory](https://forum.wixstudio.com/t/masking-wix-website-address-to-my-primary-domain-subdirectory/53844)
  - An Apache `ProxyPass` to a `wixsite.com` address loaded, but internal links still pointed at the Wix domain and failed (suspected JavaScript). — [Apache Lounge thread](https://www.apachelounge.com/viewtopic.php?p=38621) (snippet only; no resolution seen)
  - A Cloudflare Worker routing `/blog` to another origin hit asset and post-URL failures. — [Cloudflare Community: Subfolder to another server](https://community.cloudflare.com/t/subfolder-to-another-server-cloudflare-as-reverse-proxy/220717)
- **Cloudflare zone requirement:** a Cloudflare "CNAME setup (partial) is only available to customers on a Business or Enterprise plan". It proxies individual subdomains while authoritative DNS stays elsewhere, via CNAMEs to `{hostname}.cdn.cloudflare.net`. — [Cloudflare: Partial (CNAME) setup](https://developers.cloudflare.com/dns/zone-setups/partial-setup/)
- **Switching nameservers on a Wix-registered domain:** "When you switch to custom nameservers, your domain stays registered with Wix, but Wix no longer manages your domain's DNS." — [Wix: Connecting a Wix Domain to an External Site](https://support.wix.com/en/article/connecting-a-wix-domain-to-an-external-site)
- **Orange-to-orange:** when your own Cloudflare zone has a proxied record CNAME'd to a SaaS provider that is itself on Cloudflare, traffic passes through both zones ("O2O"). Cloudflare publishes provider guides (WP Engine, HubSpot, Kinsta, BigCommerce, …). Wix did not show up among them in search. — [Cloudflare: How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/)
- **Wix's www is already served by Cloudflare** (`server: cloudflare`, `cf-ray`, IPs in Cloudflare ranges). — direct check, 2026-10-25; [Cloudflare IPv4 ranges](https://www.cloudflare.com/ips-v4)
- **Vercel external rewrites:** "Rewrites to external origins forward requests to these destinations, effectively allowing Vercel to function as a reverse proxy or standalone CDN." Upstream `cache-control` is honoured by default for projects created on or after 2026-04-06. `/.well-known` can't be rewritten. — [Vercel: Rewrites](https://vercel.com/docs/rewrites) (last_updated 2026-08-11)
- **Netlify proxy rewrites** (`/path/* https://other/:splat 200`):
  - "Proxy rewrite requests will time out after 26 seconds."
  - "Rewrites can cause pages that use assets specified through relative paths to load incorrectly."
  - Proxied paths "may not redirect from HTTP to HTTPS URLs as expected."
  
  — [Netlify: Rewrites and proxies](https://docs.netlify.com/routing/redirects/rewrites-proxies/)
- **Wix Stores is installed** on the site (`wixstores-client-cart-ooi`, `wixstores-client-gallery` in the HTML). — direct fetch of [https://www.fauststudio.net/](https://www.fauststudio.net/), 2026-10-25
- **Our side handles sub-paths fine.** The landing page and tool already run under a sub-path (`/website-prod/`, `/website-prod/tool/`): the tool loads model/WASM from `import.meta.env.BASE_URL` and workers via `new URL(..., import.meta.url)`. — [local CLAUDE.md](/Users/fin/website-prod/CLAUDE.md)
- **Iframe variant (Wix page embedding our site):**
  - Wix's HTML iFrame / "Embed a Site" elements require HTTPS content.
  - A Wix Studio forum user reports Chrome blocked a download from inside the Wix iframe because the sandbox lacked `allow-downloads`. — [Wix Studio forum: enable downloading with iframe](https://forum.wixstudio.com/t/how-do-i-enable-downloading-of-a-file-with-iframe/4962); [Wix: Adding an HTML iFrame Element (Studio)](https://support.wix.com/en/article/studio-editor-adding-an-html-iframe-element)
  - The sandbox's `allow-downloads` token is what permits downloads from a sandboxed frame. — [MDN: iframe](https://developer.mozilla.org/en-us/web/html/element/iframe/)

### Inferences
- **Our build isn't the obstacle; Wix is.** Setting `base` to `/tuner/` would serve our build correctly from a sub-path. The problem is that www.fauststudio.net would have to resolve to our proxy, not to Wix, which means:
  - (a) moving nameservers off Wix to Cloudflare (losing Wix-managed DNS), paying for Cloudflare Business partial setup, or pointing www at Vercel/Netlify;
  - (b) running every Wix request, including Wix Stores cart/checkout, member login and Wix's own cookies and scripts, through a proxy that Wix says it doesn't support.
- **Likely failure modes** (inferred, not tested):
  - Wix's domain-connection checks see www no longer pointing at Wix and flag the domain as disconnected.
  - Wix's own certificate issuance or renewal for www fails.
  - O2O interactions between our Cloudflare zone and Wix's.
  - Wix-generated absolute URLs and scripts bypass or break under the proxy.
  - Any Wix platform change can silently break the site with no vendor support.
- **Even if the proxy works**, it adds a single point of failure in front of the client's whole business site (the one they "won't give up"), for one small sub-path. The risk is far out of proportion to the benefit.
- **The iframe variant** (a Wix page at `/tuner` or a Czech slug that embeds `https://tuner.fauststudio.net/`) keeps a www URL in the address bar with no DNS risk. But:
  - The tool's WAV/MP3 export may be blocked by Wix's iframe sandbox (reported missing `allow-downloads`).
  - Cross-site iframe storage is partitioned in modern browsers, so recent files in IndexedDB wouldn't match the top-level subdomain (general browser behaviour, not verified here).
  - Search engines credit iframe content to the framed URL, not the Wix page (SEO inference).
  - Mobile layout inside a fixed-height Wix embed is awkward.
  
  A plain link or button is better.

### Gaps
- No primary source from Wix explicitly forbids or permits an HTTP reverse proxy (as opposed to Cloudflare-proxied DNS). The Wix statement found covers "proxied DNS records for domain connections".
- No first-hand report was found (2025–2026) of a production Wix site running stably behind a Cloudflare Worker or Vercel proxy with Wix Stores. Absence of evidence, not proof it can't work.
- Wix's current iframe sandbox attributes (whether `allow-downloads` is present today) are unconfirmed. Only a forum report was found.
- Whether Cloudflare offers a Wix O2O provider guide wasn't confirmed (the provider-guide index wasn't fetched).

## 5. Linking option: keep our site on its own domain and add a menu link or button from the Wix site

### Takeaway
It needs zero DNS changes and can ship today, but it looks least trustworthy and gets no brand or SEO association. `faust-ifsa.github.io/website-prod/` doesn't read as Faust's site, and shares an origin with other FAUST-IFSA Pages sites. A newly bought domain fixes the look but adds cost, renewal and a second brand. The CNAME subdomain gives the brand benefit at almost no extra effort, so linking is best as an interim step or fallback.

### Cited Findings
- **Current URL and status:** `https://faust-ifsa.github.io/website-prod/`, marked `noindex` (demo). The github.io origin is shared with every FAUST-IFSA Pages site, so storage is shared too. — [local CLAUDE.md](/Users/fin/website-prod/CLAUDE.md); direct `curl -sI` of [https://faust-ifsa.github.io/website-prod/](https://faust-ifsa.github.io/website-prod/) returned `server: GitHub.com`, 200, 2026-10-25
- **Mueller on subdomains:** a subdomain "may" be treated by Google like a new website, needing its own sitemap, internal links from the main domain and a Search Console property. Mueller called that a short adjustment period. A separate domain is by definition a separate site. — secondary report, [Search Engine Journal](https://searchenginejournal.com/google-treats-subdomains-subdirectories-john-mueller-says)

### Inferences
- **Pros:**
  - No client DNS action and no GitHub domain verification.
  - Nothing can break on the Wix side.
  - The Wix editor link is a one-minute change for the client. Wix menus can link to external URLs (standard Wix editor feature, not verified against a Wix doc this session).
- **Cons:**
  - **Trust.** Visitors leave fauststudio.net for a URL naming "FAUST-IFSA" and "website-prod". That undercuts the funnel's goal of collecting emails and upselling studio time, and makes phishing-wary users hesitate.
  - **SEO.** No ranking association with Faust's brand domain, and the github.io URL breaks if the org or repo is renamed.
  - **Shared origin.** Storage is shared with sibling Pages sites.
  - A new standalone domain (e.g. a .cz tuner name) adds a yearly fee, another registrar account and a second brand to maintain.
- Linking and the subdomain aren't exclusive. The Wix site should link to the tuner in every scenario, because that internal link is also the main SEO and discovery signal for a subdomain.

### Gaps
- No user-research data was found on how much a non-brand domain reduces click-through or sign-up for a small business tool. Brand-trust claims here are reasoned, not measured.

## 6. Moving the whole domain off Wix (brief; the client refuses)

### Takeaway
There are two levels. **Changing nameservers** keeps the registration at Wix but moves DNS elsewhere, and the Wix site must then be reconnected by "pointing". **Transferring the registration away** needs an unlocked domain and an EPP code, is subject to ICANN's 60-day lock, and Wix warns the Wix site is disconnected (then reconnected by pointing). Neither is required for the subdomain option.

### Cited Findings
- **Nameserver change:** "When you switch to custom nameservers, your domain stays registered with Wix, but Wix no longer manages your domain's DNS." Wix also documents pointing A/CNAME records at an external host instead. — [Wix: Connecting a Wix Domain to an External Site](https://support.wix.com/en/article/connecting-a-wix-domain-to-an-external-site)
- **Registration transfer:**
  - Start from Domains → the domain's actions menu.
  - The domain must be unlocked.
  - The authorization (EPP) code goes to the registrant contact email.
  - Recently registered, transferred or contact-updated domains may be blocked by "ICANN's 60 day lock policy".
  - Wix warns that after a transfer your Wix site is disconnected, and Wix can no longer help manage the domain.
  
  — [Wix: Transferring Your Wix Domain Away from Wix](https://support.wix.com/en/article/transferring-your-wix-domain-away-from-wix-2477749) (via search-result summary; the page itself wasn't fetched)
- **Vercel on nameserver moves:** before changing nameservers, copy all existing DNS records, "including MX records for email and any verification TXT records". — [Vercel: Adding & Configuring a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- **Current state:** the domain is locked (`clientTransferProhibited`) and expires 2026-12-21. — direct WHOIS, [ICANN lookup](https://lookup.icann.org/en/lookup?name=fauststudio.net)

### Inferences
- **Records to recreate** if nameservers move: the apex A records (185.230.63.x), www CNAME `cdn3.wixdns.net`, and any later additions (the `tuner` CNAME and GitHub TXT). Faust has no MX or TXT today, so the email risk is nil right now. Moving nameservers is a prerequisite for a full Cloudflare zone (section 4), and that's the only reason to do it here.
- The registrant contact email is the Wix relay `fauststudio.net@wix-domains.com`, so EPP codes would land in the Wix account owner's mailbox. The transfer would have to be done by the client.

### Gaps
- Wix's exact "pointing" values for reconnecting a Wix site after a nameserver change (A/CNAME targets shown in the Wix dashboard) weren't fetched.

## 7. SEO implications: subdomain vs subpath vs separate domain (small site)

### Takeaway
Google's public position (Mueller) is that subdomains and subdirectories are both fine. Practitioners claim subdirectories do better, but those claims are anecdotal and vendor-flavoured. For a small, brand-new tool page on a domain registered Dec 2024, the difference is minor next to (a) **removing the `noindex`**, (b) **linking to it from the Wix site** and (c) registering it in Search Console. A subdomain is a reasonable SEO trade for avoiding the risky subpath proxy. A separate unbranded domain is the weakest.

### Cited Findings
- **Mueller's position:** "Google Search is fine with using either subdomains or subdirectories". Pick a structure you can keep, and use a subdomain when it offers "something different". — [Search Engine Journal: Google treats subdomains and subdirectories the same, Mueller says](https://searchenginejournal.com/google-treats-subdomains-subdirectories-john-mueller-says) (secondary report of Search Central videos/office hours; original video not checked)
- **Subdomain overhead:** a subdomain may be treated like a new site, needing its own sitemap, internal links and Search Console property. Mueller frames this as a short adjustment. — [Search Engine Journal](https://www.searchenginejournal.com/google-john-mueller-subdomain-vs-directory/254687/) (secondary)
- **Practitioner claim:** Bruce Clay reports "a traffic lift of sometimes 50% or more" when moving from a subdomain to a subdirectory. — [Bruce Clay: Subdomains vs. Subdirectories and SEO](https://www.bruceclay.com/blog/subdomains-vs-subdirectories-seo/) (anecdotal, agency source)
- **Vendor post:** Cloudflare has a blog post arguing subdirectories improve SEO. It promotes Workers-based subdirectory proxying, so it has a commercial interest. — [Cloudflare blog: Subdomains vs subdirectories, part 2](https://blog.cloudflare.com/subdomains-vs-subdirectories-improved-seo-part-2) (seen in search results only; not read)
- **Current state:** our site is set to `noindex` (demo), and fauststudio.net was first registered 2024-12-21. — [local site.config.json](/Users/fin/website-prod/site.config.json); [ICANN lookup](https://lookup.icann.org/en/lookup?name=fauststudio.net)

### Inferences
- **Subdomain (`tuner.fauststudio.net`):** brand-consistent for users and a separate property for Google. Needs a sitemap, a Search Console property (a Domain property for fauststudio.net, verified via TXT in Wix DNS, would cover both) and prominent links from www. This is the recommended balance.
- **Subpath (`www.fauststudio.net/tuner/`):** maybe marginally better for consolidation. But it needs the unsupported proxy in section 4, which puts the whole Wix site's availability and SEO at risk. The downside clearly outweighs a speculative ranking gain. The iframe variant gives the Wix page little or no credit for the tool's content.
- **Separate domain / github.io:** no brand association. github.io pages are also on a shared host domain and can't be verified as a Domain property under the client's name.
- Whichever option is chosen, the trademark-safe "vocal tuner" naming, Czech/English hreflang (language is currently state, not URL, so only one URL is indexable) and the `noindex` flip matter more for this small site than the subdomain-vs-subpath choice.

### Gaps
- No Google primary-source page (developers.google.com/search) stating the subdomain/subdirectory position was fetched. The Mueller quotes come from secondary SEO press.
- No data specific to tiny sites or tools. The available evidence is general or anecdotal.
