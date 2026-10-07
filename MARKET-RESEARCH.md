# Market Research: Browser-Based Vocal Autotune Tools

Prepared by: researcher | Date checked: **2026-10-06** (all prices and pages checked on that date unless stated otherwise) | For: pm, programmer, designer

**Scope.** I profiled 11 tools that run in a browser and 3 desktop/mobile benchmarks (Antares AutoTune, Celemony Melodyne, Voloco). Other candidates were checked and left out; see "Also checked" below. Inline citations [n] point to Sources (section 7).

**Evidence labels.** *Verified* means I saw it on the vendor's own page or in its shipped HTML/JS. *Inferred* means a reasoned guess, and the basis is given. *Third-party* means it comes from a review or aggregator site, not the vendor. *Snippet* means the page blocked direct fetching, so the fact comes from the search engine's index of that page.

---

## 1. TL;DR

- **Free browser autotune is a commodity.** At least five tools give it away with **no signup**: Violet Recording, Rys Up Audio, SoundTools.io, OnlinePitchChanger, and LA Studio (one render per day without an account). They all cover the same basics: key/scale, correction strength or retune speed, WAV export, and usually a "your audio never leaves your browser" claim [33][35][36][37][30]. "Free online autotune" alone will not set us apart.
- **Making people give an email before first use puts us behind the free tools.** The platforms that require an account up front (BandLab, Soundtrap, Soundation, TwoShot) give users a whole DAW or AI suite in return [11][16][21][27]. The more common pattern is to **let people try first and gate the result**: LA Studio allows 1 anonymous render a day [30], IchiPitchy meters exports (2 free per month) [29], and Kits.ai's free tier includes **0 download minutes** [24]. This is a decision for the tool team, but it shapes our landing page.
- **Using a free tool as a funnel is a proven model, but no actual recording studio is doing it.** Rys Up Audio uses its free tuner to sell a $49.99 plugin [35]. Violet Recording uses its free tuner and guides to earn **studio-booking referral fees** [34]. BandLab uses its free AutoPitch effects to sell Membership [6]. Kits.ai is now part of Splice [26]. I found **no studio with its own rooms, engineers, and courses** using a free tool to sell sessions. That gap is Faust's opening (inferred from the tools found; the search was not exhaustive).
- **Live, real-time correction in the browser is rare and fragile.** Only BandLab, Soundtrap, and SoundTools.io correct a live microphone [10][15][36]. SoundTools blocks Safari in live mode because of a WebKit AudioWorklet problem [36]. Most tools work by uploading a file and processing it. **Don't promise real-time on the landing page** unless the tool team confirms it.
- **Nothing is aimed at Czech users.** None of the tools I checked lists a Czech UI. LA Studio offers 9 languages and Kits.ai 7, and neither includes Czech [30][24]. Czech searches for "autotune online zdarma" return mostly translated blog content from foreign companies (eMastered, CapCut) [49][50]. A Czech + English tool from a Prague studio has open ground in local search (inferred; I did not do keyword-volume research).
- **Paid tiers fall into four price bands:** micro-subscriptions at **$3/mo** (IchiPitchy) [29]; creator platforms at **~$10–15/mo** (BandLab Pro $14.99, Kits Starter $10) [9][24]; pro plugins at **$30/mo or $300/yr** (AutoTune Unlimited) [38]; and one-off plugins at **$49.99–$300** [35][39]. Faust's cheapest upsell, a 3-hour Green Studio package with an engineer, costs **2,100 CZK (~€90)** [2], about three months of AutoTune Unlimited. The upsell should be framed as "from plugin to engineer", not as a software upgrade (inferred).
- **The client site isn't ready to receive the funnel.** fauststudio.net runs on Wix. Its homepage has no visible newsletter or email capture (I checked the HTML), and the Courses page gives no course names, prices, or dates [1][3]. The upsell pages need work before the email automation has anywhere to send people.

---

