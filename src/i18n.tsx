import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { cs } from './copy/cs'
import { type Copy, en } from './copy/en'
import { initialLang, type Lang, STORAGE_KEY } from './lang'

export type { Lang }
const COPY: Record<Lang, Copy> = { en, cs }

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void } | null>(null)

// `title` picks the document title from the copy, so each page (landing, privacy) keeps its own in both languages.
export function LangProvider({ children, title = (copy) => copy.meta.title }: { children: ReactNode; title?: (copy: Copy) => string }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = title(COPY[lang])
  }, [lang, title])

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
