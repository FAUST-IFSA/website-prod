// The signup relay: receives tuner signups (landing form + export gate) and adds them to Faust's Ecomail list.
// Contract: docs/email-gate-spec.md. Host-neutral on purpose: a standard Request goes in, a Response comes out,
// and the three settings are passed in, so this file moves to another host's function format unchanged
// (index.js is the Cloudflare wrapper). Needs only fetch, Request/Response and AbortSignal.timeout.
// The privacy policy says this relay "stores nothing itself": no storage bindings, and nothing from the request
// (email, IP address, headers, body) is ever logged. Keep it that way.
const API = 'https://api2.ecomailapp.cz'

/** @param {Request} request @param {{ apiKey: string, listId: string, allowedOrigins: string }} config */
export async function handleSignup(request, { apiKey, listId, allowedOrigins }) {
  // Only our own pages may call this. Any other origin gets no CORS headers (the browser blocks the response)
  // and nothing is sent to Ecomail.
  const origin = request.headers.get('Origin') || ''
  if (!allowedOrigins.split(',').some((o) => o.trim() === origin)) return json(403, {})
  const cors = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') return json(405, cors)

  const b = await request.json().catch(() => ({}))
  const email = typeof b.email === 'string' ? b.email.trim() : ''
  if (
    b.consent !== true ||
    b.website || // honeypot
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
    email.length > 254 ||
    !['landing', 'tool'].includes(b.source) ||
    !['en', 'cs'].includes(b.lang) ||
    typeof b.consentVersion !== 'string' ||
    !/^[\w.-]{1,32}$/.test(b.consentVersion)
  ) {
    return json(400, cors)
  }

  // The visitor's IP address is not passed on: Ecomail only ever sees this Worker.
  let res
  try {
    res = await fetch(`${API}/lists/${listId}/subscribe`, {
      method: 'POST',
      headers: { key: apiKey, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000), // the pages give up at 10 s
      body: JSON.stringify({
        subscriber_data: {
          email,
          // The proof of consent. Ecomail creates missing fields itself.
          custom_fields: {
            consent_at: new Date().toISOString(),
            consent_version: b.consentVersion,
            consent_source: b.source,
            lang: b.lang,
          },
        },
        // Double opt-in is off on the list for now, so no email may go out at signup. Set to false (and turn
        // double opt-in on in the list's settings) once Faust has a verified sender domain.
        skip_confirmation: true,
        trigger_autoresponders: false,
        trigger_notification: false,
        // Someone already on the list keeps their first consent record, and someone who unsubscribed is not
        // re-added (a stranger could otherwise re-subscribe them). Both still get 200: a success to the visitor.
        update_existing: false,
        resubscribe: false,
      }),
    })
  } catch {
    console.error('tuner signup: Ecomail unreachable')
    return json(500, cors)
  }
  if (!res.ok) {
    console.error('tuner signup: Ecomail refused, status', res.status) // not the body: it can echo the address
    return json(500, cors)
  }
  return json(200, cors)
}

function json(status, headers) {
  return new Response(JSON.stringify({ ok: status === 200 }), { status, headers: { ...headers, 'Content-Type': 'application/json' } })
}
