export type Lang = 'en' | 'cs'
// Namespaced: every site on the same GitHub Pages origin shares one localStorage.
export const STORAGE_KEY = 'faust-landing:lang'

// A saved choice wins; otherwise CS if any browser language is Czech, else EN (design-spec §3.3).
// Only a click on the switch is saved, so the browser default never counts as a choice.
// No URL routes: GitHub Pages has no server fallback.
// No React here: the export gate (src/gate.ts) uses this inside the tool's page.
export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'cs') return saved
  } catch {
    // Storage blocked (private mode, settings): fall back to the browser languages.
  }
  return navigator.languages.some((l) => l.toLowerCase().startsWith('cs')) ? 'cs' : 'en'
}
