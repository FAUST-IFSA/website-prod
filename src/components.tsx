import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { type Lang, useCopy, useLang } from './i18n'

export function SectionHead({ id, eyebrow, title, lead }: { id: string; eyebrow?: string; title: string; lead?: string }) {
  return (
    <div className="section-head">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
}

/** Text link to another site, with the ↗ icon. Opens in the same tab (design-spec §3.1). */
export function Outbound({ href, children, className = 'link' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className} href={href}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" className="link-icon" />
    </a>
  )
}

const LANGS: { code: Lang; short: string; name: string }[] = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'cs', short: 'CS', name: 'Čeština' },
]

export function LangSwitch() {
  const { langSwitch } = useCopy()
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label={langSwitch.label} className="lang-switch">
      {LANGS.map(({ code, short, name }) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-label={`${short} – ${name}`}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {short}
        </button>
      ))}
    </div>
  )
}

/** Stand-in for a photo the client hasn't supplied yet (design-spec §6). Decorative. */
export function PhotoPlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`photo-placeholder ${className}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}
