import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import site from './site.config.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  // The base path lives only in site.config.json; scripts/build-tool.mjs reads it too.
  base: site.base,
  plugins: [react()],
})
