# Wix embedding mechanisms for custom code: can the Faust landing page and tuner live inside fauststudio.net?

Research date: 2026-10-25. Sources are Wix Help Center and dev.wix.com pages as served on that date, plus live probes. The probes were curl and headless Chromium runs against fauststudio.net and against Wix's own example sites, and they are labelled "probe" below. Forum material is marked as community or anecdotal. The Wix Studio forum (forum.wixstudio.com) could not be fetched directly, so forum points come from search-result summaries and are weaker evidence.

Context from the coordinator, not re-researched here: fauststudio.net is a paid Premium site on the classic Wix Editor, with Wix DNS and no Velo code. Costs and DNS are covered in other notes.

## Q1. What are all the current ways to add custom code to a Wix site, and what was renamed or deprecated by October 2026?

### Takeaway
On a classic Wix Editor site like fauststudio.net, there are seven ways to add custom code:

- the Embed HTML / Embed a site iframe element (code mode or URL mode)
- the Custom Element (a web component loaded from a server URL or a Velo file)
- Settings → Custom Code (head/body snippets)
- Velo / JavaScript SDK site code (page code, backend, routers, HTTP functions), edited in the editor, a local IDE or Git + the Wix CLI for Sites
- Wix apps built with Blocks, the Wix CLI or self-managed hosting, which add site widgets, embedded scripts or site pages
- Wix-managed headless, where Wix hosts a custom frontend and can replace the whole editor-built site
- self-managed headless

By 2026, Wix had launched a third editor, Wix Harmony (January 2026). Harmony has no site code (no Velo) and no Blocks site widgets. Editor X had already become Wix Studio. "Velo" is still a live name, but new docs push the "Wix JavaScript SDK" and the unified "Wix CLI".

### Cited Findings

