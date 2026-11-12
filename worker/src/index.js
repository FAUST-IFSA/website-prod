// Cloudflare Worker wrapper for the signup relay (signup.js). Setup, local run and deploy: ../README.md.
// Config (wrangler.jsonc vars): ALLOWED_ORIGINS, ECOMAIL_LIST_ID. Secret: ECOMAIL_API_KEY (never in the repo).
import { handleSignup } from './signup.js'

export default {
  fetch: (request, env) =>
    handleSignup(request, { apiKey: env.ECOMAIL_API_KEY, listId: env.ECOMAIL_LIST_ID, allowedOrigins: env.ALLOWED_ORIGINS }),
}
