# Email capture: migration to fauststudio.net

Owner: pm · Date: 2026-11-03 · Spec: `docs/email-capture-spec.md` · Code: `wix/`, `src/sections/Signup.tsx`

What this is: the exact steps to move the signup endpoint from our test site
(`contactfaux400500.wixsite.com/my-site-3`, free plan) to Faust's real site, and to point the landing page at it.
Everything below has been done once on the test site; the "didn't work" notes are what we hit and how the final
version avoids it.

## State at the start

- `wix/http-functions.js` (74 lines) is final and tested: 10/10 on `wix/test.sh`, contacts land with label
  `tuner` and three filled custom fields. The landing-page form (`src/sections/Signup.tsx`) passes criteria 1–8.
- `site.config.json` → `signupEndpoint` already points at `https://www.fauststudio.net/_functions/tunerSignup`.
  That URL **404s today** (Faust has no Velo file), so a deployed landing page shows the form's error state on
  submit until step B is done. Decide before deploying: hide the form, or accept the error state on the demo.
- Faust has not yet been asked (spec task 0). Nothing below can start until they answer.

## A. Before Faust: our side (programmer, ~15 min)

1. In `wix/http-functions.js`, `ORIGINS`: delete the two `localhost` entries. Add Faust's future custom domain for
   the landing page if known (otherwise add it later; the file has to be re-pasted + re-published then).
2. `src/faust.ts` → `privacy`: paste Faust's privacy-policy URL once they send it. Empty = the form renders no
   link, which is the current (acceptable) state.
3. `src/copy/cs.ts` signup strings: native review (`TODO(cs-review)`). Not blocking.
4. Run `npm run build && npm run preview`; nothing else changes.

## B. On Faust's Wix site (Faust, or us with a collaborator seat, ~10 min)

Two routes, Faust's choice (asked in task 0): they paste, or they invite one of us (Core plan includes 5 seats:
Dashboard → Settings → Roles & Permissions → Invite People, role needs editor + code access).

1. Open the site in the **Wix Editor** (classic). Top menu **Dev Mode → Turn on Dev Mode**. Free on every plan.
2. In the code panel: **Backend & Public → Backend → `+` → Expose site API**. This creates
   `backend/http-functions.js` with the exact name Wix routes on. Replace its contents with our
   `wix/http-functions.js`.
   - *Didn't work:* creating a file by hand and naming it `http-function` (no `s`). Wix then serves no functions
     at all and every `/_functions/*` URL returns `404` with header
     `x-wix-code-user-error-details: {"code":"MODULE_NOT_FOUND"}` — identical to a site with no Velo code.
3. **Save**, then smoke-test the unpublished code before publishing:
   `wix/test.sh https://www.fauststudio.net/_functions-dev/tunerSignup` (the `-dev` path runs editor code).
   Expect 10/10. If the valid POST returns 500, see "Reading the error" below.
4. **Check for pending editor changes** on Faust's site. Publish ships everything unpublished, not just our file.
5. **Publish.**
6. Nothing to create in Contacts. On the first request the function creates the label `tuner` and the Text fields
   `tuner-consent-at`, `tuner-consent-version`, `tuner-source` itself.
   - *Didn't work:* the spec originally said "create the label and fields in the dashboard". Two reasons that
     went away: (a) Wix **silently drops** unknown extended fields — the contact is created, HTTP 200, consent
     proof lost, no error; (b) some dashboards (our free site) offer no way to create custom fields at all.
   - *Didn't work:* hardcoding the keys as `custom.tuner-consent-at` etc. Wix assigns API-created labels/fields a
     **random suffix** (`custom.tuner-WnXAj`, `custom.tuner-consent-at-uohwmeskjmxxpblngp`). The function now
     reads the keys back from `findOrCreateLabel` / `findOrCreateExtendedField`, matched by display name.
     Consequence for Faust: **never rename** the `tuner` label or the three fields in the dashboard; the code
     would create fresh ones.
7. Verify: `wix/test.sh https://www.fauststudio.net` (the script appends `/_functions/tunerSignup`). Expect
   10/10. In Dashboard → Contacts, open the test contact → Edit → Custom Fields: the three fields are filled
   (ISO timestamp, `2026-11-v1`, `landing`), label `tuner` set. Delete the test contact afterwards.
   - *Didn't work:* running `test.sh` with the site root as the argument produced a "flurry of 403s" (POSTs hit
     the homepage). The script now accepts either the root or the full endpoint URL.

## C. Landing page switch-over (programmer + user, ~10 min)

1. `site.config.json` → `signupEndpoint` already holds the production URL. No change unless Faust's domain differs.
2. `npm run build && npm run preview`, submit one real address from the form (EN and CS), confirm the success
   state, then confirm that contact in Faust's Contacts with label `tuner` and the three fields. This is spec
   criterion 11. Delete or keep the contact as Faust prefers.
3. User commits and pushes; GitHub Pages deploys from `main`.
4. pm sends the endpoint contract (spec §"Endpoint contract") to the tool team for their email gate (task 5).

## Reading the error when the valid POST returns 500

A 500 is the function's own "don't create a contact without the schema" path. The cause is logged with
`console.error('tunerSignup failed', …)` but Wix's **Logs panel is live-only** (Dashboard → Developer Tools →
Logs shows nothing from before you opened it; persistent logs need a Google Cloud link).
- Either keep the Logs panel open while re-running `test.sh`,
- or temporarily paste a variant that returns the error text in the 500 body (one line changed:
  `body: { ok: false, debug: text }`), curl once, then re-paste the clean file. Never ship the debug line.

Causes already ruled out on the test site: response shape of `findOrCreateExtendedField` (the code accepts both
`extendedField` and `field`), `suppressAuth` from an HTTP function (works), free-plan limits on custom fields
(none).

## Things Faust should know (goes in the task 0 email)

- 200 free marketing emails/month on their plan; beyond that a separate Wix email plan.
- Signups arrive as **"Never subscribed"** contacts. Making them subscribers is a dashboard toggle (or bulk
  action). Campaign recipient lists need "Subscribers".
- Spam signups only cost them if they add a "new contact → send email" automation. We use a honeypot + origin
  allow-list; add Turnstile only if junk appears.
- Publishing our file publishes their whole site. Check pending edits first.
- Don't rename the `tuner` label or the three custom fields.
- We need their privacy-policy URL to show the link under the consent box.

## Rollback

Delete `backend/http-functions.js` in the editor and publish (or leave it: with no callers it does nothing). On
our side, remove `<Signup />` from `src/App.tsx` (one import, one line). Contacts already created stay in Wix.

## Fallback if Faust refuses Dev Mode

Cloudflare Worker (free tier) holding a Wix API key, same request/response contract, so `Signup.tsx` is
unchanged; only `signupEndpoint` changes. Not built. Research: `reports/Wix Core email capture.md`.
