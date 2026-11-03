/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Injected by the `define` in vite.config.ts from site.config.json (or VITE_SIGNUP_ENDPOINT in dev).
  readonly SIGNUP_ENDPOINT: string
}
