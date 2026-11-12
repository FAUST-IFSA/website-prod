/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Injected by the `define` in vite.config.ts from site.config.json (or VITE_SIGNUP_ENDPOINT in dev).
  readonly SIGNUP_ENDPOINT: string
}

// The tool's Export button selector, injected into src/gate.ts by scripts/build-tool.mjs (its single source).
declare const __EXPORT_BUTTON__: string
