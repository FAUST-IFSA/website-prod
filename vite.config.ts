import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import site from './site.config.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // The base path lives only in site.config.json; scripts/build-tool.mjs reads it too.
  base: site.base,
  define: {
    // Where the signup form POSTs (docs/email-capture-spec.md). site.config.json holds the real URL; a
    // VITE_SIGNUP_ENDPOINT env var (shell or .env.local, both gitignored) overrides it so `npm run dev` can
    // hit a test site or a local stub. Read in code as import.meta.env.SIGNUP_ENDPOINT, like BASE_URL.
    'import.meta.env.SIGNUP_ENDPOINT': JSON.stringify(
      loadEnv(mode, process.cwd(), 'VITE_').VITE_SIGNUP_ENDPOINT || site.signupEndpoint,
    ),
  },
  plugins: [
    react(),
    // Client demo: keep search engines out. Set "noindex": false in site.config.json for production.
    // scripts/build-tool.mjs adds the same tag to the tool's page.
    {
      name: 'noindex',
      transformIndexHtml: () =>
        site.noindex ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' }] : [],
    },
  ],
}))
