import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import site from './site.config.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  // The base path lives only in site.config.json; scripts/build-tool.mjs reads it too.
  base: site.base,
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
})