**What fauststudio.net is (probe of page HTML/flags, 2026-10-25):**
- It is a Wix Thunderbolt-rendered site. The flags `"isStudio":false`, `"isResponsive":false`, `"isMobileFriendly":true`, `"isPremium":true`, `"isPremiumDomain":true` and `"isMultilingualEnabled":false` mean it is a classic Wix Editor site with a separate mobile layout, on a Premium plan with a connected domain — [fauststudio.net home page HTML](https://www.fauststudio.net/).
- Its HTML-embed origin is configured as `staticHTMLComponentUrl=https://www-fauststudio-net.filesusr.com/`, with the site feature flag `useSandboxInHTMLComp=false`. Its pages use plain slugs such as `/rates`, `/studios`, `/courses`, `/kopie-about` and `/blank`. Wix Stores widgets are present — [fauststudio.net home page HTML](https://www.fauststudio.net/).

**1. Embed HTML / Embed a site (the "HTML iframe" element, Velo type `HtmlComponent`):**
- There are two modes. "Embed HTML" (Enter Code) pastes a snippet. "Embed a site" (Enter Website Address) "displays an external site in a window on the page" — [Wix Editor: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget).
- Wix's limits for both modes:
  - "Only HTTPS codes and URLs are displayed."
  - "There is no character limit for the HTML and Embed a Site elements."
  - Both elements are iframes, so the content "won't be responsive, even if it is originally."
  - Sites that forbid framing can't be shown, and Wix can't bypass this.
  — [Wix Editor: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget)
- "The HTML element creates a sandboxed environment (an iframe) that does not have direct access to the other elements on your page." Data can be passed between page code and the iframe with `postMessage()`/`onMessage()` (Velo) — [About HTML iFrame Elements (Velo docs)](https://dev.wix.com/docs/develop-websites/articles/wix-editor-elements/other-elements/html-i-frame-element/working-with-the-html-iframe-element); [HtmlComponent introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/html-component/introduction).
- Menu names: "Embed code" element (Wix Studio) / "Embed HTML" element (Wix Editor) — [Embedding a Code Widget in an HTML iFrame Element](https://dev.wix.com/docs/develop-websites/articles/wix-editor-elements/other-elements/html-i-frame-element/embedding-a-code-widget-in-an-html-i-frame-element).
- Harmony has an equivalent "Embed code" / "Embed a site" with an accessible name and a cookie-category setting. Its help page also says "The iFrame itself is not responsive" — [Wix Harmony Editor: Embedding a Link or HTML Code](https://support.wix.com/en/article/wix-harmony-editor-embedding-a-link-or-html-code).

**2. Custom Element (web component):**
- Added via Add Elements → Embed → Popular Embeds → Custom Element (Wix Editor) or Add Elements → Embed & Social → Custom Element (Wix Studio). The source is either a "Server URL" (an externally hosted HTTPS JS file) or a "Velo file" in `public/custom-elements/`. The tag name must match `customElements.define()` — [Add a Custom Element (Velo)](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/add-a-custom-element).
- "The custom element code must be hosted by you if you are not using Velo." It must be ES2015 class syntax. "Attributes are not open to all users yet." — [Wix Editor: Adding a Custom Element to Your Site](https://support.wix.com/en/article/wix-editor-adding-a-custom-element-to-your-site).
- Custom elements render inside an iframe in the Editor and in preview, but not on the live site, so the layout can differ. They "can alter the page layout by modifying the page height". SEO is handled through Velo `seoMarkup`, and without it "only JavaScript-enabled crawlers, like Google, will index the content" — [Custom element introduction (Velo)](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction).

**3. Settings → Custom Code (dashboard head/body snippets):**
- It injects HTML/JS/CSS into `<head>`, body start or body end, on all pages or on chosen pages, and it can load once per visit or on every page. "Custom code snippets don't appear as elements in the editor." It works in all editors, including Harmony — [About Custom Code (dev docs)](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-frontend/custom-code/about-custom-code); [Embedding Custom Code on Your Site](https://support.wix.com/en/article/embedding-custom-code-on-your-site).
- Wix directs "complex, dynamic web applications" to Velo instead. It also says GA/GTM/Meta/TikTok pixels "do not work through custom code" — [Embedding Custom Code on Your Site](https://support.wix.com/en/article/embedding-custom-code-on-your-site).

**4. Velo / Wix JavaScript SDK site code:**
- Site code covers page code, backend code, custom CSS (Studio), HTTP functions, routers, data hooks, backend events, web modules and scheduled jobs. Harmony supports none of these — [About Wix Harmony (dev docs)](https://dev.wix.com/docs/develop-websites-sdk/get-started/overview/about-wix-harmony).
- The developer docs now have two parallel portals, "Extend Websites with Velo" and "Extend Websites with SDK". IDEs: the built-in code editor (Studio and Editor), the Wix IDE (Studio only, VS Code-based), and a local IDE through Git Integration & Wix CLI for Sites (Studio and Editor) — [Wix developer docs index](https://dev.wix.com/docs/llms.txt); [About Mobile Sites with Code (lists supported IDEs)](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-frontend/mobile/about-mobile-sites-with-code).
- Routers "currently require Velo APIs and file naming conventions" (`routers.js`) — [About Routers](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-backend/routers/about-routers).

**5. Wix apps (Blocks, Wix CLI, self-managed):**
- Site widgets can be built with:
  - Wix Blocks, where business logic is written in Velo
  - the Wix CLI, where the code is "by default deployed on our servers"
  - a self-managed custom element on your own server
  - Editor React Components, which are Harmony-only
  Embedded scripts are a separate extension type — [About Site Widget Extensions](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/site-widgets/about-site-widget-extensions).
- Blocks site widgets and plugins, and "legacy custom elements", are not supported in Harmony. "Legacy iFrame widgets and pages" have only partial support there. Wix recommends the Wix CLI or self-managed apps for new work — [About Wix Harmony and Apps](https://dev.wix.com/docs/build-apps/get-started/overview/about-wix-harmony-and-apps); [About Wix Harmony and Blocks](https://dev.wix.com/docs/build-apps/develop-your-app/develop-an-app-with-blocks/about-wix-harmony-and-blocks).
- Private apps can be built for specific sites — [About Wix Harmony and Blocks](https://dev.wix.com/docs/build-apps/develop-your-app/develop-an-app-with-blocks/about-wix-harmony-and-blocks).
- CLI app frontend code "is hosted on the Wix App CDN… served from its own `wix.run` subdomain" — [Implement a self-hosted backend for your CLI app](https://dev.wix.com/docs/build-apps/develop-your-app/develop-an-app-with-the-cli/project-development/self-hosted-backend/implement-a-self-hosted-backend-for-your-cli-app).
- A site page extension "adds a full page to the user's site". Its ID becomes the default URL slug — [About Site Page Extensions](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/site-pages/about-site-page-extensions).

**6. The Wix CLI (unified):**
- "The Wix CLI is the command-line tool for creating, developing, and deploying both Wix apps and Wix-managed headless projects." It is Astro-based. Site (Velo) development uses the separate "Git Integration & Wix CLI for Sites". The older "Wix CLI for Apps" is now under "legacy CLIs" — [About the Wix CLI](https://dev.wix.com/docs/wix-cli/guides/about-the-wix-cli); [Legacy CLI app structure](https://dev.wix.com/docs/wix-cli/legacy-clis/legacy-wix-cli-for-apps/get-started/cli-app-structure).

**7. Wix Headless:**
- Wix-managed headless is "the recommended path": "Wix hosts and runs your frontend". It can be built with Astro (full integration) or with "other frameworks" (limited integration: client-only builds or Cloudflare Workers server code). Self-managed headless means you host the frontend yourself — [About Wix-Managed Headless](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless); [About Supported Frameworks](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-supported-frameworks).

**Renames and deprecations:**
- Wix Harmony is "Wix's new AI-powered site editor". "Wix Harmony doesn't support site code." "Existing sites are not being migrated to Harmony." — [About Wix Harmony (dev docs)](https://dev.wix.com/docs/develop-websites-sdk/get-started/overview/about-wix-harmony).
- A Wix-partner guide dates Harmony's release to January 2026. It also says sites cannot be moved into or out of Harmony (secondary source, published 2026-08-21, updated 2026-10-22) — [wixwebdesigner.com Harmony guide](https://www.wixwebdesigner.com/guides/wix-harmony).
- On whether the Classic and Studio editors will be deprecated, Wix says "We aren't breaking any existing capabilities" — [About Wix Harmony and Apps](https://dev.wix.com/docs/build-apps/get-started/overview/about-wix-harmony-and-apps).
- Editor URLs now use the format `{username}-{sitename}.{editor|studio|harmony}.wix.com` — [About Site Widget Extensions](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/site-widgets/about-site-widget-extensions).

### Inferences
- For fauststudio.net, all the classic-Editor mechanisms are available: Embed HTML/site, Custom Element, Custom Code, Velo (it would have to be switched on, since the site has no code yet), Blocks/CLI apps, and the headless switch. None of the Harmony restrictions apply, because the site is not on Harmony and won't be migrated there.
- Only three mechanisms can run a full React SPA *as-is*, unmodified:
  - an iframe in "Embed a site" (URL) mode pointing at an external host
  - a plain link out
  - Wix-managed headless hosting, which is a separate project (see Q2/Q6)
- Every in-page DOM mechanism needs the tool to be re-packaged as a single bootstrapping script: Custom Element, Custom Code, a CLI site widget or an embedded script. See Q5 for why that breaks the tuner today.

### Gaps
- I found no official changelog that formally renames "Velo". Both names are in current docs, and "Velo" is used for the `$w`/router APIs.
- I could not confirm whether a classic Wix Editor site can be converted to Wix Studio. The secondary guide doesn't state it, and I found no Wix article.

## Q2. Can a multi-file static SPA (JS chunks, WASM, model weights, worker scripts) be uploaded to and served from Wix's own servers, or must the assets be hosted externally?

### Takeaway
A normal Wix site cannot host a multi-file SPA. The Media Manager accepts media, documents and archives (WebAssembly isn't among the listed types) and stores files under opaque IDs, and the Velo `public/` folder holds only code modules. That leaves a Velo-file custom element as the only Wix-hosted code, and it has no way to ship `.wasm` or model files. The one Wix product that serves a static build is **Wix-managed headless**. Its no-terminal "Drop" upload rejects `.wasm` (20 MB total cap); the CLI route accepts "any build output". But a headless project is a separate frontend on `*.wix-site-host.com`, or it *replaces* the whole editor site. It cannot be mounted at a path of the existing editor-built site. For a sub-page of fauststudio.net, the tuner's assets must be hosted outside Wix and referenced by URL.

### Cited Findings
- **Media Manager:**
  - The dev overview lists "Supported file types: Images, videos, audio, documents, and archives." Files get IDs and WixMedia URLs — [Media Manager (dev overview)](https://dev.wix.com/docs/overview/site-features-tools/media-manager).
  - The help article covers images (50 MB), GIFs (15 MB) and SVG (250 KB). It says "If you would like to upload other file types and larger file sizes, you can use the Wix File Share app" — [Wix Media: Supported Media File Types and File Sizes](https://support.wix.com/en/article/wix-media-supported-media-file-types-and-file-sizes).
  - The document/archive tab contents could not be read. No source lists `.js`, `.wasm` or `.json` as allowed.
  - Uploaded documents are served from hashed URLs such as `https://<uuid>.filesusr.com/ugd/9580ec_<hash>.csv?dn=Coffee.csv`. This example comes from Wix's own CMS tutorial — [Wix docs full corpus, CMS tutorial passage](https://dev.wix.com/docs/llms-full.txt).
- **Velo `public/` folder:**
  - "This folder contains the public code files for your site… You can import code from these files" — [Git repository file structure (Wix CLI for Sites)](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/git-hub-repository-file-structure).
  - Wix-hosted custom elements live in `public/custom-elements/` — [Add a Custom Element](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/add-a-custom-element).
- **Wix CLI apps:** Apps have an `assets/` directory "for storing static assets such as images and media files", which is renamed and copied into `dist` at build (legacy CLI). App frontend code is served from the Wix App CDN on a `<app-id>.wix.run` subdomain — [Legacy CLI app structure](https://dev.wix.com/docs/wix-cli/legacy-clis/legacy-wix-cli-for-apps/get-started/cli-app-structure); [Implement a self-hosted backend for your CLI app](https://dev.wix.com/docs/build-apps/develop-your-app/develop-an-app-with-the-cli/project-development/self-hosted-backend/implement-a-self-hosted-backend-for-your-cli-app).
- **Wix-managed headless, "Upload a Static Site" (Drop, at wix.com/headless/drop):**
  - Wix "serves your files unchanged and doesn't build them". The entry must be a top-level `index.html`.
  - Accepted extensions are html/htm, css, js/mjs/cjs/jsx/map, images, mp4/webm/ogv, mp3/wav/ogg/m4a, woff/woff2/ttf/otf/eot, json/xml/txt/md, pdf/csv/yaml, geojson and glb/gltf/bin.
  - "Wix rejects any other file type, such as WebAssembly."
  - Limits: "Up to 20 MB per file. Up to 20 MB in total. Up to 5,000 files."
  — [What You Can Upload](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/your-own-frontend/what-you-can-upload)
  - The site goes live on a `*.wix-site-host.com` URL — [Upload a Static Site](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/your-own-frontend/upload-a-static-site).
- **Wix-managed headless, CLI route:**
  - Initialising from the terminal accepts "Any build output", plus server code if it is built for Cloudflare Workers — [About Supported Frameworks](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-supported-frameworks).
  - The steps are `npm create @wix/new@latest init`, then build locally, then `npx wix release`. `outputDirectory` defaults to `./dist`. Node ≥ 24.22.1 is required — [Deploy Your Own Frontend with the CLI](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/your-own-frontend/deploy-your-own-frontend-with-the-cli); [The wix.config.json File](https://dev.wix.com/docs/go-headless/wix-managed-headless/other-frameworks/the-wix-config-json-file).
  - It includes "Managed hosting with global CDN… automatic SSL certificates and deploy previews" — [About Wix-Managed Headless](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless).
- **Replacing the editor site (headless switch):**
  - "Migrating to Wix Headless is only available for sites with a connected domain." After the switch the new frontend "becomes your main site," "your old site is unpublished," and "Pages that only existed on your old site are hidden."
  - "You can only have one frontend live at a time." "You can switch back at any time."
  — [Wix Headless: Moving Your Site to a Custom Frontend](https://support.wix.com/en/article/wix-headless-moving-your-site-to-a-custom-frontend)
- **What the build actually contains** (local `dist/`, built 2026-10-20, may not match the current pin):
  - `dist/` is 5.7 MB in 39 files. `dist/tool/` is 4.9 MB.
  - Three `.wasm` files of 311–436 KB, under `tool/tfjs-wasm/`.
  - Model files: `model.json` (175 KB) and `group1-shard1of1.bin` (742 KB).
  - An analysis worker of 2.1 MB, an MP3 worker of 164 KB and a main bundle of 707 KB.
  — local files under `/Users/fin/website-prod/dist/tool/`
  - The model is not "multi-MB". The whole tool is about 5 MB.
- **What GitHub Pages serves for the tool (probe):** no `X-Frame-Options` and no CSP header on `/website-prod/tool/`, so it can be framed. The `.wasm` is served as `content-type: application/wasm` with `access-control-allow-origin: *` — [faust-ifsa.github.io/website-prod/tool/](https://faust-ifsa.github.io/website-prod/tool/).

### Inferences
- **A normal editor site can't host the tool.** No mechanism on a classic-Editor site serves a directory tree with stable relative paths. Media Manager file IDs are hashed, so `index.html → assets/*.js → tfjs-wasm/*.wasm` relative references can't survive. WASM isn't documented as uploadable. "Wholesale" upload of `dist/` to the existing Wix site is therefore not possible.
- **The Drop upload fails on the tool.** The landing page alone (fonts, webp, js, css) would fit within Drop's rules. The tool would not, because of the `.wasm` files.
- **The CLI route could probably host it, but only as a separate site.** CLI headless release ("any build output") could probably host the full `dist/`, but it becomes a separate site (`*.wix-site-host.com`, or a domain moved to it). It is not a sub-page of the editor-built fauststudio.net. Using it at `fauststudio.net/...` would mean switching the whole site to headless, which replaces Faust's editor-built site and goes against the client's constraint.
- **External hosting is needed for a sub-page.** For any "inside fauststudio.net" option, the tool's files must stay on an external static host (GitHub Pages today, or Vercel/Cloudflare Pages/a `tuner.` subdomain). Wix then frames or links to them.

### Gaps
- Not verified: whether `npx wix release` accepts `.wasm` for "other frameworks", or what per-file and total limits apply there. The docs say only "Any build output".
- Not verified: whether a Wix-managed headless project can take a *subdomain* (for example `tuner.fauststudio.net`) while the editor site keeps the apex. No dev doc found. The DNS notes may cover it.
- Not verified: whether Wix CLI app `assets/` accepts `.wasm` and model binaries, and the bundle size limits for CLI site widgets.
- Not verified: whether Velo HTTP functions (`/_functions/...`) can return binary bodies with custom Content-Type. If they could, they would be an exotic way to serve files. Not researched, and not recommended.

## Q3. Can a Wix page be given over entirely to custom code (for example a full-width, full-height iframe at fauststudio.net/tuner)? How does that behave in the classic Editor's mobile layout versus Studio? Do custom slugs or routers help?

### Takeaway
Yes, within limits. A new page with the slug `tuner` and one stretched "Embed a site" element is straightforward on the classic Editor. But the classic Editor sizes the iframe in fixed pixels: there is no viewport-height unit and no auto-height. The separate mobile layout needs its own sizing, or a mobile-only embed. Wix's header and footer still surround the page unless they are hidden. Wix Studio can size sections and elements in `vh` / `calc(100vh − header)`, but fauststudio.net is not a Studio site. Velo routers don't help: they route to Wix pages and can't serve the SPA's files.

### Cited Findings
- **Page slugs:**
  - Every page has its own URL. The slug is set under Pages & Menu → More Actions → SEO basics → "URL slug", in the Wix Editor, Studio and Harmony.
  - Reserved paths can't be used, including `apps`, `_api`, `robots.txt`, `sitemap.xml`, `feed.xml` and `sites`.
  - A changed URL gets an automatic 301, but only after "upgrade your site and connect a domain".
  — [Wix Editor: Changing Your Page URL](https://support.wix.com/en/article/wix-editor-changing-your-page-url)
- **Premium URL shape:** `https://domain.com/<prefix>/<path>`, with prefixes used only for dynamic and router pages — [About the URL Structure of Site Pages](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-frontend/urls/about-the-url-structure-of-site-pages).
- **Routers:** a router receives every request under a prefix and "decide[s] which page to show (if any) and what data to pass to the page". Typical uses are dynamic pages, custom URLs, authentication and custom HTTP status codes — [About Routers](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-backend/routers/about-routers).
- **Iframe responsiveness:** HTML/URL embeds are iframes, and their content "won't be responsive". Wix's fix for fixed-size embed code is to set width and height to 100% — [Wix Editor: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget).
- **Classic Editor mobile:**
  - Wix auto-generates a mobile version, which can be adjusted in the Mobile Editor (Wix Editor) or with breakpoints (Wix Studio) — [About Mobile Sites with Code](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-frontend/mobile/about-mobile-sites-with-code).
  - HTML embeds on mobile can "get cut off and will show scroll bars". Wix's advice is to resize the frame. "You cannot edit the code inside a desktop HTML element in the mobile editor."
  - Mobile-only embeds can be added from the mobile editor, and they're "not displayed on the desktop version" — [Wix Editor: HTML Code on Mobile](https://support.wix.com/en/article/wix-editor-html-code-on-mobile).
  - Desktop elements can be hidden on mobile through the Hidden on Mobile panel — [Wix Editor: Hidden Elements in the Mobile Editor](https://support.wix.com/en/article/wix-editor-hidden-elements-in-the-mobile-editor).
- **Wix Studio sizing:**
  - Advanced sizing exposes px, %, vw/vh, max-content and calc(), for example "(100vh - 100px)".
  - A section's "Fit to screen" behaviour "makes the section take up the entire height of the viewport (100 vh)".
  - Sizes can be set per breakpoint.
  — [Studio Editor: Setting the Size of Your Elements](https://support.wix.com/en/article/studio-editor-setting-the-size-of-your-elements)
- **Auto-height (community only):**
  - Forum threads report there is no built-in auto-height for the HTML element. The usual workaround is for the iframe to `postMessage` its height to Velo page code, which then resizes the element, or to switch to a Custom Element.
  - One reply says a taller iframe can overlap the content below it.
  — [Wix Studio forum: dynamic height for embedded iframes](https://forum.wixstudio.com/t/how-to-set-dynamic-height-values-for-embedded-iframes/54471); [Wix Studio forum: iFrame auto-resize option](https://forum.wixstudio.com/t/iframe-auto-resize-to-content-option/21337) (search summaries only, not read directly)
- **Custom elements and page height:** custom elements "can alter the page layout by modifying the page height". That makes them the one in-page mechanism whose height can follow its content — [Custom element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction).
- **Viewport-height workarounds (community):** forum answers say the classic Wix Editor has no native 100vh for sections. Workarounds use widgets or code. One older Wix reply says Velo can't modify element CSS — [Wix Studio forum: section full height (100vh) in Wix Editor](https://forum.wixstudio.com/t/how-to-make-a-section-full-height-100vh-in-wix-editor/70675) (search summary).

### Inferences
- **Feasible page:** `fauststudio.net/tuner`, a new Editor page with slug `tuner` and a stretched (full-width) Embed a site element pointing at the hosted tool. It would get a fixed desktop height, for example about 900 px, and a separately sized element on the mobile layout.
- **Height trade-off.** The tuner's editor fills the viewport, so a fixed-height frame will either leave empty space or need internal scrolling on short screens. The postMessage + Velo resize trick would make Velo active on a site that has no code today. It would also need the tool team to post the tool's height.
- **No router or slug serves the SPA's files.** The page is only a host for an iframe or element.
- **Studio's `vh` sizing doesn't apply.** It would only matter if Faust rebuilt the site in Studio, which they won't.

### Gaps
- Not verified: whether the classic Editor offers a "stretch to full height" or "fit to screen" option for strips that could hold an embed. Only community statements say it doesn't.
- Not verified: how the header and footer can be hidden on a single page of the classic Editor.

## Q4. Which features require a Premium plan and/or a connected domain?

### Takeaway
Custom Elements need Premium plus a connected domain plus no ads. Settings → Custom Code needs a published site with a connected domain. Automatic 301s on slug changes need an upgraded site with a domain. Embed HTML/site and Velo work on free sites, with quotas, though PDFs in an HtmlComponent need Premium. Migrating to headless needs a connected domain. fauststudio.net (Premium, own domain) meets all of these. The ad-free condition is not stated in the probe flags, but `isPremiumDomain:true` suggests it is met.

### Cited Findings
- **Custom Element:**
  - "you must upgrade your site with a Premium Plan, connect a domain and have no ads on it", "for security reasons" — [Wix Editor: Adding a Custom Element to Your Site](https://support.wix.com/en/article/wix-editor-adding-a-custom-element-to-your-site).
  - The Velo docs say this "only applies to custom elements on sites not apps" — [Custom element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction).
- **Custom Code:** "To add custom code, the site must be published and have a connected domain." — [About Custom Code](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-frontend/custom-code/about-custom-code); [Embedding Custom Code on Your Site](https://support.wix.com/en/article/embedding-custom-code-on-your-site).
- **HtmlComponent:** "To embed a PDF in an `HtmlComponent` you must upgrade your site to a Premium Plan." — [HtmlComponent introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/html-component/introduction).
- **Embed help article:** it states no plan requirement for Embed HTML / Embed a site — [Wix Editor: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget).
- **Velo on free sites:**
  - "You can try out most coding and data features with a free site." Free quotas apply, for example 1 micro backend container, 60 backend requests/minute and 1,000 data items.
  - Paid plans raise the data, compute and developer-tool limits. Plans from before September 2023 are "legacy" with unchanged limits.
  — [About Code on Free Sites](https://dev.wix.com/docs/develop-websites-sdk/maintain-your-site/scale-your-site/about-code-on-free-sites); [About Premium Plans](https://dev.wix.com/docs/develop-websites-sdk/maintain-your-site/scale-your-site/about-premium-plans)
- **Downloads on free sites (forum, anecdotal):** one thread reports that downloads from an HTML component were blocked on a free site without a domain but worked on Premium — [Wix Studio forum: HTML element CSV download](https://forum.wixstudio.com/t/has-anybody-been-able-to-get-wix-html-element-to-download-a-csv-file/8086) (search summary).
- **Slug redirects:** "You must first upgrade your site and connect a domain to your site for the redirects to be created." — [Wix Editor: Changing Your Page URL](https://support.wix.com/en/article/wix-editor-changing-your-page-url).
- **Headless migration:** "only available for sites with a connected domain"; "Your site keeps its current plan." — [Moving Your Site to a Custom Frontend](https://support.wix.com/en/article/wix-headless-moving-your-site-to-a-custom-frontend).
- **CLI app development sites:** "premium Wix sites that you can use for app testing", up to 5 at a time — [About the Wix CLI](https://dev.wix.com/docs/wix-cli/guides/about-the-wix-cli).

### Inferences
- Plan gating is not a blocker for any mechanism on fauststudio.net. The deciding constraints are technical (Q2, Q5) and layout-related (Q3).

### Gaps
- Not verified: which specific Wix plan tier, if any, is needed for Custom Elements beyond "Premium + domain + no ads". This depends on whether the cheapest domain-only plan still shows ads. The costs notes may cover it.

## Q5. What are the known limitations of embeds: iframe domain, sandbox and allow attributes, auto-height, CSP/frontend security, SEO, size limits?

### Takeaway
- **Code mode re-hosts the snippet on another origin.** The snippet is saved as a single HTML file on `www-<site>.filesusr.com/html/<id>.html`, an origin separate from fauststudio.net. On some sites the iframe also gets `sandbox="allow-same-origin allow-forms allow-popups allow-modals allow-scripts allow-pointer-lock"`, which has no `allow-downloads`. That would block the tuner's blob-link WAV/MP3 export in Chrome.
- **fauststudio.net probably gets no sandbox.** Its `useSandboxInHTMLComp=false` flag matches a Wix example site whose HTML iframe had no sandbox attribute.
- **Iframe permissions are limited.** The iframe's `allow` list is only extendable through Velo (`$w('#html').allow`).
- **In-page code runs under Wix's frontend security.** Custom Element or Custom Code runs inside Wix's frontend security model: `fetch`/XHR are replaced, globals such as `URL`/`JSON`/`EventTarget` are locked, and same-domain iframes are auto-sandboxed.
- **Cross-origin workers break.** The tuner's `new Worker(new URL(..., import.meta.url))` would be cross-origin and fail under every in-page approach.
- **Iframe content doesn't help the Wix page's SEO.**

### Cited Findings
- **Probe of a Wix HTML element in code mode:**
  - On Wix's example site, the HTML element iframe has `src="https://www-wix-com.filesusr.com/html/d2a594_8bf…77f6.html"`, `name="htmlComp-iframe"`, `width/height="100%"` and `allow="fullscreen"`.
  - It also has `sandbox="allow-same-origin allow-forms allow-popups allow-modals allow-scripts allow-pointer-lock"`. That site's features flag is `useSandboxInHTMLComp=true`.
  — [probe: wix.com/velo-examples/hello-html-comp](https://www.wix.com/velo-examples/hello-html-comp), headless Chromium, 2026-10-25
  - The same values appear in the server-supplied component props: `"url":"https://www-wix-com.filesusr.com/html/…","allow":"fullscreen","sandbox":"allow-same-origin allow-forms allow-popups allow-modals allow-scripts allow-pointer-lock"`.
- **Probe of a second Wix example site:** its HTML iframe (`src=https://www-wix-com.filesusr.com/html/4bc52e_….html`) had **no** `sandbox` and **no** `allow` attribute. Its flag is `useSandboxInHTMLComp=false` — [probe: wix.com/code-examples/v2-embed-chart](https://www.wix.com/code-examples/v2-embed-chart).
- **fauststudio.net flags:** `useSandboxInHTMLComp=false`; HTML-embed origin `https://www-fauststudio-net.filesusr.com/` — [probe: fauststudio.net](https://www.fauststudio.net/).
- **Wix's HtmlComponent renderer:** it renders `<wix-iframe data-src={url}><iframe sandbox={sandbox} name="htmlComp-iframe" width="100%" height="100%" allow={allow} …>`. The sandbox and allow values are props from Wix's server — [Wix editor-elements HtmlComponent bundle](https://static.parastorage.com/services/editor-elements-library/dist/thunderbolt/rb_wixui.thunderbolt[HtmlComponent].0451e486.bundle.min.js).
- **Velo HtmlComponent API (bundle):** it exposes `src` (get/set, which maps to the iframe URL), `scrolling` (`yes|no|auto`), `allow` (get/set), `allowFullScreen()`, `postMessage()` and `onMessage()`. There is no `sandbox` setter and no height property — [Wix editor-elements HtmlComponent Velo bundle](https://static.parastorage.com/services/editor-elements-library/dist/corvid/rb_wixui.corvid[HtmlComponent].99e8fa08.bundle.min.js).
- **Velo `allow` property:** "Sets or gets the browser permissions for the HTML Component". Listed examples are `camera`, `encrypted-media` and `fullscreen` — [HtmlComponent.allow](https://dev.wix.com/docs/velo/velo-only-apis/$w/html-component/allow).
- **Velo `src` property:** "Setting the `src` property sets the website that's displayed in the HTML Component", and it must be HTTPS — [HtmlComponent.src](https://dev.wix.com/docs/velo/velo-only-apis/$w/html-component/src).
- **`allow-downloads` (MDN):** this token "Allows downloading files through an `<a>` … with the download attribute" — [MDN: `<iframe>` sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).
- **Blocked blob download (forum, anecdotal):**
  - A Wix forum user reported Chrome blocking a blob-link download from a Wix HTML element because the frame was "sandboxed" without `allow-downloads`. Replies pointed to Custom Elements — [Wix Studio forum: enable downloading with iframe](https://forum.wixstudio.com/t/how-do-i-enable-downloading-of-a-file-with-iframe/4962) (search summary).
  - Chrome 83 began blocking sandboxed-iframe downloads that lack `allow-downloads` — [Atlassian developer community thread citing Chrome Platform Status](https://community.developer.atlassian.com/t/add-allow-downloads-to-iframe-sandbox-attributes/38739) (search summary).
- **How the tuner exports files** (local clone at `/Users/fin/autotuner`, which may differ from the pinned commit):
  - `saveFile()` creates `URL.createObjectURL(blob)`, sets `link.download` and calls `link.click()` — `/Users/fin/autotuner/src/audio/exportFile.ts` (lines 57–65).
  - Workers are created as `new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' })` and as an MP3 worker — `/Users/fin/autotuner/src/audio/decode.ts:47`, `/Users/fin/autotuner/src/audio/exportFile.ts:20`.
  - The tfjs WASM path is `new URL(import.meta.env.BASE_URL, self.location.origin)` + `tfjs-wasm/` — `/Users/fin/autotuner/src/audio/analysis.worker.ts:23-26`.
- **Worker origin rules (MDN):** a Worker script URL "must be same-origin with the caller's document, or a `blob:` or `data:` URL". "If a cross-origin worker is required, users must load it from an intermediate same-origin worker or a blob." A violation throws `SecurityError` — [MDN: Worker() constructor](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker).
- **Wix frontend security:**
  - It "appl[ies] to all code running on the frontend of a Wix site, including custom code, site code… and code from installed apps".
  - It replaces `fetch`/`XMLHttpRequest` with secured versions that can't be reassigned and restricts `document.cookie`.
  - Iframes created by frontend code that are "on the same domain as the site, or without a specified domain, are automatically sandboxed". `srcdoc` "is blocked". `setTimeout` with a string is blocked.
  - It locks `URL`, `JSON`, `String`, `Number`, `Object`, `Reflect`, `TextEncoder`/`TextDecoder`, `addEventListener`, `EventTarget` and "Service Worker APIs" against modification.
  — [About Frontend Security](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/best-practices/about-frontend-security)
  - The help centre adds that "some code snippets that previously worked may now be blocked until the provider updates them" — [Embedding Custom Code on Your Site](https://support.wix.com/en/article/embedding-custom-code-on-your-site).
- **Sandboxing of app widgets in the editor:** custom elements and site widgets are sandboxed in the *editor* with an opaque origin, which restricts "cookies, local storage, and IndexedDB" — [About Custom Elements in Blocks](https://dev.wix.com/docs/build-apps/develop-your-app/develop-an-app-with-blocks/code-in-blocks/about-custom-elements-in-blocks); [About Site Widget Extensions](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/site-widgets/about-site-widget-extensions).
- **What works inside an HTML element:** the iframe "does not have direct access to the other elements on your page". Widgets needing page access won't work. Libraries can only touch elements inside the iframe — [About HTML iFrame Elements](https://dev.wix.com/docs/develop-websites/articles/wix-editor-elements/other-elements/html-i-frame-element/working-with-the-html-iframe-element).
- **Links inside embeds (Harmony):** check the `target` attribute, because "Links set to open in a new tab or window often don't work" — [Wix Harmony Editor: Embedding a Link or HTML Code](https://support.wix.com/en/article/wix-harmony-editor-embedding-a-link-or-html-code).
- **Size limit:** "There is no character limit for the HTML and Embed a Site elements." — [Wix Editor: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget).
- **SEO:**
  - Custom-element content needs Velo `seoMarkup`, or only JS-executing crawlers index it — [Custom element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction).
  - The Wix embed articles say nothing about how iframe content is indexed — [Wix Editor: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget).
- **Storage partitioning (MDN):** browser storage including IndexedDB "is partitioned by top-level site", so "a third-party embedded in one top-level site cannot access data stored under another top-level site" — [MDN: State Partitioning](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/State_Partitioning).

### Inferences
- **Code mode is unsuitable.** Pasting the tool's `index.html` makes it run from `www-fauststudio-net.filesusr.com`:
  - Relative asset URLs break, and absolute URLs to GitHub Pages would be needed.
  - The module workers become cross-origin and throw `SecurityError`.
  - `self.location.origin`-based WASM paths point at filesusr.com.
  - On sandboxed sites, downloads also break.
  Fixing all of this needs tool-team changes, such as blob-wrapped workers and absolute asset paths.
- **"Embed a site" (URL mode) is the only embed that runs the tool unmodified.** The iframe document is the tool's own origin (faust-ifsa.github.io or a future host), so workers, WASM and `BASE_URL` all resolve correctly. GitHub Pages sends no frame-blocking headers.
  - **Risk 1, sandboxing.** If Wix applies its sandbox list to this element, the WAV/MP3 export fails, because `allow-downloads` is missing. fauststudio.net's `useSandboxInHTMLComp=false` and the unsandboxed example suggest it won't, but it needs a live test.
  - **Risk 2, separate storage.** Recent-files IndexedDB inside the frame is partitioned under fauststudio.net. It won't share data with direct visits to the tool's own URL.
  - **Risk 3, microphone.** If the tool ever adds microphone recording, the iframe needs `allow="microphone"`. Velo's `allow` setter documents only camera, encrypted-media and fullscreen.
- **Custom Element and Custom Code are high-risk for this tool:**
  - Cross-origin workers.
  - Wix's locked globals and wrapped fetch, which tfjs or emscripten glue might touch. This is untested.
  - CSS collisions with Wix's page.
  - Editor-mode sandboxing of IndexedDB.
  - A full rebuild as a single web component.
  These are possible in principle, but they're tool-team work with an uncertain outcome.
- **For SEO, the indexable content (title, description, how-to text) should sit in native Wix text** above or below the iframe on `/tuner`. Neither the tool nor the old landing copy should be relied on for search.

### Gaps
- **Unverified:** what decides `useSandboxInHTMLComp`, and whether "Embed a site" (URL mode) iframes get the sandbox attribute at all. Neither is documented. The probe saw sandboxing only on a code-mode element on a site with the flag set to true. Test needed: add an "Embed a site" element on an unlisted fauststudio.net page and inspect the iframe's attributes, then run one export.
- **Unverified:** whether Velo's `allow` setter accepts `microphone`.
- No official Wix statement was found on how Google attributes iframe content on Wix pages.

## Q6. How feasible is the hybrid approach: rebuild the landing page natively in the Wix Editor, and only link to or embed the tuner?

### Takeaway
This is the most compatible path with Faust's "keep Wix" constraint, and probably the least technically risky. The landing sections become native Wix Editor sections on fauststudio.net, for example at `/tuner` or `/vocal-tuner`. Either the CTA links out to the tool on its own host, or the tool goes on a second page in a full-width "Embed a site" frame. The React landing code itself can't be transplanted. It would be re-created by hand, and some current features lose fidelity or need Wix-native equivalents: the EN/CS language toggle, self-hosted fonts, the drop-styled CTA, and the accessibility guarantees. Wix-native forms would plausibly *solve* the open email-collection problem, but that wasn't researched here.

### Cited Findings
- **Wix elements cover the basics.** Wix Editor sections can hold text, images and buttons. HTML/URL embeds can be added per page. Mobile layouts can hide desktop embeds and add mobile-only ones — [Wix Editor: HTML Code on Mobile](https://support.wix.com/en/article/wix-editor-html-code-on-mobile); [Wix Editor: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget).
- **Custom fonts:** "Fonts uploaded to the Media Manager are not accessible in your editor". Custom fonts must be uploaded directly in the editor — [Wix Media: Supported Media File Types and File Sizes](https://support.wix.com/en/article/wix-media-supported-media-file-types-and-file-sizes).
- **Multilingual:** fauststudio.net currently has `isMultilingualEnabled:false` — [probe: fauststudio.net](https://www.fauststudio.net/).
- **Native features:** Wix sites have native CMS, Triggered Emails and Automations features — [Wix developer docs index (Site Features & Tools)](https://dev.wix.com/docs/llms.txt).
- **Dedicated page:** a page gets its own slug through SEO basics — [Wix Editor: Changing Your Page URL](https://support.wix.com/en/article/wix-editor-changing-your-page-url).
- **The alternative is a whole-site switch.** Wix-managed headless can host our built `dist/` landing page, but making it the frontend of fauststudio.net "unpublish[es]" the old site. Only one frontend can be live — [Moving Your Site to a Custom Frontend](https://support.wix.com/en/article/wix-headless-moving-your-site-to-a-custom-frontend).
- **Community precedent:** a Wix Studio forum thread reports a React app embedded via the HTML element broke where it relied on client-side routing or link rewriting — [Wix Studio forum: Blocks app embedding HTML without iframes](https://forum.wixstudio.com/t/create-blocks-app-which-embeds-html-code-without-using-iframes/69469) (search summary). The tuner has no router (per CLAUDE.md), so this risk is low.
- **Generic third-party guidance:** "host [the React app] on a server outside of Wix… embed the app on your Wix site using an iframe" (dated guidance) — [websitebuilderinsider: Can I use React with Wix?](https://www.websitebuilderinsider.com/can-i-use-react-with-wix/).

### Inferences
- **Recommended shape on the evidence, ranked by risk (lowest first):**
  1. **Native Wix landing section or page plus a link out** to the tool hosted outside Wix (GitHub Pages today, later a subdomain or Vercel). The tool gets the full viewport, its own URL, its own storage, no sandbox risk, and no Velo.
  2. **Native Wix landing plus a `/tuner` page with a full-width "Embed a site" iframe.** Visitors stay "on fauststudio.net", but this brings the fixed-height, mobile-layout, possible-sandbox and storage-partitioning caveats from Q3/Q5. A live test is needed before committing.
  3. **Custom Element, Custom Code or a CLI site widget wrapping the tool.** This needs tool-team changes and has an uncertain fit with Wix's frontend security.
  4. **The headless switch.** It fails the client constraint.
- **Native rebuild costs:**
  - Manual re-creation of 8 sections (Header, Hero, HowItWorks, BeforeAfter, Studio, NextStep, Faq, Footer).
  - Losing the `src/copy/*.ts` single source of truth.
  - Re-implementing EN/CS through Wix Multilingual, which is off today.
  - Re-uploading Jost / Barlow Semi Condensed / Russo One as editor fonts.
  - Re-checking WCAG items: skip link, FAQ as `<details>`, 375 px layout. These are not guaranteed by the Wix Editor's absolute-positioned layout.
  - The design tokens become Wix theme colours and text styles.
- **Native rebuild gains:**
  - Wix-native forms, contacts and automations could become the email-capture backend. GitHub Pages can't host one, so this would unblock the email collection the team needs for its AI/automation deliverable (unverified, see Gaps).
  - The page inherits Faust's header, footer, domain and SEO.
  - The client can edit it.
- **The visual jump grows inside an iframe.** The tool's dark system-UI look would clash more visibly when framed inside Faust's Wix page than when it opens as its own page. That argues for option 1, or for a tool-side theme change.

### Gaps
- Not researched: Wix Forms / Wix Contacts / Automations capabilities, and their GDPR fit, as the email-capture backend.
- Not researched: Wix Multilingual's behaviour and plan requirement for an EN/CS page.
- Not researched: whether Wix Editor sections can reproduce our accessibility guarantees, namely skip link order, `<details>` FAQ semantics and reflow at 200% text.
- No tutorial from 2024–2026 was found that shows a Vite/React SPA with Web Workers + WASM successfully embedded in a Wix page. Feasibility for option 2 rests on web-platform reasoning plus the probes above, not on a documented precedent.
