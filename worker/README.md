# Signup relay (Cloudflare Worker)

Receives signups from the landing form (`src/sections/Signup.tsx`) and the export gate (`src/gate.ts`) and adds
them to Faust's Ecomail list. It exists because Ecomail's API needs a secret key and refuses calls from a
browser, and Ecomail's keyless form URL cannot be used from our pages (`reports/ecomail-email-gate.md`, "Spike
results"). Spec: `docs/email-gate-spec.md`.

**Status, 2026-11-11: built and tested locally against the real list. Not deployed** (no Cloudflare account
yet). Until it is, `site.config.json` → `signupEndpoint` is `https://signup-worker-not-deployed.invalid/`, an
address that can never resolve, so both forms show their "didn't go through" state and the export still works.

## Files

| File | What it is |
|---|---|
| `src/signup.js` | All the logic: `handleSignup(request, { apiKey, listId, allowedOrigins })`, a standard `Request` in and `Response` out. Nothing Cloudflare-specific. |
| `src/index.js` | The Cloudflare wrapper: reads the three settings from the Worker's environment and calls `handleSignup`. |
| `wrangler.jsonc` | Worker name, the allowed origins and the list id. No secrets. |

## Contract

`POST` JSON `{ email, lang: "en"|"cs", source: "landing"|"tool", consent: true, consentVersion, website }`
(`website` is the honeypot and must be empty).

| Response | When |
|---|---|
| `200 {"ok":true}` | Added to the list, **or already on it** (also when they had unsubscribed: see below) |
| `400 {"ok":false}` | Invalid email, `consent` not `true`, honeypot filled, unknown `source` / `lang`, bad `consentVersion`, body not JSON |
| `403 {"ok":false}` | The `Origin` header is not in `ALLOWED_ORIGINS` (no CORS headers, so a browser blocks it; nothing reaches Ecomail) |
| `500 {"ok":false}` | Ecomail refused the call or did not answer within 8 s |
| `204` | CORS preflight from an allowed origin |

What it sends to Ecomail (`POST /lists/{id}/subscribe`): the email and four custom fields, `consent_at` (ISO
time, set here), `consent_version`, `consent_source`, `lang`. The fields already exist on the list. The
visitor's IP address is not passed on.

Settings, all confirmed on the real list on 2026-11-11:

- `skip_confirmation: true`: the contact is subscribed at once and **no email is sent**. Double opt-in is off
  on the list because Ecomail requires a verified sender domain for it. When Faust has one: turn double opt-in
  on in the list's settings, set this to `false`, and change the consent and privacy texts (design-spec §5,
  "Draft for double opt-in").
- `update_existing: false`: a repeat signup returns 200 and leaves the first consent record untouched.
- `resubscribe: false`: someone who unsubscribed stays unsubscribed, even if the form is submitted with their
  address again (otherwise anyone could re-subscribe them). They still get 200. To come back they must ask
  Faust, or Faust switches this on once double opt-in protects it.
- `trigger_autoresponders: false`, `trigger_notification: false`: no automation and no notification email.

## It stores nothing

The privacy policy says the relay passes the signup on and stores nothing itself. Keep that true:

- no `console.log` of the body, the headers, the email or the IP address (the two `console.error` lines log a
  fixed text and Ecomail's status code only);
- no KV, D1, R2, Analytics Engine, Queues or Logpush bindings;
- `observability` is `false` in `wrangler.jsonc`, so Workers Logs keeps nothing.

What Cloudflare still does by default, as far as I know (**not verified against Cloudflare's documents; see
report F3**): it handles the request, so it sees the visitor's IP address and the body in transit, and it keeps
aggregate metrics per Worker (request counts, errors, CPU time) without request content. `wrangler tail` shows
live logs only while someone runs it.

## Run it locally

No Cloudflare login needed. The Ecomail key is read from the repo's gitignored `.env.local`
(`ECOMAIL_API_KEY=...`); a gitignored `worker/.dev.vars` works too.

```bash
cd worker
npx wrangler@4 dev --local --port 8787 --env-file ../.env.local
# in another terminal, from the repo root: build the site against it and preview
VITE_SIGNUP_ENDPOINT=http://localhost:8787/ npm run build && npm run preview
```

**This talks to the real list.** Use only `something@example.com` addresses, and delete them afterwards
(Ecomail app → Contacts, or `DELETE https://api2.ecomailapp.cz/subscribers/<email>/delete` with the `key` header).

Checks that create nothing:

```bash
W=http://localhost:8787/; O=http://localhost:4173
curl -s -o /dev/null -w '%{http_code}\n' -X OPTIONS -H "Origin: $O" $W                         # 204
curl -s -o /dev/null -w '%{http_code}\n' -X POST -H "Origin: $O" -d '{"email":"x"}' $W          # 400
curl -s -o /dev/null -w '%{http_code}\n' -X POST -H 'Origin: https://evil.example' -d '{}' $W   # 403
```

## Deploy (for the user; needs a Cloudflare account)

1. Create a free Cloudflare account (https://dash.cloudflare.com/sign-up). For the demo it can be yours; for
   launch it should be Faust's, because the Worker holds the key to their list.
2. Log in from this folder: `cd worker && npx wrangler@4 login` (opens a browser).
3. Store the Ecomail key as a secret. It is typed into the prompt, never into a file or the command line:
   `npx wrangler@4 secret put ECOMAIL_API_KEY`
4. Check `wrangler.jsonc`: `ALLOWED_ORIGINS` must list the site's origin (scheme + host, no path, no trailing
   slash), and `ECOMAIL_LIST_ID` the list.
5. Deploy: `npx wrangler@4 deploy`. It prints the URL, like
   `https://faust-tuner-signup.<your-subdomain>.workers.dev`.
6. Paste that URL (with a trailing `/`) into `site.config.json` → `signupEndpoint`, replacing the
   `…not-deployed.invalid` placeholder. Rebuild and push the site.
7. Verify with the three checks above against the deployed URL (`O=https://faust-ifsa.github.io`), then one
   real signup from the live landing form with an address you own, and find it in Ecomail with its four fields.

**When the site moves to a new domain:** add the new origin to `ALLOWED_ORIGINS`, run `npx wrangler@4 deploy`
again. **When the Ecomail account or list changes:** `secret put` the new key, change `ECOMAIL_LIST_ID`, deploy.
The custom fields are created automatically on first use.

## Moving it off Cloudflare

`src/signup.js` runs on any host with standard `fetch`, `Request` and `Response` (Node 18+, Vercel, Netlify,
Deno). Write that host's small wrapper instead of `index.js`, pass the same three settings from its environment
variables, and point `signupEndpoint` at the new URL. Whoever hosts it becomes the processor named in the
privacy policy instead of Cloudflare.

## Not built

A rate limit. The origin check and honeypot stop browsers on other sites and simple bots, but a script can
send any `Origin` header and fill the list with addresses (no email goes out while double opt-in is off, so
the damage is junk contacts and the plan's contact limit). Add the host's rate limiting before launch.