## 2. Comparison table

Prices were checked on 2026-10-06. "Browser" means the core tuning works in a web browser.

| # | Name | Browser | Real-time or upload | Signup required when | Free tier | Cheapest paid | Business model |
|---|---|---|---|---|---|---|---|
| 1 | BandLab (AutoPitch) | Y | Both (live while recording + effect on track) | Before first use | 6 AutoPitch effects, full DAW | US$14.99/mo Pro (or $99 first year) [9] *snippet* | Freemium platform, membership, distribution, ecosystem |
| 2 | Soundtrap | Y | Both (Real-Time and Standard modes) | Before first use | DAW; vocal tuning is a paid feature [16] | "Sound Starter" plan; £11.99 in UK App Store [17]; web price unverified | Freemium subscription + EDU |
| 3 | Soundation | Y | Effect on track | Before first use | Vocal Tuner "included in all plans" *snippet* [21] | $9.99/mo Starter *third-party* [23] | Freemium subscription + EDU |
| 4 | Kits.ai (now Splice) | Y | Upload (AI resynthesis) | Before first use (inferred); download needs paid plan | 15 conversion min, **0 download min** | $10/mo Starter [24] | Freemium AI subscription; acquired by Splice |
| 5 | TwoShot | Y | Upload/record, cloud processing | Before first use (credits on signup) | Signup credits ("several tuned vocals") | Unknown | Credits / AI suite |
| 6 | IchiPitchy | Y | Upload; browser preview, server-side WAV render | Unclear (Auth0 login present) | Unlimited tuning, 2 audio exports/mo | $3/mo or $33/yr [29] | Freemium micro-subscription |
| 7 | LA Studio | Y | Upload; in-browser engine + cloud options | Optional: 1 apply/day anonymous, 3/day with free account | As left | ¥980 30-day pass; credits from $5 [31] | Freemium + credits + ads |
| 8 | Violet Recording | Y | Upload, in-browser | Never | Unlimited, no watermark | Free | **Free tool + content → studio-referral fees** |
| 9 | Rys Up Audio | Y | Upload + mic recording, in-browser | Never | Unlimited, no watermark | Free (plugin $49.99) | **Free tool + ads → paid plugin** |
| 10 | SoundTools.io | Y | Live mic real-time + upload, in-browser | Never | Unlimited | Free | Ads (AdSense) |
| 11 | OnlinePitchChanger | Y | Upload/record (not live), in-browser | Never | Unlimited, no watermark | Free | Unknown (no ads in static HTML) |
| B1 | Antares AutoTune (*benchmark*) | N | Real-time plugin | Purchase/trial | 14-day trial | $30/mo or $300/yr Unlimited [38] | Subscription + perpetual |
| B2 | Celemony Melodyne (*benchmark*) | N | Offline note editing | Purchase/trial | 30-day trial | ~€99 Essential *retailer, unverified* [41] | Perpetual licences |
| B3 | Voloco (*benchmark*) | N (mobile + plugin) | Real-time | Unknown | Free tier with limits | $11.99/mo, $59.99/yr *2024 data, stale* [44] | Freemium app subscription |

---

## 3. Competitor profiles

### 3.1 BandLab (AutoPitch)
- **How it works:** You create a voice track in the web Studio, turn on AutoPitch, set key/scale (or use AutoDetect Key) and Level, then record. Correction runs live while you record, or you apply it as an effect afterwards [7][10]. The "Low Latency" algorithm for live monitoring is a membership feature [7].
- **Tech:** The web app has AngularJS markers (`ng-strict-di`, `ui-view`) and an Azure CDN (`bl-prod-images.azureedge.net`) in its HTML (*verified*) [14]. The AutoPitch landing page is built in Framer, with Branch.io deep links and a Meta pixel (*verified*) [6]. A job ad lists Vue.js and Electron for the desktop app [12]. Audio engine: Unknown.
- **Pricing:** Free: 6 AutoPitch effects. Pro: US$14.99/mo or $99 for the first year, then $149. Max: $199 for the first year, then $299, with "Retune" for cent-level editing [8][9] (*snippet*; the help page returned 403).
- **Other products:** BandLab Technologies (part of Singapore-based Caldecott Music Group) also runs Cakewalk, ReverbNation, and Airbit [13], plus distribution, mastering, and paid promotion credits [8].
- **Model:** Freemium platform. The free AutoPitch effects funnel users into Membership: CTAs say "Try 24 effects for $0" [6].
- **Features:** 24 effects (Classic, Robot, Duet, Big Harmony, etc.), key detection, intensity control, plus a full DAW [7].
- **Gating:** You need an account before you can use the Studio [11].

