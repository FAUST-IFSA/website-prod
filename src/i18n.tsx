import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { cs } from './copy/cs'
import { type Copy, en } from './copy/en'

export type Lang = 'en' | 'cs'
const COPY: Record<Lang, Copy> = { en, cs }
// Namespaced: every site on the same GitHub Pages origin shares one localStorage.
const STORAGE_KEY = 'faust-landing:lang'

// A saved choice wins; otherwise CS if any browser language is Czech, else EN (design-spec §3.3).
// Only a click on the switch is saved, so the browser default never counts as a choice.
// No URL routes: GitHub Pages has no server fallback.
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'cs') return saved
  } catch {
    // Storage blocked (private mode, settings): fall back to the browser languages.
  }
  return navigator.languages.some((l) => l.toLowerCase().startsWith('cs')) ? 'cs' : 'en'
}

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void } | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = COPY[lang].meta.title
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembered, but the switch still works for this visit.
    }
  }

  return <LangContext value={{ lang, setLang }}>{children}</LangContext>
}

export function useLang() {
  const ctx = use(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

export function useCopy(): Copy {
  return COPY[useLang().lang]
}
