# Technical compatibility of the Faust vocal tuner (and landing page) inside Wix embeds (HTML iframe element, "Embed a Site", Custom Element)

Researched 2026-10-25. Method: (1) inspection of fauststudio.net's live HTML; (2) headless rendering of live Wix sites that contain HTML elements, reading the real iframe markup and the server-computed component props; (3) a Playwright harness that wraps the **live** tool (https://faust-ifsa.github.io/website-prod/tool/) in iframes carrying Wix's exact attributes, then uploads a fixture, waits for analysis, and exports WAV and MP3; (4) read-only review of the pinned tool code (`/Users/fin/website-prod/.autotuner`, commit e255279) and the landing code (`/Users/fin/website-prod/src`); (5) Wix docs, MDN, browser-compat-data (BCD 7.3.17), and Chrome, WebKit and Firefox docs.

Test environment for every "local test" below: Chrome for Testing 156.0.8078.4 (Playwright 1.56.1, headless, macOS arm64). Harness scripts: `/private/tmp/claude-501/-Users-fin-website-prod/4a0fc7c7-380c-4a52-a30e-fb2d987d65ca/scratchpad/pwscripts/` (`harness.cjs`, `harness2.cjs`, `harness3.cjs`, `harnessE.cjs`, `harnessE2.cjs`, `dump-iframes.cjs`). These are temporary scratchpad files. **Only Chromium was tested. Firefox and Safari conclusions come from docs and compat data, not from tests.**

## 1. What iframe attributes does Wix put on its HTML / "Embed a Site" element, and from what origin is it served?

### Takeaway
Wix's HTML iframe element renders `<wix-iframe><div><iframe name="htmlComp-iframe" title="Embedded Content" width="100%" height="100%" …>`. Wix computes the `sandbox` and `allow` attributes server-side, per site, from a `useSandboxInHTMLComp` flag.

- **Flag on:** `sandbox="allow-same-origin allow-forms allow-popups allow-modals allow-scripts allow-pointer-lock"` and `allow="fullscreen"`. There is **no `allow-downloads`**, no `allow-top-navigation*` and no `allow-popups-to-escape-sandbox`.
- **Flag off:** no `sandbox` or `allow` attribute at all.

**fauststudio.net currently has `useSandboxInHTMLComp=false`.** That is a Wix-controlled setting, though, not something Faust can configure. "Embed Code" content is served as a static file from `https://www-fauststudio-net.filesusr.com/html/<id>.html`.