### 3.2 Soundtrap
- **How it works:** The Vocal Tuner has a Real-Time mode (corrects the incoming mic signal) and a Standard mode (applies to recorded tracks), plus an "Amount" slider. Key is detected automatically only when the project uses Soundtrap loops or MIDI; for imported audio you set it by hand [15].
- **Tech:** The front end is Angular (`ng-version` in the bundle, *verified*), billing runs on Recurly, and errors go to Sentry (*verified*) [19]. A 2026 job ad says the studio is written in "Dart and Javascript" with a Java backend, using Web Audio, WebRTC, and "WebAssembly in an AudioWorklet" [18].
- **Pricing:** Vocal tuning is available on the "Sound Starter, Music Production, and Production & Vocals" plans, and new users get 30 days of Antares AutoTune 2026 [16]. UK App Store in-app prices: Pro £4.49, Premium £7.99, Sound Starter £11.99, Production & Vocals £20.99 [17]. USD web prices are rendered client-side and I couldn't verify them. Older USD figures ($9.99–$17.99) appear on aggregators but use outdated plan names.
- **Other products:** Soundtrap for Education and podcast tools. Spotify sold the company back to its founders in 2023 [20].
- **Model:** Freemium subscription.
- **Gating:** You need an account to start ("Get started for free") [16].

### 3.3 Soundation
- **How it works:** Vocal Tuner is an effect you add to a track. You set root note and scale by hand, and correction strength runs from 0–100% [21]. Real-time monitoring: Unknown.
- **Tech:** The marketing site is Next.js (`_next/static`) with Strapi CMS (`strapi-cdn.soundation.com`) (*verified*) [22]. Studio audio engine: Unknown.
- **Pricing:** Free tier exists. Starter $9.99, Creator $14.99, Pro $49.99 per month (*third-party*) [23]. The official plans page renders client-side and I couldn't read it.
- **Other products:** Soundation Education (edu.soundation.com) and a sound library.
- **Model:** Freemium subscription.
- **Gating:** Account required ("Join for free") [21].

### 3.4 Kits.ai (Splice)
- **How it works:** Upload WAV/MP3/M4A, edit notes on a piano roll, then "Generate". The AI resynthesizes the vocal instead of pitch-shifting it, which the vendor says avoids artifacts [25].
- **Tech:** Marketing site built in Framer (*verified*) [24]. The core product is server-side AI (vendor statement) [25]. App stack: Unknown.
- **Pricing:** Free $0 (15 conversion minutes, **0 download minutes**). Starter $10/mo, Producer $30/mo, Professional $60/mo, with annual discounts of up to 47% [24].
- **Other products:** AI voice cloning, licensed artist voices, stem splitter, AI mastering, harmony generator, API [24]. Splice acquired Kits on 2026-01-21 [26].
- **Model:** Freemium AI subscription, now feeding into the Splice ecosystem.
- **Gating:** You can try it free, but **exporting audio requires a paid plan** [24].

