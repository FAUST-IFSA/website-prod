// Velo HTTP function for fauststudio.net: receives tuner signups and creates Wix Contacts.
// Install: see README.md next to this file. Contract: docs/email-capture-spec.md in the website-prod repo.
// URL once published: https://www.fauststudio.net/_functions/tunerSignup
import { ok, badRequest, serverError, response } from 'wix-http-functions';
import { contacts } from 'wix-crm-backend';

// Origins allowed to call this from a browser. TODO: remove the two localhost entries before handing to Faust.
const ORIGINS = ['https://faust-ifsa.github.io', 'http://localhost:5173', 'http://localhost:4173'];

const FIELDS = ['tuner-consent-at', 'tuner-consent-version', 'tuner-source'];

// Creates the label and the three custom fields if missing, once per cold start (memoised; forgotten on failure so
// a transient error doesn't poison later requests). Wix assigns the keys itself (e.g. custom.tuner-consent-at-x7f3k,
// the suffix is random), so createContact uses the keys returned here. It silently drops unknown keys, hence this.
let schema;
function ensureSchema() {
  if (!schema) {
    schema = Promise.all([
      contacts.findOrCreateLabel('tuner', { suppressAuth: true }),
      ...FIELDS.map((displayName) => contacts.findOrCreateExtendedField({ displayName, dataType: 'TEXT' }, { suppressAuth: true })),
    ]).then(([label, ...fields]) => ({
      labelKey: label.label.key,
      fieldKeys: fields.map((f) => (f.extendedField || f.field).key), // same order as FIELDS
    })).catch((e) => { schema = undefined; throw e; });
  }
  return schema;
}

function cors(origin) {
  if (!ORIGINS.includes(origin)) return {}; // unknown origin: no CORS headers, the browser blocks the response
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export function options_tunerSignup(request) {
  return response({ status: 204, headers: cors(request.headers.origin) });
}

export async function post_tunerSignup(request) {
  const headers = { ...cors(request.headers.origin), 'Content-Type': 'application/json' };
  let b;
  try { b = await request.body.json(); } catch { b = {}; }
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  if (b.consent !== true || b.website /* honeypot */ || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return badRequest({ headers, body: { ok: false } });
  }
  try {
    const { labelKey, fieldKeys: [consentAtKey, consentVersionKey, sourceKey] } = await ensureSchema();
    await contacts.createContact({
      emails: [{ email, primary: true }],
      locale: b.lang === 'cs' ? 'cs-CZ' : 'en-US',
      labelKeys: [labelKey],
      extendedFields: {
        [consentAtKey]: new Date().toISOString(),
        [consentVersionKey]: String(b.consentVersion || ''),
        [sourceKey]: b.source === 'tool' ? 'tool' : 'landing',
      },
    }, { allowDuplicates: false, suppressAuth: true });
  } catch (e) {
    // Already a contact: that's a success for the visitor. Anything else is a real failure.
    const text = `${e && e.message} ${JSON.stringify(e)}`;
    if (!/DUPLICATE_CONTACT_EXISTS/.test(text)) {
      console.error('tunerSignup failed', text, e && e.stack);
      return serverError({ headers, body: { ok: false } });
    }
  }
  return ok({ headers, body: { ok: true } });
}