### Cited Findings
- **fauststudio.net is Wix and classic Editor.** It serves `<meta name="generator" content="Wix.com Website Builder">` and an `x-wix-request-id` header, and its config contains `"isStudio":false`. The response sends no `Content-Security-Policy` or `X-Frame-Options` header. — [curl of https://www.fauststudio.net/ (2026-10-25)](https://www.fauststudio.net/)
- **fauststudio.net embed config.** Its page-asset URLs carry `staticHTMLComponentUrl=https://www-fauststudio-net.filesusr.com/` and `useSandboxInHTMLComp=false` (site revision 1669, `viewMode=desktop`). — [fauststudio.net HTML source](https://www.fauststudio.net/)
- **Live Wix site with the flag on.** On `useSandboxInHTMLComp=true` (Wix's "Hello HTML Component" example), the rendered iframe is `sandbox="allow-same-origin allow-forms allow-popups allow-modals allow-scripts allow-pointer-lock"`, `allow="fullscreen"`, `title="Embedded Content"`, `name="htmlComp-iframe"`, `width="100%" height="100%"`, `src="https://www-wix-com.filesusr.com/html/d2a594_8bf8….html"`. — [Local render of wix.com/velo-examples/hello-html-comp](https://www.wix.com/velo-examples/hello-html-comp)
- **Live Wix site with the flag off.** On `useSandboxInHTMLComp=false` (Wix's chart example), the same iframe has **no `sandbox` and no `allow` attribute**, and `src` is again `https://www-wix-com.filesusr.com/html/….html`. — [Local render of wix.com/code-examples/v2-embed-chart](https://www.wix.com/code-examples/v2-embed-chart)
- **The props are computed server-side.** The site-assets JSON contains, for the HTML component: `{"url":"https://www-wix-com.filesusr.com/html/….html","allow":"fullscreen","sandbox":"allow-same-origin allow-forms allow-popups allow-modals allow-scripts allow-pointer-lock", "translations":{"title":"Embedded Content", …"<%=componentname%> was blocked due to your <%=cookietype%> cookie settings…"}}`. The React component (`rb_wixui.thunderbolt[HtmlComponent].0451e486.bundle.min.js`) copies `sandbox`, `allow`, `scrolling`, `title` and `url` onto the iframe. It also has a cookie-consent wrapper (`isSocialElementsBlocked` → `WithConsentWrapper`), and it relays `postMessage` with target `"*"` and filters incoming messages by `event.source`. — [siteassets.parastorage.com response and HtmlComponent bundle captured while rendering hello-html-comp](https://static.parastorage.com/services/editor-elements-library/dist/thunderbolt/rb_wixui.thunderbolt%5BHtmlComponent%5D.0451e486.bundle.min.js)
- **The filesusr wrapper is just the pasted code.** Wix serves the pasted code verbatim as a static HTML file with `content-type: text/html`, `access-control-allow-origin: *` and `cache-control: public, max-age=15552000, immutable`, and no CSP or X-Frame-Options. — [curl of www-wix-com.filesusr.com/html/d2a594_8bf8….html](https://www-wix-com.filesusr.com/html/d2a594_8bf88487b87a83a978ee1e5349ba77f6.html)
- **Wix's help text** says embedded code runs in a sandboxed iFrame and lists the re-enabled tokens as allow-same-origin, allow-forms, allow-popups, allow-scripts and allow-pointer-lock. It does not mention downloads, and it omits allow-modals, which the live markup does have. — [Wix Help: Studio Editor: Adding an HTML iFrame Element](https://support.wix.com/en/article/studio-editor-adding-an-html-iframe-element)
- **Velo docs:** "The HTML element creates a sandboxed environment (an iframe) that does not have direct access to the other elements on your page." — [Wix Dev: Working with the HTML iframe Element](https://dev.wix.com/docs/develop-websites/articles/wix-editor-elements/other-elements/html-i-frame-element/working-with-the-html-iframe-element.md)
- **Two modes, both iframes.** "Embed HTML" takes a code snippet and "Embed a Site" takes a website address. "The HTML and URL elements in our editor are iFrames", so the content isn't responsive. Only HTTPS is shown. Sites that forbid framing won't display. — [Wix Help: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget)
- **Wix is tightening sandboxes elsewhere.** Wix's developer knowledge base (updated 2024-11-28) says Wix is sandboxing Custom Element and iFrame extensions **in the Editor** and no longer permits `allow-same-origin`, which limits storage there. A forum thread reported the same, citing Wix as saying live sites are unaffected. — [Wix Developers KB: Custom Element Sandbox, via search snippet](https://developers.wixanswers.com/kb/en/article/custom-element-sandbox); [Wix forum thread, via search snippet; the page itself could not be fetched](https://forum.wixstudio.com/t/wix-is-sandboxing-custom-element-and-iframe-extensions/65088); [Wix Dev: Handle Sandboxing in the Editor](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/handle-sandboxing-in-the-editor.md)
- **Same-domain iframes from frontend code** are auto-sandboxed, `srcdoc` is blocked, and `fetch`/`XMLHttpRequest` are replaced with locked, secured versions. Wix recommends cross-origin iframes with `postMessage`. — [Wix Dev: About Frontend Security](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/best-practices/about-frontend-security.md)
- **GitHub Pages doesn't block framing.** It sends `access-control-allow-origin: *`, `content-type: application/wasm` for the `.wasm` files, and no X-Frame-Options, CSP or COOP/COEP headers for `/website-prod/tool/` (index, `tfjs-backend-wasm-simd.wasm`, `model.json`). — [curl -sI of https://faust-ifsa.github.io/website-prod/tool/ (2026-10-25)](https://faust-ifsa.github.io/website-prod/tool/)

### Inferences
- **Two iframe layers with "Embed Code".** Pasting `<iframe src="https://faust-ifsa.github.io/website-prod/tool/">` gives: Wix page → `www-fauststudio-net.filesusr.com` wrapper (Wix's attributes) → our iframe. Sandbox flags and the `allow` permissions policy are both inherited and intersected down the chain. Per MDN, top-navigation permission is also inherited.
- **"Embed a Site" (URL mode)** almost certainly sets the iframe `src` to our URL directly, as a single layer. The component code applies the same `sandbox`/`allow` props whatever the URL is, so the sandbox question is identical in both modes. I did **not** observe a live URL-mode embed (see Gaps).
- **Fauststudio.net is unsandboxed today, but Wix can change that.** `useSandboxInHTMLComp` is set by Wix per site, apparently as a rollout flag; the two wix.com example sites differ. Any deployment must survive the sandboxed variant, or it could break silently when Wix flips the flag.
- **Cookie consent.** If Faust turns on Wix's cookie-consent policy, the HTML element itself can be blocked until the visitor consents (the "was blocked due to your … cookie settings" strings). This was not tested.

### Gaps
- I couldn't find a public Wix site with a URL-mode ("Embed a Site") HTML element to confirm a direct `src` with no filesusr wrapper.
- I couldn't find out how Wix decides `useSandboxInHTMLComp` (per-site rollout, plan, site age), or whether it will flip for fauststudio.net. forum.wixstudio.com was unreachable from this environment (network-blocked for curl, WebFetch failed), so forum details come only from search-engine snippets.
- I didn't check whether Wix's HTML element settings let the site owner add `allow=` permissions or sandbox tokens. Nothing in the docs or the component code suggests they can; the props come from Wix's server.

## 2. Does each tool feature work in a cross-origin (optionally Wix-sandboxed) iframe? (Chrome tested; Safari and Firefox from docs)

### Takeaway
Everything except **downloading the result** works in Chromium in all four Wix-like configurations:
- file input upload
- Web Workers, including module workers
- WASM and the Basic Pitch model loading
- analysis, the editor, and MP3 encoding in a worker
- `localStorage` and IndexedDB

**When Wix's sandbox is applied, WAV and MP3 export are blocked silently, and the tool still shows "Saved to your downloads".** If Wix ever drops `allow-same-origin`, the tool fails at upload: the worker can't start from a `null` origin and storage throws. Recent files persist between visits, but only inside the fauststudio.net partition, separate from direct visits to github.io.

### Cited Findings
**Harness results** (live tool, fixture `synth-vocal-22k-mono.wav`, 30 s; each variant in a fresh browser context; parent page served at a fake `https://wix-sim.test`):

| Variant | Analysis | WAV export | MP3 export | localStorage / IndexedDB | Recent files after reload |
|---|---|---|---|---|---|
| A: URL mode, no sandbox (fauststudio.net today) | ok (~3 s, 28 notes) | **downloaded** | **downloaded** | ok / ok | shown |
| B: URL mode, Wix sandbox + `allow="fullscreen"` | ok | **NO DOWNLOAD** | **NO DOWNLOAD** | ok / ok | shown |
| C: Embed Code (filesusr-like wrapper with Wix sandbox → our iframe) | ok | **NO DOWNLOAD** | **NO DOWNLOAD** | ok / ok | shown |
| D: Embed Code wrapper, no sandbox | ok | **downloaded** | **downloaded** | ok / ok | shown |
| E: Wix tokens **minus** allow-same-origin (hypothetical) | **fails** | n/a | n/a | SecurityError / SecurityError | n/a |

— [Local test, harness.cjs / harnessE*.cjs](https://faust-ifsa.github.io/website-prod/tool/)

- **Variants B and C:** Chrome logs `Download is disallowed. The frame initiating or instantiating the download is sandboxed, but the flag 'allow-downloads' is not set. See https://www.chromestatus.com/feature/5706745674465280`. The tool then still renders its `DownloadedScreen` heading "Saved to your downloads". — [Local test](https://www.chromestatus.com/feature/5706745674465280)
- **Variant E:** the tool shows `Failed to construct 'Worker': Script at 'https://faust-ifsa.github.io/website-prod/tool/assets/analysis.worker-BPaLg0e5.js' cannot be accessed from origin 'null'.` — [Local test](https://faust-ifsa.github.io/website-prod/tool/)
- **Popups don't escape the sandbox.** A `target="_blank"` popup opened from inside the Wix-sandboxed iframe loaded the tool, but downloads in the new tab were **also** disallowed with the same message. The popup inherits the sandbox because Wix doesn't grant `allow-popups-to-escape-sandbox`. — [Local test, harness2.cjs](https://faust-ifsa.github.io/website-prod/tool/); MDN: "If this flag is not included, a redirected page, popup window, or new tab will be subject to the same sandbox restrictions as the originating `<iframe>`." — [MDN `<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)
- **This confirms the forum report** that downloads are blocked in Wix iframes. A Wix forum user reported the missing-`allow-downloads` error in an HTML element, and a community reply said Wix iframes are sandboxed, including on premium plans, and suggested a Custom Element. — [Wix forum: Trying to download using html element, via search snippet](https://forum.wixstudio.com/t/trying-to-download-using-html-element/24535); [Wix forum: How do I enable downloading of a file with iframe?, via search snippet](https://forum.wixstudio.com/t/how-do-i-enable-downloading-of-a-file-with-iframe/4962). Our test confirms it for the sandboxed configuration only. On fauststudio.net's current unsandboxed config, downloads work.
- **Download-token support by browser:** `allow-downloads` is supported from Chrome 83, Firefox 82, and Safari and iOS Safari 17. `allow-popups-to-escape-sandbox` from Chrome 46, Firefox 49 and Safari 11.1. `allow-top-navigation-by-user-activation` from Chrome 58, Firefox 79 and Safari 11.1. — [MDN browser-compat-data 7.3.17](https://github.com/mdn/browser-compat-data); Chrome began enforcing the flag in Chrome 83 (June 2020). — [Chrome 83 deprecations and removals](https://developer.chrome.com/blog/chrome-83-deps-rems?hl=it)
- **MDN on the tokens:** `allow-downloads` "Allows downloading files through an `<a>` or `<area>` element with the download attribute … regardless of whether the user clicked". Without `allow-same-origin` the resource gets "a special origin that always fails the same-origin policy (potentially preventing access to data storage/cookies…)". — [MDN `<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)
- **Module workers** are supported from Chrome 80, Firefox 114 and Safari 15. — [MDN BCD 7.3.17](https://github.com/mdn/browser-compat-data)
- **Chrome storage partitioning.** It's on for all users since Chrome 115. Local Storage and IndexedDB in an iframe are "only available to contexts that share both the same origin and the same top-level site". — [Privacy Sandbox: Storage Partitioning](https://privacysandbox.google.com/cookies/storage-partitioning)
- **Local test of partitioning,** with Playwright's default `--disable-features=…ThirdPartyStoragePartitioning…` removed:
  - A key written inside the Wix-like iframe was readable again in a new tab under the same top-level site.
  - It was **`null`** when github.io was opened as the top-level site.
  - The recent-files list did not appear on the direct github.io visit.
  - Note: Playwright disables partitioning by default, so the first run wrongly showed shared storage.

  — [Local test, harness3.cjs](https://faust-ifsa.github.io/website-prod/tool/)
- **Firefox state partitioning** is on by default from Firefox 103. It partitions localStorage, sessionStorage, DOM Cache, IndexedDB, BroadcastChannel and Shared and Service Workers, double-keyed by origin and top-level site. — [MDN: State Partitioning](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/State_Partitioning)
- **Safari 17 storage policy.**
  - Cross-origin frames "use a separate storage partition", with a quota of 10% of the main frame origin's quota.
  - An origin may use up to 60% of disk.
  - Data can be evicted under storage pressure or after a period without user interaction (ITP).

  — [WebKit blog: Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/)
- **Safari's 7-day cap.** ITP deletes "all of a website's script-writable storage after seven days of Safari use without user interaction on the site" (IndexedDB, LocalStorage and others). — [WebKit blog: Full Third-Party Cookie Blocking and More (2020, older)](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)
- **Chrome autoplay policy.** Cross-origin iframes need the top page to delegate autoplay with the `autoplay` permissions policy, or `play()` without a gesture rejects. An AudioContext created before a gesture starts `suspended` and must be `resume()`d after one. — [Chrome blog: Autoplay policy](https://developer.chrome.com/blog/autoplay)
- **Autoplay test inconclusive.** An AudioContext created in the sandboxed cross-origin iframe reported `running` even before any gesture, with `--autoplay-policy=user-gesture-required`. Headless automation doesn't faithfully reproduce the autoplay policy. — [Local test, harness3.cjs](https://faust-ifsa.github.io/website-prod/tool/)
- **Memory is the real large-file risk.** The tool accepts files up to 100 MB (`MAX_FILE_BYTES`). It keeps the original `File` blob, the peaks and the F0 curve in IndexedDB, with up to 10 recent projects (`MAX_RECENT = 10`). — [`.autotuner/src/screens/UploadScreen.tsx` L8](file:///Users/fin/website-prod/.autotuner/src/screens/UploadScreen.tsx); [`.autotuner/src/storage/recent.ts` L5, L22-28](file:///Users/fin/website-prod/.autotuner/src/storage/recent.ts)

### Inferences
- **Uploads.** The file input and drag-and-drop work in any iframe that has `allow-scripts`. Nothing in the sandbox tokens gates `<input type=file>` or HTML5 drag-and-drop; the test used the file input. Dragging a file from the desktop onto the Wix page *outside* the iframe would let the browser open the file itself; the tool has no full-window drop guard, and in an iframe it couldn't have one for the parent page.
- **Downloads in Firefox and Safari.** Both now implement `allow-downloads` (Firefox 82+, Safari 17+), so a sandbox without it should block `<a download>` blob downloads there too. This is untested here. Older Safari (≤16) predates the token; its behaviour is not established in these notes.
- **Silent failure is the worst part.** `saveFile()` calls `link.click()` and assumes success; there is no API to detect a sandbox-blocked download. Users would see "Saved to your downloads" and find nothing. In the sandboxed case the only options are: open the tool top-level (a plain Wix button or link that navigates the *Wix page* to the tool, not a link from inside the iframe), or a tool-side workaround such as detecting the sandbox and showing an "open in new window" fallback. The fallback can't open a popup from inside the iframe, because that popup inherits the sandbox (tested).
- **Recent files.** In Chrome and Firefox they persist across visits to fauststudio.net, partitioned under that top-level site, and don't appear on github.io or under any other embedder. In Safari they are partitioned too, with a quota of 10% of fauststudio.net's origin quota, and can be wiped after 7 days of Safari use without interaction. Since Safari counts interaction per site, a user who only visits occasionally may lose them. Storing 100 MB originals in a partition capped at 10% of quota could hit `QuotaExceededError` sooner in Safari than when the tool is top-level. This is unverified (the quota is relative to disk size).
- **Autoplay.** Playback starts from user clicks or keys inside the tool, which call `ctx.resume()` (`AudioEngine.play`). The activation happens in the iframe's own document, so `allow="autoplay"` delegation shouldn't be needed. This is moderately confident and not verified in a non-automated browser.
- **WASM and CSP.** The iframe document is served by GitHub Pages with no CSP. Wix's page CSP (none is sent anyway) doesn't apply inside a cross-origin iframe. WASM compilation is allowed in sandboxed iframes with `allow-scripts`; the test confirmed tfjs WASM and Signalsmith worked.
- **Mobile memory (inference, unsourced).** Decoding a 100 MB compressed file into float32 PCM can need several hundred MB. In an iframe, that memory shares the tab with the Wix page's own JS, so iOS tab-kill risk is higher than top-level.

### Gaps
- No Firefox or WebKit test. Playwright's Firefox and WebKit builds aren't installed in this environment.
- The autoplay behaviour in real (non-headless) Chrome and Safari for a cross-origin iframe without `allow="autoplay"` wasn't verified empirically.
- No measured per-tab memory limits for iOS Safari or Android Chrome were found. Safari's exact quota for third-party partitions on typical devices wasn't computed.
- Drag-and-drop was not exercised in the harness; only the file input was.

## 3. What does our code do that matters in an iframe? (workers, WASM, model, downloads, window.top, viewport units, keyboard, links)

### Takeaway
The tool is iframe-friendly in how it loads code. Workers and assets resolve against its own origin: workers via `new URL(…, import.meta.url)`, and the model and WASM via `new URL(BASE_URL, self.location.origin)`. It never touches `window.top` or `window.parent`.

The iframe-sensitive parts are:
- downloads, via a synthetic `<a download>` click on a blob URL, with no failure detection
- window-level `keydown` shortcuts, which only fire once the iframe has focus
- canvas wheel handling, which calls `preventDefault`
- a `position: fixed` full-screen "downloaded" overlay

The landing page's tool links and its fauststudio.net links have **no `target`**, so they navigate *inside* the iframe.

### Cited Findings
- **Workers.** Built output: `new Worker(new URL('/website-prod/tool/assets/analysis.worker-BPaLg0e5.js', ''+import.meta.url), {type:'module'})` and the same for `mp3.worker-D-s5rkYz.js`. — [`/Users/fin/website-prod/dist/tool/assets/index-CbcBjuFb.js`](file:///Users/fin/website-prod/dist/tool/assets/index-CbcBjuFb.js); source: [`.autotuner/src/audio/decode.ts` L47](file:///Users/fin/website-prod/.autotuner/src/audio/decode.ts), [`.autotuner/src/audio/exportFile.ts` L20](file:///Users/fin/website-prod/.autotuner/src/audio/exportFile.ts)
- **Model and WASM paths.** `const base = new URL(import.meta.env.BASE_URL, self.location.origin).href`, then `setWasmPaths(`${base}tfjs-wasm/`)` and `tf.loadGraphModel(`${base}models/basic-pitch/model.json`)`, which compiles to `new URL('/website-prod/tool/', self.location.origin)`. — [`.autotuner/src/audio/analysis.worker.ts` L23-29](file:///Users/fin/website-prod/.autotuner/src/audio/analysis.worker.ts)
- **Bundled sizes:** model 742 KB + 175 KB JSON, three WASM binaries of 311–436 KB, analysis worker 2.1 MB, main bundle 707 KB. — [`/Users/fin/website-prod/dist/tool/`](file:///Users/fin/website-prod/dist/tool/)
- **Signalsmith** pitch shifting loads its AudioWorklet from `URL.createObjectURL(new Blob([moduleCode]))` and inlines its WASM as a base64 `data:` URL. — [`.autotuner/node_modules/signalsmith-stretch/SignalsmithStretch.mjs` L10, L393-395](file:///Users/fin/website-prod/.autotuner/node_modules/signalsmith-stretch/SignalsmithStretch.mjs)
- **Downloads.** `saveFile()` creates an `<a>` with `href = URL.createObjectURL(blob)` and `download = fileName`, calls `link.click()`, and revokes the URL after 10 s. Nothing checks whether the download happened. — [`.autotuner/src/audio/exportFile.ts` L56-64](file:///Users/fin/website-prod/.autotuner/src/audio/exportFile.ts)
- **No parent-frame or fullscreen APIs.** A grep for `window.top`, `window.parent`, `window.open`, `requestFullscreen`, `navigator.clipboard`, `navigator.storage.persist`, `history.` and `location.` finds nothing in the tool's `src/`. The only `postMessage` calls are to its own workers. There are no `alert`, `confirm` or `prompt` calls. — [grep of `/Users/fin/website-prod/.autotuner/src`](file:///Users/fin/website-prod/.autotuner/src)
- **Viewport and layout CSS:**
  - `html, body, #root { margin:0; height:100% }`
  - `:root { background:#0f1115; color-scheme: dark }`
  - `.downloaded-screen { position: fixed; inset: 0; z-index: 20 }`
  - the controls menu uses `max-height: calc(100vh - 80px)`

  — [`.autotuner/src/index.css` L1-17, L214-216, L436](file:///Users/fin/website-prod/.autotuner/src/index.css)
- **Keyboard shortcuts.** `window.addEventListener('keydown', …)` handles Space (play), Cmd/Ctrl+Z/Y/A, arrows, `<` `>` `,` `.`, Enter, Backspace/Delete and Escape, each with `preventDefault`. Cmd/Ctrl+Left/Right is used for zoom, with the comment "Also stops the browser's Cmd+Left 'back' shortcut". The Konva wheel handler calls `e.evt.preventDefault()`. — [`.autotuner/src/screens/EditorScreen.tsx` L120-160](file:///Users/fin/website-prod/.autotuner/src/screens/EditorScreen.tsx); [`.autotuner/src/editor/PitchEditor.tsx` L151-172](file:///Users/fin/website-prod/.autotuner/src/editor/PitchEditor.tsx)
- **Storage error handling.** Recent files use `idb-keyval`. `RecentFiles` falls back to an empty list on error (`listRecent().then(setRecent, () => setRecent([]))`). — [`.autotuner/src/components/RecentFiles.tsx` L24-25](file:///Users/fin/website-prod/.autotuner/src/components/RecentFiles.tsx)
- **Landing → tool links.** `TOOL_URL = `${import.meta.env.BASE_URL}tool/`` is used as a plain `<a href>` in Hero, HowItWorks and BeforeAfter. `Outbound` links (to fauststudio.net, Instagram and Facebook) are plain `<a href>` with no `target`. There are also `mailto:` and `tel:` links in the footer. — [`src/faust.ts` L25](file:///Users/fin/website-prod/src/faust.ts); [`src/components.tsx` L16-23](file:///Users/fin/website-prod/src/components.tsx); [`src/sections/Footer.tsx` L37-42](file:///Users/fin/website-prod/src/sections/Footer.tsx)
- **Language storage.** The landing language uses `localStorage` key `faust-landing:lang` inside try/catch. — [`src/i18n.tsx` L8-40](file:///Users/fin/website-prod/src/i18n.tsx)
- **Link behaviour inside a Wix-sandboxed iframe (local test):**
  - Clicking the landing CTA left the top URL at `https://wix-sim.test/` and changed only the iframe to `…/tool/`.
  - A `target="_top"` link was blocked ("Unsafe attempt to initiate navigation for frame with origin 'https://wix-sim.test' from frame with URL 'https://faust-ifsa.github.io/…'").
  - A `target="_blank"` link opened a popup that stayed sandboxed.

  — [Local test, harness2.cjs](https://faust-ifsa.github.io/website-prod/)
- **MDN on top navigation:** "A sandboxed frame blocks all top navigation unless the `sandbox` attribute values are set to `allow-top-navigation` or `allow-top-navigation-by-user-activation` … a nested frame can perform a top navigation only if its parent frames are also allowed to." — [MDN `<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)

### Inferences
- **Iframe mode (A–D):** the asset-loading approach is correct as is, because `import.meta.url` and `self.location.origin` are both github.io. No change is needed for workers or WASM.
- **Keyboard.** Shortcuts only work after the user clicks into the iframe, which is normal iframe behaviour. While the tool has focus, Space/arrow `preventDefault` stops the iframe from scrolling but never affects the Wix page. There's no conflict with Wix, but users who scroll the Wix page with the keyboard may be surprised once focus is inside.
- **Scroll trap.** Mouse-wheel over the pitch-editor canvas is captured (zoom/scroll with `preventDefault`). A visitor scrolling down the Wix page will get "stuck" when the pointer passes over a tall embedded editor.
- **The `position: fixed` downloaded overlay** is fine in an iframe; it covers only the iframe viewport.
- **Landing-page links need `target` decisions if embedded:**
  - fauststudio.net links would open the Wix site *inside its own iframe*. fauststudio.net sends no X-Frame-Options, so it would actually render nested.
  - In the unsandboxed config, `target="_top"` would work. Under Wix's sandbox it is blocked, and `_blank` works only as a sandbox-inheriting popup.
  - `mailto:`/`tel:` in sandboxed iframes may depend on `allow-popups` or top-navigation tokens (not verified).

### Gaps
- External-protocol (`mailto:`/`tel:`) behaviour from a Wix-sandboxed iframe was not tested.

## 4. Layout and UX: fixed-height iframe, scroll trapping, auto-resize, mobile view, Wix Editor vs Wix Studio

### Takeaway
A Wix HTML element is a fixed-size box set in the Editor. Content isn't responsive, Velo offers no documented way to resize the element from iframe content, and the classic-Editor mobile site renders at a **fixed 320 CSS-px viewport** (fauststudio.net confirmed). The tool is a full-window editor sized to `100%` of its frame, so it can only be usable in a large desktop box (roughly ≥ 900×600; my estimate), and it will be cramped or unusable in the mobile layout. Wix's own advice is to hide desktop embeds on mobile and add a mobile-specific alternative.

### Cited Findings
- **fauststudio.net viewports.** Its mobile response (iPhone UA) carries `<meta name="viewport" content="width=320, user-scalable=yes" id="wixMobileViewport">`; desktop carries `content="width=device-width, initial-scale=1"`. — [curl of https://www.fauststudio.net/ with iPhone UA](https://www.fauststudio.net/)
- **Wix on desktop embeds in mobile.** "You cannot edit the code inside a desktop HTML element in the mobile editor." Content larger than the frame "will get cut off and will show scroll bars". Wix recommends "hiding the desktop code" and adding a mobile-friendly alternative from the mobile editor, where elements are mobile-only. — [Wix Help: HTML Code on Mobile](https://support.wix.com/en/article/wix-editor-html-code-on-mobile)
- **Embed sizing.** Wix says embeds often have fixed pixel sizes that crop content, recommends `100%` sizing, and notes "The HTML and URL elements in our editor are iFrames", so the content isn't responsive. — [Wix Help: Embedding a Site or a Widget](https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget)
- **Wix guidance for iframe app extensions** on mobile: "Limit the width of the app to 320px, and the content to 280px". — [Wix Dev docs, via llms-full corpus](https://dev.wix.com/docs/llms-full.txt)
- **Messaging is the only documented bridge.** The Velo HtmlComponent API documents messaging (`postMessage()`/`onMessage()`); the Velo intro lists no size API. — [Wix Dev: HtmlComponent introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/html-component/introduction.md)
- **Forum reports on resizing:**
  - "there's no function in Velo" to adjust element height.
  - A `setHeight` message via postMessage left "the height of the parent site … fixed".
  - The Wix-hosted iframe being nested inside another iframe breaks naive `window.parent.postMessage`.
  - The commonly suggested fix is a Custom Element.

  These are community posts, not official, and came via search snippets. — [Wix forum: Dynamically Adjusting iFrame Height](https://forum.wixstudio.com/t/dynamically-adjusting-iframe-height-in-wix-embedding-external-booking-site/67592); [Wix forum: HTML Element with dynamic and responsive height](https://forum.wixstudio.com/t/html-element-with-dynamic-and-responsive-height/69896)
- **Custom Elements can auto-size.** Their settings include "Widget height: Whether the widget's height is adjusted automatically according to the custom element's content or can be manually adjusted." The Velo docs also note "Custom elements can alter the page layout by modifying the page height." — [Wix Dev docs, Custom Element settings (llms-full corpus)](https://dev.wix.com/docs/llms-full.txt); [Velo: Custom Element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction.md)
- **Wix Studio.** Its Studio Editor uses the same HTML iframe element. The smallest breakpoint is 320 px. — [Wix Help: Studio Editor: Adding an HTML iFrame Element](https://support.wix.com/en/article/studio-editor-adding-an-html-iframe-element); [Wix Help: Studio mobile breakpoint ≥320px](https://support.wix.com/en/article/studio-editor-request-making-the-mobile-breakpoint-smaller-than-320px)
- **The tool fills its container.** `html, body, #root { height: 100% }`, and `.upload-screen`/editor use `height: 100%`. — [`.autotuner/src/index.css` L12-35](file:///Users/fin/website-prod/.autotuner/src/index.css)

### Inferences
- **Desktop:** a large fixed box can host the tool, but a box tall enough for the editor is a giant scroll-trapping region on the Wix page, and the dark tool UI sits on Faust's cream site (already a known visual jump).
- **Mobile (classic Editor):** the iframe is laid out at ≤320 CSS px and scaled. The editor (keyboard gutter + Konva grid + transport + export bar) will be unusable at that width, and the iframe's own viewport meta is ignored. The landing page is verified only down to 375 px (per CLAUDE.md) and is not verified at 320 px.
- **Height:** auto-height for an HTML element would need Velo page code (`$w('#html1').onMessage`) plus a way to set the element's height. No official API for that was found, and forum reports say it doesn't work, so treat the height as fixed. The faust site is classic Editor (`isStudio:false`), so Studio-only responsive sizing tools don't apply.
- **Navigation inside the iframe.** Landing → `/tool/` inside one iframe means the tool inherits whatever box size suited the landing page.

### Gaps
- I didn't test the tool's actual minimum usable size, or render it at 320 px.
- I didn't verify whether Velo in the classic Editor can programmatically change an HtmlComponent's height in 2026; official docs list no such API.

## 5. The Custom Element approach: does it run in the main Wix page DOM, and what breaks for our React + Vite app?

### Takeaway
On the **live** site a Wix Custom Element is a real web component in the Wix page's own DOM and origin (`www.fauststudio.net`). In the Editor and Preview it runs inside a sandboxed iframe without `allow-same-origin`, so storage is unavailable there.

The tool would **not** work as a Custom Element without tool-team changes:
- `new Worker()` from github.io throws SecurityError (tested). A blob-URL module worker that `import()`s the github.io worker does work, since GitHub Pages sends `Access-Control-Allow-Origin: *`.
- Inside such a blob worker, `self.location.origin` becomes the Wix origin, so the model and WASM paths would resolve to `https://www.fauststudio.net/website-prod/tool/…` and 404.
- Global CSS (`:root` dark background, `html, body`, `button`, `*`) would restyle the whole Wix page unless moved into a shadow root.
- Recent files would live in fauststudio.net's first-party storage (good for persistence).
- Downloads would work, since the top-level document is not sandboxed.
- It requires a Premium plan, a connected domain and no Wix ads.

### Cited Findings
- **Where it renders.** "for security reasons, the custom element is rendered inside an iFrame in the site-editor and in preview mode", which implies the live site renders it inline. "Custom elements might appear differently in preview and live sites because they are rendered in an iframe during editor and preview modes." — [Wix Dev docs (Blocks custom elements, llms-full corpus)](https://dev.wix.com/docs/llms-full.txt); [Velo: Custom Element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction.md)
- **Requirements:** a Premium Plan, a connected custom domain and ads removed (for sites). Hosting can be Wix/Velo or an external HTTPS server; third-party elements need only a "server URL and tag name". — [Velo: Custom Element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction.md); [Wix Help: Velo: About Custom Elements](https://support.wix.com/en/article/velo-about-custom-elements)
- **Precedent:** Wix's docs show a third-party custom element loaded from GitHub Pages (`https://speechly.github.io/browser-ui/v3/push-to-talk-button.js`, tag `push-to-talk-button`). — [Wix Dev docs (llms-full corpus)](https://dev.wix.com/docs/llms-full.txt)
- **Shadow DOM and fonts.** With a shadow DOM or internal iframe "the page's stylesheet may be inaccessible"; use `getFontsHtml()`/`getSiteThemeHtml()` to bring in site fonts and theme. — [Wix Dev docs (site frontend module, llms-full corpus)](https://dev.wix.com/docs/llms-full.txt)
- **Editor sandbox.** Site widgets and plugins (including Custom Element widgets) are "treated as if they come from a different domain, and Wix does not support the `allow-same-origin` directive", which affects cookies, localStorage, sessionStorage, IndexedDB and the Cache API in the Editor. — [Wix Dev: Handle Sandboxing in the Editor](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/handle-sandboxing-in-the-editor.md)
- **Wix's frontend locks.** Wix replaces `fetch`/`XMLHttpRequest` with locked secure versions, locks `URL`, `JSON`, `Object`, `EventTarget`, `addEventListener` and the Service Worker APIs against modification, blocks `srcdoc`, and auto-sandboxes same-domain iframes. This applies to "all code running on the frontend of a Wix site". — [Wix Dev: About Frontend Security](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/best-practices/about-frontend-security.md)
- **Local test from a page at origin `https://wix-sim.test`, simulating a Custom Element script running in the Wix page:**
  - `new Worker('https://faust-ifsa.github.io/website-prod/tool/assets/mp3.worker-D-s5rkYz.js', {type:'module'})` → `SecurityError: Failed to construct 'Worker': Script at '…' c[annot be accessed from origin…]`.
  - A blob-URL module worker reported `self.location.origin = "https://wix-sim.test"`, and `import()` of the github.io worker module succeeded ("imported ok").
  - A cross-origin `fetch` of `model.json` returned 200.
  - `WebAssembly.compileStreaming(fetch(github.io …simd.wasm))` succeeded.

  — [Local test, harness2.cjs](https://faust-ifsa.github.io/website-prod/tool/)
- **GitHub Pages CORS.** It returns `access-control-allow-origin: *` on the tool HTML, `.wasm` and `model.json`. — [curl -sI, 2026-10-25](https://faust-ifsa.github.io/website-prod/tool/tfjs-wasm/tfjs-backend-wasm-simd.wasm)
- **No CSP on fauststudio.net.** Its live response sends no CSP header, and no CSP meta was found on the rendered Wix example pages. — [curl of fauststudio.net](https://www.fauststudio.net/); [Local render of wix.com example sites](https://www.wix.com/velo-examples/hello-html-comp)
- **The tool's global CSS** would leak into the Wix page: `:root { font-family: system-ui…; color:#e6e8eb; background:#0f1115; color-scheme: dark }`, `* { box-sizing: border-box }`, `html, body, #root { margin:0; height:100% }`, `button { … background:#22252c … }`, and `.downloaded-screen { position: fixed; inset: 0; z-index: 20 }`. — [`.autotuner/src/index.css`](file:///Users/fin/website-prod/.autotuner/src/index.css)

### Inferences
- **Tool-team changes needed to ship the tool as a Custom Element:**
  1. A library-mode build that defines a custom element (for example `faust-tuner`) and mounts React into a shadow root, instead of `#root` in an HTML page.
  2. Move the CSS into the shadow root and rewrite `:root`/`html, body` rules as `:host`.
  3. Start workers through a same-origin blob shim, `new Worker(URL.createObjectURL(new Blob([`import '${absWorkerUrl}'`])), {type:'module'})`.
  4. Pass an absolute asset base (for example from `import.meta.url`) into the worker instead of `self.location.origin`, for the model and WASM.
  5. Make the full-screen overlay and the controls menu (`100vh`) relative to the element.
  6. Namespace IndexedDB keys, because it would share fauststudio.net's storage with Wix's own scripts.
  7. Handle Editor and Preview, where storage throws. `RecentFiles` already degrades to empty, but `saveRecent` failures are just `void`ed.

  All of this lives in FAUST-IFSA/autotuner. Per CLAUDE.md we must not modify it from this repo.
- **Benefits:** downloads work (the top document isn't sandboxed), recent files get first-party, unpartitioned storage on fauststudio.net, and the element can auto-size its height.
- **Wix-specific risks:**
  - Wix's locked `fetch`/`URL` *should* be harmless because the tool doesn't patch them, and tfjs model fetches happen inside the worker, which Wix's page scripts don't patch.
  - The AudioWorklet blob module (Signalsmith) and blob workers would need `blob:` allowed if Wix ever adds a CSP.
  - React 19 coexists with Wix's own React (separate bundles), but adds about 700 KB of JS and a 2.1 MB worker to the page.
  - `react-dropzone` and Konva inside a shadow root are untested.
  - Window-level `keydown` listeners would then fire on the whole Wix page. Space, arrows and Backspace would be hijacked whenever the editor is mounted, unless they are scoped to the element.
- **Landing page as a Custom Element:** possible in principle, with the same CSS-isolation work, but it would duplicate what Wix itself does; see section 6.

### Gaps
- I didn't build or test the tool as an actual Wix Custom Element on a real Wix site. Behaviour of Wix's locked globals with tfjs, Konva or React-in-shadow-DOM is unverified.
- I couldn't confirm whether Wix injects any CSP on premium live sites in specific configurations; none was observed on fauststudio.net.

## 6. The landing page embedded in an iframe: SEO, analytics, deep links, back button, accessibility

### Takeaway
Embedding the landing page in a Wix iframe gives the Wix page no SEO value as configured: the landing page is `noindex`. Even with indexing on, Google credits framed content to the host page only if the framed page allows it via `indexifembedded`. Analytics and deep links don't carry across, Back steps through iframe history, and the links need `target` changes. The landing page has no analytics code today.

### Cited Findings
- **`indexifembedded`.** Google "is allowed to index the content of a page if it's embedded in another page" through iframes "in spite of a noindex rule", but `indexifembedded` "only has an effect if it's accompanied by noindex". — [Google Search Central: Robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- **The landing page is noindex.** It injects `<meta name="robots" content="noindex, nofollow">` while `site.config.json` has `"noindex": true`, and so does `dist/tool/index.html`. — [`/Users/fin/website-prod/site.config.json`](file:///Users/fin/website-prod/site.config.json); [`/Users/fin/website-prod/dist/tool/index.html`](file:///Users/fin/website-prod/dist/tool/index.html)
- **Custom Element SEO** is handled through Velo `seoMarkup`. Without it, only JavaScript-enabled crawlers index the content. — [Velo: Custom Element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction.md)
- **No analytics.** A grep for gtag, analytics, plausible, umami and dataLayer in `src/` and `index.html` finds nothing. — [`/Users/fin/website-prod/src`](file:///Users/fin/website-prod/src)
- **Frame title and skip link.** The Wix iframe's accessible name defaults to "Embedded Content" (`title: d || v.title`, from the translations prop). The landing page has a skip link to `#main` inside its own document. — [HtmlComponent bundle and site-assets props (captured)](https://static.parastorage.com/services/editor-elements-library/dist/thunderbolt/rb_wixui.thunderbolt%5BHtmlComponent%5D.0451e486.bundle.min.js); [`src/sections/Header.tsx` L11](file:///Users/fin/website-prod/src/sections/Header.tsx); [`src/App.tsx` L14](file:///Users/fin/website-prod/src/App.tsx)
- **Partitioned language choice.** Per Chrome, Firefox and Safari partitioning (section 2), `faust-landing:lang` saved inside the Wix iframe is partitioned under fauststudio.net. — [Privacy Sandbox: Storage Partitioning](https://privacysandbox.google.com/cookies/storage-partitioning); [MDN: State Partitioning](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/State_Partitioning)

### Inferences
- **SEO.** Embedding the landing page in an HTML element puts its copy in a separate document on github.io. To have Google attribute it to the Wix page, we'd need `noindex, indexifembedded` (or simply index it). Even then, attribution is at Google's discretion and other search engines may ignore it. Rebuilding the landing content natively in Wix gives far better SEO.
- **Analytics.** Wix Analytics would see only the Wix page view. Interactions inside the iframe (CTA clicks, tool usage) are invisible to Wix unless we `postMessage` events to Velo page code. Any analytics *inside* the iframe would be a third-party context with partitioned or blocked cookies.
- **Deep links and back button.** The Wix URL never reflects landing or tool state. Navigating landing → tool inside the iframe adds a joint-session-history entry, so the browser Back button first returns the iframe to the landing page before leaving the Wix page, which is standard but often confusing. The tool's Cmd/Ctrl+Left `preventDefault` only applies while the iframe has focus.
- **Accessibility.** Screen readers will announce a generic "Embedded Content" frame unless a better title can be set; no Wix setting for it was verified. The skip link works only within the iframe and can't skip Wix's header. Tab order enters the iframe at its DOM position in the Wix page, so the "CTA as an early tab stop" goal is lost.
- **Language choice** persists for repeat visitors via the embed, but separately from direct github.io visits.

### Gaps
- I didn't find whether the Wix HTML element exposes a setting to change the iframe `title`.
- Bing's and other engines' handling of iframe content was not researched.

## 7. Overall verdict: which embed mode is technically viable, and what changes are needed?

### Takeaway
**The most robust option is not embedding the tool at all.** Link from a native Wix page or button to the tool running top-level on its own URL. This needs no code changes and avoids every sandbox, sizing, mobile and partitioning problem. The other options rank as follows:
1. **HTML element in URL mode ("Embed a Site").** Technically works today on fauststudio.net because its flag is `useSandboxInHTMLComp=false`, but downloads would silently break if Wix turns the sandbox on. It is fixed-height, trap-scrolls, and is unusable in the 320 px mobile layout.
2. **"Embed Code" with an inner iframe.** Same as option 1, plus an extra layer.
3. **Custom Element.** The only embedded mode with working downloads, first-party storage and auto-height, but it needs significant tool-team work: a web-component build, shadow-DOM CSS, worker and asset-path changes, and scoped keyboard handling.

The landing page shouldn't be iframed. Its content belongs natively in Wix for SEO, analytics and accessibility.

### Cited Findings
- **Silent download block under Wix's sandbox,** for both single-layer and two-layer embeds, while the tool reports success. — [Local test, harness.cjs](https://faust-ifsa.github.io/website-prod/tool/)
- **fauststudio.net's current flag** is `useSandboxInHTMLComp=false`; another Wix site has it `true`. — [fauststudio.net HTML](https://www.fauststudio.net/); [wix.com/velo-examples/hello-html-comp](https://www.wix.com/velo-examples/hello-html-comp)
- **Wix's sandboxing direction.** Wix removed `allow-same-origin` for Editor sandboxes of Custom Element and iframe extensions (2024-11). Without `allow-same-origin` the tool fails completely (tested). — [Wix Dev: Handle Sandboxing in the Editor](https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/handle-sandboxing-in-the-editor.md); [Local test, harnessE2.cjs](https://faust-ifsa.github.io/website-prod/tool/)
- **Classic mobile layout** is `width=320` on fauststudio.net, and Wix advises hiding desktop embeds on mobile. — [fauststudio.net mobile HTML](https://www.fauststudio.net/); [Wix Help: HTML Code on Mobile](https://support.wix.com/en/article/wix-editor-html-code-on-mobile)
- **Custom Element status.** It runs inline on the live site; a cross-origin `new Worker` fails; blob-worker import with CORS works. — [Velo: Custom Element introduction](https://dev.wix.com/docs/velo/velo-only-apis/$w/custom-element/introduction.md); [Local test, harness2.cjs](https://faust-ifsa.github.io/website-prod/tool/)

### Inferences
- **Changes in our repo (website-prod), if any iframe embedding is pursued:**
  - Decide on `noindex` vs `noindex, indexifembedded` for the landing page.
  - Add `target="_top"` to the fauststudio.net links, or better, drop the landing page from the embed entirely. Note `_top` is blocked if Wix sandboxes the element.
  - Have the CTA open the tool top-level rather than inside a small iframe. Practically, put the CTA on the Wix side as a native Wix button linking to the tool URL.
  - Moving hosting to a Faust subdomain (for example `tuner.fauststudio.net`) wouldn't change iframe sandboxing, but it would make the tool same-site with fauststudio.net. Under Chrome's and Firefox's site-keyed partitioning that should give it unpartitioned storage when embedded (an inference, untested).
- **Changes that need the tool team (FAUST-IFSA/autotuner):**
  1. Detect a sandboxed or embedded context (for example `window.top !== window`, or try a probe) and, when downloads might be blocked, show an "Open the tuner in a full window" message instead of a false "Saved to your downloads". `saveFile` can't detect the block itself.
  2. Embed-friendly layout: a minimum size, and avoiding wheel capture until the user clicks into the canvas, to soften the scroll trap.
  3. For a Custom Element: a web-component build with shadow DOM, blob-shim workers, an absolute asset base passed to the worker instead of `self.location.origin`, scoped keydown handling, and Editor/Preview storage guards.
  4. Optionally request `navigator.storage.persist()` for recent files. Safari grants it by heuristics.
- **The cleanest answer for the client:** build the landing content as a native Wix page on fauststudio.net, with Faust's real fonts, SEO and analytics, and a big "Open the free tuner" button that navigates top-level to the tool on its own URL (github.io now, ideally a Faust subdomain later). This keeps their Wix site and sidesteps every embed limitation found here.

### Gaps
- None of these recommendations were validated on a real Wix site. A quick real-world check would settle the remaining uncertainty: a hidden test page on fauststudio.net with an "Embed a Site" element pointing at the tool, exercised in Chrome, Safari (macOS and iOS) and Firefox.
- The effect of a Faust subdomain on storage partitioning (same-site embedding) is my inference from the partition-key definitions; it was not tested.