### 3.5 TwoShot
- **How it works:** Upload or record a vocal, choose subtle or hard tuning, and it is processed in the cloud. Key/scale detection is included [27].
- **Tech (verified from shipped JS):** React SPA built with Vite (`VITE_*` config), Auth0 on an EU tenant, Stripe, Sentry, an API at api.twoshot.app, the Rubber Band R3 stretch engine, and a WASM demuxer with AudioWorklet [27]. *Inferred* from the bundle's model IDs: other AI tools (stem split, one-shots) run server-side.
- **Pricing:** "New accounts get credits on signup that cover several tuned vocals" [27]. Paid prices: Unknown (pricing page didn't render).
- **Other products:** Described as an "AI Creative Suite" (studio, stems, one-shots).
- **Model:** Credits.
- **Gating:** Account required to receive credits [27].

### 3.6 IchiPitchy
- **How it works:** Upload a file. It detects the notes plus key and scale, then you set "Level" and "Smooth" (keeps vibrato), edit notes on a piano roll, or ask an AI assistant in plain English. Preview plays in the browser; the WAV export is "rendered server-side" [28].
- **Tech (verified from JS):** React with Vite-style asset names, Tone.js, AudioWorklet, Rubber Band in a Web Worker, Auth0, and Vercel Analytics [28]. Payments run through Dodo Payments [29].
- **Pricing:** Free: unlimited tuning, 2 editor exports per month, MIDI export always free. Pro: $3/mo or $33/yr, plus VAT [29].
- **Other products:** AI vocal isolation, harmony, mixing, and "Creator Studio" (lyric captions, MP4 export) [29].
- **Model:** Freemium micro-subscription.
- **Gating:** The page doesn't say whether an account is needed to tune. Metered exports and the Auth0 login suggest one is needed at export (*inferred*).

### 3.7 LA Studio
- **How it works:** Upload MP3/WAV/FLAC/M4A. It auto-suggests key/scale, lets you edit notes on a piano roll, and applies correction with the "Lyra HQ" engine, which runs in the browser after a model download. Cloud options are also offered [30][32].
- **Tech:** Next.js App Router (verified chunk paths), Google AdSense, and Stripe [30][31]. *Inferred* Japan-based operator: the site has a `/tokushoho` page (Japanese commercial-disclosure law) and a ¥ price.
- **Pricing:** Free. Pro: monthly/annual price is shown only at checkout, with a 7-day trial that needs a card. Pro 30-day pass ¥980. Credits: 100 for $5 up to 1,000 for $35 [31].
- **Other products:** Vocal remover, stem split, mastering, a DAW, audio-to-MIDI, AI music generation [31].
- **Model:** Freemium + credits + ads.
- **Gating:** **1 full apply per day without an account, 3 per day with a free account**, and unlimited preview [30]. This is the most useful reference model for our gate.

### 3.8 Violet Recording (studio-referral funnel)
- **How it works:** Upload MP3/WAV/M4A/OGG/FLAC, pick key/scale and strength (natural to "T-Pain"), preview before and after, then download WAV/MP3. Processing happens in the browser: "your vocal is never uploaded" [33].
- **Tech:** Unknown. The site returned HTTP 526 (Cloudflare origin error) on 2026-10-06, so these facts come from the search index (*snippet*).
- **Pricing:** Free, with no signup and no watermark [33].
- **Other products / model:** It describes itself as "an independent guide, not a studio". It matches users with US partner studios (recording, mixing/mastering, production) and "may earn a referral fee when a booking goes ahead" [34]. **This is the closest analog to our model:** a free tool that brings in traffic, which is turned into studio bookings.
- **Gating:** None for the tool. The studio-matching form is where it captures leads [34].

### 3.9 Rys Up Audio (plugin funnel)
- **How it works:** Upload (MP3/WAV/OGG/FLAC, up to 50 MB) or record from the mic. Key/scale is chosen manually, and it has Strength and Transition (ms) controls. Exports 16-bit WAV [35].
- **Tech:** Shopify storefront, Google AdSense, and Google Ad Manager (*verified* in HTML). The vendor describes the engine as Web Audio with "YIN-style autocorrelation… ~10 ms refresh" [35].
- **Pricing:** Every tool is free, with "no signup, watermark, or paid credits" [35].
- **Other products:** RysUpTune and RysUpShift plugins at $49.99 each, a free RysUpAir plugin, and DAW vocal presets [35].
- **Model:** **Free tool funnels into a paid plugin.** The tool page has an inline CTA: "Want an Auto-Tune alternative inside your DAW?… $49.99 Get plugin" [35].
- **Gating:** None.

### 3.10 SoundTools.io
- **How it works:** **"Sing Live" real-time mode** plus file upload. Offers 8 scales, retune speed, and dry/wet mix. Exports WAV only [36].
- **Tech:** The vendor says it uses a "phase vocoder AudioWorklet", with everything processed on the device [36]. **Safari is blocked in live mode**: "a known WebKit limitation with AudioWorklet-based pitch correction that we cannot work around." This conflicts with its own FAQ, which says Safari "should work" [36].
- **Pricing:** Free, no account, no limits [36].
- **Model:** Ads (Google AdSense, *verified*). Operator: Unknown.
- **Gating:** None.

### 3.11 OnlinePitchChanger
- **How it works:** Upload or record (no live correction). Pitch is tracked with YIN every 12 ms and shifted with PSOLA, retune speed runs from 0 to 120 ms, and you export MP3 or WAV. It suggests the key [37].
- **Tech:** WordPress with the Astra theme and a custom `opc-autotune-online` plugin script, plus GA (*verified*). The vendor states processing happens on the device [37].
- **Pricing / model:** Free, no signup, no watermark. Revenue model: Unknown.
- **Gating:** None.

### 3.12 Benchmark: Antares AutoTune (desktop)
- Real-time plugin (VST3/AU/AAX). **AutoTune Unlimited costs $30/mo or $300/yr** for new subscribers since 2025-04-04 [38]. AutoTune 2026 launched 2025-10-21 at $300 perpetual with a 14-day trial; one search snippet said $150, so the price is in conflict and I used the Sound On Sound figure [39]. Antares retired the Artist and Access tiers [39]. Antares also licenses AutoTune into Soundtrap [16]. The name "Auto-Tune" is an Antares trademark, so we should say "autotune effect" or "pitch correction" (see Risks).

### 3.13 Benchmark: Celemony Melodyne 5 (desktop)
- Offline, note-by-note editing in four editions (Essential, Assistant, Editor, Studio) with a 30-day trial [40]. The vendor page shows no prices. Retailer listings put Essential at about €99 (*unverified*) [41]. This is the "natural-sounding" reference that AI tools (Kits, IchiPitchy) compare themselves to.

### 3.14 Benchmark: Voloco (mobile + plugin)
- A real-time autotune app for iOS/Android from Resonant Cavity Inc., claiming "80+ million downloads" [42]. All Access costs $11.99/mo or $59.99/yr (Adapty capture from **2024-09-18, stale**) [44]. The Voloco Producer desktop plugin costs $14.99/mo or $99.99/yr [43]. I found **no web version**.

### Also checked and left out
- **Moises:** it offers pitch *shifting* and AI voice conversion, not pitch correction [45].
- **Audiotool:** I found no dedicated autotune device, and users have asked for one on its forum [46].
- **Musicfy:** I found no autotune feature.
- **LANDR:** its VoxTune is a desktop plugin, not a browser tool [48]. LANDR is still relevant as an adjacent model because it bundles plugins, mastering, and courses into one subscription (*third-party*).
- **Audimee:** an AI vocal tuner behind an account [47]. It is a smaller analog to Kits.
- **Freebeat.ai:** it has a vocal tuner, but the page returned HTTP 429 and I couldn't verify it.

---

## 4. Patterns and gaps

**What is commodity (every free tool has it):** upload MP3/WAV, choose key/scale, a correction strength or retune speed that runs from natural to robotic, and WAV export. Most also claim "no watermark" and "processed in your browser, never uploaded" [33][35][36][37]. Auto key detection is close to standard among the better tools [7][27][28][30].

**What is underserved:**
1. **A path from tool to people.** Every free tool ends at a download. The funnels lead to a plugin (Rys Up), a subscription (BandLab, Kits), or an anonymous referral network (Violet). None leads to a real studio, an engineer, or a teacher.
2. **Local language and local trust.** I found no Czech-language tool, and Czech search results are filled by translated content from foreign companies [49][50].
3. **Guidance for beginners.** Tools give you knobs but don't teach. A short "how to record a better take" message fits naturally with Faust's courses (*inferred*).
4. **Reliable live correction on mobile/Safari.** It is hard to build [36], so most tools don't offer it.

**Pricing bands (USD unless noted):** free with ads or as a funnel → $3/mo micro-subscription → ~$10–15/mo creator platforms → $30/mo or $300 perpetual for pro plugins. Studio time is a different category: Faust Green Studio starts at **700 CZK/h (~€30)**, with a 3-hour package at 2,100 CZK (~€90) and Blue Studio 4 hours at 4,000 CZK (~€170) [2].

**Onboarding/gating patterns:**
- *No gate:* the utility sites (Violet, Rys Up, SoundTools, OPC).
- *Soft daily gate:* LA Studio, with 1 anonymous render a day and more with a free account.
- *Export gate:* IchiPitchy (2 exports/mo) and Kits (0 free download minutes).
- *Hard gate before use:* BandLab, Soundtrap, Soundation, TwoShot, which justify it with a full DAW or suite.
- A small tool that asks for an email before any value goes against what users have learned to expect (*inferred*).

**Studio-backed tools:** The only studio-adjacent funnel I found is Violet Recording, and it is a referral guide, not a studio [34]. Several studio-branded tool pages I checked were run by tool or content companies. **I found no recording studio offering a free browser tool as its own funnel.** The search was English and Czech web search only, so this is not exhaustive.

**Czech / Central Europe:** Faust's site is in English and Czech [1]. Faust also has strong local references (Iva Bittová, Aneta Langerová, Barbora Poláková, Katarzia) alongside international ones (Skunk Anansie, Damian Marley, OneRepublic) [4], which no competitor can match. For context only (not a competitor): Czech Radio rents its Prague Studio 1 at 6,000 CZK/h (*snippet*).

---

## 5. Value proposition for our product

**Target user:** Beginner and intermediate singers, rappers, and songwriters in Prague and Czechia (Czech or English speaking) who record at home on a phone or laptop and want their vocal to sound polished. Some will later want lessons or a real session.

**Their problem:**
- Pro tuning is expensive and complicated (AutoTune $30/mo; Melodyne is desktop software) [38][40].
- Platform tools make you learn a DAW and create an account before you hear anything [11][16].
- Free tools are anonymous utilities that leave you with a WAV and no next step (§4).

**What we offer:** A free in-browser vocal tuner, backed by a 35-year-old Prague studio [4][5], with a clear next step to Faust engineers, courses, and studio time [2][3].

**Why us over the alternatives:**
1. **A real studio behind the tool.** Competitors funnel users to plugins, subscriptions, or anonymous referrals. Faust can offer a named room and engineer at a published price [2][34][35].
2. **Local.** Czech + English in a market no competitor localizes for [24][30][49].
3. **Credibility.** Since 1991, with international and Czech artist references [4][5].
4. **Price ladder.** Free tool → 3-hour session at 2,100 CZK, which is cheaper than many people expect from a "pro studio" [2].

**Positioning statement (draft):**
> For independent singers and rappers who record at home, Faust Autotune is the free browser vocal tuner from Faust Studio Prague, the recording studio behind 35 years of Czech and international records. Unlike anonymous online tuners, it comes with a real next step: an engineer, a course, or a session in the room.

**Candidate headline directions:**
1. *"Free autotune for your vocals, from a real Prague studio."* This leads with the commodity promise users search for, then the differentiator (§4, [33][35]).
2. *"From bedroom take to studio sound."* This sells the journey from tool to session, which is the core of the funnel ([2], §4 "path from tool to people").
3. *Czech:* *"Autotune zdarma v prohlížeči. Od studia, které nahrává od roku 1991."* ("Free autotune in your browser. From a studio that has been recording since 1991.") This fills the Czech-language gap ([49][50], [5]).

**MVP implications.** These are recommendations for the tool team; we don't own the tool, and the landing page must not promise anything the tool doesn't ship.
- **Parity features, needed to be credible:** key/scale selection with auto-detect; one strength or retune-speed control from natural to hard; preview before and after; WAV export (MP3 is a bonus); accepts MP3/WAV/M4A at minimum. Every serious competitor has these (§3).
- **Gate placement:** let users hear the tuned result before asking for their email, and ask at download or save. The landing page copy should describe the gate honestly ("free, sign up with email to download"). This follows the LA Studio and IchiPitchy patterns [29][30].
- **No watermark.** If true, say so. It is a standard promise among the free tools [33][35][37].
- **Privacy statement:** only say "processed in your browser" if the tool team confirms it. GDPR consent for marketing emails must be **separate** from the signup needed to use the tool (see Risks).
- **Device support:** state which browsers and devices are supported, Safari/iOS especially. Don't claim live/real-time correction unless it ships [36].
- **Next-step hooks on the landing page and the post-export screen:** "Book 3 hours with an engineer – 2,100 CZK" and "Learn to record vocals – Faust courses". Course details don't exist on the site yet [3].

---

## 6. Open questions and risks

**For the PM / client to decide:**
1. **When is email required?** Before first use, or at export? This is the biggest conversion question (§4).
2. **Does the tool process audio locally or on a server?** This decides whether we can make a privacy claim.
3. Does it do live mic correction? Does it work on mobile Safari?
4. **Languages:** Czech + English UI in both the tool and the landing page?
5. **Where are emails stored?** We need a consent text, a double opt-in decision, and a privacy policy owner. GDPR and Czech rules on commercial email generally require explicit marketing consent, separate from what's needed to use the service. **Get legal confirmation**; I have not researched this in depth.
6. **Upsell catalog:** course names, prices, dates, and formats are missing from fauststudio.net [3]. The rates page also shows two prices for the 3-hour Green package (2,100 CZK and 1,950 CZK) [2].
7. **Can we use artist names** from the references page in marketing? This needs client permission.
8. **Trademark:** "Auto-Tune" is an Antares trademark. Use "autotune" generically with care, or "pitch correction / vocal tuner". Needs a legal check.
9. **Domain:** a subdomain of fauststudio.net (Wix) or a separate domain? This affects SEO and tracking.

**What I couldn't verify:**
- Soundtrap and Soundation USD web prices (pages render client-side); the figures shown are App Store or third-party.
- BandLab prices come from a help-center snippet because direct fetching returned 403.
- TwoShot paid prices.
- Melodyne official prices.
- The AutoTune 2026 price ($300 vs $150).
- Voloco's current prices (the data is from 2024).
- Violet Recording's live site (HTTP 526 today, so everything comes from the search index).
- Who operates SoundTools.io and OnlinePitchChanger.
- Whether IchiPitchy requires an account to tune.
- Audio engines for BandLab and Soundation.
- Czech search volumes (not researched).
- No user testing of the competitor tools: the flows are described from vendor pages, not from hands-on sessions.

---

## 7. Sources

All accessed 2026-10-06 unless noted.

1. https://www.fauststudio.net/ (also inspected HTML: Wix generator)
2. https://www.fauststudio.net/rates
3. https://www.fauststudio.net/courses
4. https://www.fauststudio.net/references
5. https://www.fauststudio.net/kopie-about
6. https://www.bandlab.com/promo/autopitch-free-pitch-correction (HTML inspected)
7. https://blog.bandlab.com/autopitch-vocal-effects-guide/ (published 2025-06-26)
8. https://blog.bandlab.com/bandlab-membership/ (published 2026-09-15)
9. https://help.bandlab.com/hc/en-us/articles/20758981227033-BandLab-Membership-FAQ (search snippet; direct fetch 403)
10. https://help.bandlab.com/hc/en-us/articles/360034710974-Using-AutoPitch (search snippet)
11. https://help.bandlab.com/hc/en-us/articles/115002945153-Getting-started-with-BandLab-s-Studio (search snippet)
12. https://relocate.me/singapore/singapore/bandlab/web-developer-5625 (job posting, undated)
13. https://sg.mustakbil.com/jobs/job/1045449 (BandLab Technologies company description in job posting)
14. https://www.bandlab.com/studio (HTML inspected)
15. https://soundtrap.com/content/product/auto-tune-by-antares
16. https://www.soundtrap.com/musicmakers
17. https://apps.apple.com/gb/app/id991031323
18. https://www.studentjob.se/lediga-jobb/876107-senior-developer-for-the-soundtrap-hub-i-stockholm (posted 2026-09-06, closed)
19. https://www.soundtrap.com/pricing (HTML/JS bundles inspected)
20. https://www.digitalmusicnews.com/2023/06/12/soundtrap-spotify-sale/ (2023; context only)
21. https://soundation.com/audio-effects/vocal-tuner
22. https://soundation.com/ (HTML inspected)
23. https://toolradar.com/tools/soundation/pricing (third-party, via search snippet)
24. https://www.kits.ai/pricing (HTML inspected)
25. https://www.kits.ai/blog/kits-ai-pitch-editing (published 2025-07-15)
26. https://www.musicbusinessworldwide.com/splice-acquires-ai-powered-voice-production-platform-kits-ai/ (published 2026-01-21)
27. https://twoshot.app/ai-autotune/ (HTML + JS bundle inspected)
28. https://www.ichipitchy.com/autotune-online (HTML + JS bundle inspected)
29. https://www.ichipitchy.com/pricing
30. https://la-studio.cc/en/autotune (HTML inspected)
31. https://la-studio.cc/en/pricing
32. https://la-studio.cc/en/blog/how-to-autotune-your-voice-online-free-no-download (updated 2026-09-11)
33. https://violetrecording.com/tools/autotune/ (HTTP 526 on access; content via search index)
34. https://violetrecording.com/studio/ (HTTP 526 on access; content via search index)
35. https://rysupaudio.com/tools/free-autotune-online (HTML inspected)
36. https://soundtools.io/vocal-tuner/ (HTML inspected)
37. https://onlinepitchchanger.com/autotune-online/ (HTML inspected)
38. https://www.antarestech.com/blog/autotune-evolves-new-pricing-structure (published 2025-02-26)
39. https://www.soundonsound.com/news/antares-release-autotune-2026 (published 2025-10-21)
40. https://www.celemony.com/en/melodyne/what-is-melodyne
41. https://www.ebay.de/p/18040231989 (retailer listing via search snippet; unverified)
42. https://voloco.com/
43. https://voloco.com/plugin/
44. https://adapty.io/paywall-library/voloco/ (data captured 2024-09-18; stale)
45. https://moises.ai/features/pitch-changer-shifter/ (search snippet)
46. https://www.audiotool.com/board/feature_requests/audiotrack_pitch_changer (search snippet)
47. https://audimee.com/tools/free-autotune
48. https://www.thomannmusic.com/landr_voxtune.htm (LANDR VoxTune as plugin; search snippet)
49. https://emastered.com/cs/blog/best-vocal-tuner-apps (Czech-localized content)
50. https://www.capcut.com/cs-cz/resource/autotune-voice-changers (Czech-localized content)
